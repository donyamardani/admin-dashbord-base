import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FaTags,
  FaLayerGroup,
  FaShoppingBag,
  FaUsers,
  FaPlus,
  FaChartLine,
  FaBox,
  FaEye,
  FaStar,
  FaHeart,
  FaShoppingCart,
  FaArrowUp,
  FaArrowDown,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle,
  FaRegClock
} from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    brands: { count: 0, published: 0, unpublished: 0 },
    categories: { count: 0, published: 0, unpublished: 0 },
    products: { count: 0, published: 0, unpublished: 0, avgRating: 0, totalBought: 0 },
    users: { count: 0, active: 0, inactive: 0, admins: 0 }
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [categoryChartData, setCategoryChartData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  const COLORS = ['#0d9488', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981', '#6366f1', '#ec4899'];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // فراخوانی API های واقعی - باید با بک‌اند خودت جایگزین کنی
      const [brandsRes, categoriesRes, productsRes, usersRes] = await Promise.all([
        fetch('brands?limit=1000', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        fetch('categories?limit=1000', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        fetch('products?limit=1000', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }),
        fetch('users?limit=1000', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      ]);

      const brandsData = await brandsRes.json();
      const categoriesData = await categoriesRes.json();
      const productsData = await productsRes.json();
      const usersData = await usersRes.json();

      const brands = brandsData.data || brandsData || [];
      const categories = categoriesData.data || categoriesData || [];
      const products = productsData.data || productsData || [];
      const users = usersData.data || usersData || [];

      setStats({
        brands: {
          count: brands.length,
          published: brands.filter(b => b.isPublished).length,
          unpublished: brands.filter(b => !b.isPublished).length
        },
        categories: {
          count: categories.length,
          published: categories.filter(c => c.isPublished).length,
          unpublished: categories.filter(c => !c.isPublished).length
        },
        products: {
          count: products.length,
          published: products.filter(p => p.isPublished).length,
          unpublished: products.filter(p => !p.isPublished).length,
          avgRating: products.length > 0 ? (products.reduce((sum, p) => sum + (p.avgRating || 0), 0) / products.length).toFixed(1) : 0,
          totalBought: products.reduce((sum, p) => sum + (p.boughtCount || 0), 0)
        },
        users: {
          count: users.length,
          active: users.filter(u => u.isActive).length,
          inactive: users.filter(u => !u.isActive).length,
          admins: users.filter(u => u.role === 'admin' || u.role === 'superAdmin').length
        }
      });

      // آخرین ۵ محصول
      const sortedProducts = [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
      setRecentProducts(sortedProducts);

      // آخرین ۵ کاربر
      const sortedUsers = [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
      setRecentUsers(sortedUsers);

      // داده نمودار محصولات بر اساس برند
      const brandCounts = {};
      products.forEach(p => {
        const brandTitle = brands.find(b => b._id === p.brandId?.toString())?.title || 'نامشخص';
        brandCounts[brandTitle] = (brandCounts[brandTitle] || 0) + 1;
      });
      setChartData(Object.entries(brandCounts).map(([name, value]) => ({ name, value })).slice(0, 8));

      // داده نمودار محصولات بر اساس دسته‌بندی
      const catCounts = {};
      products.forEach(p => {
        const catTitle = categories.find(c => c._id === p.categoryId?.toString())?.title || 'نامشخص';
        catCounts[catTitle] = (catCounts[catTitle] || 0) + 1;
      });
      setCategoryChartData(Object.entries(catCounts).map(([name, value]) => ({ name, value })).slice(0, 8));

      // داده نمودار ماهانه (نمونه)
      setMonthlyData([
        { name: 'فروردین', products: 12, users: 8 },
        { name: 'اردیبهشت', products: 19, users: 15 },
        { name: 'خرداد', products: 25, users: 22 },
        { name: 'تیر', products: 32, users: 28 },
        { name: 'مرداد', products: 28, users: 35 },
        { name: 'شهریور', products: 45, users: 42 },
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // داده‌های نمونه برای تست
      setStats({
        brands: { count: 12, published: 10, unpublished: 2 },
        categories: { count: 8, published: 7, unpublished: 1 },
        products: { count: 156, published: 140, unpublished: 16, avgRating: 4.2, totalBought: 342 },
        users: { count: 45, active: 40, inactive: 5, admins: 3 }
      });
      setRecentProducts([
        { _id: 1, title: 'گوشی موبایل سامسونگ', minPrice: 12500000, maxPrice: 15000000, categoryId: { title: 'الکترونیک' }, brandId: { title: 'سامسونگ' }, avgRating: 4.5, boughtCount: 23, isPublished: true, createdAt: '2024-06-20' },
        { _id: 2, title: 'لپ‌تاپ ایسوس', minPrice: 45000000, maxPrice: 52000000, categoryId: { title: 'الکترونیک' }, brandId: { title: 'ایسوس' }, avgRating: 4.8, boughtCount: 15, isPublished: true, createdAt: '2024-06-19' },
        { _id: 3, title: 'هدفون بلوتوثی', minPrice: 2500000, maxPrice: 3200000, categoryId: { title: 'الکترونیک' }, brandId: { title: 'اپل' }, avgRating: 4.3, boughtCount: 45, isPublished: true, createdAt: '2024-06-18' },
        { _id: 5, title: 'ساعت هوشمند', minPrice: 3500000, maxPrice: 4800000, categoryId: { title: 'الکترونیک' }, brandId: { title: 'شیائومی' }, avgRating: 4.6, boughtCount: 30, isPublished: true, createdAt: '2024-06-16' },
      ]);
      setRecentUsers([
        { _id: 1, fullName: 'علی احمدی', phoneNumber: '09123456789', role: 'user', isActive: true, createdAt: '2024-06-20' },
        { _id: 2, fullName: 'سارا رضایی', phoneNumber: '09129876543', role: 'admin', isActive: true, createdAt: '2024-06-19' },
        { _id: 3, fullName: 'محمد کریمی', phoneNumber: '09121234567', role: 'user', isActive: false, createdAt: '2024-06-18' },
        { _id: 4, fullName: 'فاطمه محمدی', phoneNumber: '09127654321', role: 'superAdmin', isActive: true, createdAt: '2024-06-17' },
        { _id: 5, fullName: 'رضا نوری', phoneNumber: '09128889999', role: 'user', isActive: true, createdAt: '2024-06-16' },
      ]);
      setChartData([
        { name: 'سامسونگ', value: 45 },
        { name: 'اپل', value: 32 },
        { name: 'شیائومی', value: 28 },
        { name: 'ایسوس', value: 20 },
        { name: 'سونی', value: 10 },
      ]);
      setCategoryChartData([
        { name: 'هدفون', value: 85 },
        { name: 'موبایل', value: 35 },
        { name: 'لپتاپ', value: 20 },
        { name: 'اسمارت واچ', value: 10 },
      ]);
      setMonthlyData([
        { name: 'فروردین', products: 12, users: 8 },
        { name: 'اردیبهشت', products: 19, users: 15 },
        { name: 'خرداد', products: 25, users: 22 },
        { name: 'تیر', products: 32, users: 28 },
        { name: 'مرداد', products: 28, users: 35 },
        { name: 'شهریور', products: 45, users: 42 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'برندها',
      count: stats.brands.count,
      published: stats.brands.published,
      unpublished: stats.brands.unpublished,
      icon: FaTags,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      path: '/dashboard/brand'
    },
    {
      title: 'دسته‌بندی‌ها',
      count: stats.categories.count,
      published: stats.categories.published,
      unpublished: stats.categories.unpublished,
      icon: FaLayerGroup,
      color: 'bg-green-500',
      lightColor: 'bg-green-50',
      textColor: 'text-green-600',
      path: '/dashboard/category'
    },
    {
      title: 'محصولات',
      count: stats.products.count,
      published: stats.products.published,
      unpublished: stats.products.unpublished,
      icon: FaShoppingBag,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      path: '/dashboard/product'
    },
    {
      title: 'کاربران',
      count: stats.users.count,
      active: stats.users.active,
      inactive: stats.users.inactive,
      admins: stats.users.admins,
      icon: FaUsers,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      path: '/dashboard/user'
    },
  ];

  const quickActions = [
    { title: 'افزودن برند', path: '/dashboard/brand/create', icon: FaPlus, color: 'bg-blue-600 hover:bg-blue-700' },
    { title: 'افزودن دسته‌بندی', path: '/dashboard/category/create', icon: FaPlus, color: 'bg-green-600 hover:bg-green-700' },
    { title: 'افزودن محصول', path: '/dashboard/product/create', icon: FaPlus, color: 'bg-purple-600 hover:bg-purple-700' },
  ];

  const formatPrice = (price) => {
    if (!price) return '0';
    return price.toLocaleString('fa-IR');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const getRoleBadge = (role) => {
    const styles = {
      superAdmin: 'bg-red-100 text-red-700',
      admin: 'bg-orange-100 text-orange-700',
      user: 'bg-blue-100 text-blue-700'
    };
    const labels = {
      superAdmin: 'مدیر کل',
      admin: 'مدیر',
      user: 'کاربر'
    };
    return { style: styles[role] || styles.user, label: labels[role] || 'کاربر' };
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
          <p className="text-gray-500 text-sm">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaChartLine className="text-teal-600" />
            داشبورد مدیریت
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            خوش آمدید، <span className="font-semibold text-gray-700">{user?.fullName || 'مدیر'}</span> 👋
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400 bg-white px-4 py-2 rounded-lg shadow-sm">
          <FaRegClock />
          {new Date().toLocaleDateString('fa-IR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <Link
            key={index}
            to={card.path}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-5 border border-gray-100 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-gray-500 text-sm font-medium">{card.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2 group-hover:text-teal-600 transition-colors">
                  {card.count.toLocaleString('fa-IR')}
                </p>
                <div className="flex items-center gap-3 mt-3 text-xs">
                  <span className="flex items-center gap-1 text-green-600">
                    <FaCheckCircle className="text-xs" />
                    {card.published !== undefined ? `${card.published.toLocaleString('fa-IR')} منتشر` : `${card.active.toLocaleString('fa-IR')} فعال`}
                  </span>
                  <span className="flex items-center gap-1 text-red-500">
                    <FaTimesCircle className="text-xs" />
                    {card.unpublished !== undefined ? `${card.unpublished.toLocaleString('fa-IR')} پیش‌نویس` : `${card.inactive.toLocaleString('fa-IR')} غیرفعال`}
                  </span>
                </div>
              </div>
              <div className={`${card.color} p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaPlus className="text-teal-600" />
          دسترسی سریع
        </h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className={`${action.color} text-white px-5 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md text-sm font-medium`}
            >
              <action.icon className="w-4 h-4" />
              {action.title}
            </Link>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Bar Chart - Products by Brand */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 lg:col-span-2">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaChartLine className="text-blue-600" />
            محصولات بر اساس برند
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [value, 'تعداد محصول']}
                />
                <Bar dataKey="value" fill="#0d9488" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Products by Category */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FaLayerGroup className="text-green-600" />
            محصولات بر اساس دسته‌بندی
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {categoryChartData.map((entry, index) => (
              <span key={index} className="flex items-center gap-1 text-xs text-gray-600">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaChartLine className="text-purple-600" />
          روند ماهانه ثبت محصول و کاربر
        </h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <Line type="monotone" dataKey="products" stroke="#0d9488" strokeWidth={2} dot={{ fill: '#0d9488' }} name="محصولات" />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} name="کاربران" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Recent Products */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FaBox className="text-purple-600" />
              آخرین محصولات
            </h2>
            <Link to="/dashboard/product" className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1 hover:underline">
              <FaEye />
              مشاهده همه
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="text-right py-3 px-3 rounded-tr-lg">محصول</th>
                  <th className="text-right py-3 px-3">قیمت</th>
                  <th className="text-right py-3 px-3">امتیاز</th>
                  <th className="text-right py-3 px-3">وضعیت</th>
                  <th className="text-right py-3 px-3 rounded-tl-lg">تاریخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">{product.title}</span>
                        <span className="text-xs text-gray-400">{product.brandId?.title} / {product.categoryId?.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-600 font-mono text-xs">
                      {formatPrice(product.minPrice)} - {formatPrice(product.maxPrice)} تومان
                    </td>
                    <td className="py-3 px-3">
                      <span className="flex items-center gap-1 text-amber-500 text-xs">
                        <FaStar />
                        {product.avgRating || 0}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${product.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {product.isPublished ? 'منتشر' : 'پیش‌نویس'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-400 text-xs">{formatDate(product.createdAt)}</td>
                  </tr>
                ))}
                {recentProducts.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-400">
                      محصولی یافت نشد
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FaUsers className="text-orange-600" />
              آخرین کاربران
            </h2>
            <Link to="/dashboard/user" className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1 hover:underline">
              <FaEye />
              مشاهده همه
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-600">
                  <th className="text-right py-3 px-3 rounded-tr-lg">کاربر</th>
                  <th className="text-right py-3 px-3">موبایل</th>
                  <th className="text-right py-3 px-3">نقش</th>
                  <th className="text-right py-3 px-3">وضعیت</th>
                  <th className="text-right py-3 px-3 rounded-tl-lg">تاریخ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentUsers.map((user) => {
                  const roleBadge = getRoleBadge(user.role);
                  return (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xs">
                            {user.fullName?.charAt(0) || '؟'}
                          </div>
                          <span className="font-medium text-gray-800">{user.fullName || 'بدون نام'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-500 text-xs font-mono">{user.phoneNumber}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${roleBadge.style}`}>
                          {roleBadge.label}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`flex items-center gap-1 text-xs ${user.isActive ? 'text-green-600' : 'text-red-500'}`}>
                          {user.isActive ? <FaCheckCircle /> : <FaTimesCircle />}
                          {user.isActive ? 'فعال' : 'غیرفعال'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-400 text-xs">{formatDate(user.createdAt)}</td>
                    </tr>
                  );
                })}
                {recentUsers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-400">
                      کاربری یافت نشد
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm">میانگین امتیاز محصولات</p>
              <p className="text-2xl font-bold mt-1 flex items-center gap-2">
                <FaStar />
                {stats.products.avgRating}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaStar className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">کل خریدها</p>
              <p className="text-2xl font-bold mt-1 flex items-center gap-2">
                <FaShoppingCart />
                {stats.products.totalBought.toLocaleString('fa-IR')}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaShoppingCart className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">مدیران سیستم</p>
              <p className="text-2xl font-bold mt-1 flex items-center gap-2">
                <FaUsers />
                {stats.users.admins.toLocaleString('fa-IR')}
              </p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <FaUsers className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;