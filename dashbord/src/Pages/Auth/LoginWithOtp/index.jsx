import React, { useEffect, useRef, useState } from "react";
import FetchData from "../../../Utils/FetchData";
import notify from "../../../Utils/Notify";
import { useDispatch } from "react-redux";
import { login } from "../../../Store/Slices/AuthSlice";

export default function LoginWithOtp({ phoneNumber, handlePageType }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [timer, setTimer] = useState(0);

  const inputsRef = useRef([]);
  const dispatch = useDispatch();

  /* ================= OTP HANDLERS ================= */
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  /* ================= TIMER ================= */
  useEffect(() => {
    let interval;
    if (resendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    if (timer === 0) {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer, resendDisabled]);

  /* ================= VERIFY / SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const code = otp.join("");

    if (!phoneNumber?.trim()) {
      notify("error", "شماره تلفن یافت نشد");
      setLoading(false);
      return;
    }

    if (code.length !== 6) {
      notify("error", "کد ۶ رقمی را به طور کامل وارد کنید");
      setLoading(false);
      return;
    }

    console.log("Sending OTP verification to server...", { phoneNumber, code });

    // 🟢 اصلاح شد: هدرهای اضافی که تنظیمات FetchData را خراب می‌کردند حذف شدند
    const result = await FetchData("auth/login-otp", {
      method: "POST",
      body: JSON.stringify({ phoneNumber: phoneNumber.trim(), code }),
    });

    console.log("Server Response for OTP:", result);

    // 🟢 بررسی هوشمندانه خطای پاسخ سرور بر اساس ساختار استاندارد FetchData شما
    if (result && result.success === false) {
      notify("error", result.message || "کد وارد شده صحیح نیست");
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
      setLoading(false);
      return;
    }

    // در صورت موفقیت
    notify("success", result?.message || "ورود با موفقیت انجام شد!");
    
    // ذخیره توکن دریافتی در لوکال استوریج (اگر بک‌اند توکن را در دیتای اصلی فرستاده باشد)
    if (result?.data?.token || result?.token) {
      localStorage.setItem("token", result?.data?.token || result?.token);
    }

    dispatch(login(result?.data || result));
    setLoading(false);

    // 🟢 بعد از لاگین موفق کاربر را به صفحه اصلی یا پنل کاربری هدایت کنید:
    // window.location.href = "/dashboard"; 
  };

  /* ================= RESEND ================= */
  const resendCode = async () => {
    console.log("Requesting resend code for:", phoneNumber);
    
    const result = await FetchData("auth/resend-code", {
      method: "POST",
      body: JSON.stringify({ phoneNumber: phoneNumber.trim() }),
    });

    if (result && result.success === false) {
      notify("error", result.message || "خطا در ارسال مجدد کد");
      return;
    }

    notify("success", result?.message || "کد تایید مجدداً ارسال شد!");
    setOtp(["", "", "", "", "", ""]);
    setResendDisabled(true);
    setTimer(60);
    inputsRef.current[0]?.focus();
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4" dir="rtl">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl shadow-lg p-8">

        <h2 className="text-2xl font-bold text-center mb-6 bg-linear-to-r from-indigo-500 to-teal-500 text-transparent bg-clip-text">
          تایید شماره تلفن
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Phone Number */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              شماره تلفن
            </label>
            <input
              type="text"
              readOnly
              value={phoneNumber}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 outline-none text-left"
              dir="ltr"
            />
          </div>

          {/* OTP Boxes */}
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
                  className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              ))}
            </div>

            
            <button
              type="button"
              onClick={resendCode}
              disabled={resendDisabled}
              className={
                "mt-4 w-full py-2 rounded-xl text-white font-semibold transition " +
                (resendDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-500 hover:bg-indigo-600")
              }
            >
              {resendDisabled ? `لطفاً منتظر بمانید (${formatTimer(timer)})` : "ارسال مجدد کد تایید"}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-xl bg-teal-500 text-white font-semibold hover:bg-teal-600 transition disabled:opacity-50"
          >
            {loading ? "در حال بررسی..." : "ورود"}
          </button>

          {/* Wrong number */}
          <p
            onClick={() => handlePageType("first-step")}
            className="text-center text-sm text-teal-600 hover:text-teal-700 cursor-pointer"
          >
            شماره اشتباه است؟ اینجا کلیک کنید
          </p>

        </form>
      </div>
    </div>
  );
}