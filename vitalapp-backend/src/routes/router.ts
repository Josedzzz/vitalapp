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

export default router;
