const mongoose = require("mongoose");

const webinarSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true,
  },

  description: String,

  day: {
    type: String,
    required: true,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },

  time: {
    type: String,
    required: true,
  },

  australiaTimeZone: {
    type: String,
    required: true,
    enum: ["AWST","ACST","ACDT","AEST","AEDT"],
  },

  durationMinutes: {
    type: Number,
    default: 60,
  },

  meetLink: {
    type: String,
    required: true,
  },

  recordingLink: String,
},
{ timestamps: true }
);

module.exports = mongoose.model("Webinar", webinarSchema);