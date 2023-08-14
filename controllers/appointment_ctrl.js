import userModel, { appointmentModel } from "../models/UserModel.js";
import bcrypt, { hash } from "bcrypt";

class App_Controller {
	static appointment_get = async (req, res) => {
		let timeslots = ["9:00", "9:30", "10:00", "10:30"];
		req.session.timeslots = timeslots;
		let all_appointments = [];
		const appointments_in_db = await appointmentModel.find({});
		if (appointments_in_db.length > 0) {
			all_appointments = appointments_in_db;
		}
		res.render("appointment", {
			user: req.session.user,
			timeslots: timeslots,
			all_appointments: all_appointments,
			_date: null,
		});
	};

	static add_appointment = async (req, res) => {
		const form_data = req.body;
		const appointment_to_save = new appointmentModel({
			date: form_data.app_date,
			time: form_data.app_time,
		});
		const appointment_saved_in_db = await appointment_to_save.save();
		res.redirect("/appointment");
	};

	/**
	 * Admin: get all available times for a specific date
	 */
	static get_timeslots = async (req, res) => {
		try {
			const form_data = req.body;
			let timeslots = [];
			let stored_timeslots = req.session.timeslots;
			const appointment_dates = await appointmentModel.find({
				date: form_data.app_date,
			});
			let all_appointments = [];
			const appointments_in_db = await appointmentModel.find();
			if (appointments_in_db.length > 0) {
				all_appointments = appointments_in_db;
			}

			if (appointment_dates.length > 0) {
				appointment_dates.forEach((appt) => {
					// if date's timeslot is already taken, remove it from the list
					if (stored_timeslots.includes(appt.time)) {
						stored_timeslots.splice(stored_timeslots.indexOf(appt.time), 1);
					}
				});
			} else {
				stored_timeslots = ["9:00", "9:30", "10:00", "10:30"];
			}
			console.log("stored_timeslots: ", stored_timeslots);
			let date = form_data.app_date;
			res.render("appointment", {
				user: req.session.user,
				timeslots: stored_timeslots,
				_date: date,
				all_appointments: all_appointments,
			});
		} catch (error) {
			console.log(`unable to find appointment ${error}`);
		}
	};

	/**
	 * Driver: get all available times for a specific date (G2)
	 */
	static g2_get_date_appointments = async (req, res) => {
		try {
			const form_data = req.body;
			let timeslots = [];
			const userInfo = await userModel.findOne({
				_id: req.session.user.user_id,
			});
			const isDefault = userInfo.licenseNum === "default" ? true : false;
			let app_booked = null;
			let selected_date = form_data.app_date;
			let formaction_fisrt_form = "/g2_post";
			let formaction_second_form = "/g2_get_appointments";
			let formaction_third_form = "/g2_book_appointment";
			if (userInfo.appointmentID !== "default") {
				const app = await appointmentModel.findOne({
					_id: userInfo.appointmentID,
				});
				const date = app.date;
				const time = app.time;
				app_booked = `Your appointment is booked for ${date} at ${time}`;
				formaction_fisrt_form = "/g2_update_user";
				formaction_second_form = "/g2_get_appointments";
			}
			const appointment_dates = await appointmentModel.find({
				date: form_data.app_date,
			});
			if (appointment_dates.length > 0) {
				timeslots = appointment_dates;
			} else {
				timeslots = "404";
			}
			selected_date = form_data.app_date;
			res.render("g2_test", {
				user: userInfo,
				timeslots: timeslots,
				date: selected_date,
				err: null,
				isDefault: isDefault,
				driverMarkExist: req.session.user.driverMarkExist,
				formaction_fisrt_form: formaction_fisrt_form,
				formaction_second_form: formaction_second_form,
				formaction_third_form: formaction_third_form,
				app_booked: app_booked,
			});
		} catch (error) {
			console.log(`unable to find appointment ${error}`);
		}
	};

