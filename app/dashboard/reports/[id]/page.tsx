"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowRight, Download, Edit, FileText, Loader2, Clock, CalendarIcon,
  User, MapPin, CheckCircle, XCircle 
} from "lucide-react";
import { reportsService } from "@/lib/api";
import notifications from "@/lib/utils/notifications";

// Map report type to Arabic labels
const reportTypeMap: Record<string, string> = {
  morning: "صباحي",
  evening: "مسائي",
};

// Create a mapping for status to styling and localized status names
const statusMap: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  complete: { color: "bg-green-100 text-green-800", icon: <CheckCircle size={12} className="ml-1" />, label: "مكتمل" },
  draft: { color: "bg-slate-100 text-slate-800", icon: <Clock size={12} className="ml-1" />, label: "مسودة" },
  approved: { color: "bg-amber-100 text-amber-800", icon: <CheckCircle size={12} className="ml-1" />, label: "معتمد" },
  archived: { color: "bg-red-100 text-red-800", icon: <XCircle size={12} className="ml-1" />, label: "مؤرشف" },
};

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const id = params?.id;

  useEffect(() => {
    if (!id) return;
    
    const fetchReportDetails = async () => {
      setIsLoading(true);
      try {
        const response = await reportsService.getReportById(id);
        
        if (response.success && response.data) {
          setReport(response.data);
        } else {
          notifications.error("فشل في تحميل التقرير");
          console.error("Failed to fetch report:", response.message);
        }
      } catch (error) {
        notifications.error("حدث خطأ أثناء تحميل التقرير");
        console.error("Error fetching report:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchReportEvents = async () => {
      setLoadingEvents(true);
      try {
        const response = await reportsService.getReportEvents(id);
        
        if (response.success && response.data) {
          setEvents(response.data);
        } else {
          notifications.warning("فشل في تحميل الأحداث المرتبطة بالتقرير");
          console.error("Failed to fetch report events:", response.message);
        }
      } catch (error) {
        console.error("Error fetching report events:", error);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchReportDetails();
    fetchReportEvents();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <Loader2 className="animate-spin h-8 w-8 mr-2 text-primary" />
        <span>جاري تحميل التقرير...</span>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="bg-card rounded-lg shadow-sm border p-6 text-center">
        <h2 className="text-xl font-bold mb-4">التقرير غير موجود</h2>
        <p className="mb-4">لم يتم العثور على التقرير المطلوب أو قد تكون لا تملك صلاحية الوصول إليه.</p>
        <Link href="/dashboard/reports" className="text-primary hover:underline flex items-center justify-center">
          <ArrowRight className="ml-2" size={16} />
          العودة إلى قائمة التقارير
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="ml-2" size={24} />
          <h1 className="text-2xl font-bold">{report.reportNumber || "تقرير بدون رقم"}</h1>
          {report.status && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mr-4 ${
                statusMap[report.status]?.color || "bg-gray-100"
              }`}
            >
              {statusMap[report.status]?.icon} {statusMap[report.status]?.label || report.status}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/reports/${id}/edit`}
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md flex items-center text-sm"
          >
            <Edit size={16} className="ml-2" />
            تعديل
          </Link>
          <Link
            href={`/dashboard/reports/${id}/print`}
            className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md flex items-center text-sm"
          >
            <Download size={16} className="ml-2" />
            تصدير
          </Link>
          <Link
            href="/dashboard/reports"
            className="bg-muted text-muted-foreground hover:bg-muted/80 px-4 py-2 rounded-md flex items-center text-sm"
          >
            <ArrowRight size={16} className="ml-2" />
            العودة للقائمة
          </Link>
        </div>
      </div>

      {/* Report Details */}
      <div className="bg-card rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">رقم التقرير</h3>
              <p className="text-lg">{report.reportNumber || "غير محدد"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">نوع التقرير</h3>
              <p className="text-lg">{reportTypeMap[report.reportType] || report.reportType || "غير محدد"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">الحالة</h3>
              <p className="flex items-center">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    statusMap[report.status]?.color || "bg-gray-100"
                  }`}
                >
                  {statusMap[report.status]?.icon} {statusMap[report.status]?.label || report.status || "غير محدد"}
                </span>
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">تاريخ التقرير</h3>
              <p className="text-lg flex items-center">
                <CalendarIcon className="ml-1 h-4 w-4" />
                {new Date(report.reportDate).toLocaleDateString("ar-EG") || "غير محدد"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">بواسطة</h3>
              <p className="text-lg flex items-center">
                <User className="ml-1 h-4 w-4" />
                {report.createdBy?.fullName || "غير معروف"}
              </p>
            </div>
            <div>
                <h3 className="text-sm font-medium text-muted-foreground">المحافظات</h3>
              <p className="text-lg flex items-center">
                <MapPin className="ml-1 h-4 w-4" />
                {Array.isArray(report.governorates) && report.governorates.length > 0
                  ? report.governorates.map((gov: any) => typeof gov === 'object' && gov.name ? gov.name : gov).join(", ")
                  : "غير محدد"}
              </p>
            </div>
          </div>
        </div>

        {report.summary && (
          <div className="p-6 border-t">
            <h3 className="text-lg font-medium mb-2">ملخص التقرير</h3>
            <p className="whitespace-pre-line">{report.summary}</p>
          </div>
        )}
      </div>

      {/* Events List */}
      <div className="bg-card rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">الأحداث المسجلة في التقرير</h2>
        </div>

        {loadingEvents ? (
          <div className="flex justify-center items-center p-10">
            <Loader2 className="animate-spin h-6 w-6 mr-2 text-primary" />
            <span>جاري تحميل الأحداث...</span>
          </div>
        ) : events.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-xs text-muted-foreground border-b">
                  <th className="text-right p-3 font-medium">المحافظة</th>
                  <th className="text-right p-3 font-medium">المنطقة</th>
                  <th className="text-right p-3 font-medium">التاريخ</th>
                  <th className="text-right p-3 font-medium">الوقت</th>
                  <th className="text-right p-3 font-medium">النوع</th>
                  <th className="text-right p-3 font-medium">الوصف</th>
                  <th className="text-right p-3 font-medium">الخطورة</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b hover:bg-muted/50 text-sm">
                    <td className="p-3 whitespace-nowrap">{event.governorate}</td>
                    <td className="p-3 whitespace-nowrap">{event.region}</td>
                    <td className="p-3 whitespace-nowrap">
                      {new Date(event.eventDate).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="p-3 whitespace-nowrap">{event.eventTime}</td>
                    <td className="p-3 whitespace-nowrap">{event.eventType}</td>
                    <td className="p-3">{event.description}</td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          event.severity === "critical"
                            ? "bg-red-100 text-red-800"
                            : event.severity === "high"
                            ? "bg-orange-100 text-orange-800"
                            : event.severity === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {event.severity === "critical"
                          ? "حرج"
                          : event.severity === "high"
                          ? "مرتفع"
                          : event.severity === "medium"
                          ? "متوسط"
                          : "منخفض"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            لا توجد أحداث مسجلة في هذا التقرير
          </div>
        )}
      </div>
    </div>
  );
}
