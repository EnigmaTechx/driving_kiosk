import express from "express";
import Controller from "../controllers/Controller.js";
import App_Controller from "../controllers/appointment_ctrl.js";
import isDriver, { isAdmin, isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

router.get("/login", Controller.login_get);
router.post("/login", Controller.login_post);
router.post("/signup", Controller.signup_post);
router.get("/dashboard", Controller.dashboard_get);
router.get("/g_test", isDriver, Controller.g_test_get);
router.get("/g2_test", isDriver, Controller.g2_test_get);
router.post("/g2_post", Controller.g2_test_post);
router.get("/appointment", isAdmin, App_Controller.appointment_get);
router.post("/add_appt", App_Controller.add_appointment);
router.post("/get_timeslots", App_Controller.get_timeslots);
router.post("/get_appointments", App_Controller.get_date_appointments);
router.post("/book_appointment", App_Controller.book_appointment);
router.post("/update_user", Controller.update_user);
router.get("/logout", Controller.logout_get);

export default router;
