const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  content: {
    type: String,
    required: true,
  },

  tags: {
    type: [String],
    default: [],
  },

  isPinned: {
    type: Boolean,
    default: false,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Note", noteSchema);
