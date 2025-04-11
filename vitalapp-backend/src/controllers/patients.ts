import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { AppError, errorResponse, successResponse } from "../utils/response.ts";
import {
  getPatientAgendasService,
  getPatientDiagnosisService,
} from "../services/patientService.ts";

// gets the patient info
export const getPatientInfoController = (ctx: Context) => {
  const patient = ctx.state.patient;
  if (!patient) {
    ctx.response.status = 404;
    ctx.response.body = { error: "Patient not found" };
    return;
  }
  ctx.response.status = 200;
  ctx.response.body = {
    success: true,
    data: patient,
  };
};

// gets the patient agendas info
export const getPatientAgendasController = async (
  ctx: Context,
): Promise<void> => {
  try {
    const patient = ctx.state.patient;
    const { page, limit } = ctx.state.pagination;
    const agendas = await getPatientAgendasService(
      patient._id.toString(),
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

// gets the patient diagnosis info
export const getPatientDiagnosisController = async (
  ctx: Context,
): Promise<void> => {
  try {
    const patient = ctx.state.patient;
    const { page, limit } = ctx.state.pagination;
    const diagnosis = await getPatientDiagnosisService(
      patient._id.toString(),
      page,
      limit,
    );
    ctx.response.status = 200;
    ctx.response.body = successResponse(
      diagnosis,
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
