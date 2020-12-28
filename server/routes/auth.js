const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const router = express.Router();

const { User } = require("../models/student");

router.post("/login", async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  const token = user.genAuthToken();

  res.send(token);
});

const schema = Joi.object({
  email: Joi.string().min(5).max(255).required().email(),
  password: Joi.string().min(5).max(1024).required(),
});

module.exports = router;
