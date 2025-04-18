"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  FileText,
  Activity,
  User,
  Users,
  Shield,
  Flag,
  FileCheck,
  Upload
} from "lucide-react";
import { eventsService, CreateEventData, governoratesService, reportsService } from "@/lib/api";
import notifications from "@/lib/utils/notifications";

// Types for form state
interface EventForm extends Omit<CreateEventData, 'eventDate' | 'eventTime'> {
  eventDate: string;
  eventTime: string;
  casualties: {
    killed: number;
    injured: number;
    arrested: number;
  };
  involvedParties?: string[];
}

// Governorate type
interface Governorate {
  _id: string;
  name: string;
  code: string;
  regions: string[];
}

// Component for file upload
const FileUpload = ({ onFileSelected }: { onFileSelected: (file: File) => void }) => {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 flex flex-col items-center justify-center">
      <Upload className="h-10 w-10 text-gray-400 mb-2" />
      <p className="text-sm text-gray-500 mb-2">اسحب الملفات هنا أو انقر للاختيار</p>
      <input
        type="file"
        className="hidden"
        id="file-upload"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onFileSelected(e.target.files[0]);
          }
        }}
      />
      <label
        htmlFor="file-upload"
        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm cursor-pointer"
      >
        اختر ملفًا
      </label>
    </div>
  );
};

