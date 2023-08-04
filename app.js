import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import router from "./routes/routes.js";

// const bcrypt = require("bcrypt");
const app = express();

app.set("view engine", "ejs");

// const userModel = require("./models/UserModel");

// handling form data to/from db
// const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

const uri =
  "mongodb+srv://drive_test:drivetest123@cluster0.u4gblg6.mongodb.net/DrivingKiosk?retryWrites=true&w=majority";

// Session store
const session_store = MongoStore.create({
  mongoUrl: uri,
  dbName: "DrivingKiosk",
  collectionName: "user_sessions",
});

app.use(
  session({
    secret: "key for driving kiosk",
    resave: false,
    saveUninitialized: false,
    store: session_store,
  })
);

// declare that all static resources (pages) will be in public directory
app.use(express.static("public"));

app.listen(2023, () => {
  console.log("Server is listening at port 2023 !!!");
});

app.use("/", router);
