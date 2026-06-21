import React, { useEffect, useState } from 'react'
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FiUploadCloud, FiPlus, FiTrash2 } from "react-icons/fi";
import notify from '../../../Utils/Notify';
import FetchData from '../../../Utils/FetchData';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

let infoIdCounter = 1;

export default function CreateProduct() {
  const [images, setImages] = useState([]) // File[]
  const [loading, setLoading] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [brandId, setBrandId] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [brands, setBrands] = useState([])
  const [categories, setCategories] = useState([])
  const [information, setInformation] = useState([])
  const navigate = useNavigate()
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    (async () => {
      const [brandsRes, categoriesRes] = await Promise.all([
        FetchData('brands?limit=1000&sort=title', { method: 'GET' }),
        FetchData('categories?limit=1000&sort=title', { method: 'GET' }),
      ])
      if (brandsRes?.data) setBrands(brandsRes.data)
      if (categoriesRes?.data) setCategories(categoriesRes.data)
    })()
  }, [token])

  const addInformationRow = () => {
    setInformation([...information, { id: infoIdCounter++, key: "", value: "" }])
  }

  const updateInformationRow = (id, field, val) => {
    setInformation(information.map((row) => row.id === id ? { ...row, [field]: val } : row))
  }

  const removeInformationRow = (id) => {
    setInformation(information.filter((row) => row.id !== id))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) {
      notify('error', 'لطفاً عنوان محصول را وارد کنید');
      return;
    }
    if (!description.trim()) {
      notify('error', 'لطفاً توضیحات محصول را وارد کنید');
      return;
    }
    if (!brandId) {
      notify('error', 'لطفاً برند محصول را انتخاب کنید');
      return;
    }
    if (!categoryId) {
      notify('error', 'لطفاً دسته‌بندی محصول را انتخاب کنید');
      return;
    }

    setLoading(true)

    // ۱. آپلود تصاویر محصول
    const uploadedImages = []
    for (const file of images) {
      const formData = new FormData()
      formData.append('file', file)
      try {
        const resImg = await fetch(import.meta.env.VITE_BASE_URL + 'upload', {
          method: 'POST',
          headers: { "Authorization": `Bearer ${token}` },
          body: formData,
        })
        if (resImg.status === 401 || resImg.status === 403) {
          notify('error', 'نشست شما منقضی شده است. لطفاً دوباره لاگین کنید.');
          setLoading(false);
          return;
        }
        const dataImg = await resImg.json()
        if (dataImg.success) {
          uploadedImages.push(dataImg.data)
        } else {
          notify('error', dataImg.message || 'آپلود یکی از تصاویر ناموفق بود')
          setLoading(false)
          return
        }
      } catch (error) {
        notify('error', 'خطا در ارتباط با سرور جهت آپلود تصاویر')
        setLoading(false)
        return
      }
    }

    // ۲. فرآیند ساخت محصول
    const tagsArray = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    const informationArray = information
      .filter((row) => row.key.trim() && row.value.trim())
      .map(({ key, value }) => ({ key: key.trim(), value: value.trim() }))

    const result = await FetchData("products", {
      method: "POST",
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim(),
        brandId,
        categoryId,
        tags: tagsArray,
        information: informationArray,
        images: uploadedImages,
        isPublished,
      }),
    });

    if (result.success) {
      notify('success', result.message || 'محصول جدید ساخته شد')
      navigate('/dashboard/product')
    } else {
      if (result.status !== 401 && result.status !== 403) {
        notify('error', result.message || 'ساخت محصول ناموفق بود')
      }
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-2xl shadow-sm border border-gray-100" dir="rtl">
      <div className="mb-6 border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-gray-800">ایجاد محصول جدید</h2>
        <p className="text-sm text-gray-500 mt-1">مشخصات محصول جدید را وارد و ثبت کنید.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* عنوان محصول */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            عنوان محصول <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name='title'
            placeholder='مثال: گوشی موبایل سامسونگ گلکسی...'
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
            required
          />
        </div>

        {/* توضیحات محصول */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            توضیحات محصول <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name='description'
            rows={4}
            placeholder='توضیحات کامل محصول را وارد کنید...'
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm resize-none"
            required
          />
        </div>

        {/* برند و دسته‌بندی */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="brandId" className="block text-sm font-medium text-gray-700 mb-2">
              برند <span className="text-red-500">*</span>
            </label>
            <select
              id="brandId"
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm bg-white cursor-pointer"
              required
            >
              <option value="">انتخاب برند...</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>{brand.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
              دسته‌بندی <span className="text-red-500">*</span>
            </label>
            <select
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm bg-white cursor-pointer"
              required
            >
              <option value="">انتخاب دسته‌بندی...</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>{category.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* برچسب‌ها */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
            برچسب‌ها
          </label>
          <input
            type="text"
            id="tags"
            placeholder='برچسب‌ها را با ویرگول جدا کنید، مثال: جدید, پرفروش'
            onChange={(e) => setTags(e.target.value)}
            value={tags}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
          />
        </div>

        {/* مشخصات فنی محصول */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">مشخصات فنی محصول</label>
            <button
              type="button"
              onClick={addInformationRow}
              className="flex items-center gap-1 text-xs font-medium text-teal-600 hover:text-teal-700"
            >
              <FiPlus /> افزودن مشخصه
            </button>
          </div>

          {information.length === 0 ? (
            <p className="text-xs text-gray-400 bg-gray-50 border border-dashed border-gray-200 rounded-xl px-4 py-3 text-center">
              هنوز مشخصه‌ای اضافه نشده است.
            </p>
          ) : (
            <div className="space-y-2">
              {information.map((row) => (
                <div key={row.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="عنوان (مثال: رنگ)"
                    value={row.key}
                    onChange={(e) => updateInformationRow(row.id, 'key', e.target.value)}
                    className="w-1/2 px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                  />
                  <input
                    type="text"
                    placeholder="مقدار (مثال: مشکی)"
                    value={row.value}
                    onChange={(e) => updateInformationRow(row.id, 'value', e.target.value)}
                    className="w-1/2 px-3 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => removeInformationRow(row.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition shrink-0"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* تصاویر محصول */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            تصاویر محصول
          </label>

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 hover:border-teal-500 bg-gray-50/50 hover:bg-teal-50/10 h-32 rounded-2xl cursor-pointer transition-all p-4 text-center">
            <FiUploadCloud className="text-3xl text-gray-400 mb-2" />
            <span className="text-xs font-medium text-gray-600">انتخاب تصویر یا رها کردن فایل (چند تصویر مجاز است)</span>
            <span className="text-[11px] text-gray-400 mt-1">فرمت‌های مجاز: JPG, PNG (حداکثر ۲ مگابایت)</span>
            <input
              type="file"
              name='images'
              accept='image/*'
              multiple
              onChange={(e) => {
                if (e.target.files?.length) {
                  setImages([...images, ...Array.from(e.target.files)])
                }
              }}
              className="hidden"
            />
          </label>

          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
              {images.map((file, index) => (
                <div key={index} className="relative h-28 border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center p-2">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="product preview"
                    className="max-h-full max-w-full object-contain rounded-xl"
                  />
                  <button
                    type="button"
                    className="absolute top-1.5 right-1.5 text-xl text-red-500 hover:text-red-600 bg-white rounded-full shadow-md transition-transform active:scale-95"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                  >
                    <IoMdCloseCircleOutline />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* وضعیت انتشار */}
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
          <div>
            <span className="block text-sm font-semibold text-gray-800">وضعیت انتشار</span>
            <span className="block text-xs text-gray-500 mt-0.5">در صورت فعال بودن، محصول در سایت نمایش داده می‌شود.</span>
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
            onClick={() => navigate('/dashboard/product')}
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
            ) : "ثبت و ایجاد محصول"}
          </button>
        </div>
      </form>
    </div>
  )
}