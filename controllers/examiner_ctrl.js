import userModel, { appointmentModel } from "../models/UserModel.js";

class ExaminerController {
  static examiner_page_get = async (req, res) => {
    // get all users who are drivers and do not have testPassed value
    let pending_drivers = [];
    try {
      const drivers = await userModel.find({
        UserType: "Driver",
        testPassed: { $exists: false },
      });
      if (drivers.length > 0) {
        pending_drivers = drivers;
      } else {
        console.log("No pending drivers");
      }
    } catch (error) {
      console.log("Error getting pending drivers: ", error);
    }
    res.render("examiner", {
      pending_drivers: pending_drivers,
      user: req.session.user,
    });
  };

  static filter_pending_list = async (req, res) => {
    const form_data = req.body;
    let test_type = form_data.test_type;

    // incase of all, get all drivers who do not have testPassed value
    let drivers_list = [];
    try {
      let drivers = null;
      if (test_type === "all") {
        drivers = await userModel.find({
          UserType: "Driver",
          testPassed: { $exists: false },
        });
      } else {
        drivers = await userModel.find({
          UserType: "Driver",
          testType: test_type,
          testPassed: { $exists: false },
        });
      }
      if (drivers.length > 0) {
        drivers_list = drivers;
        console.log(`Drivers list ${test_type}: `, drivers_list);
      } else {
        console.log(`No ${test_type} drivers`);
      }
    } catch (error) {
      console.log(`Error getting ${test_type} drivers: `, error);
    }
    res.render("examiner", {
      pending_drivers: drivers_list,
      user: req.session.user,
    });
  };

  static post_score = async (req, res) => {
    const form_data = req.body;
    const user_id = form_data.user_id;
    // ternary operator to check if user passed or failed
    const pass_fail = form_data.score === "pass" ? true : false;
    console.log("Form data: ", form_data, "Pass/Fail: ", pass_fail);
    try {
      // add testPassed value and comment value to user
      const score_update = await userModel.findOneAndUpdate(
        { _id: user_id },
        {
          testPassed: pass_fail,
          comments: form_data.comment,
        },
        { new: true }
      );
    } catch (error) {
      console.log("Error updating user score: ", error);
    }
    res.redirect("/examiner");
  };
}

export default ExaminerController;
