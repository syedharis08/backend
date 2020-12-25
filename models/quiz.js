const mongoose = require("mongoose");

const quizSchema = mongoose.Schema({
  quizID: Number,
  quiz: [
    {
      questionStatement: {
        type: String,
        required: true,
      },
      options: [
        {
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
module.exports.Quizzes = Quizzes;
