import { hash, compare } from "npm:bcryptjs";
import { CreatedPatient, Patients, PatientSchema } from "../models/patient.ts";
import { generateJwt } from "../utils/jwt.ts";
import { Doctors } from "../models/doctor.ts";

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

/**
 * handles the login for a patient
 * @param email - the email of the patient
 * @param password - the provided password
 * @returns the userId and the jwt token
 */
export const loginService = async (
  email: string,
  password: string,
): Promise<{ userId: string; token: string }> => {
  const patient = await Patients.findOne({ email });
  if (!patient) {
    throw new Error("Invalid credentials");
  }
  const isMatch = await compare(password, patient.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  const userId = patient._id.toString();
  const token = await generateJwt(patient._id.toString());
  return { userId, token };
};

/**
 * handles the login for a doctor
 * @param email - the email of the doctor
 * @param password - the provided password
 * @returns the userId and the jwt token for a doctor
 */
export const loginDoctorService = async (
  email: string,
  password: string,
): Promise<{ doctorId: string; token: string }> => {
  const doctor = await Doctors.findOne({ email });
  if (!doctor) {
    throw new Error("Invalid credentials");
  }
  const isMatch = await compare(password, doctor.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  const doctorId = doctor._id.toString();
  const token = await generateJwt(doctor._id.toString());
  return { doctorId, token };
};
