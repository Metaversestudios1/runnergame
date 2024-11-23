
const mongoose = require("mongoose");
const EventSchema = new mongoose.Schema(
  {
    eventId: {
      type: Number,
         autoIncrement: true,
    },
    name: {
      type: String,
     },
    startTime: {
      type: Date,
     },
    endTime: {
      type: Date,
     },
    details: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true, collection: "events" }
);

module.exports = mongoose.model("Event", EventSchema);
