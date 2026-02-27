import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiBox,
  FiTag,
  FiLayers,
  FiX,
} from "react-icons/fi";

export default function Sidebar({ open, setOpen }) {
  const menu = [
    { name: "خانه", path: "/", icon: <FiHome /> },
    { name: "محصولات", path: "/product", icon: <FiBox /> },
    { name: "دسته بندی", path: "/category", icon: <FiLayers /> },
    { name: "برند", path: "/brand", icon: <FiTag /> },
    { name: "کاربران", path: "/user", icon: <FiUsers /> },
  ];

  return (
    <>
      {/* overlay mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <aside
        className={`
        fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50
        transform transition-all duration-300
        ${open ? "translate-x-0" : "translate-x-full"}
        md:translate-x-0
      `}
      >
        {/* header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold text-lg">پنل مدیریت</h2>

          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-xl"
          >
            <FiX />
          </button>
        </div>

        {/* menu */}
        <nav className="p-3 space-y-2">
          {menu.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-xl transition
                ${
                  isActive
                    ? "bg-indigo-500 text-white shadow"
                    : "hover:bg-gray-100"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}