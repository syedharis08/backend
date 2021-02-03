const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  confirmPassword: {
    type: String,
    required: true,
  },
  result: [
    {
      obtained: Number,
      quizid: String,
      chaptername: String,
    },
  ],
});

studentSchema.methods.genAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, name: this.name, email: this.email },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("Student", studentSchema);

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});

exports.User = User;
exports.validation = schema;
