import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../../Store/Slices/AuthSlice";
import FetchData from "../../../Utils/FetchData";
import notify from "../../../Utils/Notify";
import { useNavigate } from "react-router-dom";

export default function LoginWithPass({ phoneNumber, handlePageType }) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!phoneNumber.trim()) {
      notify("error", "شماره تلفن نادرست است");
      setLoading(false);
      return;
    }

    if (!password.trim()) {
      notify("error", "پسورد نادرست است");
      setLoading(false);
      return;
    }

    const result = await FetchData("auth/login-password", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ phoneNumber, password }),
    });

    if (!result.success) {
      notify("error", result.message || 'شماره تلفن یا رمز عبور اشتباه است');
      setLoading(false);
      return;
    }
    notify("success", result.message || "ورود با موفقیت انجام شد");
  
    // 🟢 ارسال مستقیم دیتا که شامل توکن و آبجکت کاربر است
    dispatch(login(result.data)); 
  
    setLoading(false);
  
    // هدایت مستقیم کاربر به داشبورد
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4" dir="rtl">
      <div className="w-full max-w-md backdrop-blur-lg bg-white/80 border border-gray-200 rounded-2xl shadow-xl p-8">
        
        <h2 className="text-center text-2xl font-bold mb-6 bg-linear-to-r from-teal-500 to-indigo-500 bg-clip-text text-transparent">
          ورود با رمز عبور
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Phone */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              شماره تلفن
            </label>
            <input
              type="text"
              readOnly
              value={phoneNumber}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed text-left"
              dir="ltr"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              رمز عبور
            </label>
            <input
              type="password"
              placeholder="رمز عبور خود را وارد کنید"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition text-left"
              dir="ltr"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !password.trim()}
            className="w-full py-2 rounded-xl bg-teal-500 text-white font-semibold hover:bg-teal-600 active:scale-[.97] transition disabled:opacity-60"
          >
            {loading ? "در حال ورود..." : "ورود"}
          </button>

          {/* Forget Password */}
          <p
            onClick={() => handlePageType("forget-pass")}
            className="text-center text-sm text-teal-600 hover:text-teal-700 cursor-pointer mt-3"
          >
            رمز عبور را فراموش کرده‌اید؟ اینجا کلیک کنید
          </p>
        </form>
      </div>
    </div>
  );
}