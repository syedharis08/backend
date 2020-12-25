const express = require("express");
const _ = require("lodash");
const router = express.Router();

const { ClassName, validation } = require("../models/class");
const { User } = require("../models/student");

router.post("/:id", async (req, res) => {
  const { error } = validation.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ _id: req.params._id });
  if (!user) return res.status(404).send("User Not found");

  let c = new ClassName({ userID: req.params.id, name: req.body.name });
  await c.save();
});

router.get("/ClassNamees", async (req, res) => {
  try {
    let c = await ClassName.find();
    res.send(c);
  } catch (error) {
    res.send(error);
  }
});
router.delete("/ClassNamees/:id", async (req, res) => {
  try {
    let c = await ClassName.findOneAndRemove({ _id: req.params.id });
    res.send(c);
  } catch (error) {
    res.send(error);
  }
});
router.put("/ClassNamees/:id", async (req, res) => {
  try {
    let c = await ClassName.findOneAndUpdate({
      _id: req.params.id,
      name: req.body.name,
    });
    res.send(c);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
