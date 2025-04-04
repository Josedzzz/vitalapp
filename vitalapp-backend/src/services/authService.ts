import { hash } from "npm:bcryptjs";
import { CreatedPatient, Patients, PatientSchema } from "../models/patient.ts";

/**
 * handles the business logic for creating a new patient
 * @param userData - patient information from request
 * @returns the created patient object
 */
export const signUpService = async (
  userData: Omit<PatientSchema, "_id">,
): Promise<CreatedPatient> => {
  const hashedPassword = await hash(userData.password, 10);
  const userToInsert = {
    ...userData,
    password: hashedPassword,
  };
  const patient = await Patients.insertOne(userToInsert);
  if (!patient) {
    throw new Error("Failed to create patient");
  }
  return {
    ...userToInsert,
    _id: patient.insertedId.toString(),
  };
};
