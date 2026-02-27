import React from "react";
import { FiMenu, FiBell, FiSearch } from "react-icons/fi";

export default function Navbar({ setOpen }) {
  return (
    <header className="bg-white shadow-sm h-16 flex items-center px-4 justify-between">
      {/* right */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setOpen(true)}
          className="text-2xl md:hidden"
        >
          <FiMenu />
        </button>

        <h1 className="font-semibold text-gray-700 hidden md:block">
          داشبورد
        </h1>
      </div>

      {/* center search */}
      <div className="hidden md:flex items-center bg-gray-100 px-3 rounded-xl">
        <FiSearch />
        <input
          placeholder="جستجو..."
          className="bg-transparent outline-none p-2 w-64"
        />
      </div>

      {/* left */}
      <div className="flex items-center gap-4">
        <button className="text-xl relative">
          <FiBell />
          <span className="absolute -top-1 -left-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <img
          src="https://i.pravatar.cc/40"
          className="w-9 h-9 rounded-full"
        />
      </div>
    </header>
  );
}