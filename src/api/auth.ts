import type { AuthResponse } from "@/types";

const USE_MOCK = true;

export async function requestOTP(phone: string): Promise<{ message: string }> {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 400));
    return { message: `OTP sent to ${phone}` };
  }
  throw new Error("Real backend not connected");
}

export async function verifyOTP(phone: string, otp: string): Promise<AuthResponse> {
  if (USE_MOCK) {
    await new Promise((res) => setTimeout(res, 400));
    if (otp.trim().length !== 6) {
      throw new Error("Invalid OTP code. Please enter a 6-digit code.");
    }
    return {
      token: `mock-jwt-token-${Date.now()}`,
      user: {
        phone,
        name: "Meena Devi",
      },
    };
  }
  throw new Error("Real backend not connected");
}
