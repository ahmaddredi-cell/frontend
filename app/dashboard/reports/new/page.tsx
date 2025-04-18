"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowRight, 
  Calendar, 
  FileText,
  Save, 
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { reportsService, CreateReportData, governoratesService } from "@/lib/api";
import notifications from "@/lib/utils/notifications";

// Governorate interface
interface Governorate {
  _id: string;
  name: string;
  code: string;
  regions: string[];
}

export default function NewReportPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    reportNumber: "",
    reportDate: new Date().toISOString().split('T')[0],
    reportType: "morning" as const, // صباحي
    summary: "",
    selectedGovernorates: [] as string[],
  });
  
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: "" });
  
  // Function to generate report number
  const generateReportNumber = () => {
    // Format: REP-YYYYMMDD-[M/E]-XXX
    const date = new Date(formData.reportDate);
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    const typeCode = formData.reportType === 'morning' ? 'M' : 'E';
    
    // Use a sequential number - just hardcode for now since we can't determine next sequence without backend call
    const seq = "001";
    
    return `REP-${dateStr}-${typeCode}-${seq}`;
  };
  
  // Always auto-generate report number when date or type changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      reportNumber: generateReportNumber()
    }));
  }, [formData.reportDate, formData.reportType]);
  
  // Fetch governorates on component mount
  useEffect(() => {
    const fetchGovernorates = async () => {
      try {
        const response = await governoratesService.getGovernorates();
        if (response.success && response.data) {
          setGovernorates(response.data);
        } else {
          console.error('Failed to fetch governorates:', response.message);
          notifications.error('فشل في تحميل بيانات المحافظات');
        }
      } catch (error) {
        console.error('Error fetching governorates:', error);
        notifications.error('حدث خطأ أثناء تحميل بيانات المحافظات');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGovernorates();
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleGovernorateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    setFormData({
      ...formData,
      selectedGovernorates: checked
        ? [...formData.selectedGovernorates, value]
        : formData.selectedGovernorates.filter((gov) => gov !== value),
    });
  };
  
  const handleSelectAll = () => {
    if (formData.selectedGovernorates.length === governorates.length) {
      // If all are selected, unselect all
      setFormData({
        ...formData,
        selectedGovernorates: [],
      });
    } else {
      // Select all
      setFormData({
        ...formData,
        selectedGovernorates: governorates.map((gov) => gov._id),
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published') => {
    e.preventDefault();
    
    // Validate form
    if (!formData.reportNumber) {
      setFormStatus({
        type: 'error',
        message: "يرجى إدخال رقم التقرير",
      });
      return;
    }
    
    if (!formData.reportDate) {
      setFormStatus({
        type: 'error',
        message: "يرجى تحديد تاريخ التقرير",
      });
      return;
    }
    
    if (formData.selectedGovernorates.length === 0) {
      setFormStatus({
        type: 'error',
        message: "يرجى اختيار محافظة واحدة على الأقل",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Map 'published' status to 'complete' which is valid in the backend model
      const backendStatus = status === 'published' ? 'complete' : 'draft';
      
      const reportData: CreateReportData = {
        reportNumber: formData.reportNumber,
        reportDate: formData.reportDate,
        reportType: formData.reportType,
        summary: formData.summary || undefined,
        governorates: formData.selectedGovernorates,
        status: backendStatus // Using the mapped status value
      };
      
      console.log('Submitting report data:', reportData);
      
      // Submit to API
      const response = await reportsService.createReport(reportData);
      console.log('API create report response:', response);
      
      if (!response.success) {
        throw new Error(response.message || "حدث خطأ أثناء إنشاء التقرير");
      }
      
      console.log('Successfully created report, response data:', response.data);
      
      // Success notification
      notifications.success(
        status === 'draft' 
          ? "تم حفظ التقرير كمسودة بنجاح" 
          : "تم نشر التقرير بنجاح"
      );
      
      // Set form status for UI feedback
      setFormStatus({
        type: 'success',
        message: status === 'draft' 
          ? "تم حفظ التقرير كمسودة بنجاح" 
          : "تم نشر التقرير بنجاح"
      });
      
      // Redirect after successful creation
      setTimeout(() => {
        router.push('/dashboard/reports');
      }, 1500);
      
    } catch (error) {
      console.error("Error submitting report:", error);
      
      // Provide more detailed logging for debugging
      if (error instanceof Error) {
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      } else {
        console.error('Unknown error type:', typeof error);
        console.error('Error details:', error);
      }
      
      notifications.error(
        error instanceof Error ? error.message : "حدث خطأ أثناء حفظ التقرير. يرجى المحاولة مرة أخرى"
      );
      
      setFormStatus({
        type: 'error',
        message: error instanceof Error 
          ? error.message 
          : "حدث خطأ أثناء حفظ التقرير. يرجى المحاولة مرة أخرى",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link
          href="/dashboard/reports"
          className="text-muted-foreground hover:text-foreground flex items-center ml-4"
        >
          <ArrowRight className="ml-1" size={18} />
          العودة إلى التقارير
        </Link>
        <h1 className="text-2xl font-bold flex items-center">
          <FileText className="ml-2" size={24} />
          إنشاء تقرير جديد
        </h1>
      </div>
      
      {formStatus.type && (
        <div className={`p-4 rounded-md ${
          formStatus.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex">
            {formStatus.type === 'success' ? (
              <CheckCircle className="ml-3 h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="ml-3 h-5 w-5 text-red-500" />
            )}
            <span className={formStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {formStatus.message}
            </span>
          </div>
        </div>
      )}
      
      <form className="space-y-6">
        <div className="bg-card rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-medium mb-4 pb-2 border-b">معلومات التقرير الأساسية</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                رقم التقرير <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <input
                  type="text"
                  name="reportNumber"
                  value={formData.reportNumber}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-l-md bg-background"
                  placeholder="مثال: REP-20250417-M-001"
                  required
                />
                <button
                  type="button"
                  onClick={() => setFormData({...formData, reportNumber: generateReportNumber()})}
                  className="px-3 py-2 bg-secondary text-secondary-foreground border border-r rounded-r-md hover:bg-secondary/90"
                  title="توليد رقم تقرير تلقائي"
                >
                  توليد
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                صيغة الترقيم: REP-التاريخ-النوع-الرقم التسلسلي
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                تاريخ التقرير <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  name="reportDate"
                  value={formData.reportDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-9 py-2 border rounded-md bg-background"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                نوع التقرير <span className="text-red-500">*</span>
              </label>
              <select
                name="reportType"
                value={formData.reportType}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md bg-background"
                required
              >
                <option value="morning">صباحي</option>
                <option value="evening">مسائي</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium mb-1">
              ملخص التقرير
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder="أدخل ملخص أو ملاحظات للتقرير..."
            />
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-4 pb-2 border-b">
            <h2 className="text-lg font-medium">
              المحافظات المشمولة <span className="text-red-500">*</span>
            </h2>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-sm text-primary hover:underline"
            >
              {formData.selectedGovernorates.length === governorates.length
                ? "إلغاء تحديد الكل"
                : "تحديد الكل"}
            </button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="mr-2">جاري تحميل المحافظات...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {governorates.map((governorate) => (
                <div key={governorate._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`gov-${governorate._id}`}
                    value={governorate._id}
                    checked={formData.selectedGovernorates.includes(governorate._id)}
                    onChange={handleGovernorateChange}
                    className="h-4 w-4 ml-2 rounded text-primary focus:ring-primary"
                  />
                  <label
                    htmlFor={`gov-${governorate._id}`}
                    className="text-sm cursor-pointer"
                  >
                    {governorate.name}
                  </label>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-sm text-muted-foreground mt-4">
            سيتم إنشاء التقرير بناءً على المحافظات المحددة فقط
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="px-4 py-2 border border-muted rounded-md text-sm font-medium hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            onClick={() => window.history.back()}
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'draft')}
            disabled={isSubmitting}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary ml-2"
          >
            <Save className="inline-block ml-2 h-4 w-4" />
            حفظ كمسودة
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'published')}
            disabled={isSubmitting}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <CheckCircle className="inline-block ml-2 h-4 w-4" />
            نشر التقرير
          </button>
        </div>
      </form>
    </div>
  );
}
