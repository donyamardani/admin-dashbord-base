import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'

export default function Category() {
  const navigate = useNavigate()

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6" dir="rtl">
      {/* هدر بخش مدیریت دسته‌بندی‌ها */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            مدیریت دسته‌بندی‌های محصول
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            لیست، ویرایش و افزودن دسته‌بندی‌ها و زیردسته‌های محصولات در این بخش انجام می‌شود.
          </p>
        </div>

        {/* دکمه ایجاد دسته‌بندی */}
        <button
          onClick={() => navigate('/dashboard/category/create')}
          className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-medium text-sm px-5 py-2.5 rounded-xl shadow-md shadow-teal-600/10 transition-all duration-150 whitespace-nowrap self-start sm:self-auto w-full sm:w-auto"
        >
          <FiPlus className="text-lg" />
          <span>ایجاد دسته‌بندی جدید</span>
        </button>
      </div>

      {/* بخش نمایش فرزندان (فرم ایجاد یا لیست دسته‌بندی‌ها) */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <Outlet />
      </div>
    </div>
  )
}