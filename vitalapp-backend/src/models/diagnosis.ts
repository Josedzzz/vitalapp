import db from "../config/db.ts";

export interface DiagnosisSchema {
  _id: { $oid: string };
  patientId: string;
  description: string;
  diseaseId: string;
}

export const Diagnoses = db.collection<DiagnosisSchema>("diagnoses");
