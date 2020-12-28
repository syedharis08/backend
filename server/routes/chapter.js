const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { Chapters } = require("../models/chapter");

router.get("/", async (req, res) => {
  const Chapter = await Chapters.find();
  res.status(200).json(Chapter);
});

router.post("/add-chapter", async (req, res) => {
  try {
    const Chapter = await Chapters.create(req.body);
    Chapter.save();

    return res.status(201).json(Chapter);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const Chapter = await Chapters.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          topics: { topicName: req.body.topicName },
        },
      },
      { new: true }
    );

    if (!Chapter)
      return res
        .status(404)
        .send("The Chapter with the given ID was not found.");

    Chapter.save();
    res.send(Chapter);
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

router.delete("/:id", async (req, res) => {
  const Chapter = await Chapters.findByIdAndRemove(req.params.id);

  if (!Chapter)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send("Chapter Removed!");
});

router.get("/:id", async (req, res) => {
  const Chapter = await Chapters.findById(req.params.id);

  if (!Chapter)
    return res.status(404).send("The Chapter with the given ID was not found.");

  res.status(201).send(Chapter);
});

module.exports = router;
