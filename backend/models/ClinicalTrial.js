import mongoose from "mongoose";

const officialSchema = new mongoose.Schema({
  name: String,
  affiliation: String,
});

const clinicalTrialSchema = new mongoose.Schema(
  {
    facility: { type: String, required: true },
    city: { type: String },
    state: { type: String },
    zip: { type: String }, // ✅ Added ZIP field
    country: { type: String, required: true },
    minimumAge: { type: Number },
    maximumAge: { type: Number },
    sex: {
      type: String,
      enum: ["ALL", "MALE", "FEMALE"],
      default: "ALL",
    },
    overallOfficials: [officialSchema],
  },
  { timestamps: true }
);

// ✅ Useful indexes for faster analytics & queries
clinicalTrialSchema.index({ country: 1 });
clinicalTrialSchema.index({ city: 1 });
clinicalTrialSchema.index({ zip: 1 }); // ✅ Added ZIP index for location-based queries

export const ClinicalTrial = mongoose.model(
  "ClinicalTrial",
  clinicalTrialSchema
);
