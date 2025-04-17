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
  Shield,
  CheckCircle,
  Clock,
  AlertTriangle,
  MapPin,
  Eye
} from "lucide-react";

// Mock data for demonstration
const events = [
  { 
    id: 1, 
    eventNumber: "E-2025-0423-001", 
    eventType: "اعتقال", 
    date: "23/04/2025", 
    time: "08:15", 
    governorate: "نابلس", 
    region: "بلاطة", 
    status: "منتهي", 
    severity: "متوسط",
    createdBy: "محمد علي"
  },
  { 
    id: 2, 
    eventNumber: "E-2025-0423-002", 
    eventType: "حاجز عسكري", 
    date: "23/04/2025", 
    time: "10:30", 
    governorate: "رام الله", 
    region: "المنارة", 
    status: "قيد المتابعة", 
    severity: "عالي",
    createdBy: "أحمد محمود"
  },
  { 
    id: 3, 
    eventNumber: "E-2025-0422-001", 
    eventType: "مداهمة", 
    date: "22/04/2025", 
    time: "02:40", 
    governorate: "الخليل", 
    region: "وسط المدينة", 
    status: "منتهي", 
    severity: "عالي",
    createdBy: "سارة أحمد"
  },
  { 
    id: 4, 
    eventNumber: "E-2025-0422-002", 
    eventType: "إطلاق نار", 
    date: "22/04/2025", 
    time: "14:25", 
    governorate: "جنين", 
    region: "مخيم جنين", 
    status: "منتهي", 
    severity: "حرج",
    createdBy: "أحمد محمود"
  },
  { 
    id: 5, 
    eventNumber: "E-2025-0421-001", 
    eventType: "مستوطنون", 
    date: "21/04/2025", 
    time: "19:10", 
    governorate: "نابلس", 
    region: "حوارة", 
    status: "منتهي", 
    severity: "عالي",
    createdBy: "محمد علي"
  },
  { 
    id: 6, 
    eventNumber: "E-2025-0421-002", 
    eventType: "اقتحام مسجد", 
    date: "21/04/2025", 
    time: "05:30", 
    governorate: "القدس", 
    region: "المسجد الأقصى", 
    status: "قيد المتابعة", 
    severity: "حرج",
    createdBy: "سارة أحمد"
  },
  { 
    id: 7, 
    eventNumber: "E-2025-0420-001", 
    eventType: "حاجز طيار", 
    date: "20/04/2025", 
    time: "11:45", 
    governorate: "طولكرم", 
    region: "الشويكة", 
    status: "منتهي", 
    severity: "متوسط",
    createdBy: "أحمد محمود"
  },
  { 
    id: 8, 
    eventNumber: "E-2025-0420-002", 
    eventType: "مظاهرة", 
    date: "20/04/2025", 
    time: "13:20", 
    governorate: "بيت لحم", 
    region: "بيت جالا", 
    status: "جاري التحقق", 
    severity: "منخفض",
    createdBy: "محمد علي"
  },
];

// Event type options
const eventTypes = [
  "اعتقال", "حاجز عسكري", "مداهمة", "إطلاق نار", "مستوطنون", "اقتحام مسجد", "حاجز طيار", "مظاهرة"
];

// Create a mapping for status and severity to styling
const statusMap: Record<string, { color: string, icon: React.ReactNode }> = {
  "منتهي": { color: "bg-green-100 text-green-800", icon: <CheckCircle size={12} className="ml-1" /> },
  "قيد المتابعة": { color: "bg-amber-100 text-amber-800", icon: <Clock size={12} className="ml-1" /> },
  "جاري التحقق": { color: "bg-blue-100 text-blue-800", icon: <Clock size={12} className="ml-1" /> },
};

