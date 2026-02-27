import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      required: true,
    },
    capacity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Event = mongoose.model("Event", eventSchema);