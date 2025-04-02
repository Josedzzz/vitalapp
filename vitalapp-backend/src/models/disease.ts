import db from "../config/db.ts";

export interface DiseaseSchema {
  _id: { $oid: string };
  name: string;
  description: string;
}

export const Diseases = db.collection<DiseaseSchema>("diseases");
