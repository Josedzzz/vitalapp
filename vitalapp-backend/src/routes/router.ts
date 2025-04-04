import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { validateSignup } from "../middlewares/authValidation.ts";
import { signUpController } from "../controllers/auth.ts";

const router = new Router();

// auth routes
router.post("/auth/signup", validateSignup, signUpController);

// health check
router.get("/api/health", (ctx) => {
  ctx.response.body = { success: true, message: "API is up and running" };
});

export default router;
