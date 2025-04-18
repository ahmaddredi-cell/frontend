"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowRight, Save, FileText, Loader2, Clock, CalendarIcon, 
  Info, CheckCircle, XCircle, AlertTriangle
} from "lucide-react";
import { reportsService, governoratesService } from "@/lib/api";
import notifications from "@/lib/utils/notifications";

// Report types with Arabic translations
const reportTypes = [
  { value: "morning", label: "صباحي" },
  { value: "evening", label: "مسائي" },
];

// Status options with Arabic translations
const statusOptions = [
  { value: "draft", label: "مسودة", icon: <Clock size={12} className="ml-1" />, color: "bg-slate-100 text-slate-800" },
  { value: "complete", label: "مكتمل", icon: <CheckCircle size={12} className="ml-1" />, color: "bg-green-100 text-green-800" },
  { value: "approved", label: "معتمد", icon: <CheckCircle size={12} className="ml-1" />, color: "bg-amber-100 text-amber-800" },
  { value: "archived", label: "مؤرشف", icon: <XCircle size={12} className="ml-1" />, color: "bg-red-100 text-red-800" },
];

// Status map for display
const statusMap: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  complete: { color: "bg-green-100 text-green-800", icon: <CheckCircle size={12} className="ml-1" />, label: "مكتمل" },
  draft: { color: "bg-slate-100 text-slate-800", icon: <Clock size={12} className="ml-1" />, label: "مسودة" },
  approved: { color: "bg-amber-100 text-amber-800", icon: <CheckCircle size={12} className="ml-1" />, label: "معتمد" },
  archived: { color: "bg-red-100 text-red-800", icon: <XCircle size={12} className="ml-1" />, label: "مؤرشف" },
};

