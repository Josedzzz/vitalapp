import { Agenda, AgendaSchema } from "../models/agenda.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.2/mod.ts";

// creates an agenda
export const createAppointment = async (appointmentData: AgendaSchema) => {
  return await Agenda.insertOne(appointmentData);
};

// gets all the appointments
export const getAppointments = async () => {
  return await Agenda.find().toArray();
};

// gets all the appointments of a doctor
export const getAppointmentsByDoctor = async (doctorId: string) => {
  return await Agenda.find({ doctorId }).toArray();
};

// gets all the appointments of a patient
export const getAppointmentsByPatient = async (patientId: string) => {
  return await Agenda.find({ patientId }).toArray();
};

// gets an appointment by id
export const getAppointmentById = async (id: string) => {
  return await Agenda.findOne({ _id: new ObjectId(id) });
};

// udpates an appointment by the id
export const updateAppointment = async (
  id: string,
  appointmentData: AgendaSchema,
) => {
  return await Agenda.updateOne(
    { _id: new ObjectId(id) },
    { $set: appointmentData },
  );
};

// deletes an appointment by the id
export const deleteAppointment = async (id: string) => {
  return await Agenda.deleteOne({ _id: new ObjectId(id) });
};
