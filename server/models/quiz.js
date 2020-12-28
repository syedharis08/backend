const mongoose = require("mongoose");

const quizSchema = mongoose.Schema({
  quiz: [
    {
      name: String,
      question: {
        type: String,
        required: true,
      },
      options: [
        {
          name: String,
          option: {
            type: String,
            required: true,
          },
          isCorrect: {
            type: Boolean,
            required: true,
          },
        },
      ],
    },
  ],
});

const Quizzes = mongoose.model("Quizzes", quizSchema);
module.exports = { Quizzes };
