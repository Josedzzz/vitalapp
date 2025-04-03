import { Doctors, DoctorSchema } from "../models/doctor.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.2/mod.ts";

// create a doctor
export const createDoctor = async (doctorData: DoctorSchema) => {
  return await Doctors.insertOne(doctorData);
};

// gets all the doctors
export const getDoctors = async () => {
  return await Doctors.find().toArray();
};

// gets a doctor by the id
export const getDoctorById = async (id: string) => {
  return await Doctors.findOne({ _id: new ObjectId(id) });
};

// updates a doctor by the id
export const updateDoctor = async (id: string, doctorData: DoctorSchema) => {
  return await Doctors.updateOne(
    { _id: new ObjectId(id) },
    { $set: doctorData },
  );
};

// deletes a doctor by the id
export const deleteDoctor = async (id: string) => {
  return await Doctors.deleteOne({ _id: new ObjectId(id) });
};
