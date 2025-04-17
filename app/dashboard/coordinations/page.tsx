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
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Eye,
  Calendar as CalendarIcon
} from "lucide-react";
import { ClientDateTime } from "@/components/ui/client-date";
import { formatTableDate } from "@/lib/utils/date-formatter";

// Mock data for demonstration
const coordinations = [
  { 
    id: 1001, 
    requestNumber: "C-2025-0423-001", 
    requestTime: new Date("2025-04-23T09:15:00"), 
    approvalTime: new Date("2025-04-23T10:30:00"),
    movementTime: new Date("2025-04-23T13:00:00"),
    returnTime: "18:00",
    fromLocation: "نابلس", 
    toLocation: "رام الله", 
    department: "الشرطة",
    forces: 5,
    weapons: 3,
    purpose: "نقل معدات أمنية",
    governorate: "نابلس",
    status: "منجز",
    createdBy: "محمد علي"
  },
  { 
    id: 1002, 
    requestNumber: "C-2025-0423-002", 
    requestTime: new Date("2025-04-23T11:40:00"), 
    approvalTime: null,
    movementTime: null,
    returnTime: "17:00",
    fromLocation: "الخليل", 
    toLocation: "بيت لحم", 
    department: "المخابرات",
    forces: 8,
    weapons: 6,
    purpose: "مهمة أمنية",
    governorate: "الخليل",
    status: "قيد الانتظار",
    createdBy: "أحمد محمود"
  },
  { 
    id: 1003, 
    requestNumber: "C-2025-0422-001", 
    requestTime: new Date("2025-04-22T08:20:00"), 
    approvalTime: new Date("2025-04-22T09:15:00"),
    movementTime: new Date("2025-04-22T10:30:00"),
    returnTime: "16:00",
    fromLocation: "جنين", 
    toLocation: "طوباس", 
    department: "الأمن الوقائي",
    forces: 4,
    weapons: 2,
    purpose: "تفتيش دوري",
    governorate: "جنين",
    status: "منجز",
    createdBy: "سارة أحمد"
  },
  { 
    id: 1004, 
    requestNumber: "C-2025-0422-002", 
    requestTime: new Date("2025-04-22T13:10:00"), 
    approvalTime: null,
    movementTime: null,
    returnTime: "21:30",
    fromLocation: "رام الله", 
    toLocation: "القدس", 
    department: "الشرطة",
    forces: 10,
    weapons: 8,
    purpose: "تأمين فعالية",
    governorate: "رام الله",
    status: "مرفوض",
    rejectionReason: "الوضع الأمني الحالي",
    createdBy: "أحمد محمود"
  },
  { 
    id: 1005, 
    requestNumber: "C-2025-0421-001", 
    requestTime: new Date("2025-04-21T07:45:00"), 
    approvalTime: new Date("2025-04-21T08:50:00"),
    movementTime: new Date("2025-04-21T10:00:00"),
    returnTime: "16:30",
    fromLocation: "طولكرم", 
    toLocation: "قلقيلية", 
    department: "الأمن الوطني",
    forces: 6,
    weapons: 4,
    purpose: "نقل معتقلين",
    governorate: "طولكرم",
    status: "منجز",
    createdBy: "محمد علي"
  },
  { 
    id: 1006, 
    requestNumber: "C-2025-0421-002", 
    requestTime: new Date("2025-04-21T12:30:00"), 
    approvalTime: new Date("2025-04-21T13:45:00"),
    movementTime: null,
    returnTime: "20:00",
    fromLocation: "بيت لحم", 
    toLocation: "الخليل", 
    department: "المخابرات",
    forces: 4,
    weapons: 4,
    purpose: "مهمة خاصة",
    governorate: "بيت لحم",
    status: "ملغي",
    createdBy: "سارة أحمد"
  },
];

// Department options
const departments = ["الشرطة", "المخابرات", "الأمن الوقائي", "الأمن الوطني", "قوات الأمن"];

// Create a mapping for status to styling
const statusMap: Record<string, { color: string, icon: React.ReactNode }> = {
  "منجز": { color: "bg-green-100 text-green-800", icon: <CheckCircle size={12} className="ml-1" /> },
  "قيد الانتظار": { color: "bg-amber-100 text-amber-800", icon: <Clock size={12} className="ml-1" /> },
  "مرفوض": { color: "bg-red-100 text-red-800", icon: <XCircle size={12} className="ml-1" /> },
  "ملغي": { color: "bg-slate-100 text-slate-800", icon: <XCircle size={12} className="ml-1" /> },
};

