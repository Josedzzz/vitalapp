import { Agendas } from "../models/agenda.ts";
import { Diseases } from "../models/disease.ts";
import { Doctors } from "../models/doctor.ts";
import { Patients } from "../models/patient.ts";

/**
 * retrieves the patient ID from their email
 * @param email - email of the patient
 * @returns the patient's ObjectId as string
 */
export const getPatientIdByEmail = async (email: string): Promise<string> => {
  const patient = await Patients.findOne({ email });
  if (!patient || !patient._id) {
    throw new Error("Patient not found");
  }
  return patient._id.toString();
};

/**
 * assigns an appointment to a patient
 * @param email - email of the patient
 * @param doctorId - the ID of the doctor assigning the appointment
 * @param date - the date of the appointment (yyyy-mm-dd)
 * @param startTime - start time (HH:mm)
 * @param endTime - end time (HH:mm)
 * @returns the created agenda entry
 */
export const assignAppointmentService = async (
  email: string,
  doctorId: string,
  date: Date,
  startTime: string,
  endTime: string,
): Promise<{ _id: string }> => {
  const patientId = await getPatientIdByEmail(email);
  const agendaToInsert = {
    date,
    startTime,
    endTime,
    doctorId,
    patientId,
  };
  const result = await Agendas.insertOne(agendaToInsert);
  if (!result) {
    throw new Error("Failed to assign appointment");
  }
  return { _id: result.insertedId.toString() };
};

/**
 * gets all the doctors
 * @param page - the page to get the doctors
 * @param limit - the limit of each page
 * @returns the list of doctors
 */
export const getAllDoctorsService = async (page: number, limit: number) => {
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

/**
 * gets all the doctor appointments
 * @param doctorId - the id of the doctor to get the appointments
 * @param page - the page to get the doctor appointments
 * @param limit - the limit of each page
 * @returns the list of doctor appointments
 */
export const getDoctorAppointmentsService = async (
  doctorId: string,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;
  const appointments = await Agendas.find({
    doctorId,
  })
    .sort({ date: 1 })
    .skip(skip)
    .limit(limit)
    .toArray();
  return appointments;
};

/**
 * get all the diseases
 * @returns the list of all the diseases
 */
export const getAllDiseasesService = async () => {
  const diseases = await Diseases.find({}).toArray();
  return diseases;
};
