import store from "../Store"; // 🟢 ۱. استور رداکس خود را ایمپورت کنید (آدرس فایل استور خود را چک کنید)
import { logout } from "../Store/Slices/AuthSlice"; // 🟢 ۲. اکشن لاگ‌اوت را از اسلایس خود بیاورید

const FetchData = async (url, options = {}) => {
  try {
    // گرفتن توکن از لوکال استوریج
    const token = localStorage.getItem("token");

    // آماده‌سازی هدرها به همراه توکن (در صورت وجود)
    const headers = {
      "Content-type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` }), 
      ...options.headers, 
    };

    const res = await fetch(import.meta.env.VITE_BASE_URL + url, {
      ...options,
      headers,
    });

    // کنترل حالتی که سرور دیتای خالی یا فرمت غیر JSON برمی‌گرداند
    let data = {};
    try {
      data = await res.json();
    } catch (jsonError) {
      console.log("Response is not JSON", jsonError);
    }

    if (!res.ok) {
      // 🟢 ۳. بررسی هوشمند خطای 401 و 403 برای اخراج کاربر خاطی یا منقضی شده
      if (res.status === 401 || res.status === 403) {
        console.warn(`Auth Error (${res.status}): Clearing session and logging out...`);
        
        // پاک کردن توکن از لوکال استوریج
        localStorage.removeItem("token");
        
        // پاک کردن استیت رداکس با دیسپچ مستقیم از طریق خودِ store
        store.dispatch(logout());

        // ریدایرکت اختیاری به صفحه لاگین در صورت نیاز به بازنشانی کامل پنجره
        // window.location.href = "/";
      }

      return {
        success: false,
        message: data?.message || 'Request failed',
        status: res.status,
      };
    }

    return data;
  } catch (error) {
    console.log('fetchdata error', error);
    return {
      success: false,
      message: 'Network error',
    };
  }
};

export default FetchData;