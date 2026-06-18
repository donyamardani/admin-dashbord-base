import React, { useEffect, useRef, useState } from "react";
import FetchData from "../../../Utils/FetchData";
import notify from "../../../Utils/Notify";

export default function ForgetPass({ handlePageType }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0);

  const inputsRef = useRef([]);

  // OTP handlers
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // Timer
  useEffect(() => {
    let countdown;
    if (resendDisabled && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(countdown);
  }, [resendDisabled, timer]);

  // Send code
  const sendCode = async () => {
    if (!phoneNumber.trim()) {
      notify("error", "لطفاً ابتدا شماره تلفن خود را وارد کنید.");
      return;
    }
    const result = await FetchData("auth/resend-code", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ phoneNumber }),
    });
    notify(result.success ? "success" : "error", result.message);
    setOtp(["", "", "", "", "", ""]);// Clear the code input
    setResendDisabled(true); // Disable resend button
    setTimer(120); // Reset timer to 2 minutes
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    loading(true);

    const code = otp.join("");

    if (!phoneNumber.trim()) {
      notify("error", "لطفاً شماره تلفن خود را وارد کنید");
      setLoading(false);
      return;
    }
    if (code.length !== 6) {
      notify("error", "لطفاً کد تایید ۶ رقمی را وارد کنید");
      setLoading(false);
      return;
    }
    if (!newPassword.trim()) {
      notify("error", "لطفاً رمز عبور جدید خود را وارد کنید");
      setLoading(false);
      return;
    }

    const result = await FetchData("auth/forget-password", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ phoneNumber, code, newPassword }),
    });

    if (!result.success) {
      notify("error", result.message);
      setOtp(["", "", "", "", "", ""]);
      setLoading(false);
      return;
    }

    notify("success", result.message);
    handlePageType("first-step");
    setLoading(false);
  };

  // Format timer
  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4" dir="rtl">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-lg p-8">

        <h2 className="text-2xl font-bold text-center mb-6 bg-linear-to-r from-indigo-500 to-teal-500 text-transparent bg-clip-text">
          بازیابی رمز عبور
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Phone Number */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              شماره تلفن
            </label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-teal-500 outline-none text-left"
              placeholder="شماره تلفن را وارد کنید"
              dir="ltr"
            />
          </div>

          {/* OTP Professional */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">
              کد تایید
            </label>

            <div className="flex justify-between" dir="ltr">
              {otp.map((value, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={value}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              ))}
            </div>

            {/* Send Code */}
            <button
              type="button"
              onClick={sendCode}
              disabled={resendDisabled || !phoneNumber.trim()}
              className={
                "mt-3 w-full py-2 rounded-xl text-white font-semibold transition " +
                (resendDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-600")
              }
            >
              {resendDisabled ? `لطفاً منتظر بمانید (${formatTimer(timer)})` : "ارسال کد تایید"}
            </button>
          </div>

          {/* New Password */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              رمز عبور جدید
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-teal-500 outline-none text-left"
              placeholder="رمز عبور جدید را وارد کنید"
              dir="ltr"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-xl bg-teal-500 text-white font-semibold hover:bg-teal-600 transition disabled:opacity-50"
          >
            {loading ? "در حال ارسال..." : "تغییر رمز عبور"}
          </button>
        </form>
      </div>
    </div>
  );
}