	/**
	 * Driver: get all available times for a specific date (G)
	 */
	static g_get_date_appointments = async (req, res) => {
		try {
			const form_data = req.body;
			let timeslots = [];
			const userInfo = await userModel.findOne({
				_id: req.session.user.user_id,
			});
			const isDefault = userInfo.licenseNum === "default" ? true : false;
			let app_booked = null;
			let selected_date = form_data.app_date;
			let formaction_fisrt_form = "/g_post";
			let formaction_second_form = "/g_get_appointments";
			let formaction_third_form = "/g_book_appointment";
			if (userInfo.appointmentID !== "default") {
				const app = await appointmentModel.findOne({
					_id: userInfo.appointmentID,
				});
				const date = app.date;
				const time = app.time;
				app_booked = `Your appointment is booked for ${date} at ${time}`;
				formaction_fisrt_form = "/g_update_user";
				formaction_second_form = "/g_get_appointments";
			}
			const appointment_dates = await appointmentModel.find({
				date: form_data.app_date,
			});
			if (appointment_dates.length > 0) {
				timeslots = appointment_dates;
			} else {
				timeslots = "404";
			}
			selected_date = form_data.app_date;
			res.render("g2_test", {
				user: userInfo,
				timeslots: timeslots,
				date: selected_date,
				err: null,
				isDefault: isDefault,
				driverMarkExist: req.session.user.driverMarkExist,
				formaction_fisrt_form: formaction_fisrt_form,
				formaction_second_form: formaction_second_form,
				formaction_third_form: formaction_third_form,
				app_booked: app_booked,
			});
		} catch (error) {
			console.log(`unable to find appointment ${error}`);
		}
	};

	/**
	 * Driver: book an appointment (G2)
	 */
	static g2_book_appointment = async (req, res) => {
		try {
			const form_data = req.body;
			const appointment_to_update = await appointmentModel.findOneAndUpdate(
				{ _id: form_data.app_id },
				{
					$set: {
						isTimeSlotAvailable: false,
					},
				},
				{ new: true }
			);
			if (appointment_to_update) {
				let user_id = req.session.user.user_id;
				const user = await userModel.findOneAndUpdate(
					{ _id: user_id },
					{
						$set: {
							appointmentID: form_data.app_id,
						},
					},
					{ new: true }
				);
				if (user) {
					let app_booked = `Your appointment is booked for ${appointment_to_update.date} at ${appointment_to_update.time}`;
					let formaction_fisrt_form = "/g2_post";
					let formaction_second_form = "/g2_get_appointments";
					res.render("g2_test", {
						user: user,
						timeslots: null,
						date: null,
						err: null,
						isDefault: false,
						driverMarkExist: req.session.user.driverMarkExist,
						formaction_fisrt_form: formaction_fisrt_form,
						formaction_second_form: formaction_second_form,
						app_booked: app_booked,
					});
				}
			}
		} catch (error) {
			console.log(`unable to book appointment ${error}`);
		}
	};

	/**
	 * Driver: book an appointment (G)
	 */
	static g_book_appointment = async (req, res) => {
		try {
			const form_data = req.body;
			const appointment_to_update = await appointmentModel.findOneAndUpdate(
				{ _id: form_data.app_id },
				{
					$set: {
						isTimeSlotAvailable: false,
					},
				},
				{ new: true }
			);
			if (appointment_to_update) {
				let user_id = req.session.user.user_id;
				const user = await userModel.findOneAndUpdate(
					{ _id: user_id },
					{
						$set: {
							appointmentID: form_data.app_id,
						},
					},
					{ new: true }
				);
				if (user) {
					let app_booked = `Your appointment is booked for ${appointment_to_update.date} at ${appointment_to_update.time}`;
					let formaction_fisrt_form = "/g_post";
					let formaction_second_form = "/g_get_appointments";
					res.render("g_test", {
						user: user,
						timeslots: null,
						date: null,
						err: null,
						isDefault: false,
						driverMarkExist: req.session.user.driverMarkExist,
						formaction_fisrt_form: formaction_fisrt_form,
						formaction_second_form: formaction_second_form,
						app_booked: app_booked,
					});
				}
			}
		} catch (error) {
			console.log(`unable to book appointment ${error}`);
		}
	};
}

export default App_Controller;
