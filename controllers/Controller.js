import userModel, { appointmentModel } from "../models/UserModel.js";
import bcrypt, { hash } from "bcrypt";

class Controller {
  // AUTH ROUTES
  static login_get = (req, res) => {
    const error = req.session.error;
    delete req.session.error;
    res.render("login", { err: error });
  };

  static login_post = async (req, res) => {
    const form_data = req.body;
    const user_in_db = await userModel.findOne({ username: form_data.uname });
    if (!user_in_db) {
      req.session.error = "Username not found";
      res.redirect("/login");
    } else {
      const isMatched = await bcrypt.compare(
        form_data.pwd,
        user_in_db.password
      );
      if (isMatched) {
        let userInfo = {
          user_id: user_in_db._id,
          username: user_in_db.username,
          UserType: user_in_db.UserType,
        };
        req.session.user = userInfo;
        const user = req.session.user;
        res.render("dashboard", { user: userInfo });
      } else {
        req.session.error = "Invalid Password";
        res.redirect("/login");
      }
    }
  };

  static signup_post = async (req, res) => {
    const form_data = req.body;
    const username = await userModel.findOne({ username: form_data.uname });
    if (username) {
      req.session.error = "Username already exists";
      res.redirect("/login");
    } else {
      try {
        const hashed_pwd = await bcrypt.hash(form_data.pwd, 10);

        const user_to_save = new userModel({
          username: form_data.uname,
          email: form_data.email,
          password: hashed_pwd,
          UserType: form_data.user_type,
        });

        const user_saved_in_db = await user_to_save.save();
        res.redirect("/login");
      } catch (error) {
        res.send(error);
      }
    }
  };

  static logout_get = (req, res) => {
    req.session.destroy();
    res.redirect("/login");
  };

  // MAIN PAGE ROUTES
  static dashboard_get = (req, res) => {
    res.render("dashboard", { user: req.session.user });
  };

  static g_test_get = async (req, res) => {
    const success = req.session.success;
    delete req.session.success;
    const error = req.session.error;
    delete req.session.error;
    // fetch user from db
    const userInfo = await userModel.findOne({ _id: req.session.user.user_id });
    if (userInfo.licenseNum === "default") {
      // user has not filled out their info; redirect to g2_test page
      res.redirect("/g2_test");
    } else {
      // user has filled out their info; render g_test page
      res.render("g_test", { user: userInfo, success: success, err: error });
    }
  };

  static update_user = async (req, res) => {
    try {
      const userId = req.session.user.user_id;
      const form_data = req.body;
      // ensure fields are filled out
      if (
        form_data.make === "" ||
        form_data.model === "" ||
        form_data.year === "" ||
        form_data.platenum === ""
      ) {
        req.session.error = "Please fill out all fields";
        res.redirect("/g_test");
      } else {
        const doc = await userModel.findOneAndUpdate(
          { _id: userId },
          {
            $set: {
              carDetails: {
                make: form_data.make,
                model: form_data.model,
                year: form_data.year,
                platenum: form_data.platenum,
              },
            },
          },
          { new: true }
        );
        if (doc) {
          req.session.success = "Car details updated successfully";
          res.redirect("g_test");
        } else {
          req.session.error = "Failed to update car details";
          res.redirect("g_test");
        }
      }
    } catch (error) {
      console.log(`unable to update ${error}`);
    }
  };

  static g2_test_get = async (req, res) => {
    const error = req.session.error;
    delete req.session.error;
    const userInfo = await userModel.findOne({ _id: req.session.user.user_id });
    const isDefault = userInfo.licenseNum === "default" ? true : false;
    let app_booked = null;
    let date = null;
    if (userInfo.appointmentID !== "default") {
      const app = await appointmentModel.findOne({
        _id: userInfo.appointmentID,
      });
      date = app.date;
      const time = app.time;
      app_booked = `Your appointment is booked for ${date} at ${time}`;
    }

    res.render("g2_test", {
      user: userInfo,
      isDefault: isDefault,
      err: error,
      date: date,
      timeslots: null,
      app_booked: app_booked,
    });
  };

  static g2_test_post = async (req, res) => {
    try {
      const userId = req.session.user.user_id;
      const form_data = req.body;
      // ensure all fields are filled out
      if (
        form_data.fname === "" ||
        form_data.lname === "" ||
        form_data.license === "" ||
        form_data.age === "" ||
        form_data.make === "" ||
        form_data.model === "" ||
        form_data.year === "" ||
        form_data.platenum === ""
      ) {
        req.session.error = "Please fill out all fields";
        res.redirect("/g2_test");
      } else {
        // make sure licence number is exactly 8 characters
        if (form_data.license.length !== 8) {
          req.session.error = "License number must be 8 characters";
          res.redirect("/g2_test");
        } else {
          // check if license number already exists in db
          const user_in_db = await userModel.findOne({ _id: userId });
          const duplicateLicense = await bcrypt.compare(
            form_data.license,
            user_in_db.licenseNum
          );
          if (duplicateLicense) {
            req.session.error = "License number already exists";
            res.redirect("/g2_test");
          } else {
            const hashed_license = await bcrypt.hash(form_data.license, 10);
            const doc = await userModel.findOneAndUpdate(
              { _id: userId },
              {
                $set: {
                  firstName: form_data.fname,
                  lastName: form_data.lname,
                  licenseNum: hashed_license,
                  age: form_data.age,
                  carDetails: {
                    make: form_data.make,
                    model: form_data.model,
                    year: form_data.year,
                    platenum: form_data.platenum,
                  },
                },
              },
              { new: true }
            );
            if (doc) {
              res.redirect("g_test");
            } else {
              res.redirect("/g2_test");
            }
          }
        }
      }
    } catch (error) {
      console.log(`unable to update ${error}`);
    }
  };
}

export default Controller;
