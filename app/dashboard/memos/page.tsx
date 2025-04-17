"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Plus, 
  Search,
  FileText,
  File,
  UserRound,
  Tag,
  Building,
  Eye,
  Edit,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2
} from "lucide-react";
import { ClientDate } from "@/components/ui/client-date";
import { memosService, MemoRelease, MemoReleaseFilters } from "@/lib/api/memos-service";
import notifications from "@/lib/utils/notifications";

// Status styling map
const statusMap: Record<string, { color: string, icon: React.ReactNode }> = {
  "draft": { color: "bg-slate-100 text-slate-800", icon: <File size={12} className="ml-1" /> },
  "sent": { color: "bg-amber-100 text-amber-800", icon: <Clock size={12} className="ml-1" /> },
  "received": { color: "bg-blue-100 text-blue-800", icon: <CheckCircle size={12} className="ml-1" /> },
  "processed": { color: "bg-green-100 text-green-800", icon: <CheckCircle size={12} className="ml-1" /> },
};

// Type styling map
const typeMap: Record<string, { label: string, color: string }> = {
  "memo": { label: "مذكرة", color: "bg-purple-100 text-purple-800" },
  "release": { label: "إفراج", color: "bg-indigo-100 text-indigo-800" },
};

export default function MemosPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<MemoRelease[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [selectedFilters, setSelectedFilters] = useState<MemoReleaseFilters>({
    type: "",
    status: "",
    governorate: "",
    startDate: "",
    endDate: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [governorates, setGovernorates] = useState<Array<{ _id: string, name: string }>>([]);
  
  // Fetch memos and releases
  useEffect(() => {
    fetchDocuments();
    fetchGovernorates();
  }, [currentPage, selectedFilters]);
  
  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      // Apply filters and pagination
      const filters: MemoReleaseFilters = {
        ...selectedFilters,
        search: searchQuery || undefined,
        page: currentPage,
        limit: itemsPerPage,
        sortBy: 'date',
        sortDirection: 'desc'
      };
      
      const response = await memosService.getMemosReleases(filters);
      
      if (response.success && response.data) {
        setDocuments(response.data.documents || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalItems(response.data.total || 0);
      } else {
        notifications.error(response.message || "فشل في تحميل المذكرات والإفراجات");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
      notifications.error("حدث خطأ أثناء تحميل البيانات");
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchGovernorates = async () => {
    try {
      const response = await fetch('/api/governorates');
      if (response.ok) {
        const data = await response.json();
        setGovernorates(data);
      }
    } catch (error) {
      console.error("Error fetching governorates:", error);
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchDocuments();
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
      governorate: "",
      startDate: "",
      endDate: "",
    });
    setCurrentPage(1);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <FileText className="ml-2" size={24} />
          المذكرات والإفراجات
        </h1>
        <div className="flex space-x-2">
          <Link
            href="/dashboard/memos/new?type=release"
            className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md flex items-center text-sm ml-2"
          >
            <Plus size={16} className="ml-2" />
            إفراج جديد
          </Link>
          <Link
            href="/dashboard/memos/new?type=memo"
            className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-md flex items-center text-sm"
          >
            <Plus size={16} className="ml-2" />
            مذكرة جديدة
          </Link>
        </div>
      </div>
      
      {/* Search and Filter Bar */}
      <div className="bg-card rounded-lg shadow-sm border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 relative flex">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="ابحث في المذكرات والإفراجات..."
              className="w-full pl-10 pr-9 py-2 text-sm border rounded-md bg-background"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <button 
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm mr-2"
            >
              بحث
            </button>
          </form>
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
              <label className="block text-sm font-medium mb-1">نوع المستند</label>
              <select
                className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                value={selectedFilters.type}
                onChange={(e) => handleFilterChange("type", e.target.value)}
              >
                <option value="">الكل</option>
                <option value="memo">مذكرة</option>
                <option value="release">إفراج</option>
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
                <option value="sent">مرسلة</option>
                <option value="received">مستلمة</option>
                <option value="processed">معالجة</option>
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
                  <option key={gov._id} value={gov._id}>
                    {gov.name}
                  </option>
                ))}
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
                onClick={() => {
                  setIsFilterOpen(false);
                  fetchDocuments();
                }}
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
                <th className="text-right p-3">رقم المرجع</th>
                <th className="text-right p-3">النوع</th>
                <th className="text-right p-3">الموضوع</th>
                <th className="text-right p-3">التاريخ</th>
                <th className="text-right p-3">المحافظة</th>
                <th className="text-right p-3">الحالة</th>
                <th className="text-right p-3">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="mr-2">جاري تحميل البيانات...</span>
                    </div>
                  </td>
                </tr>
              ) : documents.length > 0 ? (
                documents.map((doc) => (
                  <tr key={doc.id} className="border-b hover:bg-muted/50 text-sm">
                    <td className="p-3" dir="ltr">
                      <Link href={`/dashboard/memos/${doc.id}`} className="text-primary hover:underline">
                        {doc.referenceNumber}
                      </Link>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${typeMap[doc.type]?.color}`}>
                        {typeMap[doc.type]?.label}
                      </span>
                    </td>
                    <td className="p-3 max-w-[200px] truncate" title={doc.subject}>
                      {doc.subject}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <ClientDate date={doc.date} format="short" />
                        <span className="text-xs text-muted-foreground">{doc.time}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <Building size={12} className="ml-1 text-muted-foreground" />
                        <span>{doc.governorate}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusMap[doc.status]?.color}`}>
                        {statusMap[doc.status]?.icon} 
                        {doc.status === 'draft' ? 'مسودة' : 
                         doc.status === 'sent' ? 'مرسلة' :
                         doc.status === 'received' ? 'مستلمة' : 'معالجة'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex space-x-2">
                        <Link
                          href={`/dashboard/memos/${doc.id}`}
                          className="text-primary hover:underline text-xs flex items-center"
                        >
                          <Eye size={12} className="ml-1" /> عرض
                        </Link>
                        <Link
                          href={`/dashboard/memos/${doc.id}/edit`}
                          className="text-blue-600 hover:underline text-xs mr-2"
                        >
                          <Edit size={12} className="ml-1" /> تعديل
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-muted-foreground">
                    لا توجد مذكرات أو إفراجات مطابقة للبحث
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {`عرض ${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(currentPage * itemsPerPage, totalItems)} من ${totalItems} عنصر`}
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
