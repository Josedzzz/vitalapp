import {
  assertEquals,
  assertExists,
} from "https://deno.land/std@0.154.0/testing/asserts.ts";
import { verifyJwt } from "../utils/jwt.ts";
import { assert } from "https://deno.land/x/oak@v12.6.1/util.ts";
import {
  loginDoctorService,
  loginService,
  signUpService,
} from "./authService.ts";
import { Patients } from "../models/patient.ts";
import { assertRejects } from "@std/assert";
import { hash } from "npm:bcryptjs";
import { Doctors } from "../models/doctor.ts";

const testPatient = {
  name: "Test",
  lastName: "Patient",
  email: "test_patient@example.com",
  password: "test123",
  direction: "Some address",
};

const testDoctor = {
  name: "Test Doc",
  lastName: "Test",
  specialization: "specialization",
  email: "sofia.martinez@clinicapp.com",
  password: "password123",
};

// Test to register a patient
Deno.test(
  "signUpService should create a patient and return the correct data",
  async () => {
    const created = await signUpService(testPatient);
    assertExists(created._id);
    assertEquals(created.email, testPatient.email);
    assert(created.password !== testPatient.password);
    const dbPatient = await Patients.findOne({ email: testPatient.email });
    assertExists(dbPatient);
    assertEquals(dbPatient?.email, testPatient.email);
  },
);

// Test for the login of a patient
Deno.test("loginService should return valid JWT for a patient", async () => {
  await Patients.deleteOne({ email: testPatient.email });
  const hashedPassword = await hash(testPatient.password, 10);
  await Patients.insertOne({
    ...testPatient,
    password: hashedPassword,
  });
  const { userId, token } = await loginService(
    testPatient.email,
    testPatient.password,
  );
  assertExists(userId);
  assertExists(token);
  const decoded = await verifyJwt(token);
  assertExists(decoded);
  assertEquals(decoded.sub, userId);

  // Verify that the incorrect credential fail
  await assertRejects(
    async () => await loginService(testPatient.email, "wrongpassword"),
    Error,
    "Invalid credentials",
  );
});

Deno.test(
  "loginDoctorService should return valid JWT for a doctor",
  async () => {
    // Asegura que el doctor exista
    const existingDoctor = await Doctors.findOne({ email: testDoctor.email });
    if (!existingDoctor) {
      const hashedPassword = await hash(testDoctor.password, 10);
      await Doctors.insertOne({
        ...testDoctor,
        password: hashedPassword,
      });
    }
    const { doctorId, token } = await loginDoctorService(
      testDoctor.email,
      testDoctor.password,
    );
    assertExists(doctorId);
    assertExists(token);
    const decoded = await verifyJwt(token);
    assertExists(decoded);
    assertEquals(decoded?.sub, doctorId);

    await assertRejects(
      () => loginDoctorService(testDoctor.email, "wrongpassword"),
      Error,
      "Invalid credentials",
    );
  },
);
