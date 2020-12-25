const express = require("express");
const quiz = require("../models/quiz");
const router = express.Router();
const { Quizzes } = require("../models/quiz");

router.post("/uploadQuiz", async (req, res) => {
  try {
    // const { quizObj } = req.body;
    const newQuiz = await Quizzes.create(req.body);

    return res.status(201).json(newQuiz);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

router.get("/getQuiz", async (req, res) => {
  const Quiz = await Quizzes.find();
  res.status(200).json(Quiz);
});
module.exports = router;
