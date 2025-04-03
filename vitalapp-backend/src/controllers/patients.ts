import { Patients, PatientSchema } from "../models/patient.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.2/mod.ts";

// insert the patient data on the db
export const createPatient = async (patientData: PatientSchema) => {
  return await Patients.insertOne(patientData);
};

// gets all the patients
export const getPatients = async () => {
  return await Patients.find().toArray();
};

// gets a patient by the id
export const getPatientById = async (id: string) => {
  return await Patients.findOne({ _id: new ObjectId(id) });
};

// udpate a patient by the id
export const updatePatient = async (id: string, patientData: PatientSchema) => {
  return await Patients.updateOne(
    { _id: new ObjectId(id) },
    { $set: patientData },
  );
};

// delete a patient by the id
export const deletePatient = async (id: string) => {
  return await Patients.deleteOne({ _id: new ObjectId(id) });
};
