import React, { useEffect, useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaCloudUploadAlt, FaCheckCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import notify from "../../../Utils/Notify";
import FetchData from "../../../Utils/FetchData";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateBrand() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [img, setImg] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // 🟢 اصلاح شد: دریافت مطمئن و یکدست توکن از رداکس
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const result = await FetchData(`brands/${id}`, {
        method: "GET",
      });
      if (result?.data?.[0]) {
        const brand = result.data[0];
        setTitle(brand.title);
        setIsPublished(brand.isPublished);
        if (brand.image) {
          setImg([
            {
              id: 1,
              local: false,
              remove: false,
              data: brand.image,
            },
          ]);
        }
      }
    })();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      notify("error", "لطفاً نام برند را وارد کنید");
      return;
    }

    setLoading(true);
    let image = "";

    try {
      for (let imgItem of img) {
        if (imgItem.local && imgItem.remove) {
          continue;
        }
        if (!imgItem.local && !imgItem.remove) {
          image = imgItem.data;
          break;
        }
        
        // فرآیند آپلود عکس جدید
        if (imgItem.local && !imgItem.remove) {
          const formData = new FormData();
          formData.append("file", imgItem.data);

          const resImg = await fetch(import.meta.env.VITE_BASE_URL + "upload", {
            method: "POST",
            headers: {
              // 🟢 اصلاح شد: استفاده از فرمت استاندارد حروف بزرگ برای دور زدن باگ ۴۰۱
              "Authorization": `Bearer ${token}`, 
            },
            body: formData,
          });

          if (resImg.status === 401 || resImg.status === 403) {
            setLoading(false);
            return; // سیستم FetchData خودش کاربر را هدایت می‌کند
          }

          const dataImg = await resImg.json();
          if (dataImg.success) {
            image = dataImg.data;
          } else {
            notify("error", dataImg.message || "آپلود تصویر ناموفق بود");
            setLoading(false);
            return;
          }
        }
        
        // فرآیند حذف عکس قدیمی از سرور
        if (!imgItem.local && imgItem.remove) {
          await fetch(import.meta.env.VITE_BASE_URL + "upload", {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-type": "application/json",
            },
            body: JSON.stringify({ filename: imgItem.data }),
          });
        }
      }

      // 🟢 اصلاح شد: حذف هدرهای دستی تداخلی؛ FetchData خودش همه چیز را ست می‌کند
      const result = await FetchData(`brands/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: title.trim(),
          isPublished,
          image,
        }),
      });

      if (result.success) {
        notify("success", result.message || "برند با موفقیت ویرایش شد");
        navigate("/dashboard/brand");
      } else {
        if (result.status !== 401 && result.status !== 403) {
          notify("error", result.message || "خطا در ویرایش برند");
        }
      }
    } catch (err) {
      console.error("Error in update workflow:", err);
      notify("error", "خطایی در فرآیند ارتباط با سرور رخ داد");
    } finally {
      setLoading(false);
    }
  };

  const items = img
    ?.filter((item) => !item.remove)
    .map((imgItem) => (
      <div key={imgItem?.id || imgItem?.data} className="mt-3 w-full max-w-sm">
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm p-2">
          <img
            src={
              imgItem.local
                ? URL.createObjectURL(imgItem.data)
                : import.meta.env.VITE_BASE_FILE + imgItem.data
            }
            alt="brand preview"
            className="h-44 w-full object-contain rounded-xl bg-gray-50"
          />

          <button
            type="button"
            onClick={() => {
              const newImages = img?.map((i) => {
                if (i.id === imgItem.id) {
                  return { ...i, remove: true }; // اصلاح رفتار جهش مستقیم در استیت کامپوننت
                }
                return i;
              });
              setImg(newImages);
            }}
            className="absolute top-4 right-4 rounded-full bg-white/95 border border-gray-200 p-2 shadow-md transition text-red-500 hover:bg-red-50 active:scale-[0.95]"
            aria-label="Remove image"
          >
            <IoMdCloseCircleOutline className="text-xl" />
          </button>
        </div>
      </div>
    ));

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-0" dir="rtl">
      <div className="mb-6 flex items-start justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">ویرایش برند</h2>
          <p className="mt-1 text-sm text-gray-500">مشخصات، تصویر و وضعیت انتشار برند تجاری را تغییر دهید.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="hidden sm:inline-flex rounded-xl px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 bg-white shadow-sm transition hover:bg-gray-50 active:scale-[0.97]"
        >
          بازگشت
        </button>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5 sm:p-6 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">عنوان برند <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان برند را وارد کنید"
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label className="text-sm font-semibold text-gray-700">تصویر برند (اختیاری)</label>
            <span className="text-xs text-gray-400" dir="ltr">PNG, JPG, WEBP</span>
          </div>

          <label className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50/50 px-4 py-4 cursor-pointer transition hover:bg-gray-50 hover:border-teal-500 focus-within:ring-4 focus-within:ring-teal-500/10">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0">
                <FaCloudUploadAlt className="text-gray-500 text-xl" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-gray-700">
                  {img.find(i => !i.remove) ? "تصویر انتخاب شده است" : "برای آپلود کلیک کنید"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">سایز پیشنهادی: مربع یا مستطیل کوچک</p>
              </div>
            </div>

            {img.find(i => !i.remove) ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl">
                <FaCheckCircle /> انتخاب شد
              </span>
            ) : (
              <span className="text-xs text-gray-400 border border-gray-200 bg-white rounded-lg px-2 py-1">انتخاب فایل</span>
            )}

            <input
              type="file"
              onChange={(e) => {
                if (img.find((item) => !item.remove)) {
                  notify("error", "ابتدا تصویر قبلی را حذف کنید");
                  return;
                }
                if (e.target.files?.[0]) {
                  const nextId = img?.at(-1)?.id ? img?.at(-1)?.id + 1 : 1;
                  setImg([
                    ...img,
                    {
                      id: nextId,
                      local: true,
                      remove: false,
                      data: e.target.files[0],
                    },
                  ]);
                }
              }}
              accept="image/*"
              className="hidden"
            />
          </label>

          <div className="flex flex-wrap gap-3">{items}</div>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div>
            <p className="text-sm font-bold text-gray-800">وضعیت انتشار</p>
            <p className="text-xs text-gray-500 mt-0.5">در صورت فعال بودن، این برند در سایت عمومی نمایش داده خواهد شد.</p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              name="isPublished"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="sr-only peer"
            />
            <span className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${isPublished ? "bg-teal-600" : "bg-gray-200"}`}>
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${isPublished ? "-translate-x-5" : "-translate-x-1"}`} />
            </span>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto order-2 sm:order-1 rounded-xl px-5 py-2.5 text-sm font-medium text-gray-600 border border-gray-200 bg-white transition hover:bg-gray-50 active:scale-[0.97]"
          >
            انصراف
          </button>

          <button
            disabled={loading}
            type="submit"
            className={`w-full sm:w-auto order-1 sm:order-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-teal-600/10 transition active:scale-[0.98] ${loading ? "bg-teal-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700 focus:outline-none"}`}
          >
            {loading ? (
              <span className="inline-flex items-center justify-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white/60 border-t-white animate-spin" />
                در حال ذخیره...
              </span>
            ) : "ذخیره تغییرات"}
          </button>
        </div>
      </form>
    </div>
  );
}