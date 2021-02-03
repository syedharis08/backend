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

router.post("/updateResult", async (req, res) => {
  const Student = await User.findByIdAndUpdate(
    req.query._id,
    {
      $push: {
        result: {
          obtained: req.body.obtainedmarks,
          quizid: req.body.quizid,
          chaptername: req.body.chaptername,
        },
      },
    },
    { new: true }
  );
  if (!Student) res.sendStatus(404).send("Unable to find user!");

  return res.status(201).send(true);
});

router.get("/getResult", async (req, res) => {
  const Student = await User.findOne({ _id: req.query.id });
  if (!Student) res.sendStatus(404).send("Unable to find user!");

  return res.status(201).send(Student.result);
});

module.exports = router;