export default function CoordinationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({
    department: "",
    status: "",
    governorate: "",
    startDate: "",
    endDate: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const itemsPerPage = 10;
  
  // Date filtering helper function using our formatTableDate utility
  const isDateInRange = (date: Date, startDate: string, endDate: string): boolean => {
    if (!startDate && !endDate) return true;
    
    const dateStr = formatTableDate(date);
    
    if (startDate && !endDate) {
      return dateStr >= startDate;
    }
    
    if (!startDate && endDate) {
      return dateStr <= endDate;
    }
    
    return dateStr >= startDate && dateStr <= endDate;
  };

  // Filter coordinations based on search and filters
  const filteredCoordinations = coordinations.filter((coordination) => {
    const matchesSearch = 
      searchQuery === "" ||
      coordination.requestNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coordination.fromLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coordination.toLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coordination.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coordination.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coordination.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesDepartment = selectedFilters.department === "" || coordination.department === selectedFilters.department;
    const matchesStatus = selectedFilters.status === "" || coordination.status === selectedFilters.status;
    const matchesGovernorate = selectedFilters.governorate === "" || coordination.governorate === selectedFilters.governorate;
    const matchesDateRange = isDateInRange(
      coordination.requestTime, 
      selectedFilters.startDate, 
      selectedFilters.endDate
    );
    
    return matchesSearch && matchesDepartment && matchesStatus && matchesGovernorate && matchesDateRange;
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredCoordinations.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCoordinations.slice(indexOfFirstItem, indexOfLastItem);
  
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
      department: "",
      status: "",
      governorate: "",
      startDate: "",
      endDate: "",
    });
    setCurrentPage(1);
  };

  // No need for this helper since ClientDateTime components handle null values internally

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <CalendarIcon className="ml-2" size={24} />
          التنسيقات
        </h1>
        <Link
          href="/dashboard/coordinations/new"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md flex items-center text-sm"
        >
          <Plus size={16} className="ml-2" />
          إنشاء طلب تنسيق
        </Link>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="bg-card rounded-lg shadow-sm border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث عن التنسيقات..."
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
              <label className="block text-sm font-medium mb-1">الجهة/الجهاز</label>
              <select
                className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                value={selectedFilters.department}
                onChange={(e) => handleFilterChange("department", e.target.value)}
              >
                <option value="">الكل</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
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
                <option value="منجز">منجز</option>
                <option value="قيد الانتظار">قيد الانتظار</option>
                <option value="مرفوض">مرفوض</option>
                <option value="ملغي">ملغي</option>
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
                <option value="رام الله">رام الله</option>
                <option value="نابلس">نابلس</option>
                <option value="الخليل">الخليل</option>
                <option value="القدس">القدس</option>
                <option value="جنين">جنين</option>
                <option value="طولكرم">طولكرم</option>
                <option value="بيت لحم">بيت لحم</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">من تاريخ</label>
              <div className="relative">
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                  type="date"
                  className="w-full pl-10 pr-9 py-2 text-sm border rounded-md bg-background"
                  value={selectedFilters.startDate}
                  onChange={(e) => handleFilterChange("startDate", e.target.value)}
                  // When displaying selected date, format it consistently
                  placeholder={selectedFilters.startDate ? formatTableDate(new Date(selectedFilters.startDate)) : ""}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">إلى تاريخ</label>
              <div className="relative">
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  className="w-full pl-10 pr-9 py-2 text-sm border rounded-md bg-background"
                  value={selectedFilters.endDate}
                  onChange={(e) => handleFilterChange("endDate", e.target.value)}
                  placeholder={selectedFilters.endDate ? formatTableDate(new Date(selectedFilters.endDate)) : ""}
                />
              </div>
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
                <th className="text-right p-3">رقم الطلب</th>
                <th className="text-right p-3">وقت الطلب</th>
                <th className="text-right p-3">الجهة</th>
                <th className="text-right p-3">من/إلى</th>
                <th className="text-right p-3">الغرض</th>
                <th className="text-right p-3">القوات</th>
                <th className="text-right p-3">الحالة</th>
                <th className="text-right p-3">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((coordination) => (
                  <tr key={coordination.id} className="border-b hover:bg-muted/50 text-sm">
                    <td className="p-3" dir="ltr">
                      <Link href={`/dashboard/coordinations/${coordination.id}`} className="text-primary hover:underline">
                        {coordination.requestNumber}
                      </Link>
                    </td>
                    <td className="p-3" dir="ltr">
                      <ClientDateTime date={coordination.requestTime} format="medium" />
                    </td>
                    <td className="p-3">{coordination.department}</td>
                    <td className="p-3">
                      <div>
                        <div className="text-xs text-muted-foreground">من: {coordination.fromLocation}</div>
                        <div>إلى: {coordination.toLocation}</div>
                      </div>
                    </td>
                    <td className="p-3">{coordination.purpose}</td>
                    <td className="p-3">
                      <div>
                        <div>أفراد: {coordination.forces}</div>
                        <div className="text-xs text-muted-foreground">أسلحة: {coordination.weapons}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusMap[coordination.status]?.color}`}>
                        {statusMap[coordination.status]?.icon} {coordination.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Link
                          href={`/dashboard/coordinations/${coordination.id}`}
                          className="text-primary hover:underline text-xs flex items-center"
                        >
                          <Eye size={12} className="ml-1" /> عرض
                        </Link>
                        
                        {/* Show respond button only for pending coordinations */}
                        {coordination.status === "قيد الانتظار" && (
                          <Link
                            href={`/dashboard/coordinations/${coordination.id}/respond`}
                            className="text-blue-600 hover:underline text-xs mr-2 flex items-center"
                          >
                            <MessageSquare size={12} className="ml-1" /> رد
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-muted-foreground">
                    لا توجد تنسيقات مطابقة للبحث
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
            {`عرض ${indexOfFirstItem + 1} - ${Math.min(indexOfLastItem, filteredCoordinations.length)} من ${filteredCoordinations.length} تنسيق`}
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
