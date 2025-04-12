import { ObjectId } from "npm:mongodb";
import db from "../config/db.ts";

export interface PatientSchema {
  _id?: ObjectId;
  name: string;
  lastName: string;
  direction?: string;
  email: string;
  password: string;
}

export const Patients = db.collection<PatientSchema>("patients");

// types for the patient
export type CreatedPatient = Omit<PatientSchema, "_id"> & { _id: string };
