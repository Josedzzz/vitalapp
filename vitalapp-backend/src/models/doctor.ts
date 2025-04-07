import { ObjectId } from "npm:mongodb";
import db from "../config/db.ts";

export interface DoctorSchema {
  _id?: ObjectId;
  name: string;
  lastName: string;
  specialization: string;
  email: string;
  password: string;
}

export const Doctors = db.collection<DoctorSchema>("doctors");

// types for the doctor
export type InsertDoctor = Omit<DoctorSchema, "_id"> & { _id: string };
