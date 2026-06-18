import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import FetchData from '../../../Utils/FetchData'
import Loading from '../../../Components/Loading'
import { useNavigate } from 'react-router-dom'
import { BsTrash3Fill } from "react-icons/bs";
import { MdModeEdit } from "react-icons/md";
import { FiSearch, FiFilter, FiChevronRight, FiChevronLeft } from "react-icons/fi"; // اضافه شدن آیکون‌های پجینیشن
import notify from '../../../Utils/Notify'

export default function GetAllBrand() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10) // تغییر لیمیت به ۱۰ برای تست راحت‌تر پیجینیشن
  const [brands, setBrands] = useState(null)
  const [sort, setSort] = useState('-createdAt')
  const [search, setSearch] = useState('')
  const [countOfBrands, setCountOfBrands] = useState(0)
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate()

  // محاسبه تعداد کل صفحات
  const totalPages = Math.ceil(countOfBrands / limit) || 1;

  useEffect(() => {
    (async () => {
      const result = await FetchData(`brands?page=${page}&limit=${limit}&sort=${sort}${search?`&search=${search}`:''}`, {
        method: 'GET',
      })
      if (result) {
        setBrands(result.data)
        setCountOfBrands(result.count)
      }
    })()
  }, [page, limit, search, sort, token])

  // ریست کردن صفحه به ۱ در صورت سرچ جدید
  useEffect(() => {
    setPage(1)
  }, [search, sort])

  if (!brands) { return <Loading /> }

  const handleRemove = async (id) => {
    if (!window.confirm("آیا از حذف این برند اطمینان دارید؟")) return;

    const result = await FetchData(`brands/${id}`, {
      method: 'DELETE',
    })
    
    if (result.success) {
      const newBrands = brands?.filter((item) => item._id.toString() !== id.toString())
      setBrands(newBrands)
      setCountOfBrands(prev => prev - 1)
      notify('success', result.message || 'برند با موفقیت حذف شد')
    } else {
      notify('error', result.message || 'حذف برند ناموفق بود')
    }
  }

  const items = brands?.map((item, index) => (
    <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50/70 transition duration-150">
      <td className="px-6 py-4 text-sm text-gray-500 font-medium text-center">
        {(page - 1) * limit + (index + 1)} {/* محاسبه هوشمند ردیف بر اساس شماره صفحه */}
      </td>
      <td className="px-6 py-4 text-sm text-gray-800 font-semibold">{item?.title}</td>
      <td className="px-6 py-4 text-sm">
        <div className="w-12 h-12 rounded-xl bg-gray-50 p-1 border border-gray-100 flex items-center justify-center overflow-hidden">
          <img 
            src={import.meta.env.VITE_BASE_FILE + item.image} 
            alt={item?.title} 
            className="max-w-full max-h-full object-contain"
          />
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
            onClick={() => navigate(`/dashboard/brand/update/${item?._id}`)}
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
            placeholder='جستجو در برندها...' 
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
                <th className="px-6 py-3.5 text-sm font-bold text-gray-500">عنوان برند</th>
                <th className="px-6 py-3.5 text-sm font-bold text-gray-500">تصویر لوگو</th>
                <th className="px-6 py-3.5 text-sm font-bold text-gray-500">وضعیت انتشار</th>
                <th className="px-6 py-3.5 text-sm font-bold text-gray-500 w-32">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {brands.length > 0 ? (
                items
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-400 font-medium">
                    هیچ برندی یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* فوتر جدول همراه با پیجینیشن کامپکت و رسپانسیو */}
        <div className="px-6 py-4 bg-gray-50/70 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <div className="font-medium text-xs sm:text-sm">
            نمایش داده‌های تکه {brands.length > 0 ? (page - 1) * limit + 1 : 0} تا {Math.min(page * limit, countOfBrands)} از مجموع <span className="font-bold text-teal-600">{countOfBrands}</span> برند
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
              <FiChevronRight className="text-lg" /> {/* به دلیل RTL، آیکون راست به معنی برگشت به قبل است */}
            </button>

            {/* رندر شماره صفحات به صورت دینامیک */}
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              // شروط برای نمایش صفحات (جلوگیری از شلوغی در صفحات بسیار زیاد)
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
              <FiChevronLeft className="text-lg" /> {/* به دلیل RTL، آیکون چپ به معنی جلو رفتن است */}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}