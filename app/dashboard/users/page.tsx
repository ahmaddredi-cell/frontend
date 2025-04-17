"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Plus, 
  Search,
  User,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  CheckCircle,
  XCircle,
  UserCog,
  EyeIcon
} from "lucide-react";

// Mock data for demonstration
const users = [
  { 
    id: 1, 
    username: "admin", 
    fullName: "أحمد محمود", 
    role: "مدير",
    email: "admin@example.com",
    governorate: "المقر العام", 
    lastLogin: new Date("2025-04-23T10:30:00"),
    status: "نشط",
    permissions: ["إدارة المستخدمين", "إدارة الإعدادات", "إنشاء التقارير", "إدارة التنسيقات"]
  },
  { 
    id: 2, 
    username: "sarah", 
    fullName: "سارة أحمد", 
    role: "مدخل بيانات",
    email: "sarah@example.com",
    governorate: "رام الله", 
    lastLogin: new Date("2025-04-23T09:15:00"),
    status: "نشط",
    permissions: ["إنشاء التقارير", "إدارة الأحداث"]
  },
  { 
    id: 3, 
    username: "mohammed", 
    fullName: "محمد علي", 
    role: "مراجع",
    email: "mohammed@example.com",
    governorate: "نابلس", 
    lastLogin: new Date("2025-04-22T14:45:00"),
    status: "نشط",
    permissions: ["مراجعة التقارير", "إدارة التنسيقات"]
  },
  { 
    id: 4, 
    username: "layla", 
    fullName: "ليلى سعيد", 
    role: "مدخل بيانات",
    email: "layla@example.com",
    governorate: "الخليل", 
    lastLogin: new Date("2025-04-21T11:20:00"),
    status: "غير نشط",
    permissions: ["إنشاء التقارير", "إدارة الأحداث"]
  },
  { 
    id: 5, 
    username: "khaled", 
    fullName: "خالد محمد", 
    role: "مراجع",
    email: "khaled@example.com",
    governorate: "القدس", 
    lastLogin: new Date("2025-04-20T08:30:00"),
    status: "نشط",
    permissions: ["مراجعة التقارير", "إدارة التنسيقات"]
  },
];

// User roles
const roles = ["مدير", "مراجع", "مدخل بيانات"];

// Governorates
const governorates = ["المقر العام", "رام الله", "نابلس", "الخليل", "القدس", "جنين", "بيت لحم", "طولكرم"];

// Status map for styling
const statusMap: Record<string, { color: string, icon: React.ReactNode }> = {
  "نشط": { color: "bg-green-100 text-green-800", icon: <CheckCircle size={12} className="ml-1" /> },
  "غير نشط": { color: "bg-red-100 text-red-800", icon: <XCircle size={12} className="ml-1" /> },
};

