import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import {
  validateLogin,
  validateSignup,
} from "../middlewares/authValidation.ts";
import { loginController, signUpController } from "../controllers/auth.ts";

const router = new Router();

// auth routes
router.post("/auth/signup", validateSignup, signUpController);
router.post("/auth/login", validateLogin, loginController);

// health check
router.get("/api/health", (ctx) => {
  ctx.response.body = { success: true, message: "API is up and running" };
});

export default router;
