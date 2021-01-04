const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");

const router = express.Router();

const { User, validation } = require("../models/student");
const auth = require("../middleware/student_auth");

router.post("/signup", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  //resultUpdateStart
  user = new User(
    _.pick(req.body, ["name", "email", "password", "confirmPassword"])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  user.confirmPassword = await bcrypt.hash(user.confirmPassword, salt);
  await user.save();

  const token = user.genAuthToken();

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
  } catch (error) {
    res.send(error);
  }
});

router.put("/update-password", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);
  const user = await User.findOne({ email: req.body.email });

  console.log(user);
  user.password = password;
  await user.save();

  res.send(true);
});

router.post("/updateResult", async(req, res)=>{
  console.log(req.body.Score);
  console.log(req.body.quiz);

  let result = await Quizzes.create(req.body.Quiz);
  console.log(newQuiz);

  const result = await Chapters.findByIdAndUpdate(
    { _id: req.body.studentid },
    {
      result: { id: quiz._id },
    },
    { new: true }
  );
  if (!quiz)
    return res.status(404).send("The Quiz with the given ID was not found.");

  return res.status(201).send(true);
})

module.exports = router;
