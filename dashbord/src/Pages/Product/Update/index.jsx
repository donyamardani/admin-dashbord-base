import React, { useEffect, useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaCloudUploadAlt, FaCheckCircle } from "react-icons/fa";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { useSelector } from "react-redux";
import notify from "../../../Utils/Notify";
import FetchData from "../../../Utils/FetchData";
import Loading from "../../../Components/Loading";
import { useNavigate, useParams } from "react-router-dom";

let infoIdCounter = 1;

export default function UpdateProduct() {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [information, setInformation] = useState([]);
  const [isPublished, setIsPublished] = useState(false);
  const [images, setImages] = useState([]); // { id, local, remove, data }
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const [brandsRes, categoriesRes, productRes] = await Promise.all([
        FetchData('brands?limit=1000&sort=title', { method: 'GET' }),
        FetchData('categories?limit=1000&sort=title', { method: 'GET' }),
        FetchData(`products/${id}`, { method: "GET" }),
      ]);

      if (brandsRes?.data) setBrands(brandsRes.data);
      if (categoriesRes?.data) setCategories(categoriesRes.data);

      const product = productRes?.data;
      if (product) {
        setTitle(product.title || "");
        setDescription(product.description || "");
        setTags((product.tags || []).join(', '));
        setBrandId(product.brandId?._id || product.brandId || "");
        setCategoryId(product.categoryId?._id || product.categoryId || "");
        setIsPublished(!!product.isPublished);
        setInformation(
          (product.information || []).map((row) => ({
            id: infoIdCounter++,
            key: row.key,
            value: row.value,
          }))
        );
        setImages(
          (product.images || []).map((img, index) => ({
            id: index + 1,
            local: false,
            remove: false,
            data: img,
          }))
        );
      }
      setLoaded(true);
    })();
  }, [id, token]);

  const addInformationRow = () => {
    setInformation([...information, { id: infoIdCounter++, key: "", value: "" }]);
  };

  const updateInformationRow = (rowId, field, val) => {
    setInformation(information.map((row) => row.id === rowId ? { ...row, [field]: val } : row));
  };

  const removeInformationRow = (rowId) => {
    setInformation(information.filter((row) => row.id !== rowId));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      notify("error", "لطفاً عنوان محصول را وارد کنید");
      return;
    }
    if (!description.trim()) {
      notify("error", "لطفاً توضیحات محصول را وارد کنید");
      return;
    }
    if (!brandId) {
      notify("error", "لطفاً برند محصول را انتخاب کنید");
      return;
    }
    if (!categoryId) {
      notify("error", "لطفاً دسته‌بندی محصول را انتخاب کنید");
      return;
    }

    setLoading(true);
    const finalImages = [];

    try {
      for (let imgItem of images) {
        if (imgItem.local && imgItem.remove) {
          continue;
        }
        if (!imgItem.local && !imgItem.remove) {
          finalImages.push(imgItem.data);
          continue;
        }

        // آپلود تصویر جدید
        if (imgItem.local && !imgItem.remove) {
          const formData = new FormData();
          formData.append("file", imgItem.data);

          const resImg = await fetch(import.meta.env.VITE_BASE_URL + "upload", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData,
          });

          if (resImg.status === 401 || resImg.status === 403) {
            setLoading(false);
            return;
          }

          const dataImg = await resImg.json();
          if (dataImg.success) {
            finalImages.push(dataImg.data);
          } else {
            notify("error", dataImg.message || "آپلود یکی از تصاویر ناموفق بود");
            setLoading(false);
            return;
          }
          continue;
        }

        // حذف عکس قدیمی از سرور
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

      const tagsArray = tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const informationArray = information
        .filter((row) => row.key.trim() && row.value.trim())
        .map(({ key, value }) => ({ key: key.trim(), value: value.trim() }));

      const result = await FetchData(`products/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          brandId,
          categoryId,
          tags: tagsArray,
          information: informationArray,
          images: finalImages,
          isPublished,
        }),
      });

      if (result.success) {
        notify("success", result.message || "محصول با موفقیت ویرایش شد");
        navigate("/dashboard/product");
      } else {
        if (result.status !== 401 && result.status !== 403) {
          notify("error", result.message || "خطا در ویرایش محصول");
        }
      }
    } catch (err) {
      console.error("Error in update workflow:", err);
      notify("error", "خطایی در فرآیند ارتباط با سرور رخ داد");
    } finally {
      setLoading(false);
    }
  };

  if (!loaded) {
    return <Loading />;
  }

  const imageItems = images
    ?.filter((item) => !item.remove)
    .map((imgItem) => (
      <div key={imgItem?.id} className="relative h-28 border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center p-2">
        <img
          src={
            imgItem.local
              ? URL.createObjectURL(imgItem.data)
              : import.meta.env.VITE_BASE_FILE + imgItem.data
          }
          alt="product preview"
          className="max-h-full max-w-full object-contain rounded-xl"
        />
        <button
          type="button"
          onClick={() => {
            const newImages = images?.map((i) => {
              if (i.id === imgItem.id) {
                return { ...i, remove: true };
              }
              return i;
            });
            setImages(newImages);
          }}
          className="absolute top-1.5 right-1.5 text-xl text-red-500 hover:text-red-600 bg-white rounded-full shadow-md transition-transform active:scale-95"
          aria-label="Remove image"
        >
          <IoMdCloseCircleOutline />
        </button>
      </div>
    ));

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-0" dir="rtl">
      <div className="mb-6 flex items-start justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">ویرایش محصول</h2>
          <p className="mt-1 text-sm text-gray-500">مشخصات، تصاویر و وضعیت انتشار محصول را تغییر دهید.</p>
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
        {/* عنوان محصول */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">عنوان محصول <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="عنوان محصول را وارد کنید"
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
          />
        </div>

        {/* توضیحات محصول */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">توضیحات محصول <span className="text-red-500">*</span></label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="توضیحات کامل محصول را وارد کنید"
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 resize-none"
          />
        </div>

        {/* برند و دسته‌بندی */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">برند <span className="text-red-500">*</span></label>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 cursor-pointer"
            >
              <option value="">انتخاب برند...</option>
              {brands.map((brand) => (
                <option key={brand._id} value={brand._id}>{brand.title}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 block">دسته‌بندی <span className="text-red-500">*</span></label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-800 outline-none transition focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 cursor-pointer"
            >
              <option value="">انتخاب دسته‌بندی...</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>{category.title}</option>
              ))}
            </select>
          </div>
        </div>

        {/* برچسب‌ها */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">برچسب‌ها</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="برچسب‌ها را با ویرگول جدا کنید، مثال: جدید, پرفروش"
            className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
          />
        </div>

        {/* مشخصات فنی محصول */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-gray-700 block">مشخصات فنی محصول</label>
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
                    className="w-1/2 rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-800 outline-none transition focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                  />
                  <input
                    type="text"
                    placeholder="مقدار (مثال: مشکی)"
                    value={row.value}
                    onChange={(e) => updateInformationRow(row.id, 'value', e.target.value)}
                    className="w-1/2 rounded-xl border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-800 outline-none transition focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
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
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label className="text-sm font-semibold text-gray-700">تصاویر محصول</label>
            <span className="text-xs text-gray-400" dir="ltr">PNG, JPG, WEBP</span>
          </div>

          <label className="flex items-center justify-between gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50/50 px-4 py-4 cursor-pointer transition hover:bg-gray-50 hover:border-teal-500 focus-within:ring-4 focus-within:ring-teal-500/10">
            <div className="flex items-center gap-3">
              <span className="h-10 w-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0">
                <FaCloudUploadAlt className="text-gray-500 text-xl" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-gray-700">
                  {images.filter(i => !i.remove).length > 0 ? `${images.filter(i => !i.remove).length} تصویر انتخاب شده است` : "برای آپلود کلیک کنید"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">می‌توانید چند تصویر همزمان اضافه کنید</p>
              </div>
            </div>

            {images.filter(i => !i.remove).length > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-xl">
                <FaCheckCircle /> انتخاب شد
              </span>
            )}

            <input
              type="file"
              multiple
              onChange={(e) => {
                if (e.target.files?.length) {
                  const lastId = images?.at(-1)?.id || 0;
                  const newItems = Array.from(e.target.files).map((file, index) => ({
                    id: lastId + index + 1,
                    local: true,
                    remove: false,
                    data: file,
                  }));
                  setImages([...images, ...newItems]);
                }
              }}
              accept="image/*"
              className="hidden"
            />
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{imageItems}</div>
        </div>

        {/* وضعیت انتشار */}
        <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div>
            <p className="text-sm font-bold text-gray-800">وضعیت انتشار</p>
            <p className="text-xs text-gray-500 mt-0.5">در صورت فعال بودن، این محصول در سایت عمومی نمایش داده خواهد شد.</p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
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