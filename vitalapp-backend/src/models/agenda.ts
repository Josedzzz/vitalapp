import { ObjectId } from "npm:mongodb";
import db from "../config/db.ts";

export interface AgendaSchema {
  _id?: ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  doctorId: string;
  patientId: string;
}

export const Agendas = db.collection<AgendaSchema>("agendas");

// types for the agenda
export type CreatedAgenda = Omit<AgendaSchema, "_id"> & { _id: string };
