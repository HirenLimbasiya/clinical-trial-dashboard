import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import { ClinicalTrial } from "../models/ClinicalTrial.js";
import { connectDB } from "../config/db.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Load raw JSON data
    const rawData = JSON.parse(
      fs.readFileSync("./data/clinicalTrialsRaw.json", "utf-8")
    );

    // Flatten structure into insertable records
    const flattened = rawData.flatMap((trial) => {
      const eligibility = trial.protocolSection?.eligibilityModule || {};
      const contacts = trial.protocolSection?.contactsLocationsModule || {};

      const minAge = parseInt(eligibility.minimumAge?.split(" ")[0] || 0);
      const maxAge = parseInt(eligibility.maximumAge?.split(" ")[0] || 0);
      const sex = eligibility.sex || "ALL";
      const officials = contacts.overallOfficials || [];
      const locations = contacts.locations || [];

      // Map locations into MongoDB-ready objects
      return locations.map((loc) => ({
        facility: loc.facility || "Unknown Facility",
        city: loc.city || "Unknown City",
        state: loc.state || null,
        zip: loc.zip || null, // ✅ added ZIP extraction
        country: loc.country || "Unknown Country",
        minimumAge: minAge,
        maximumAge: maxAge,
        sex,
        overallOfficials: officials.map((o) => ({
          name: o.name,
          affiliation: o.affiliation,
        })),
      }));
    });

    // Reset and insert new data
    await ClinicalTrial.deleteMany();
    await ClinicalTrial.insertMany(flattened);

    console.log(`✅ Seeded ${flattened.length} clinical trial records`);
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
