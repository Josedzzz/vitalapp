import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { signUpService } from "../services/authService.ts";
import { successResponse, errorResponse, AppError } from "../utils/response.ts";

// controller to create a patient
export const signUpController = async (ctx: Context): Promise<void> => {
  try {
    const body = await ctx.request.body({ type: "json" }).value;
    const user = await signUpService(body);
    ctx.response.status = 201;
    ctx.response.body = successResponse(user, "User created successfully");
  } catch (error) {
    const err = error as AppError;
    ctx.response.status = 400;
    ctx.response.body = errorResponse(
      err.error?.code || "SIGNUP_ERROR",
      err.error?.message || "Signup failed",
    );
  }
};
