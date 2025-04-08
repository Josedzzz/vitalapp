import { Context, Status } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { errorResponse } from "../utils/response.ts";
import { Doctors } from "../models/doctor.ts";
import { ObjectId } from "npm:mongodb";

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
