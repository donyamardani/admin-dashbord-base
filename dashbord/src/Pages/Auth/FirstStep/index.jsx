import React, { useState } from "react"; // 🟢 اضافه شدن useState
import FetchData from "../../../Utils/FetchData";
import notify from "../../../Utils/Notify";

export default function FirstStep({
  handlePageType,
  phoneNumber: initialPhoneNumber, // تغییر نام پروپ برای عدم تداخل
  handlePhoneNumber,
}) {
  // 🟢 ایجاد یک استیت محلی برای مدیریت بدون تاخیر اینپوت
  const [localPhone, setLocalPhone] = useState(initialPhoneNumber || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!localPhone.trim()) {
      notify("error", "لطفاً شماره تلفن خود را وارد کنید.");
      return;
    }
    
    console.log("1. Sending Request...");
    const result = await FetchData("auth", {
      method: "POST",
      body: JSON.stringify({ phoneNumber: localPhone.trim() }), 
    });
    
    console.log("2. Result received from FetchData:", result);

    if (result && result.success === false) {
      console.log("3. Stuck in error block:", result.message);
      notify("error", result.message);
      return;
    }

    console.log("4. Request successful. Moving to next page...");
    handlePhoneNumber(localPhone.trim());
    
    // بررسی وجود پسورد در دیتای دریافتی
    const isPasswordMode = result?.passwordExist || result?.data?.passwordExist;
    console.log("5. Target Page Mode:", isPasswordMode ? "password" : "otp");
    
    handlePageType(isPasswordMode ? "password" : "otp");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            خوش آمدید!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            برای ادامه، شماره تلفن خود را وارد کنید.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="phoneNumber" className="sr-only">
                شماره تلفن
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                required
                // 🟢 اتصال به استیت محلی جدید
                value={localPhone}
                onChange={(e) => setLocalPhone(e.target.value)}
                className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm text-right"
                placeholder="شماره تلفن"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-150 ease-in-out"
            >
              ورود یا ثبت نام
            </button>
          </div>

          <div className="text-sm text-center">
            <span
              onClick={() => handlePageType("forget-pass")}
              className="font-medium text-teal-600 hover:text-teal-500 cursor-pointer"
            >
              رمز عبور را فراموش کرده‌اید؟
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}