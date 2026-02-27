import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import router from "./Route";

export default function App() {
  useEffect(() => {
    document.documentElement.lang = "fa";
    document.documentElement.dir = "rtl";
    document.body.classList.add("rtl");
  }, []);

  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            direction: "rtl",
            fontFamily: "Vazirmatn",
          },
        }}
      />
    </>
  );
}