import express from "express";
import Controller from "../controllers/Controller.js";
import App_Controller from "../controllers/appointment_ctrl.js";
import ExaminerController from "../controllers/examiner_ctrl.js";
import isDriver, {
  isAdmin,
  isAuthorized,
  isExaminer,
} from "../middlewares/auth.js";

const router = express.Router();

router.get("/login", Controller.login_get);
router.post("/login", Controller.login_post);
router.post("/signup", Controller.signup_post);

router.get("/dashboard", Controller.dashboard_get);

router.get("/g_test", isDriver, Controller.g_test_get);
router.post("/g_post", Controller.g_test_post);

router.get("/g2_test", isDriver, Controller.g2_test_get);
router.post("/g2_post", Controller.g2_test_post);

router.get("/appointment", isAdmin, App_Controller.appointment_get);
router.post("/add_appt", App_Controller.add_appointment);
router.post("/get_timeslots", App_Controller.get_timeslots);

router.post("/g_get_appointments", App_Controller.g_get_date_appointments);
router.post("/g_book_appointment", App_Controller.g_book_appointment);
router.post("/g_update_user", Controller.g_update_user);

router.post("/g2_get_appointments", App_Controller.g2_get_date_appointments);
router.post("/g2_book_appointment", App_Controller.g2_book_appointment);
router.post("/g2_update_user", Controller.g2_update_user);

router.get("/passfail", App_Controller.pass_fail_get);
router.post("/passfail_filter", App_Controller.pass_fail_post);

router.get("/examiner", isExaminer, ExaminerController.examiner_page_get);
router.post("/filter_pending_list", ExaminerController.filter_pending_list);
router.post("/post_score", ExaminerController.post_score);

router.get("/logout", Controller.logout_get);

export default router;
