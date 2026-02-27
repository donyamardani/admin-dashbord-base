import React from "react";
import { useState } from "react";
import Sidebar from "../Components/Sidebare";
import Navbar from "../Components/Navbar";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../Utils/ScrollToTop";

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <ScrollToTop />

      {/* sidebar */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* content */}
      <div className="md:mr-64 transition-all">
        <Navbar setOpen={setOpen} />

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}