import React, { useState, useEffect } from 'react';
import { createBrowserRouter, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// ایمپورت صفحات و کامپوننت‌ها
import Layout from "../Layout";
import Home from "../Pages/Home";
import Brand from "../Pages/Brand";
import Category from "../Pages/Category";
import Product from "../Pages/Product";
import User from "../Pages/User";
import Auth from '../Pages/Auth';
import GetAllBrand from '../Pages/Brand/GetAll';
import CreateBrand from '../Pages/Brand/Create';
import UpdateBrand from '../Pages/Brand/Update';
import GetAllCategory from '../Pages/Category/GetAll';
import CreateCategory from '../Pages/Category/Create';
import UpdateCategory from '../Pages/Category/Update';
import GetAllProduct from '../Pages/Product/GetAll';
import CreateProduct from '../Pages/Product/Create';
import UpdateProduct from '../Pages/Product/Update';
import GetAllUser from '../Pages/User/GetAll';
import UpdateUser from '../Pages/User/Update';

// 🔒 کامپوننت محافظت از مسیرها (لودینگ داخلی)
const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  
  // تعریف استیت لودینگ در خود کامپوننت
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // یک تاخیر بسیار کوچک (مثلاً ۱۰۰ میلی‌ثانیه) یا بررسی وجود دیتا 
    // برای اینکه مطمئن شویم رداکس استیت اولیه خود را لود کرده است.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [token, user]);

  // تا زمانی که لودینگ فعال است، اسپینر نشان داده می‌شود
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const hasValidToken = token && token !== "undefined" && token !== "null";
  const isAdmin = user?.role === 'admin' || user?.role === 'superAdmin';
  const isAuthenticatedAdmin = hasValidToken && isAdmin;

  return isAuthenticatedAdmin ? children : <Navigate to="/" replace />;
};

// 🔓 کامپوننت صفحات عمومی (لودینگ داخلی)
const AnonymousRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  
  // تعریف استیت لودینگ در خود کامپوننت
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [token, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const hasValidToken = token && token !== "undefined" && token !== "null";
  const isAdmin = user?.role === 'admin' || user?.role === 'superAdmin';
  const isAuthenticatedAdmin = hasValidToken && isAdmin;

  return !isAuthenticatedAdmin ? children : <Navigate to="/dashboard" replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AnonymousRoute><Auth /></AnonymousRoute>
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      { index: true, element: <Home /> },
      { 
        path: "brand", 
        element: <Brand />,
        children:[
          { index: true, element: <GetAllBrand /> },
          { path: "create", element: <CreateBrand /> },
          { path: "update/:id", element: <UpdateBrand /> }
        ]
      },
      { 
        path: "category", 
        element: <Category />,
        children:[
          { index: true, element: <GetAllCategory /> },
          { path: "create", element: <CreateCategory /> },
          { path: "update/:id", element: <UpdateCategory /> }
        ]
      },
      { 
        path: "product", 
        element: <Product />,
        children:[
          { index: true, element: <GetAllProduct /> },
          { path: "create", element: <CreateProduct /> },
          { path: "update/:id", element: <UpdateProduct /> }
        ]
      },
      { 
        path: "user", 
        element: <User />,
        children:[
          { index: true, element: <GetAllUser /> },
          { path: "update/:id", element: <UpdateUser /> }
        ]
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  }
]);

export default router;