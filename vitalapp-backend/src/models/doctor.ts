import { ObjectId } from "npm:mongodb";
import db from "../config/db.ts";
import { hash } from "npm:bcryptjs";

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

const sampleDoctors: Omit<DoctorSchema, "_id">[] = [
  {
    name: "Laura",
    lastName: "González",
    specialization: "General",
    email: "laura.gonzalez@clinicapp.com",
    password: "password123",
  },
  {
    name: "Carlos",
    lastName: "Ramírez",
    specialization: "Cardiology",
    email: "carlos.ramirez@clinicapp.com",
    password: "password123",
  },
  {
    name: "Sofía",
    lastName: "Martínez",
    specialization: "Psychology",
    email: "sofia.martinez@clinicapp.com",
    password: "password123",
  },
  {
    name: "Andrés",
    lastName: "Pérez",
    specialization: "Pediatrics",
    email: "andres.perez@clinicapp.com",
    password: "password123",
  },
  {
    name: "Valentina",
    lastName: "Torres",
    specialization: "Dermatology",
    email: "valentina.torres@clinicapp.com",
    password: "password123",
  },
];

for (const doc of sampleDoctors) {
  const hashedPassword = await hash(doc.password, 10); // 10 = salt rounds
  const docToInsert = {
    ...doc,
    password: hashedPassword,
  };
  await Doctors.insertOne(docToInsert);
}

console.log("✅ Doctors inserted with hashed passwords.");
