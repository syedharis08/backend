const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const app = express();

const auth = require("./routes/auth");
const student = require("./routes/student");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKet not defined.");
  process.exit(1);
}

const connectionString =
  "mongodb+srv://ayesha:24121998asb@testcluster.dzcrp.mongodb.net/<>?retryWrites=true&w=majority";
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDb... ", err));

app.use(express.json());
app.use("/api/auth", auth);
app.use("/api/student", student);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}...`));
