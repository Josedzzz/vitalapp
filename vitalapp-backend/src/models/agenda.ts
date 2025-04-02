import db from "../config/db.ts";

export interface AgendaSchema {
  _id: { $oid: string };
  date: Date;
  startTime: string;
  endTime: string;
  doctorId: string;
  patientId: string;
}

export const Agenda = db.collection<AgendaSchema>("agenda");
