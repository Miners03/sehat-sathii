import type { AuthResponse } from "@/types";
import * as authApi from "@/api/auth";
import { clearStoredData } from "@/api/checkin";

export async function sendOTPService(phone: string): Promise<string> {
  const res = await authApi.requestOTP(phone);
  return res.message;
}

export async function verifyOTPService(phone: string, otp: string): Promise<AuthResponse> {
  return await authApi.verifyOTP(phone, otp);
}

export function deleteUserDataService() {
  clearStoredData();
  localStorage.removeItem("sehat_saathi_token");
  localStorage.removeItem("sehat_saathi_user");
}
