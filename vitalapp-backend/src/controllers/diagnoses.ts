import { Diagnoses, DiagnosisSchema } from "../models/diagnosis.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.2/mod.ts";

// create a diagnosis for a patient
export const createDiagnosis = async (diagnosisData: DiagnosisSchema) => {
  return await Diagnoses.insertOne(diagnosisData);
};

// get all the diagnosis of a patient
export const getDiagnosesByPatient = async (patientId: string) => {
  return await Diagnoses.find({ patientId }).toArray();
};

// get a diagnosis by the id
export const getDiagnosisById = async (id: string) => {
  return await Diagnoses.findOne({ _id: new ObjectId(id) });
};

// update a diagnosis by the id
export const updateDiagnosis = async (
  id: string,
  diagnosisData: DiagnosisSchema,
) => {
  return await Diagnoses.updateOne(
    { _id: new ObjectId(id) },
    { $set: diagnosisData },
  );
};

// delete a diagnosis by the id
export const deleteDiagnosis = async (id: string) => {
  return await Diagnoses.deleteOne({ _id: new ObjectId(id) });
};
