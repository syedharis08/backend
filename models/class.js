const Joi = require("joi");
const mongoose = require("mongoose");
const { User, validation } = require("../models/student");

const classSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
});

const ClassName = mongoose.model("Class", classSchema);
const schema = Joi.object({
  userID: Joi.string().required(),
  name: Joi.string().required(),
});

exports.ClassName = ClassName;
exports.validation = schema;
