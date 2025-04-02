import db from "../config/db.ts";

export interface DoctorSchema {
  _id: { $oid: string };
  name: string;
  lastName: string;
  specialization: string;
}

export const Doctors = db.collection<DoctorSchema>("doctors");
