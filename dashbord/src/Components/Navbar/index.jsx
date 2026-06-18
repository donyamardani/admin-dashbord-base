import React from "react";
import { FiMenu, FiBell, FiSearch } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Store/Slices/AuthSlice";

export default function Navbar({ setOpen }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  return (
    <header className="bg-white shadow-sm h-16 flex items-center px-4 justify-between" dir="rtl">
      {/* بخش راست - منو موبایل، عنوان و دکمه خروج */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpen(true)}
          className="text-2xl md:hidden text-gray-600 hover:text-teal-600 transition"
        >
          <FiMenu />
        </button>

        <h1 className="font-bold text-gray-700 hidden md:block text-lg">
          داشبورد
        </h1>

        <button 
          onClick={() => dispatch(logout())}
          className="text-sm font-medium text-red-500 hover:text-red-600 border border-red-200 hover:border-red-500 rounded-lg px-2.5 py-1 transition duration-150"
        >
          خروج
        </button>
      </div>

      {/* بخش وسط - سرچ باکس رسپانسیو */}
      <div className="hidden md:flex items-center bg-gray-100 px-3 rounded-xl border border-transparent focus-within:border-teal-500 focus-within:bg-white transition-all duration-200">
        <FiSearch className="text-gray-400 text-lg" />
        <input
          placeholder="جستجو..."
          className="bg-transparent outline-none p-2 w-64 text-sm text-gray-700"
        />
      </div>

      {/* بخش چپ - نوتیفیکیشن و اطلاعات کاربر */}
      <div className="flex items-center gap-4">
        {/* دکمه اعلان‌ها */}
        <button className="text-xl relative text-gray-600 hover:text-teal-600 transition">
          <FiBell />
          {/* نقطه قرمز اعلان‌ها که در حالت راست‌چین در سمت راستِ بالا قرار می‌گیرد */}
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* مشخصات کاربر */}
        <div className="text-left md:text-right hidden sm:block">
          <h3 className="text-sm font-semibold text-gray-800 text-right" dir="ltr">
            {user?.phoneNumber}
          </h3>
          <p className="text-xs text-gray-500 font-medium mt-0.5 text-right">
            {user?.fullName || "کاربر ادمین"}
          </p> 
        </div>
       
        {/* آواتار */}
        <img
          src="https://i.pravatar.cc/40"
          alt="پروفایل"
          className="w-10 h-10 rounded-full border border-gray-200 object-cover shadow-sm"
        />
      </div>
    </header>
  );
}