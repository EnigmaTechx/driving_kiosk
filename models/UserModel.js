import mongoose from "mongoose";

const uri =
  "mongodb+srv://drive_test:drivetest123@cluster0.u4gblg6.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("****** Connected to MongoDB Sucessfully !!! ******");
  })
  .catch((err) => {
    console.log(`Not Connected to MongoDB due to error:\n  ${err}}`);
  });

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true, default: "default" },
  lastName: { type: String, required: true, default: "default" },
  licenseNum: { type: String, required: true, default: "default" },
  age: { type: Number, required: true, default: 0 },
  carDetails: {
    make: { type: String, required: true, default: "default" },
    model: { type: String, required: true, default: "default" },
    year: { type: Number, required: true, default: 0 },
    platenum: { type: String, required: true, default: "default" },
  },
  UserType: { type: String, required: true, default: "Driver" },
  appointmentID: { type: String, required: true, default: "default" },
});

const appointmentSchema = mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  isTimeSlotAvailable: { type: Boolean, required: true, default: true },
});

// create a model to use the carSchema
const userModel = mongoose.model("user", userSchema);

const appointmentModel = mongoose.model("appointment", appointmentSchema);

// export the model
export default userModel;
export { appointmentModel };
