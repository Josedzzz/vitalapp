import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";

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
