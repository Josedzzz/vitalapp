import { ObjectId } from "npm:mongodb";
import { Patients } from "../models/patient.ts";
import { Agendas } from "../models/agenda.ts";
import { Diagnosis } from "../models/diagnosis.ts";
import { DiseaseSchema } from "../models/disease.ts";
import { Doctors } from "../models/doctor.ts";

/**
 * get a patient info by the id of it
 * @param id - the id of the patient
 * @returns the patient info
 */
export const getPatientByIdService = async (id: string) => {
  try {
    const objectId = new ObjectId(id);
    const patient = await Patients.findOne({ _id: objectId });
    return patient;
  } catch (error) {
    console.error("Error retrieving patient:", error);
    return null;
  }
};

/**
 * gets all the patient agendas
 * @param patientId - the id of the patient
 * @param page - the page to get
 * @param limit - the limit of each page
 * @returns the list of patient agendas
 */
export const getPatientAgendasService = async (
  patientId: string,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;
  const agendas = await Agendas.find({ patientId: patientId })
    .sort({ date: 1 })
    .skip(skip)
    .limit(limit)
    .toArray();
  return agendas;
};

/**
 * gets all the patient diagnosis
 * @param patientId - the id of the patient
 * @param page - the page to get
 * @param limit - the limit of each page
 * @returns the list of patient diagnosis
 */
export const getPatientDiagnosisService = async (
  patientId: string,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;
  const diagnosis = await Diagnosis.find({ patientId: patientId })
    .skip(skip)
    .limit(limit)
    .toArray();
  return diagnosis;
};

/**
 * get the disease info
 * @returns the obtained disease
 */
export const getDiseaseByIdPatientService = (disease: DiseaseSchema) => {
  return disease;
};

/**
 * get the doctor info
 * @returns the doctor info
 */
export const getDoctorByIdService = async (doctorId: string) => {
  try {
    const objectId = new ObjectId(doctorId);
    const doctor = await Doctors.findOne({ _id: objectId });
    if (!doctor) return null;
    const { _id, password, ...doctorWithoutSensitiveInfo } = doctor;
    console.log(password);
    return doctorWithoutSensitiveInfo;
  } catch (error) {
    console.error("Error retrieving the doctor:", error);
    return null;
  }
};

/**
 * gets all the doctors
 * @param page - the page to get the doctors
 * @param limit - the limit of each page
 * @returns the list of doctors
 */
export const getAllDoctorsPatientService = async (
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;
  const doctors = await Doctors.find(
    {},
    {
      projection: { password: 0 },
      skip,
      limit,
    },
  ).toArray();
  const total = await Doctors.countDocuments({});
  return {
    doctors,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};
