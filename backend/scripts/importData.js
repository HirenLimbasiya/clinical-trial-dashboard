/**
 * Data Import Script (Safe Version)
 * - Skips incomplete or malformed records
 * - Auto-parses age fields (e.g. "55 Years" → 55)
 * - Randomizes startYear within the last 10 years
 * - Logs inserted vs skipped counts
 */

require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const ClinicalTrial = require("../src/models/ClinicalTrial");
const { MONGODB_URI } = require("../src/config/env");

// Path to JSON dataset
const dataFilePath = path.join(__dirname, "clinicalTrialsData.json");

// ---------------------------
// Helpers
// ---------------------------

// Convert "55 Years" → 55
const parseAge = (ageStr) => {
  if (!ageStr) return null;
  const match = ageStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
};

// Generate a random year within the last 10 years
const getRandomYear = () => {
  const currentYear = new Date().getFullYear();
  const yearsAgo = Math.floor(Math.random() * 10); // 0–9 years ago
  return currentYear - yearsAgo;
};

/**
 * Import data into MongoDB safely
 */
const importData = async () => {
  try {
    // Read JSON file
    const rawData = fs.readFileSync(dataFilePath, "utf-8");
    const rawTrials = JSON.parse(rawData);

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB Connected");

    // Clear existing collection
    await ClinicalTrial.deleteMany({});
    console.log("🗑️  Existing data cleared");

    let inserted = 0;
    let skipped = 0;

    const validTrials = [];

    for (const item of rawTrials) {
      try {
        const eligibility = item.protocolSection?.eligibilityModule || {};
        const contacts = item.protocolSection?.contactsLocationsModule || {};

        const sex = eligibility.sex || "ALL";
        const minAge = parseAge(eligibility.minimumAge) ?? 0;
        const maxAge = parseAge(eligibility.maximumAge) ?? 120;

        const locations = contacts.locations || [];
        const officials = contacts.overallOfficials || [];

        // Skip if no valid location
        if (!locations.length) {
          skipped++;
          continue;
        }

        const mappedLocations = locations.map((loc) => ({
          facility: loc.facility || "Unknown Facility",
          city: loc.city || "Unknown City",
          state: loc.state || "",
          zip: loc.zip || "",
          country: loc.country || "Unknown Country",
          status: loc.status || "Recruiting",
        }));

        const mappedOfficials = officials.map((off) => ({
          name: off.name || "Unknown Official",
          affiliation: off.affiliation || "Unknown Affiliation",
          role: off.role || "Investigator",
        }));

        validTrials.push({
          sex,
          minimumAge: minAge,
          maximumAge: maxAge,
          locations: mappedLocations,
          overallOfficials: mappedOfficials,
          startYear: getRandomYear(), // ✅ Random year within last 10 years
        });

        inserted++;
      } catch (innerErr) {
        skipped++;
      }
    }

    // Insert valid trials
    if (validTrials.length > 0) {
      await ClinicalTrial.insertMany(validTrials);
    }

    console.log(`\n✅ Import complete!`);
    console.log(`   Inserted: ${inserted}`);
    console.log(`   Skipped: ${skipped}`);

    // Build indexes
    await ClinicalTrial.createIndexes();
    console.log("📊 Indexes created successfully");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error importing data:", error);
    process.exit(1);
  }
};

/**
 * Delete all data
 */
const deleteData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB Connected");

    await ClinicalTrial.deleteMany({});
    console.log("🗑️  All data deleted successfully");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error deleting data:", error);
    process.exit(1);
  }
};

// CLI usage: node importData.js [--delete]
if (process.argv[2] === "--delete") {
  deleteData();
} else {
  importData();
}
