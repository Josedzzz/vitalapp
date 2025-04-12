import {
  create,
  getNumericDate,
  verify,
} from "https://deno.land/x/djwt@v2.8/mod.ts";

// load and encode the secret key
const jwtSecret = Deno.env.get("JWT_SECRET") || "your-secret-key";
const keyData = new TextEncoder().encode(jwtSecret);

// import the secret key as a CryptoKey
export const jwtKey = await crypto.subtle.importKey(
  "raw",
  keyData,
  { name: "HMAC", hash: "SHA-256" },
  true,
  ["sign", "verify"],
);

/**
 * Generates a JWT token for a patient.
 * @param userId - The patient's unique ID
 * @returns a JWT token
 */
export const generateJwt = async (userId: string): Promise<string> => {
  const payload = {
    sub: userId,
    exp: getNumericDate(60 * 60 * 24 * 5), // Expires in 5 days
  };
  return await create({ alg: "HS256", typ: "JWT" }, payload, jwtKey);
};

/**
 * Verifies a JWT token
 * @param token - The JWT token to verify
 * @returns The decoded payload if valid
 */
export const verifyJwt = async (token: string) => {
  return await verify(token, jwtKey);
};
