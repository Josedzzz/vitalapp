import { Context, Status } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { Patients } from "../models/patient.ts";
import { errorResponse } from "../utils/response.ts";
import { compare } from "npm:bcryptjs";
import { verifyJwt } from "../utils/jwt.ts";
import { ObjectId } from "npm:mongodb";
import { Doctors } from "../models/doctor.ts";

// validation scheme
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  direction: z.string().optional(),
});

// validation schema for login
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// middleware to validate the patient daa
export const validateSignup = async (
  ctx: Context,
  next: () => Promise<unknown>,
) => {
  const body = await ctx.request.body({ type: "json" }).value;
  const result = signupSchema.safeParse(body);
  if (!result.success) {
    const message = result.error.errors[0].message;
    ctx.response.status = Status.BadRequest;
    ctx.response.body = errorResponse("VALIDATION_ERROR", message);
    return;
  }
  const existingPatient = await Patients.findOne({ email: body.email });
  if (existingPatient) {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = errorResponse(
      "EMAIL_IN_USE",
      "Email is already in use",
    );
    return;
  }
  ctx.state.validatedBody = result.data;
  await next();
};

// middleware to validate login data
export const validateLogin = async (
  ctx: Context,
  next: () => Promise<unknown>,
) => {
  const body = await ctx.request.body({ type: "json" }).value;
  const result = loginSchema.safeParse(body);
  if (!result.success) {
    const message = result.error.errors[0].message;
    ctx.response.status = Status.BadRequest;
    ctx.response.body = errorResponse("VALIDATION_ERROR", message);
    return;
  }
  const patient = await Patients.findOne({ email: body.email });
  if (!patient) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = errorResponse(
      "INVALID_CREDENTIALS",
      "Invalid email or password",
    );
    return;
  }
  const isPasswordValid = await compare(body.password, patient.password);
  if (!isPasswordValid) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = errorResponse(
      "INVALID_CREDENTIALS",
      "Invalid email or password",
    );
    return;
  }
  ctx.state.validatedBody = result.data;
  ctx.state.patient = patient;
  await next();
};

// middleware to validate the jwt token for a patient
export const jwtPatientsMiddleware = async (
  ctx: Context,
  next: () => Promise<unknown>,
) => {
  const bearerToken = ctx.request.headers.get("Authorization");
  if (!bearerToken) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = errorResponse("UNAUTHORIZED", "No token provided");
    return;
  }
  const token = bearerToken.split(" ")[1];
  if (!token) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = errorResponse("INVALID_TOKEN", "Invalid token format");
    return;
  }
  try {
    const decodedToken = await verifyJwt(token);
    const userId = new ObjectId(decodedToken.sub);
    const patient = await Patients.findOne({ _id: userId });
    if (!patient) {
      ctx.response.status = Status.Unauthorized;
      ctx.response.body = errorResponse(
        "PATIENT_NOT_FOUND",
        "Patient not found",
      );
      return;
    }
    ctx.state.patient = patient;
    await next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = errorResponse(
      "INVALID_TOKEN",
      "Invalid or expired token",
    );
  }
};

// middleware to validate login data for a doctor
export const validateDoctorLogin = async (
  ctx: Context,
  next: () => Promise<unknown>,
) => {
  const body = await ctx.request.body({ type: "json" }).value;
  const result = loginSchema.safeParse(body);
  if (!result.success) {
    const message = result.error.errors[0].message;
    ctx.response.status = Status.BadRequest;
    ctx.response.body = errorResponse("VALIDATION_ERROR", message);
    return;
  }
  const doctor = await Doctors.findOne({ email: body.email });
  if (!doctor) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = errorResponse(
      "INVALID_CREDENTIALS",
      "Invalid email or password",
    );
    return;
  }
  const isPasswordValid = await compare(body.password, doctor.password);
  if (!isPasswordValid) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = errorResponse(
      "INVALID_CREDENTIALS",
      "Invalid email or password",
    );
    return;
  }
  ctx.state.validatedBody = result.data;
  ctx.state.doctor = doctor;
  await next();
};

// middleware to validate the jwt token for a doctor
export const jwtDoctorsMiddleware = async (
  ctx: Context,
  next: () => Promise<unknown>,
) => {
  const bearerToken = ctx.request.headers.get("Authorization");
  if (!bearerToken) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = errorResponse("UNAUTHORIZED", "No token provided");
    return;
  }
  const token = bearerToken.split(" ")[1];
  if (!token) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = errorResponse("INVALID_TOKEN", "Invalid token format");
    return;
  }
  try {
    const decodedToken = await verifyJwt(token);
    const doctorId = new ObjectId(decodedToken.sub);
    const doctor = await Doctors.findOne({ _id: doctorId });
    if (!doctor) {
      ctx.response.status = Status.Unauthorized;
      ctx.response.body = errorResponse("DOCTOR_NOT_FOUND", "Doctor not found");
      return;
    }
    ctx.state.doctor = doctor;
    await next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = errorResponse(
      "INVALID_TOKEN",
      "Invalid or expired token",
    );
  }
};
