import db from "../config/db.ts";

export interface DoctorSchema {
  _id: { $oid: string };
  name: string;
  lastName: string;
  specialization: string;
  email: string;
  password: string;
}

export type InsertDoctor = Omit<DoctorSchema, "_id">;
export const Doctors = db.collection<DoctorSchema>("doctors");
