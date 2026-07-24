import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Sparkles, ArrowRight, CheckCircle, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { sendOTPService, verifyOTPService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

interface PhoneFormData {
  phone: string;
}

interface OTPFormData {
  otp: string;
}

export const AuthPage: React.FC = () => {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const phoneForm = useForm<PhoneFormData>();
  const otpForm = useForm<OTPFormData>();

  const onSendOTP = async (data: PhoneFormData) => {
    setServerError(null);
    setLoading(true);
    try {
      await sendOTPService(data.phone);
      setPhoneNumber(data.phone);
      setStep("otp");
    } catch (err: any) {
      setServerError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOTP = async (data: OTPFormData) => {
    setServerError(null);
    setLoading(true);
    try {
      const res = await verifyOTPService(phoneNumber, data.otp);
      login(res.token, res.user);
      navigate("/home", { replace: true });
    } catch (err: any) {
      setServerError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6 px-4">
      <Card className="max-w-md w-full shadow-lg border border-text-muted/15 p-8 space-y-6">
        {/* Logo and Intro */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-primary mx-auto flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-text pt-2">{t("appName")}</h1>
          <p className="text-text-muted text-base">{t("tagline")}</p>
        </div>

        {serverError && (
          <div className="p-3 bg-reach-out/10 border border-reach-out/20 text-reach-out rounded-xl text-sm font-medium">
            {serverError}
          </div>
        )}

        {step === "phone" ? (
          <form onSubmit={phoneForm.handleSubmit(onSendOTP)} className="space-y-4">
            <Input
              label={t("phoneLabel")}
              placeholder="e.g. 9876543210"
              type="tel"
              {...phoneForm.register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit mobile number",
                },
              })}
              error={phoneForm.formState.errors.phone?.message}
            />

            <Button type="submit" fullWidth disabled={loading} size="lg">
              {loading ? "Sending..." : t("sendOTP")}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>
        ) : (
          <form onSubmit={otpForm.handleSubmit(onVerifyOTP)} className="space-y-4">
            <div className="text-sm text-text-muted bg-bg p-3 rounded-xl flex items-center justify-between">
              <span>OTP sent to <strong className="text-text">{phoneNumber}</strong></span>
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="text-xs text-primary font-semibold underline"
              >
                Change
              </button>
            </div>

            <Input
              label={t("otpLabel")}
              placeholder="123456"
              maxLength={6}
              {...otpForm.register("otp", {
                required: "OTP is required",
                minLength: { value: 6, message: "OTP must be 6 digits" },
              })}
              error={otpForm.formState.errors.otp?.message}
            />

            <p className="text-xs text-text-muted">
              (Use <strong>123456</strong> for testing mock auth)
            </p>

            <Button type="submit" fullWidth disabled={loading} size="lg">
              {loading ? "Verifying..." : t("verifyOTP")}
              <CheckCircle className="w-5 h-5 ml-2" />
            </Button>
          </form>
        )}

        <div className="pt-4 border-t border-text-muted/10 text-center text-xs text-text-muted flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-steady" />
          <span>Your data is private & encrypted locally</span>
        </div>
      </Card>
    </div>
  );
};
