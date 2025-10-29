/**
 * Clinical Trial Model
 * Mongoose schema for clinical trial data with optimized indexing
 */

const mongoose = require("mongoose");

// Sub-schema for Overall Officials
const OverallOfficialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    affiliation: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

// Sub-schema for Locations/Facilities
const LocationSchema = new mongoose.Schema(
  {
    facility: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
      index: true, // Index for trials-per-city queries
    },
    state: {
      type: String,
      trim: true,
    },
    zip: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
      index: true, // Index for location distribution queries
    },
    status: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

// Main Clinical Trial Schema
const ClinicalTrialSchema = new mongoose.Schema(
  {
    // Eligibility criteria
    sex: {
      type: String,
      required: true,
      enum: ["MALE", "FEMALE", "ALL"],
      index: true, // Index for demographics queries
    },
    minimumAge: {
      type: Number,
      required: true,
      min: 0,
    },
    maximumAge: {
      type: Number,
      required: true,
      min: 0,
    },

    // Location information
    locations: {
      type: [LocationSchema],
      required: true,
      validate: {
        validator: function (locations) {
          return locations && locations.length > 0;
        },
        message: "At least one location is required",
      },
    },

    // Overall officials (optional)
    overallOfficials: {
      type: [OverallOfficialSchema],
      default: [],
    },

    // Additional fields for potential filtering
    startYear: {
      type: Number,
      index: true,
    },

    // Metadata
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "clinicalTrials",
  }
);

// Compound indexes for optimized queries
// Index for demographics queries (sex + age range)
ClinicalTrialSchema.index({ sex: 1, minimumAge: 1, maximumAge: 1 });

// Index for location-based queries (country + city)
ClinicalTrialSchema.index({ "locations.country": 1, "locations.city": 1 });

// Text index for facility search (bonus feature)
ClinicalTrialSchema.index({ "locations.facility": "text" });

// Pre-save middleware to update timestamps
ClinicalTrialSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Instance method to get primary location
ClinicalTrialSchema.methods.getPrimaryLocation = function () {
  return this.locations && this.locations.length > 0 ? this.locations[0] : null;
};

// Static method to get unique countries
ClinicalTrialSchema.statics.getUniqueCountries = async function () {
  return this.distinct("locations.country");
};

// Static method to get unique cities
ClinicalTrialSchema.statics.getUniqueCities = async function () {
  return this.distinct("locations.city");
};

// Virtual for age range
ClinicalTrialSchema.virtual("ageRange").get(function () {
  return `${this.minimumAge}-${this.maximumAge}`;
});

// Ensure virtuals are included in JSON output
ClinicalTrialSchema.set("toJSON", { virtuals: true });
ClinicalTrialSchema.set("toObject", { virtuals: true });

const ClinicalTrial = mongoose.model("ClinicalTrial", ClinicalTrialSchema);

module.exports = ClinicalTrial;
