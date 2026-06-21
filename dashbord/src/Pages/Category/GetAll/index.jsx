import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import FetchData from '../../../Utils/FetchData'
import Loading from '../../../Components/Loading'
import { useNavigate } from 'react-router-dom'
import { BsTrash3Fill } from "react-icons/bs";
import { MdModeEdit } from "react-icons/md";
import { FiSearch, FiFilter, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import notify from '../../../Utils/Notify'

export default function GetAllCategory() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [categories, setCategories] = useState(null)
  const [sort, setSort] = useState('-createdAt')
  const [search, setSearch] = useState('')
  const [countOfCategories, setCountOfCategories] = useState(0)
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate()

  // محاسبه تعداد کل صفحات
  const totalPages = Math.ceil(countOfCategories / limit) || 1;

  useEffect(() => {
    (async () => {
      const result = await FetchData(`categories?page=${page}&limit=${limit}&sort=${sort}${search ? `&search=${search}` : ''}`, {
        method: 'GET',
      })
      if (result) {
        setCategories(result.data)
        setCountOfCategories(result.count)
      }
    })()
  }, [page, limit, search, sort, token])

  // ریست کردن صفحه به ۱ در صورت سرچ جدید
  useEffect(() => {
    setPage(1)
  }, [search, sort])

  if (!categories) { return <Loading /> }

  const handleRemove = async (id) => {
    if (!window.confirm("آیا از حذف این دسته‌بندی اطمینان دارید؟")) return;

    const result = await FetchData(`categories/${id}`, {
      method: 'DELETE',
    })

    if (result.success) {
      const newCategories = categories?.filter((item) => item._id.toString() !== id.toString())
      setCategories(newCategories)
      setCountOfCategories(prev => prev - 1)
      notify('success', result.message || 'دسته‌بندی با موفقیت حذف شد')
    } else {
      notify('error', result.message || 'حذف دسته‌بندی ناموفق بود (ممکن است این دسته‌بندی دارای محصول یا زیردسته باشد)')
    }
  }

  const items = categories?.map((item, index) => (
    <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50/70 transition duration-150">
      <td className="px-6 py-4 text-sm text-gray-500 font-medium text-center">
        {(page - 1) * limit + (index + 1)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-800 font-semibold">{item?.title}</td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {item?.supCategoryId?.title ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-sky-700 bg-sky-50 rounded-lg">
            {item.supCategoryId.title}
          </span>
        ) : (
          <span className="text-xs text-gray-400">دسته اصلی</span>
        )}
      </td>
      <td className="px-6 py-4 text-sm">
        <div className="w-12 h-12 rounded-xl bg-gray-50 p-1 border border-gray-100 flex items-center justify-center overflow-hidden">
          {item.image ? (
            <img
              src={import.meta.env.VITE_BASE_FILE + item.image}
              alt={item?.title}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <span className="text-[10px] text-gray-300">بدون تصویر</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 text-sm">
        {item?.isPublished ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-lg">
            منتشر شده
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-700 bg-amber-50 rounded-lg">
            پیش‌نویس
          </span>
        )}
      </td>
      <td className="px-6 py-4 text-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(`/dashboard/category/update/${item?._id}`)}
            className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition duration-150"
            title="ویرایش"
          >
            <MdModeEdit className="text-lg" />
          </button>
          <button
            onClick={() => handleRemove(item?._id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition duration-150"
            title="حذف"
          >
            <BsTrash3Fill className="text-base" />
          </button>
        </div>
      </td>
    </tr>
  ))

  return (
    <div className="space-y-6" dir="rtl">
      {/* بخش فیلترها و سرچ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder='جستجو در دسته‌بندی‌ها...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 focus:bg-white transition-all"
          />
        </div>

        <div className="relative flex items-center gap-2 min-w-[200px]">
          <FiFilter className="text-gray-400 shrink-0" />
          <select
            name="sort"
            id="sort"
            onChange={(e) => setSort(e.target.value)}
            value={sort}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all cursor-pointer appearance-none"
          >
            <option value="-createdAt">جدیدترین‌ها</option>
            <option value="createdAt">قدیمی‌ترین‌ها</option>
            <option value="title">A تا Z</option>
            <option value="-title">Z تا A</option>
          </select>
        </div>
      </div>

      {/* بخش جدول رسپانسیو */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50/75 border-b border-gray-100">
                <th className="px-6 py-3.5 text-sm font-bold text-gray-500 text-center w-20">ردیف</th>
                <th className="px-6 py-3.5 text-sm font-bold text-gray-500">عنوان دسته‌بندی</th>
                <th className="px-6 py-3.5 text-sm font-bold text-gray-500">دسته والد</th>
                <th className="px-6 py-3.5 text-sm font-bold text-gray-500">تصویر</th>
                <th className="px-6 py-3.5 text-sm font-bold text-gray-500">وضعیت انتشار</th>
                <th className="px-6 py-3.5 text-sm font-bold text-gray-500 w-32">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                items
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-sm text-gray-400 font-medium">
                    هیچ دسته‌بندی‌ای یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* فوتر جدول همراه با پیجینیشن کامپکت و رسپانسیو */}
        <div className="px-6 py-4 bg-gray-50/70 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <div className="font-medium text-xs sm:text-sm">
            نمایش داده‌های تکه {categories.length > 0 ? (page - 1) * limit + 1 : 0} تا {Math.min(page * limit, countOfCategories)} از مجموع <span className="font-bold text-teal-600">{countOfCategories}</span> دسته‌بندی
          </div>

          {/* باکس دکمه‌های صفحات */}
          <div className="flex items-center gap-1.5" dir="rtl">
            {/* دکمه صفحه قبلی */}
            <button
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="p-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition"
              title="صفحه قبلی"
            >
              <FiChevronRight className="text-lg" />
            </button>

            {/* رندر شماره صفحات به صورت دینامیک */}
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= page - 1 && pageNumber <= page + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={`w-9 h-9 text-xs font-semibold rounded-xl transition ${
                      page === pageNumber
                        ? "bg-teal-600 text-white shadow-md shadow-teal-600/10"
                        : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (pageNumber === page - 2 || pageNumber === page + 2) {
                return <span key={pageNumber} className="px-1 text-gray-400 text-xs">...</span>;
              }
              return null;
            })}

            {/* دکمه صفحه بعدی */}
            <button
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="p-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition"
              title="صفحه بعدی"
            >
              <FiChevronLeft className="text-lg" />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}