const severityMap: Record<string, { color: string }> = {
  "منخفض": { color: "bg-slate-100 text-slate-800" },
  "متوسط": { color: "bg-yellow-100 text-yellow-800" },
  "عالي": { color: "bg-orange-100 text-orange-800" },
  "حرج": { color: "bg-red-100 text-red-800" },
};

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({
    eventType: "",
    status: "",
    severity: "",
    governorate: "",
    startDate: "",
    endDate: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const itemsPerPage = 10;
  
  // Filter events based on search and filters
  const filteredEvents = events.filter((event) => {
    const matchesSearch = 
      searchQuery === "" ||
      event.eventNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.governorate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesEventType = selectedFilters.eventType === "" || event.eventType === selectedFilters.eventType;
    const matchesStatus = selectedFilters.status === "" || event.status === selectedFilters.status;
    const matchesSeverity = selectedFilters.severity === "" || event.severity === selectedFilters.severity;
    const matchesGovernorate = selectedFilters.governorate === "" || event.governorate === selectedFilters.governorate;
    
    return matchesSearch && matchesEventType && matchesStatus && matchesSeverity && matchesGovernorate;
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEvents.slice(indexOfFirstItem, indexOfLastItem);
  
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
      eventType: "",
      status: "",
      severity: "",
      governorate: "",
      startDate: "",
      endDate: "",
    });
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <Shield className="ml-2" size={24} />
          الأحداث الأمنية
        </h1>
        <Link
          href="/dashboard/events/new"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md flex items-center text-sm"
        >
          <Plus size={16} className="ml-2" />
          إضافة حدث جديد
        </Link>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="bg-card rounded-lg shadow-sm border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث عن الأحداث..."
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
              <label className="block text-sm font-medium mb-1">نوع الحدث</label>
              <select
                className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                value={selectedFilters.eventType}
                onChange={(e) => handleFilterChange("eventType", e.target.value)}
              >
                <option value="">الكل</option>
                {eventTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
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
                <option value="منتهي">منتهي</option>
                <option value="قيد المتابعة">قيد المتابعة</option>
                <option value="جاري التحقق">جاري التحقق</option>
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
              <label className="block text-sm font-medium mb-1">مستوى الخطورة</label>
              <select
                className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                value={selectedFilters.severity}
                onChange={(e) => handleFilterChange("severity", e.target.value)}
              >
                <option value="">الكل</option>
                <option value="منخفض">منخفض</option>
                <option value="متوسط">متوسط</option>
                <option value="عالي">عالي</option>
                <option value="حرج">حرج</option>
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
                <th className="text-right p-3">رقم الحدث</th>
                <th className="text-right p-3">النوع</th>
                <th className="text-right p-3">التاريخ</th>
                <th className="text-right p-3">الوقت</th>
                <th className="text-right p-3">المكان</th>
                <th className="text-right p-3">الحالة</th>
                <th className="text-right p-3">الخطورة</th>
                <th className="text-right p-3">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((event) => (
                  <tr key={event.id} className="border-b hover:bg-muted/50 text-sm">
                    <td className="p-3" dir="ltr">
                      <Link href={`/dashboard/events/${event.id}`} className="text-primary hover:underline">
                        {event.eventNumber}
                      </Link>
                    </td>
                    <td className="p-3">{event.eventType}</td>
                    <td className="p-3" dir="ltr">{event.date}</td>
                    <td className="p-3" dir="ltr">{event.time}</td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <MapPin size={12} className="ml-1 text-muted-foreground" />
                        <span>{event.governorate} - {event.region}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusMap[event.status]?.color}`}>
                        {statusMap[event.status]?.icon} {event.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${severityMap[event.severity]?.color}`}>
                        {event.severity === "حرج" && <AlertTriangle size={12} className="ml-1" />}
                        {event.severity}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Link
                          href={`/dashboard/events/${event.id}`}
                          className="text-primary hover:underline text-xs flex items-center"
                        >
                          <Eye size={12} className="ml-1" /> عرض
                        </Link>
                        <Link
                          href={`/dashboard/events/${event.id}/edit`}
                          className="text-blue-600 hover:underline text-xs mr-2"
                        >
                          تعديل
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-muted-foreground">
                    لا توجد أحداث مطابقة للبحث
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
            {`عرض ${indexOfFirstItem + 1} - ${Math.min(indexOfLastItem, filteredEvents.length)} من ${filteredEvents.length} حدث`}
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
