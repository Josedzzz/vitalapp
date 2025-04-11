import { ObjectId } from "npm:mongodb";
import db from "../config/db.ts";

export interface DiagnosisSchema {
  _id?: ObjectId;
  patientId: string;
  agendaId: string;
  description: string;
  diseaseId: string[];
}

export const Diagnosis = db.collection<DiagnosisSchema>("diagnosis");

// types for the diagnosis
export type InsertDiagnosis = Omit<DiagnosisSchema, "_id"> & { _id: string };
