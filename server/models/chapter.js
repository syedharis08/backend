const mongoose = require("mongoose");

const chapterSchema = mongoose.Schema({
  chapterID: {
    type: Number,
    required: true,
    unique: true,
  },
  chapterName: {
    type: String,
    required: true,
  },
  quizzes: {
    id: String,
  },
  topics: [
    {
      topicid: String,
      topicName: String,
    },
  ],
});

const Chapters = mongoose.model("Chapters", chapterSchema);
module.exports = { Chapters };
