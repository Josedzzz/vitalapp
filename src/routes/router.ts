import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import {
  jwtDoctorsMiddleware,
  jwtPatientsMiddleware,
  validateDoctorLogin,
  validateLogin,
  validateSignup,
} from "../middlewares/authValidation.ts";
import {
  checkAuthController,
  loginController,
  loginDoctorController,
  signUpController,
} from "../controllers/auth.ts";
import {
  validateAgenda,
  validateDiagnosisMiddleware,
  validateDiseaseIdMiddleware,
  validatePagination,
} from "../middlewares/doctorValidation.ts";
import {
  addDiagnosisController,
  assignAgendaController,
  getAllDiseasesController,
  getAllDoctorsController,
  getDiseaseByIdController,
  getDoctorAppointmentsController,
} from "../controllers/doctors.ts";
import {
  getDiseaseByIdPatientController,
  getDoctorByIdController,
  getPatientAgendasController,
  getPatientDiagnosisController,
  getPatientInfoController,
} from "../controllers/patients.ts";
import {
  validateDiseaseIdPatientMiddleware,
  validateDoctorIdMiddleware,
} from "../middlewares/patientValidation.ts";

const router = new Router();

// auth routes
router.post("/auth/signup", validateSignup, signUpController);
router.post("/auth/login", validateLogin, loginController);
router.get("/auth/check", jwtPatientsMiddleware, checkAuthController);
router.post("/auth/login-doc", validateDoctorLogin, loginDoctorController);
router.get("/auth/check-doc", jwtDoctorsMiddleware, checkAuthController);

// health check
router.get("/api/health", (ctx) => {
  ctx.response.body = { success: true, message: "API is up and running" };
});

// doctor routes
router.post(
  "/doc/agenda",
  jwtDoctorsMiddleware,
  validateAgenda,
  assignAgendaController,
);
router.get("/doc/doctors", jwtDoctorsMiddleware, getAllDoctorsController);
router.get(
  "/doc/appointments",
  jwtDoctorsMiddleware,
  validatePagination,
  getDoctorAppointmentsController,
);
router.get("/doc/diseases", jwtDoctorsMiddleware, getAllDiseasesController);
router.get(
  "/doc/diseases/:id",
  jwtDoctorsMiddleware,
  validateDiseaseIdMiddleware,
  getDiseaseByIdController,
);
router.post(
  "/doc/diagnosis",
  jwtDoctorsMiddleware,
  validateDiagnosisMiddleware,
  addDiagnosisController,
);

// patient routes
router.get("/patient/me", jwtPatientsMiddleware, getPatientInfoController);
router.get(
  "/patient/agenda",
  jwtPatientsMiddleware,
  validatePagination,
  getPatientAgendasController,
);
router.get(
  "/patient/diagnosis",
  jwtPatientsMiddleware,
  validatePagination,
  getPatientDiagnosisController,
);
router.get(
  "/patient/diseases/:id",
  jwtPatientsMiddleware,
  validateDiseaseIdPatientMiddleware,
  getDiseaseByIdPatientController,
);
router.get(
  "/patient/doctors/:id",
  jwtPatientsMiddleware,
  validateDoctorIdMiddleware,
  getDoctorByIdController,
);
router.get("/patient/doctors", jwtPatientsMiddleware, getAllDoctorsController);
router.post(
  "/patient/agenda",
  jwtPatientsMiddleware,
  validateAgenda,
  assignAgendaController,
);

export default router;
