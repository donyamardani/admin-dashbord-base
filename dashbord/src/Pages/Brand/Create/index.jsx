import React, { useState } from 'react'
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FiUploadCloud } from "react-icons/fi"; 
import notify from '../../../Utils/Notify';
import FetchData from '../../../Utils/FetchData';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function CreateBrand() {
  const [img, setImg] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [title, setTitle] = useState("")
  const navigate = useNavigate()
  const token = useSelector((state) => state.auth.token);

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      notify('error', 'لطفاً نام برند را وارد کنید');
      return;
    }
    
    setLoading(true)
    let image = '';
    
    // ۱. فرآیند آپلود تصویر
    if (img) {
      const formData = new FormData()
      formData.append('file', img)
      try {
        console.log("تلاش برای آپلود تصویر با توکن:", token);
        const resimg = await fetch(import.meta.env.VITE_BASE_URL + 'upload', {
          method: 'POST',
          headers: {
            // 🟢 اصلاح شد: استفاده از حروف بزرگ استاندارد برای هدر Authorization و Bearer
            "Authorization": `Bearer ${token}` 
          },
          body: formData
        })

        // بررسی اینکه اگر آپلود تصویر خطای احراز هویت داد، هندل شود
        if (resimg.status === 401 || resimg.status === 403) {
          notify('error', 'نشست شما منقضی شده است. لطفاً دوباره لاگین کنید.');
          setLoading(false);
          return;
        }

        const dataImg = await resimg.json()
        if (dataImg.success) {
          image = dataImg.data
        } else {
          notify('error', dataImg.message || 'آپلود عکس ناموفق بود')
          setLoading(false)
          return
        }
      } catch (error) {
        notify('error', 'خطا در ارتباط با سرور جهت آپلود تصویر')
        setLoading(false)
        return
      }
    }

    // ۲. فرآیند ساخت برند
    console.log("تلاش برای ارسال اطلاعات برند به همراه تصویر:", image);
    
    // 🟢 اصلاح شد: هدرها کاملاً حذف شدند چون FetchData خودش آن‌ها را به صورت استاندارد اعمال می‌کند
    const result = await FetchData("brands", {
      method: "POST",
      body: JSON.stringify({
        title: title.trim(),
        isPublished,
        image,
      }),
    });
    
    if (result.success) {
      notify('success', result.message || 'برند جدید ساخته شد')
      navigate('/dashboard/brand')
    } else {
      // اگر خطای ۴۰۱ یا ۴۰۳ رخ داده باشد، FetchData خودش عمل لاگ‌اوت را انجام می‌دهد
      if (result.status !== 401 && result.status !== 403) {
        notify('error', result.message || 'ساخت برند ناموفق بود')
      }
    }
    setLoading(false)
  }
 
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-sm border border-gray-100" dir="rtl">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-800">ایجاد برند جدید</h2>
        <p className="text-sm text-gray-500 mt-1">مشخصات برند تجاری جدید را وارد و ثبت کنید.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* فیلد عنوان برند */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            نام برند <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            id="title"
            name='title' 
            placeholder='مثال: سامسونگ، ...' 
            onChange={(e) => setTitle(e.target.value)} 
            value={title} 
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
            required
          />
        </div>

        {/* فیلد تصویر برند */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            لوگو یا تصویر برند
          </label>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-teal-500 bg-gray-50/50 hover:bg-teal-50/10 h-40 rounded-2xl cursor-pointer transition-all p-4 text-center">
              <FiUploadCloud className="text-3xl text-gray-400 mb-2" />
              <span className="text-xs font-medium text-gray-600">انتخاب تصویر یا رها کردن فایل</span>
              <span className="text-[11px] text-gray-400 mt-1">فرمت‌های مجاز: JPG, PNG (حداکثر ۲ مگابایت)</span>
              <input 
                type="file" 
                name='image' 
                accept='image/*' 
                onChange={(e) => setImg(e.target.files?.[0])}  
                className="hidden"
              />
            </label>

            {/* پیش‌نمایش تصویر */}
            {img ? (
              <div className="relative h-40 border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center p-2 group">
                <img 
                  src={URL.createObjectURL(img)} 
                  alt="brand preview" 
                  className="max-h-full max-w-full object-contain rounded-xl"
                />
                <button 
                  type="button"
                  className="absolute top-2 right-2 text-2xl text-red-500 hover:text-red-600 bg-white rounded-full shadow-md transition-transform active:scale-95" 
                  onClick={() => setImg(null)}
                >
                  <IoMdCloseCircleOutline />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex h-40 border border-dashed border-gray-100 rounded-2xl items-center justify-center bg-gray-50/30 text-xs text-gray-400">
                تصویری انتخاب نشده است
              </div>
            )}
          </div>
        </div>

        {/* وضعیت انتشار */}
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div>
            <span className="block text-sm font-semibold text-gray-800">وضعیت انتشار</span>
            <span className="block text-xs text-gray-500 mt-0.5">در صورت فعال بودن، برند در سایت نمایش داده می‌شود.</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input 
              type="checkbox" 
              name='isPublished' 
              checked={isPublished} 
              onChange={(e) => setIsPublished(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
          </label>
        </div>

        {/* دکمه‌ها */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
          <button 
            type="button"
            onClick={() => navigate('/dashboard/brand')}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
          >
            انصراف
          </button>
          
          <button 
            type='submit' 
            disabled={loading}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 active:scale-[0.98] disabled:opacity-50 text-white text-sm font-medium rounded-xl shadow-md shadow-teal-600/10 transition-all flex items-center justify-center"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>در حال ثبت...</span>
              </div>
            ) : "ثبت و ایجاد برند"}
          </button>
        </div>
      </form>
    </div>
  )
}