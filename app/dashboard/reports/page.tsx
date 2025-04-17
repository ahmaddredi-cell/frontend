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
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Download
} from "lucide-react";

// Mock data for demonstration
const reports = [
  { id: 1, reportNumber: "R-2025-0423", type: "صباحي", date: "23/04/2025", status: "مكتمل", events: 8, createdBy: "أحمد محمود" },
  { id: 2, reportNumber: "R-2025-0422", type: "مسائي", date: "22/04/2025", status: "مكتمل", events: 5, createdBy: "محمد علي" },
  { id: 3, reportNumber: "R-2025-0422", type: "صباحي", date: "22/04/2025", status: "مكتمل", events: 6, createdBy: "أحمد محمود" },
  { id: 4, reportNumber: "R-2025-0421", type: "مسائي", date: "21/04/2025", status: "مكتمل", events: 3, createdBy: "سارة أحمد" },
  { id: 5, reportNumber: "R-2025-0421", type: "صباحي", date: "21/04/2025", status: "مكتمل", events: 7, createdBy: "محمد علي" },
  { id: 6, reportNumber: "R-2025-0420", type: "مسائي", date: "20/04/2025", status: "مكتمل", events: 4, createdBy: "أحمد محمود" },
  { id: 7, reportNumber: "R-2025-0420", type: "صباحي", date: "20/04/2025", status: "مكتمل", events: 5, createdBy: "سارة أحمد" },
  { id: 8, reportNumber: "R-2025-0419", type: "مسائي", date: "19/04/2025", status: "مكتمل", events: 3, createdBy: "محمد علي" },
  { id: 9, reportNumber: "R-2025-0419", type: "صباحي", date: "19/04/2025", status: "مسودة", events: 2, createdBy: "أحمد محمود" },
  { id: 10, reportNumber: "R-2025-0418", type: "مسائي", date: "18/04/2025", status: "قيد المراجعة", events: 9, createdBy: "سارة أحمد" },
];

// Create a mapping for status to styling
const statusMap: Record<string, { color: string, icon: React.ReactNode }> = {
  "مكتمل": { color: "bg-green-100 text-green-800", icon: <CheckCircle size={12} className="ml-1" /> },
  "مسودة": { color: "bg-slate-100 text-slate-800", icon: <Clock size={12} className="ml-1" /> },
  "قيد المراجعة": { color: "bg-amber-100 text-amber-800", icon: <Clock size={12} className="ml-1" /> },
  "ملغي": { color: "bg-red-100 text-red-800", icon: <XCircle size={12} className="ml-1" /> },
};

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({
    type: "",
    status: "",
    startDate: "",
    endDate: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const itemsPerPage = 10;
  
  // Filter reports based on search and filters
  const filteredReports = reports.filter((report) => {
    const matchesSearch = 
      searchQuery === "" ||
      report.reportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesType = selectedFilters.type === "" || report.type === selectedFilters.type;
    const matchesStatus = selectedFilters.status === "" || report.status === selectedFilters.status;
    
    return matchesSearch && matchesType && matchesStatus;
  });
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  
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
      type: "",
      status: "",
      startDate: "",
      endDate: "",
    });
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <FileText className="ml-2" size={24} />
          التقارير اليومية
        </h1>
        <Link
          href="/dashboard/reports/new"
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md flex items-center text-sm"
        >
          <Plus size={16} className="ml-2" />
          إنشاء تقرير جديد
        </Link>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="bg-card rounded-lg shadow-sm border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث عن التقارير..."
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
          <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4 border-t pt-4">
            <div>
              <label className="block text-sm font-medium mb-1">نوع التقرير</label>
              <select
                className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                value={selectedFilters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
              >
                <option value="">الكل</option>
                <option value="صباحي">صباحي</option>
                <option value="مسائي">مسائي</option>
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
                <option value="مكتمل">مكتمل</option>
                <option value="مسودة">مسودة</option>
                <option value="قيد المراجعة">قيد المراجعة</option>
                <option value="ملغي">ملغي</option>
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
            <div className="md:col-span-4 flex justify-end">
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
                <th className="text-right p-3">رقم التقرير</th>
                <th className="text-right p-3">النوع</th>
                <th className="text-right p-3">التاريخ</th>
                <th className="text-right p-3">الحالة</th>
                <th className="text-right p-3">الأحداث</th>
                <th className="text-right p-3">بواسطة</th>
                <th className="text-right p-3">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((report) => (
                  <tr key={report.id} className="border-b hover:bg-muted/50 text-sm">
                    <td className="p-3" dir="ltr">
                      <Link href={`/dashboard/reports/${report.id}`} className="text-primary hover:underline">
                        {report.reportNumber}
                      </Link>
                    </td>
                    <td className="p-3">{report.type}</td>
                    <td className="p-3" dir="ltr">{report.date}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusMap[report.status]?.color}`}>
                        {statusMap[report.status]?.icon} {report.status}
                      </span>
                    </td>
                    <td className="p-3">{report.events}</td>
                    <td className="p-3">{report.createdBy}</td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Link
                          href={`/dashboard/reports/${report.id}`}
                          className="text-primary hover:underline text-xs"
                        >
                          عرض
                        </Link>
                        <Link
                          href={`/dashboard/reports/${report.id}/edit`}
                          className="text-blue-600 hover:underline text-xs mr-2"
                        >
                          تعديل
                        </Link>
                        <Link
                          href={`/dashboard/reports/${report.id}/print`}
                          className="text-green-600 hover:underline text-xs mr-2 flex items-center"
                        >
                          <Download size={12} className="ml-1" /> تصدير
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-muted-foreground">
                    لا توجد تقارير مطابقة للبحث
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
            {`عرض ${indexOfFirstItem + 1} - ${Math.min(indexOfLastItem, filteredReports.length)} من ${filteredReports.length} تقرير`}
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
