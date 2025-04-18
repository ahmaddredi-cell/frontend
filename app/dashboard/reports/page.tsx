"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, ChevronLeft, ChevronRight, Filter, Plus, Search, FileText, CheckCircle, Clock, XCircle, Download, Loader2 } from "lucide-react";
import { reportsService } from "@/lib/api";
import notifications from "@/lib/utils/notifications";

// Interface for reports data
interface Report {
  id: string;
  reportNumber: string;
  reportType: "morning" | "evening";
  reportDate: string;
  status: string;
  createdBy: {
    fullName: string;
  };
  eventCount?: number;
}

// Create a mapping for status to styling and localized status names
const statusMap: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  complete: { color: "bg-green-100 text-green-800", icon: <CheckCircle size={12} className="ml-1" />, label: "مكتمل" },
  draft: { color: "bg-slate-100 text-slate-800", icon: <Clock size={12} className="ml-1" />, label: "مسودة" },
  approved: { color: "bg-amber-100 text-amber-800", icon: <CheckCircle size={12} className="ml-1" />, label: "معتمد" },
  archived: { color: "bg-red-100 text-red-800", icon: <XCircle size={12} className="ml-1" />, label: "مؤرشف" },
};

// Map report type to Arabic labels
const reportTypeMap: Record<string, string> = {
  morning: "صباحي",
  evening: "مسائي",
};

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({
    reportType: "",
    status: "",
    startDate: "",
    endDate: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const itemsPerPage = 10;

  // Fetch reports on component mount and when filters change
  useEffect(() => {
    fetchReports();
  }, [currentPage, selectedFilters]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      // Prepare filters for API
      const apiFilters = {
        page: currentPage,
        limit: itemsPerPage,
        ...selectedFilters,
      };

      // Remove empty filters
      Object.keys(apiFilters).forEach((key) => {
        if (!apiFilters[key as keyof typeof apiFilters]) {
          delete apiFilters[key as keyof typeof apiFilters];
        }
      });

      const response = await reportsService.getReports(apiFilters);

      if (response.success && response.data) {
        // Format the data to match our Report interface - handle both formats
        // Backend returns { data: reports } or { data: { reports, total, pagination } }
        const reportsData = response.data?.reports || response.data || [];
        const formattedReports = reportsData.map((report: any) => ({
          id: report._id || report.id,
          reportNumber: report.reportNumber,
          reportType: report.reportType,
          reportDate: new Date(report.reportDate).toLocaleDateString("ar-EG"),
          status: report.status,
          createdBy: report.createdBy || { fullName: "غير معروف" },
          eventCount: report.eventCount || 0,
        }));

        setReports(formattedReports);

        // Since the API response might not match the TypeScript type exactly,
        // we need to handle all possible response formats
        const responseData = response.data as any; // Type assertion to handle various formats

        // Handle pagination data based on the response structure
        if (responseData.total) {
          // Format with total directly in the response
          setTotalReports(responseData.total);
          setTotalPages(responseData.totalPages || Math.ceil(responseData.total / itemsPerPage));
        } else if (responseData.pagination) {
          // Format with pagination object
          setTotalReports(responseData.count || formattedReports.length);
          setTotalPages(responseData.pagination?.totalPages || Math.ceil((responseData.count || formattedReports.length) / itemsPerPage));
        } else {
          // Fallback
          setTotalReports(formattedReports.length);
          setTotalPages(Math.ceil(formattedReports.length / itemsPerPage));
        }
      } else {
        notifications.error("فشل في تحميل التقارير");
        console.error("Failed to fetch reports:", response.message, response);
      }
    } catch (error) {
      notifications.error("حدث خطأ أثناء تحميل التقارير");
      console.error("Error fetching reports:", error);

      // Log detailed error information to help debug API issues
      if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      } else {
        console.error("Unknown error type:", typeof error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Apply local search filtering if needed
  const filteredReports = searchQuery
    ? reports.filter((report) => {
        return (
          report.reportNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          reportTypeMap[report.reportType].toLowerCase().includes(searchQuery.toLowerCase()) ||
          (report.createdBy.fullName && report.createdBy.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      })
    : reports;

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
      reportType: "",
      status: "",
      startDate: "",
      endDate: "",
    });
    setCurrentPage(1);
  };

  const handleApplyFilter = () => {
    fetchReports();
    setIsFilterOpen(false);
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
                value={selectedFilters.reportType}
                onChange={(e) => handleFilterChange("reportType", e.target.value)}
              >
                <option value="">الكل</option>
                <option value="morning">صباحي</option>
                <option value="evening">مسائي</option>
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
                <option value="draft">مسودة</option>
                <option value="complete">مكتمل</option>
                <option value="approved">معتمد</option>
                <option value="archived">مؤرشف</option>
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
              <button className="bg-muted text-muted-foreground hover:bg-muted/80 px-4 py-2 rounded-md text-sm ml-2" onClick={handleFilterReset}>
                إعادة ضبط
              </button>
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm" onClick={handleApplyFilter}>
                تطبيق الفلتر
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Table */}
      <div className="bg-card rounded-lg shadow-sm border">
        {isLoading ? (
          <div className="flex justify-center items-center p-10">
            <Loader2 className="animate-spin h-8 w-8 mr-2 text-primary" />
            <span>جاري تحميل التقارير...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-xs text-muted-foreground border-b">
                  <th className="text-right p-3 font-medium">رقم التقرير</th>
                  <th className="text-right p-3 font-medium">النوع</th>
                  <th className="text-right p-3 font-medium">التاريخ</th>
                  <th className="text-right p-3 font-medium">الحالة</th>
                  <th className="text-right p-3 font-medium">الأحداث</th>
                  <th className="text-right p-3 font-medium">بواسطة</th>
                  <th className="text-right p-3 font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <tr key={report.id} className="border-b hover:bg-muted/50 text-sm">
                      <td className="p-3 whitespace-nowrap" dir="rtl">
                        <Link href={`/dashboard/reports/${report.id}`} className="text-primary hover:underline">
                          {report.reportNumber}
                        </Link>
                      </td>
                      <td className="p-3 whitespace-nowrap">{reportTypeMap[report.reportType]}</td>
                      <td className="p-3 whitespace-nowrap">{report.reportDate}</td>
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            statusMap[report.status]?.color || "bg-gray-100"
                          }`}
                        >
                          {statusMap[report.status]?.icon || <Clock size={12} className="ml-1" />} {statusMap[report.status]?.label || report.status}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">{report.eventCount || 0}</td>
                      <td className="p-3 whitespace-nowrap">{report.createdBy?.fullName || "غير معروف"}</td>
                      <td className="p-3 whitespace-nowrap">
                        <div className="flex gap-2 items-center">
                          <Link href={`/dashboard/reports/${report.id}`} className="text-primary hover:underline text-xs">
                            عرض
                          </Link>
                          <Link href={`/dashboard/reports/${report.id}/edit`} className="text-blue-600 hover:underline text-xs mr-2">
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
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {`عرض ${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, totalReports)} من ${totalReports} تقرير`}
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
                  currentPage === i + 1 ? "bg-primary text-primary-foreground" : "border hover:bg-muted"
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
