import { Diseases, DiseaseSchema } from "../models/disease.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.2/mod.ts";

// create a disease
export const createDisease = async (diseaseData: DiseaseSchema) => {
  return await Diseases.insertOne(diseaseData);
};

// gets all the diseases
export const getDiseases = async () => {
  return await Diseases.find().toArray();
};

// gets a disease by the id
export const getDiseaseById = async (id: string) => {
  return await Diseases.findOne({ _id: new ObjectId(id) });
};

// update a disease by the id
export const updateDisease = async (id: string, diseaseData: DiseaseSchema) => {
  return await Diseases.updateOne(
    { _id: new ObjectId(id) },
    { $set: diseaseData },
  );
};

// delete a disease by the id
export const deleteDisease = async (id: string) => {
  return await Diseases.deleteOne({ _id: new ObjectId(id) });
};
