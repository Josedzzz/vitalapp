import db from "../config/db.ts";

export interface PatientSchema {
  _id: { $oid: string };
  name: string;
  lastName: string;
  direction: string;
  email: string;
  password: string;
}

export const Patients = db.collection<PatientSchema>("patients");
