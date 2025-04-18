import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import {
  addDiagnosisService,
  assignAppointmentService,
  getAllDiseasesService,
  getAllDoctorsService,
  getDiseaseByIdService,
  getDoctorAppointmentsService,
} from "../services/doctorService.ts";
import { successResponse, errorResponse, AppError } from "../utils/response.ts";

// controller to asign an agenda
export const assignAgendaController = async (ctx: Context): Promise<void> => {
  try {
    const { patientEmail, doctorId, date, startTime, endTime } =
      await ctx.request.body({
        type: "json",
      }).value;
    const agenda = await assignAppointmentService(
      patientEmail,
      doctorId,
      new Date(date),
      startTime,
      endTime,
    );
    ctx.response.status = 201;
    ctx.response.body = successResponse(agenda, "Agenda created successfully");
  } catch (error) {
    const err = error as AppError;
    ctx.response.status = 400;
    ctx.response.body = errorResponse(
      err.error?.code || "AGENDA_CREATION_ERROR",
      err.error?.message || "Failed to create agenda",
    );
  }
};

// controller to get all the doctors
export const getAllDoctorsController = async (ctx: Context): Promise<void> => {
  try {
    const url = ctx.request.url;
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 10;
    if (page <= 0 || limit <= 0) {
      ctx.response.status = 400;
      ctx.response.body = errorResponse(
        "INVALID_QUERY",
        "Page and limit must be greater than 0",
      );
      return;
    }
    const result = await getAllDoctorsService(page, limit);
    ctx.response.status = 200;
    ctx.response.body = successResponse(result, "Doctors fetched successfully");
  } catch (error) {
    const err = error as AppError;
    ctx.response.status = 500;
    ctx.response.body = errorResponse(
      err.error?.code || "GET_DOCTORS_ERROR",
      err.error?.message || "Failed to fetch doctors",
    );
  }
};

// controller to get all the appointments of a doctor
export const getDoctorAppointmentsController = async (
  ctx: Context,
): Promise<void> => {
  try {
    const doctor = ctx.state.doctor;
    const { page, limit } = ctx.state.pagination;
    const agendas = await getDoctorAppointmentsService(
      doctor._id.toString(),
      page,
      limit,
    );
    ctx.response.status = 200;
    ctx.response.body = successResponse(
      agendas,
      "Appointments retrieved successfully",
    );
  } catch (error) {
    const err = error as AppError;
    ctx.response.status = 500;
    ctx.response.body = errorResponse(
      err.error?.code || "GET_AGENDAS_ERROR",
      err.error?.message || "Failed to retrieve agendas",
    );
  }
};

// controller to gel all the diseases
export const getAllDiseasesController = async (ctx: Context) => {
  const diseases = await getAllDiseasesService();
  ctx.response.status = 200;
  ctx.response.body = successResponse(
    diseases,
    "Diseases retrieved successfully",
  );
};

// controller to get a disease base on the id
export const getDiseaseByIdController = (ctx: Context) => {
  const disease = ctx.state.disease;
  const data = getDiseaseByIdService(disease);
  ctx.response.status = 200;
  ctx.response.body = successResponse(data, "Disease retrieved successfully");
};

// controller to add a diagnosis
export const addDiagnosisController = async (ctx: Context) => {
  try {
    const data = ctx.state.validatedBody;
    const inserted = await addDiagnosisService(data);
    ctx.response.status = 200;
    ctx.response.body = successResponse({ _id: inserted }, "Diagnosis added");
  } catch (error) {
    const err = error as AppError;
    ctx.response.status = 500;
    ctx.response.body = errorResponse(
      err.error?.code || "PUT_DIAGNOSIS_ERROR",
      err.error?.message || "Failed to add the diagnosis",
    );
  }
};
