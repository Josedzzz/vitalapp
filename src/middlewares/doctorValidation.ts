import {
  Context,
  RouterContext,
  Status,
} from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { errorResponse } from "../utils/response.ts";
import { Doctors } from "../models/doctor.ts";
import { ObjectId } from "npm:mongodb";
import { Diseases } from "../models/disease.ts";

// validates the startTime is before the endTime
const isStartBeforeEnd = (start: string, end: string): boolean => {
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);
  if (startHour < endHour) return true;
  if (startHour === endHour && startMinute < endMinute) return true;
  return false;
};

// validation scheme to create an agenda
const agendaSchema = z
  .object({
    patientEmail: z.string().email("Invalid email"),
    doctorId: z.string().length(24, "Invalid doctor Id"),
    date: z.string(),
    startTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid start time format"),
    endTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid end time format"),
  })
  .refine((data) => isStartBeforeEnd(data.startTime, data.endTime), {
    message: "Start time must be before end time",
    path: ["startTime"],
  });

// middleware to validate the agenda data
export const validateAgenda = async (
  ctx: Context,
  next: () => Promise<unknown>,
) => {
  const body = await ctx.request.body({ type: "json" }).value;
  const result = agendaSchema.safeParse(body);
  if (!result.success) {
    const message = result.error.errors[0].message;
    ctx.response.status = Status.BadRequest;
    ctx.response.body = errorResponse("VALIDATION_ERROR", message);
    return;
  }
  const { doctorId } = result.data;
  const doctor = await Doctors.findOne({ _id: new ObjectId(doctorId) });
  if (!doctor) {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = errorResponse("DOCTOR_NOT_FOUND", "Doctor not found");
    return;
  }
  ctx.state.validatedBody = result.data;
  await next();
};

// middleware to validate the pagination
export const validatePagination = async (
  ctx: Context,
  next: () => Promise<unknown>,
) => {
  const url = ctx.request.url;
  const pageParam = url.searchParams.get("page") ?? "1";
  const limitParam = url.searchParams.get("limit") ?? "10";
  const page = parseInt(pageParam);
  const limit = parseInt(limitParam);
  if (isNaN(page) || page < 1 || isNaN(limit) || limit < 1) {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = errorResponse(
      "INVALID_PAGINATION",
      "Invalid pagination parameters",
    );
    return;
  }
  ctx.state.pagination = { page, limit };
  await next();
};

// middleware to validate a disease
export const validateDiseaseIdMiddleware = async (
  ctx: RouterContext<"/doc/diseases/:id">,
  next: () => Promise<unknown>,
) => {
  const { id } = ctx.params;
  if (!id || !ObjectId.isValid(id)) {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = errorResponse("INVALID_ID", "Invalid disease ID");
    return;
  }
  const disease = await Diseases.findOne({ _id: new ObjectId(id) });
  if (!disease) {
    ctx.response.status = Status.NotFound;
    ctx.response.body = errorResponse("DISEASE_NOT_FOUND", "Disease not found");
    return;
  }
  ctx.state.disease = disease;
  await next();
};

// basic validation for the diagnosis schema
const diagnosisSchema = z.object({
  patientId: z.string().min(1),
  agendaId: z.string().min(1),
  description: z.string().min(1),
  diseaseId: z.array(z.string().min(1)).min(1),
});

// middleware to validate the diagnosis
export const validateDiagnosisMiddleware = async (
  ctx: Context,
  next: () => Promise<unknown>,
) => {
  const body = await ctx.request.body({ type: "json" }).value;
  const result = diagnosisSchema.safeParse(body);
  if (!result.success) {
    const message = result.error.errors[0].message;
    ctx.response.status = Status.BadRequest;
    ctx.response.body = errorResponse("VALIDATION_ERROR", message);
    return;
  }
  ctx.state.validatedBody = result.data;
  await next();
};
