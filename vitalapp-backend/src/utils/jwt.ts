import { create, getNumericDate } from "https://deno.land/x/djwt@v2.8/mod.ts";

// Import JWT Secret Key as a CryptoKey
const jwtSecret = Deno.env.get("JWT_SECRET") || "your-secret-key";
const keyData = new TextEncoder().encode(jwtSecret);

export const jwtKey = await crypto.subtle.importKey(
  "raw",
  keyData,
  { name: "HMAC", hash: "SHA-256" },
  true,
  ["sign", "verify"],
);

/**
 * generates a JWT token for a patient.
 * @param userId - the patient's unique ID
 * @returns a promise that resolves to a JWT token
 */
export const generateJwt = async (userId: string): Promise<string> => {
  const payload = {
    sub: userId,
    exp: getNumericDate(60 * 60 * 24 * 5),
  };
  return await create({ alg: "HS256", typ: "JWT" }, payload, jwtKey);
};