// Role map for styling
const roleMap: Record<string, { color: string }> = {
  "مدير": { color: "bg-blue-100 text-blue-800" },
  "مراجع": { color: "bg-purple-100 text-purple-800" },
  "مدخل بيانات": { color: "bg-amber-100 text-amber-800" },
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({
    role: "",
    status: "",
    governorate: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  
  const itemsPerPage = 10;
  
  // Filter users based on search and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      searchQuery === "" ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.governorate.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesRole = selectedFilters.role === "" || user.role === selectedFilters.role;
    const matchesStatus = selectedFilters.status === "" || user.status === selectedFilters.status;
    const matchesGovernorate = selectedFilters.governorate === "" || user.governorate === selectedFilters.governorate;
    
    return matchesSearch && matchesRole && matchesStatus && matchesGovernorate;
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  const handleFilterChange = (key: string, value: string) => {
    setSelectedFilters({
      ...selectedFilters,
      [key]: value,
    });
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  const handleFilterReset = () => {
    setSelectedFilters({
      role: "",
      status: "",
      governorate: "",
    });
    setCurrentPage(1);
  };
  
  const handleDeleteClick = (userId: number) => {
    setShowDeleteConfirm(userId);
  };
  
  const handleDelete = (userId: number) => {
    // In a real app, this would call an API to delete the user
    console.log(`Deleting user ${userId}`);
    setShowDeleteConfirm(null);
  };
  
  const handleCancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  // Format date for display
  const formatDateTime = (date: Date) => {
    return date.toLocaleString('ar-EG', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <UserCog className="ml-2" size={24} />
          إدارة المستخدمين
        </h1>
        <Link
          href="/dashboard/users/new"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md flex items-center text-sm"
        >
          <UserPlus size={16} className="ml-2" />
          إضافة مستخدم جديد
        </Link>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="bg-card rounded-lg shadow-sm border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث عن المستخدمين..."
              className="w-full pl-10 pr-9 py-2 text-sm border rounded-md bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="bg-muted text-muted-foreground hover:bg-muted/80 px-4 py-2 rounded-md flex items-center justify-center text-sm md:w-auto"
            onClick={handleFilterToggle}
          >
            <Filter size={16} className="ml-2" />
            {isFilterOpen ? "إغلاق الفلتر" : "فلتر متقدم"}
          </button>
        </div>
        
        {isFilterOpen && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
            <div>
              <label className="block text-sm font-medium mb-1">الدور</label>
              <select
                className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                value={selectedFilters.role}
                onChange={(e) => handleFilterChange("role", e.target.value)}
              >
                <option value="">الكل</option>
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">الحالة</label>
              <select
                className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                value={selectedFilters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="">الكل</option>
                <option value="نشط">نشط</option>
                <option value="غير نشط">غير نشط</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">المحافظة</label>
              <select
                className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                value={selectedFilters.governorate}
                onChange={(e) => handleFilterChange("governorate", e.target.value)}
              >
                <option value="">الكل</option>
                {governorates.map((gov) => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3 flex justify-end">
              <button
                className="bg-muted text-muted-foreground hover:bg-muted/80 px-4 py-2 rounded-md text-sm ml-2"
                onClick={handleFilterReset}
              >
                إعادة ضبط
              </button>
              <button
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm"
                onClick={() => setIsFilterOpen(false)}
              >
                تطبيق الفلتر
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Results Table */}
      <div className="bg-card rounded-lg shadow-sm border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-muted-foreground border-b">
                <th className="text-right p-3">اسم المستخدم</th>
                <th className="text-right p-3">الاسم الكامل</th>
                <th className="text-right p-3">الدور</th>
                <th className="text-right p-3">البريد الإلكتروني</th>
                <th className="text-right p-3">المحافظة</th>
                <th className="text-right p-3">آخر تسجيل دخول</th>
                <th className="text-right p-3">الحالة</th>
                <th className="text-right p-3">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50 text-sm">
                    <td className="p-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold ml-2">
                          {user.fullName.split(' ').map(name => name[0]).join('')}
                        </div>
                        <span>{user.username}</span>
                      </div>
                    </td>
                    <td className="p-3">{user.fullName}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleMap[user.role]?.color}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3" dir="ltr">{user.email}</td>
                    <td className="p-3">{user.governorate}</td>
                    <td className="p-3" dir="ltr">{formatDateTime(user.lastLogin)}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusMap[user.status]?.color}`}>
                        {statusMap[user.status]?.icon} {user.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Link
                          href={`/dashboard/users/${user.id}`}
                          className="text-primary hover:underline text-xs flex items-center"
                        >
                          <EyeIcon size={12} className="ml-1" /> عرض
                        </Link>
                        <Link
                          href={`/dashboard/users/${user.id}/edit`}
                          className="text-blue-600 hover:underline text-xs mr-2 flex items-center"
                        >
                          <Edit size={12} className="ml-1" /> تعديل
                        </Link>
                        {showDeleteConfirm === user.id ? (
                          <div className="flex items-center">
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="text-red-600 hover:underline text-xs mr-2"
                            >
                              تأكيد
                            </button>
                            <button
                              onClick={handleCancelDelete}
                              className="text-slate-600 hover:underline text-xs"
                            >
                              إلغاء
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDeleteClick(user.id)}
                            className="text-red-600 hover:underline text-xs mr-2 flex items-center"
                          >
                            <Trash2 size={12} className="ml-1" /> حذف
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-muted-foreground">
                    لا يوجد مستخدمين مطابقين للبحث
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {`عرض ${indexOfFirstItem + 1} - ${Math.min(indexOfLastItem, filteredUsers.length)} من ${filteredUsers.length} مستخدم`}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-md border disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded-md ${
                  currentPage === i + 1
                    ? "bg-primary text-primary-foreground"
                    : "border hover:bg-muted"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-md border disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
