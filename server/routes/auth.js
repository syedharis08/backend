const express = require("express");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const router = express.Router();
const nodemailer = require("nodemailer");

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

router.post("/forget-password", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.send("User does not exists");

  var smtpConfig = {
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "syedharis14@gmail.com",
      pass: "f4c0441c",
    },
  };

  let transporter = nodemailer.createTransport(smtpConfig);

  const randomNumber = Math.floor(Math.random() * 3000 + 1000);

  let mailOptions = {
    from: "syedharis14@gmail.com",
    to: `${user.email}`,
    subject: "Forget password",
    text: `Your password reset code is : ${randomNumber}`,
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log("Error", err);
    }
    return;
  });

  res.status(200).send(randomNumber.toString());
});

const schema = Joi.object({
  email: Joi.string().min(5).max(255).required().email(),
  password: Joi.string().min(5).max(1024).required(),
});

module.exports = router;