export default function EditReportPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params?.id;
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [governorates, setGovernorates] = useState<{id: string, name: string}[]>([]);
  
  const [formData, setFormData] = useState({
    reportNumber: "",
    reportDate: "",
    reportType: "",
    status: "",
    summary: "",
    governorates: [] as string[],
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch initial report data
  useEffect(() => {
    if (!id) return;
    
    const fetchReport = async () => {
      setIsLoading(true);
      try {
        const response = await reportsService.getReportById(id);
        
        if (response.success && response.data) {
          const report = response.data;
          
          // Format date to YYYY-MM-DD for input field
          const reportDate = report.reportDate 
            ? new Date(report.reportDate).toISOString().split('T')[0]
            : "";
            
          // Handle governorates which might be objects with _id and name
          let governorateIds: string[] = [];
          if (Array.isArray(report.governorates)) {
            governorateIds = report.governorates.map((gov: any) => 
              typeof gov === 'object' && gov._id ? gov._id : gov
            );
          }
          
          setFormData({
            reportNumber: report.reportNumber || "",
            reportDate: reportDate,
            reportType: report.reportType || "",
            status: report.status || "",
            summary: report.summary || "",
            governorates: governorateIds,
          });
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
    
    // Fetch governorates list for dropdown
    const fetchGovernorates = async () => {
      try {
        const response = await governoratesService.getGovernorates();
        
        if (response.success && response.data) {
          // Convert to the format needed for the UI
          const governoratesList = response.data.map((gov: any) => ({
            id: gov._id,
            name: gov.name
          }));
          setGovernorates(governoratesList);
        } else {
          console.error("Failed to fetch governorates");
          // Fallback governorates if API fails
          setGovernorates([
            { id: "gaza", name: "غزة" },
            { id: "north_gaza", name: "شمال غزة" },
            { id: "deir_al_balah", name: "دير البلح" },
            { id: "khan_younis", name: "خان يونس" },
            { id: "rafah", name: "رفح" }
          ]);
        }
      } catch (error) {
        console.error("Error fetching governorates:", error);
        // Fallback governorates
        setGovernorates([
          { id: "gaza", name: "غزة" },
          { id: "north_gaza", name: "شمال غزة" },
          { id: "deir_al_balah", name: "دير البلح" },
          { id: "khan_younis", name: "خان يونس" },
          { id: "rafah", name: "رفح" }
        ]);
      }
    };

    fetchReport();
    fetchGovernorates();
  }, [id]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.reportNumber.trim()) {
      newErrors.reportNumber = "رقم التقرير مطلوب";
    }
    
    if (!formData.reportDate) {
      newErrors.reportDate = "تاريخ التقرير مطلوب";
    }
    
    if (!formData.reportType) {
      newErrors.reportType = "نوع التقرير مطلوب";
    }
    
    if (!formData.status) {
      newErrors.status = "حالة التقرير مطلوبة";
    }
    
    if (formData.governorates.length === 0) {
      newErrors.governorates = "يجب اختيار محافظة واحدة على الأقل";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleGovernoratesToggles = (governorateId: string) => {
    setFormData(prev => {
      const isSelected = prev.governorates.includes(governorateId);
      
      const newGovernorates = isSelected
        ? prev.governorates.filter(g => g !== governorateId)
        : [...prev.governorates, governorateId];
        
      return { ...prev, governorates: newGovernorates };
    });
    
    // Clear error for governorates if it exists
    if (errors.governorates) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.governorates;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) {
      notifications.error("معرف التقرير غير موجود");
      return;
    }
    
    if (!validateForm()) {
      notifications.error("يرجى تصحيح الأخطاء في النموذج قبل الحفظ");
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Make sure reportType is the correct type
      if (formData.reportType !== "morning" && formData.reportType !== "evening") {
        throw new Error("نوع التقرير غير صالح");
      }
      
      // Validate status
      if (formData.status !== "draft" && formData.status !== "complete" && 
          formData.status !== "approved" && formData.status !== "archived") {
        throw new Error("حالة التقرير غير صالحة");
      }
      
      const updateData = {
        id: id,
        reportNumber: formData.reportNumber,
        reportDate: formData.reportDate,
        reportType: formData.reportType as "morning" | "evening",
        status: formData.status as "draft" | "complete" | "approved" | "archived",
        summary: formData.summary,
        governorates: formData.governorates
      };
      
      const response = await reportsService.updateReport(updateData);
      
      if (response.success) {
        notifications.success("تم تحديث التقرير بنجاح");
        router.push(`/dashboard/reports/${id}`);
      } else {
        notifications.error(response.message || "فشل في تحديث التقرير");
      }
    } catch (error) {
      notifications.error("حدث خطأ أثناء حفظ التقرير");
      console.error("Error updating report:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <Loader2 className="animate-spin h-8 w-8 mr-2 text-primary" />
        <span>جاري تحميل بيانات التقرير...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <FileText className="ml-2" size={24} />
          <h1 className="text-2xl font-bold">تعديل التقرير</h1>
          {formData.status && (
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mr-4 ${
                statusMap[formData.status]?.color || "bg-gray-100"
              }`}
            >
              {statusMap[formData.status]?.icon} {statusMap[formData.status]?.label || formData.status}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/dashboard/reports/${id}`}
            className="bg-muted text-muted-foreground hover:bg-muted/80 px-4 py-2 rounded-md flex items-center text-sm"
          >
            <ArrowRight size={16} className="ml-2" />
            إلغاء
          </Link>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-card rounded-lg shadow-sm border p-6 space-y-6">
        {/* Report Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label htmlFor="reportNumber" className="block text-sm font-medium">
              رقم التقرير <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="reportNumber"
              name="reportNumber"
              value={formData.reportNumber}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.reportNumber ? "border-red-500" : "border-gray-300"
              }`}
              dir="rtl"
            />
            {errors.reportNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.reportNumber}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="reportDate" className="block text-sm font-medium">
              تاريخ التقرير <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="reportDate"
              name="reportDate"
              value={formData.reportDate}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.reportDate ? "border-red-500" : "border-gray-300"
              }`}
              dir="rtl"
            />
            {errors.reportDate && (
              <p className="text-red-500 text-xs mt-1">{errors.reportDate}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="reportType" className="block text-sm font-medium">
              نوع التقرير <span className="text-red-500">*</span>
            </label>
            <select
              id="reportType"
              name="reportType"
              value={formData.reportType}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.reportType ? "border-red-500" : "border-gray-300"
              }`}
              dir="rtl"
            >
              <option value="">اختر نوع التقرير</option>
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.reportType && (
              <p className="text-red-500 text-xs mt-1">{errors.reportType}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium">
              حالة التقرير <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.status ? "border-red-500" : "border-gray-300"
              }`}
              dir="rtl"
            >
              <option value="">اختر حالة التقرير</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="text-red-500 text-xs mt-1">{errors.status}</p>
            )}
          </div>
        </div>

        {/* Governorates */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            المحافظات <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {governorates.map((governorate) => (
              <button
                key={governorate.id}
                type="button"
                onClick={() => handleGovernoratesToggles(governorate.id)}
                className={`px-3 py-1 rounded-full text-sm ${
                  formData.governorates.includes(governorate.id)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {governorate.name}
              </button>
            ))}
          </div>
          {errors.governorates && (
            <p className="text-red-500 text-xs mt-1">{errors.governorates}</p>
          )}
        </div>

        {/* Summary */}
        <div className="space-y-2">
          <label htmlFor="summary" className="block text-sm font-medium">
            ملخص التقرير
          </label>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleInputChange}
            rows={5}
            className="w-full px-3 py-2 border rounded-md"
            dir="rtl"
            placeholder="أدخل ملخصًا للتقرير هنا..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md flex items-center text-sm"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin ml-2" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save size={16} className="ml-2" />
                حفظ التعديلات
              </>
            )}
          </button>
        </div>
      </form>

      {/* Note about events */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start">
        <AlertTriangle size={20} className="text-amber-500 ml-3 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-medium text-amber-800">ملاحظة حول تعديل الأحداث</h3>
          <p className="text-amber-700 text-sm">
            يمكنك عرض وتعديل الأحداث المرتبطة بهذا التقرير من خلال صفحة عرض التقرير، والضغط على زر "تعديل" بجانب كل حدث.
          </p>
        </div>
      </div>
    </div>
  );
}
