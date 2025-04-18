"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowRight, Printer, Download, FileText, Loader2, 
  Calendar, User, MapPin, Clock, CheckCircle, XCircle
} from "lucide-react";
import { reportsService } from "@/lib/api";
import notifications from "@/lib/utils/notifications";

// Map report type to Arabic labels
const reportTypeMap: Record<string, string> = {
  morning: "صباحي",
  evening: "مسائي",
};

// Create a mapping for status to styling and localized status names
const statusMap: Record<string, { icon: React.ReactNode; label: string }> = {
  complete: { icon: <CheckCircle size={12} className="ml-1" />, label: "مكتمل" },
  draft: { icon: <Clock size={12} className="ml-1" />, label: "مسودة" },
  approved: { icon: <CheckCircle size={12} className="ml-1" />, label: "معتمد" },
  archived: { icon: <XCircle size={12} className="ml-1" />, label: "مؤرشف" },
};

export default function PrintReportPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const printRef = useRef<HTMLDivElement>(null);
  
  const id = params?.id;
  const [report, setReport] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  
  // Load report data
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

  // Handle direct printing of the report
  const handlePrint = () => {
    window.print();
  };

  // Handle PDF generation
  const handleExportPdf = async () => {
    if (!id) {
      notifications.error("معرف التقرير غير موجود");
      return;
    }
    
    setIsPdfGenerating(true);
    
    try {
      const response = await reportsService.generatePdf(id);
      
      if (response.success && response.data?.url) {
        // Open the PDF in a new tab
        window.open(response.data.url, '_blank');
        notifications.success("تم إنشاء ملف PDF بنجاح");
      } else {
        notifications.error("فشل في إنشاء ملف PDF");
      }
    } catch (error) {
      notifications.error("حدث خطأ أثناء إنشاء ملف PDF");
      console.error("Error generating PDF:", error);
    } finally {
      setIsPdfGenerating(false);
    }
  };

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
      {/* Header with actions - only visible on screen, not in print */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center">
          <FileText className="ml-2" size={24} />
          <h1 className="text-2xl font-bold">طباعة التقرير</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md flex items-center text-sm"
          >
            <Printer size={16} className="ml-2" />
            طباعة
          </button>
          <button
            onClick={handleExportPdf}
            disabled={isPdfGenerating}
            className="bg-green-600 text-white hover:bg-green-700 px-4 py-2 rounded-md flex items-center text-sm"
          >
            {isPdfGenerating ? (
              <>
                <Loader2 size={16} className="animate-spin ml-2" />
                جاري التصدير...
              </>
            ) : (
              <>
                <Download size={16} className="ml-2" />
                تصدير PDF
              </>
            )}
          </button>
          <Link
            href={`/dashboard/reports/${id}`}
            className="bg-muted text-muted-foreground hover:bg-muted/80 px-4 py-2 rounded-md flex items-center text-sm"
          >
            <ArrowRight size={16} className="ml-2" />
            العودة للتقرير
          </Link>
        </div>
      </div>

      {/* Printable content */}
      <div ref={printRef} className="bg-white p-6 rounded-lg shadow-sm border print:border-none print:shadow-none print:rounded-none print:p-0">
        {/* Report Header for print */}
        <div className="text-center mb-8 border-b pb-4">
          <div className="flex justify-center mb-2">
            <FileText size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-1">نظام التقارير الأمنية</h1>
          <h2 className="text-xl">
            تقرير {reportTypeMap[report.reportType] || report.reportType} رقم {report.reportNumber}
          </h2>
          <p className="text-muted-foreground">
            تاريخ التقرير: {new Date(report.reportDate).toLocaleDateString("ar-EG")}
          </p>
          <p className="text-muted-foreground">
            حالة التقرير: {statusMap[report.status]?.label || report.status}
          </p>
        </div>

        {/* Report Details */}
        <div className="grid grid-cols-1 mb-8">
          <div className="mb-4">
            <h3 className="text-lg font-bold mb-2 border-b pb-1">معلومات التقرير</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <Calendar className="ml-2 mt-1" size={18} />
                <div>
                  <h4 className="font-semibold">تاريخ التقرير</h4>
                  <p>{new Date(report.reportDate).toLocaleDateString("ar-EG")}</p>
                </div>
              </div>
              <div className="flex items-start">
                <User className="ml-2 mt-1" size={18} />
                <div>
                  <h4 className="font-semibold">بواسطة</h4>
                  <p>{report.createdBy?.fullName || "غير معروف"}</p>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="ml-2 mt-1" size={18} />
                <div>
                  <h4 className="font-semibold">المحافظات</h4>
                  <p>
                    {Array.isArray(report.governorates) && report.governorates.length > 0
                      ? report.governorates.map((gov: any) => typeof gov === 'object' && gov.name ? gov.name : gov).join("، ")
                      : "غير محدد"}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="ml-2 mt-1" size={18} />
                <div>
                  <h4 className="font-semibold">نوع التقرير</h4>
                  <p>{reportTypeMap[report.reportType] || report.reportType || "غير محدد"}</p>
                </div>
              </div>
            </div>
          </div>

          {report.summary && (
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-2 border-b pb-1">ملخص التقرير</h3>
              <p className="whitespace-pre-line">{report.summary}</p>
            </div>
          )}
        </div>

        {/* Events Table */}
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3 border-b pb-1">الأحداث المسجلة في التقرير</h3>
          
          {loadingEvents ? (
            <div className="flex justify-center items-center p-6 print:hidden">
              <Loader2 className="animate-spin h-6 w-6 mr-2 text-primary" />
              <span>جاري تحميل الأحداث...</span>
            </div>
          ) : events.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-muted print:bg-gray-200">
                    <th className="text-right p-2 font-medium border">المحافظة</th>
                    <th className="text-right p-2 font-medium border">المنطقة</th>
                    <th className="text-right p-2 font-medium border">التاريخ</th>
                    <th className="text-right p-2 font-medium border">الوقت</th>
                    <th className="text-right p-2 font-medium border">النوع</th>
                    <th className="text-right p-2 font-medium border">الوصف</th>
                    <th className="text-right p-2 font-medium border">الخطورة</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, index) => (
                    <tr key={event.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="p-2 border">{event.governorate}</td>
                      <td className="p-2 border">{event.region}</td>
                      <td className="p-2 border whitespace-nowrap">
                        {new Date(event.eventDate).toLocaleDateString("ar-EG")}
                      </td>
                      <td className="p-2 border whitespace-nowrap">{event.eventTime}</td>
                      <td className="p-2 border">{event.eventType}</td>
                      <td className="p-2 border">{event.description}</td>
                      <td className="p-2 border">
                        {event.severity === "critical"
                          ? "حرج"
                          : event.severity === "high"
                          ? "مرتفع"
                          : event.severity === "medium"
                          ? "متوسط"
                          : "منخفض"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-muted-foreground p-4">
              لا توجد أحداث مسجلة في هذا التقرير
            </p>
          )}
        </div>

        {/* Footer for print */}
        <div className="mt-16 pt-4 border-t text-center text-sm text-muted-foreground">
          <p>تم إنشاء هذا التقرير بواسطة نظام التقارير الأمنية</p>
          <p>تاريخ الطباعة: {new Date().toLocaleDateString("ar-EG")} {new Date().toLocaleTimeString("ar-EG")}</p>
        </div>
      </div>

      {/* Print specific styles */}
      <style jsx global>{`
        @media print {
          body {
            font-size: 12pt;
            color: black;
            background: white;
          }
          @page {
            size: A4;
            margin: 2cm;
          }
          nav, footer, .print-hidden {
            display: none !important;
          }
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          thead {
            display: table-header-group;
          }
          tfoot {
            display: table-footer-group;
          }
        }
      `}</style>
    </div>
  );
}
