import {
  RouterContext,
  Context,
  Status,
} from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { ObjectId } from "npm:mongodb";
import { errorResponse } from "../utils/response.ts";
import { Diseases } from "../models/disease.ts";
import { Doctors } from "../models/doctor.ts";

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
export const validateDiseaseIdPatientMiddleware = async (
  ctx: RouterContext<"/patient/diseases/:id">,
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

// middleware to validate the doctor id
export const validateDoctorIdMiddleware = async (
  ctx: RouterContext<"/patient/doctors/:id">,
  next: () => Promise<unknown>,
) => {
  const { id } = ctx.params;
  if (!id || !ObjectId.isValid(id)) {
    ctx.response.status = Status.BadRequest;
    ctx.response.body = errorResponse("INVALID_ID", "Invalid disease ID");
    return;
  }
  const doctor = await Doctors.findOne({ _id: new ObjectId(id) });
  if (!doctor) {
    ctx.response.status = Status.NotFound;
    ctx.response.body = errorResponse("DOCTOR_NOT_FOUND", "Doctor not found");
    return;
  }
  ctx.state.doctorId = doctor._id;
  await next();
};
