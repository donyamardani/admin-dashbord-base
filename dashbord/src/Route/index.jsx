import React from 'react'
import { createBrowserRouter } from "react-router-dom";
import Layout from "../Layout";
import Home from "../Pages/Home";
import Brand from "../Pages/Brand";
import Category from "../Pages/Category";
import Product from "../Pages/Product";
import User from "../Pages/User";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "brand", element: <Brand /> },
      { path: "category", element: <Category /> },
      { path: "product", element: <Product /> },
      { path: "user", element: <User /> },
    ],
  },
]);

export default router;