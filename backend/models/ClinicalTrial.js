import mongoose from "mongoose";

const officialSchema = new mongoose.Schema({
  name: String,
  affiliation: String,
});

const clinicalTrialSchema = new mongoose.Schema(
  {
    facility: String,
    city: String,
    state: String,
    country: String,
    minimumAge: Number,
    maximumAge: Number,
    sex: { type: String, enum: ["ALL", "MALE", "FEMALE"], default: "ALL" },
    overallOfficials: [officialSchema],
  },
  { timestamps: true }
);

// Useful indexes for fast aggregation
clinicalTrialSchema.index({ country: 1 });
clinicalTrialSchema.index({ city: 1 });

export const ClinicalTrial = mongoose.model(
  "ClinicalTrial",
  clinicalTrialSchema
);
