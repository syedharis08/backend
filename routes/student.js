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

module.exports = router;
