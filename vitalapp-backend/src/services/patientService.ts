import { ObjectId } from "npm:mongodb";
import { Patients } from "../models/patient.ts";

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