export default function NewEventPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [reports, setReports] = useState<{ id: string; reportNumber: string }[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  
  // Form state - casualties is now non-optional
  const [form, setForm] = useState<EventForm>({
    eventDate: new Date().toISOString().split('T')[0],
    eventTime: new Date().toTimeString().slice(0, 5),
    governorate: "",
    region: "",
    eventType: "security_incident",
    description: "",
    severity: "medium",
    status: "ongoing",
    palestinianIntervention: "",
    israeliResponse: "",
    results: "",
    reportId: "", // Add this field since it's required in the interface
    casualties: {
      killed: 0,
      injured: 0,
      arrested: 0
    },
    involvedParties: []
  });
  
  // New involved party state
  const [newParty, setNewParty] = useState("");
  
  // File attachments
  const [files, setFiles] = useState<File[]>([]);
  
  // Load governorates and reports on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch governorates
        const governoratesResponse = await governoratesService.getGovernorates();
        if (governoratesResponse.success && governoratesResponse.data) {
          setGovernorates(governoratesResponse.data);
        } else {
          console.error('Failed to fetch governorates:', governoratesResponse.message);
          notifications.error('فشل في تحميل بيانات المحافظات');
        }
        
        // Fetch reports that are not archived
        const reportsResponse = await reportsService.getReports({
          status: 'draft,complete,approved' // Exclude archived reports
        });
        
        console.log("Full reports response:", reportsResponse);
        
        // Additional debug logging to examine the structure in more detail
        if (reportsResponse.data) {
          console.log("Reports data structure check:", {
            isArray: Array.isArray(reportsResponse.data),
            hasReportsProperty: reportsResponse.data && typeof reportsResponse.data === 'object' && 'reports' in reportsResponse.data,
            hasDataProperty: reportsResponse.data && typeof reportsResponse.data === 'object' && 'data' in reportsResponse.data,
            keys: reportsResponse.data && typeof reportsResponse.data === 'object' ? Object.keys(reportsResponse.data) : []
          });
        }
        
        if (reportsResponse.success) {
          try {
            // Define report type based on backend model structure
            interface ReportItem {
              _id?: string;
              id?: string;
              reportNumber: string;
              reportDate: string;
              reportType: string;
              status: string;
            }
            
            // The backend response structure varies - fix handling to correctly process the response
            let reportsList: ReportItem[] = [];
            
            // In the dailyReport.controller.js, reports are returned in the 'data' property
            // The API call response will be in format { success: true, data: reports }
            const responseData = reportsResponse.data as any;
            
            console.log("Response data type:", typeof responseData);
            console.log("Full response structure:", JSON.stringify(reportsResponse, null, 2));
            
            if (responseData) {
              // The dailyReport.controller.js returns data in the 'data' property
              if (responseData.data && Array.isArray(responseData.data)) {
                reportsList = responseData.data;
                console.log("Found reports in responseData.data:", reportsList.length);
              } 
              // For compatibility with potential array returns
              else if (Array.isArray(responseData)) {
                reportsList = responseData;
                console.log("Found reports in direct array:", reportsList.length);
              }
              // For other potential formats
              else if (responseData.reports && Array.isArray(responseData.reports)) {
                reportsList = responseData.reports;
                console.log("Found reports in responseData.reports:", reportsList.length);
              }
            }
            
            console.log("Processed reports data:", reportsList);
            
            if (reportsList && reportsList.length > 0) {
              setReports(reportsList.map((report: any) => ({
                id: report._id || report.id, // Handle both _id and id formats
                reportNumber: report.reportNumber || `تقرير #${report._id?.substring(0,5) || ""}`
              })));
              console.log("Reports set successfully:", reportsList.length, "reports");
            } else {
              console.warn("No reports found in the response data");
            }
          } catch (error) {
            console.error("Error processing reports data:", error);
            notifications.error("حدث خطأ في معالجة بيانات التقارير");
          }
        } else {
          console.error('Failed to fetch reports:', reportsResponse.message);
          notifications.error('فشل في تحميل بيانات التقارير');
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        notifications.error("حدث خطأ أثناء تحميل البيانات الأولية");
      }
    };
    
    fetchData();
  }, []);
  
  // Update regions when governorate changes
  useEffect(() => {
    if (form.governorate) {
      const selectedGovernorate = governorates.find(g => g._id === form.governorate);
      if (selectedGovernorate) {
        setRegions(selectedGovernorate.regions);
        // Reset region if it's not in the new list
        if (!selectedGovernorate.regions.includes(form.region)) {
          setForm(prev => ({ ...prev, region: "" }));
        }
      }
    } else {
      setRegions([]);
    }
  }, [form.governorate, governorates]);
  
  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      // Handle nested properties (e.g., casualties.killed)
      const [parent, child] = name.split(".");
      
      if (parent === "casualties") {
        // Handle casualties object specifically with non-undefined values
        setForm(prev => {
          const numValue = parseInt(value) || 0;
          return {
            ...prev,
            casualties: {
              ...prev.casualties,
              [child]: numValue
            }
          };
        });
      } else {
        // Handle other nested properties
        setForm(prev => {
          const newFormValue = { ...prev };
          
          // Ensure parent property exists as an object
          if (!newFormValue[parent as keyof EventForm]) {
            (newFormValue as any)[parent] = {};
          }
          
          // Update child property
          const parentObj = (newFormValue as any)[parent];
          if (typeof parentObj === 'object') {
            parentObj[child] = value;
          }
          
          return newFormValue;
        });
      }
    } else {
      // Handle regular properties
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };
  
  // Handle adding involved party
  const handleAddParty = () => {
    if (newParty.trim()) {
      setForm(prev => {
        const currentParties = prev.involvedParties || [];
        return {
          ...prev,
          involvedParties: [...currentParties, newParty.trim()]
        };
      });
      setNewParty("");
    }
  };
  
  // Handle removing involved party
  const handleRemoveParty = (index: number) => {
    setForm(prev => {
      const currentParties = prev.involvedParties || [];
      return {
        ...prev,
        involvedParties: currentParties.filter((_, i) => i !== index)
      };
    });
  };
  
  // Handle adding file
  const handleAddFile = (file: File) => {
    setFiles(prev => [...prev, file]);
  };
  
  // Handle removing file
  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Validate reportId is present since it's required
      if (!form.reportId) {
        notifications.error("الرجاء اختيار التقرير المرتبط");
        setIsLoading(false);
        return;
      }

      // Format the date and time properly for API submission
      // Fix for "Invalid Date" error - Create a properly formatted ISO string
      const eventDateTime = new Date(`${form.eventDate}T${form.eventTime}`);
      
      if (isNaN(eventDateTime.getTime())) {
        notifications.error("تاريخ أو وقت الحدث غير صالح");
        setIsLoading(false);
        return;
      }
      
      // Format form data for API
      const eventData: any = {
        eventDate: form.eventDate,
        // Format time in ISO format to prevent "Invalid Date" error
        eventTime: eventDateTime.toISOString(),
        governorate: form.governorate,
        region: form.region,
        eventType: form.eventType,
        description: form.description,
        palestinianIntervention: form.palestinianIntervention,
        israeliResponse: form.israeliResponse,
        results: form.results,
        status: form.status, // Status should already be valid from the select options
        severity: form.severity,
        reportId: form.reportId,
        casualties: form.casualties,
        involvedParties: form.involvedParties
      };
      
      // Add debug logging to see what's being sent
      console.log("Creating event with data:", eventData);
      
      // Submit event data without eventNumber (it should be generated on the backend)
      const response = await eventsService.createEvent(eventData);
      
      if (!response.success) {
        throw new Error(response.message || "فشل في إنشاء الحدث");
      }
      
      const eventId = response.data?.id;
      
      // Upload attachments if any
      if (files.length > 0 && eventId) {
        for (const file of files) {
          await eventsService.uploadEventAttachment(eventId, file);
        }
      }
      
      notifications.success("تم إنشاء الحدث بنجاح");
      router.push("/dashboard/events");
    } catch (error: any) {
      console.error("Error creating event:", error);
      
      // Display detailed error message if available
      if (error.message) {
        notifications.error(error.message);
      } else if (error.response && error.response.data && error.response.data.message) {
        notifications.error(error.response.data.message);
      } else {
        notifications.error("حدث خطأ أثناء إنشاء الحدث");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-2 items-start md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">إضافة حدث جديد</h1>
          <p className="text-muted-foreground">قم بإدخال تفاصيل الحدث الأمني الجديد</p>
        </div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-primary hover:underline"
        >
          <ArrowRight size={16} />
          العودة
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8 bg-card rounded-lg shadow-sm border p-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">المعلومات الأساسية</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Report Selection */}
            <div>
              <label className="block text-sm font-medium mb-1 required">التقرير المرتبط</label>
              <select
                name="reportId"
                value={form.reportId || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                required
              >
                <option value="">اختر التقرير...</option>
                {reports.map(report => (
                  <option key={report.id} value={report.id}>
                    {report.reportNumber}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Event Type */}
            <div>
              <label className="block text-sm font-medium mb-1 required">نوع الحدث</label>
              <select
                name="eventType"
                value={form.eventType}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                required
              >
                <option value="security_incident">حادث أمني</option>
                <option value="arrest">اعتقال</option>
                <option value="checkpoint">حاجز</option>
                <option value="raid">مداهمة</option>
                <option value="confrontation">مواجهة</option>
                <option value="other">أخرى</option>
              </select>
            </div>
            
            {/* Severity */}
            <div>
              <label className="block text-sm font-medium mb-1 required">خطورة الحدث</label>
              <select
                name="severity"
                value={form.severity}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                required
              >
                <option value="low">منخفضة</option>
                <option value="medium">متوسطة</option>
                <option value="high">عالية</option>
                <option value="critical">حرجة</option>
              </select>
            </div>
            
            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-1 required">حالة الحدث</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                required
              >
              <option value="ongoing">قيد المتابعة</option>
              <option value="finished">انتهى</option>
              <option value="monitoring">تحت المراقبة</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Location & Time */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">المكان والوقت</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Governorate */}
            <div>
              <label className="block text-sm font-medium mb-1 required">المحافظة</label>
              <select
                name="governorate"
                value={form.governorate}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                required
              >
                <option value="">اختر المحافظة...</option>
                {governorates.map(gov => (
                  <option key={gov._id} value={gov._id}>
                    {gov.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Region */}
            <div>
              <label className="block text-sm font-medium mb-1 required">المنطقة</label>
              <select
                name="region"
                value={form.region}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                required
                disabled={!form.governorate}
              >
                <option value="">اختر المنطقة...</option>
                {regions.map(region => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Event Date */}
            <div>
              <label className="block text-sm font-medium mb-1 required">تاريخ الحدث</label>
              <div className="relative">
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="date"
                  name="eventDate"
                  value={form.eventDate}
                  onChange={handleChange}
                  className="w-full pl-10 pr-9 py-2 text-sm border rounded-md bg-background"
                  required
                />
              </div>
            </div>
            
            {/* Event Time */}
            <div>
              <label className="block text-sm font-medium mb-1 required">وقت الحدث</label>
              <div className="relative">
                <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="time"
                  name="eventTime"
                  value={form.eventTime}
                  onChange={handleChange}
                  className="w-full pl-10 pr-9 py-2 text-sm border rounded-md bg-background"
                  required
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Description */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">وصف الحدث</h2>
          
          <div>
            <label className="block text-sm font-medium mb-1 required">وصف تفصيلي للحدث</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background min-h-[100px]"
              placeholder="أدخل وصفًا تفصيليًا للحدث..."
              required
            />
          </div>
          
          {/* Involved Parties */}
          <div>
            <label className="block text-sm font-medium mb-1">الجهات المعنية</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newParty}
                onChange={(e) => setNewParty(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border rounded-md bg-background"
                placeholder="أدخل اسم الجهة..."
              />
              <button
                type="button"
                onClick={handleAddParty}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm"
              >
                إضافة
              </button>
            </div>
            
            {/* List of involved parties */}
            {form.involvedParties && form.involvedParties.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {form.involvedParties.map((party, index) => (
                  <div
                    key={index}
                    className="bg-muted px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    <span>{party}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveParty(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Response & Results */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">التدخل والنتائج</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Palestinian Intervention */}
            <div>
              <label className="block text-sm font-medium mb-1">التدخل الفلسطيني</label>
              <textarea
                name="palestinianIntervention"
                value={form.palestinianIntervention || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background min-h-[80px]"
                placeholder="أدخل تفاصيل التدخل الفلسطيني..."
              />
            </div>
            
            {/* Israeli Response */}
            <div>
              <label className="block text-sm font-medium mb-1">الرد الإسرائيلي</label>
              <textarea
                name="israeliResponse"
                value={form.israeliResponse || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border rounded-md bg-background min-h-[80px]"
                placeholder="أدخل تفاصيل الرد الإسرائيلي..."
              />
            </div>
          </div>
          
          {/* Results */}
          <div>
            <label className="block text-sm font-medium mb-1">النتائج</label>
            <textarea
              name="results"
              value={form.results || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border rounded-md bg-background min-h-[80px]"
              placeholder="أدخل نتائج الحدث..."
            />
          </div>
          
          {/* Casualties */}
          <div>
            <label className="block text-sm font-medium mb-1">الإصابات</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">القتلى</label>
                <input
                  type="number"
                  name="casualties.killed"
                  value={form.casualties.killed}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">الجرحى</label>
                <input
                  type="number"
                  name="casualties.injured"
                  value={form.casualties.injured}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">المعتقلين</label>
                <input
                  type="number"
                  name="casualties.arrested"
                  value={form.casualties.arrested}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 text-sm border rounded-md bg-background"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Attachments */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">المرفقات</h2>
          
          <FileUpload onFileSelected={handleAddFile} />
          
          {/* List of attached files */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              <label className="block text-sm font-medium mb-1">الملفات المرفقة</label>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li
                    key={index}
                    className="bg-muted p-2 rounded-md flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-muted-foreground" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({Math.round(file.size / 1024)} KB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border rounded-md text-sm hover:bg-muted"
            disabled={isLoading}
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md flex items-center gap-2 text-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                جاري الحفظ...
              </>
            ) : (
              <>حفظ الحدث</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
