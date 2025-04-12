import { ObjectId } from "npm:mongodb";
import db from "../config/db.ts";

export interface DiseaseSchema {
  _id?: ObjectId;
  name: string;
  description: string;
}

export const Diseases = db.collection<DiseaseSchema>("diseases");

// types for the diseases
export type InsertDisease = Omit<DiseaseSchema, "_id"> & { _id: string };
