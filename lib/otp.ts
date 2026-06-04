import bcrypt from "bcryptjs";
import { randomInt } from "crypto";

export function generateOtp() {
  return `${randomInt(100000, 999999)}`;
}

export async function hashOtp(otp: string) {
  return bcrypt.hash(otp, 10);
}

export async function compareOtp(otp: string, hash: string) {
  return bcrypt.compare(otp, hash);
}
