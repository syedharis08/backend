require("express-async-errors");
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("config");
const auth = require("./routes/auth");
const student = require("./routes/student");

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKet not defined.");
  process.exit(1);
}

// const mongoose = require("mongoose");
// mongoose
//   .connect(config.mongoURI, { useNewUrlParser: true })
//   .then(() => console.log("DB connected"))
//   .catch(err => console.error(err));

const connectionString =
  "mongodb+srv://ayesha:24121998asb@testcluster.dzcrp.mongodb.net/<>?retryWrites=true&w=majority";
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDb... ", err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/users", require("./routes/users"));
app.use("/api/video", require("./routes/video"));
app.use("/api/quiz", require("./routes/quiz"));
app.use("/api/chapter", require("./routes/chapter"));
app.use("/api/student", student);
app.use("/api/auth", auth);

//use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
app.use("/uploads", express.static("uploads"));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server Running at ${port}`);
});
