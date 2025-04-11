import { ObjectId } from "npm:mongodb";
import { Patients } from "../models/patient.ts";
import { Agendas } from "../models/agenda.ts";

/**
 * get a patient info by the id of it
 * @param id - the id of the patient
 * @returns the patient info
 */
export const getPatientByIdService = async (id: string) => {
  try {
    const objectId = new ObjectId(id);
    const patient = await Patients.findOne({ _id: objectId });
    return patient;
  } catch (error) {
    console.error("Error retrieving patient:", error);
    return null;
  }
};

/**
 * gets all the patient agendas
 * @param patientId - the id of the patient
 * @param page - the page to get
 * @param limit - the limit of each page
 * @returns the list of patient agendas
 */
export const getPatientAgendasService = async (
  patientId: string,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;
  const agendas = await Agendas.find({ patientId: patientId })
    .sort({ date: 1 })
    .skip(skip)
    .limit(limit)
    .toArray();
  return agendas;
};
