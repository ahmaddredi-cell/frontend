"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Users,
  Shield,
  BookText,
  Building,
  Save,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { coordinationsService, CreateCoordinationData, governoratesService } from "@/lib/api";
import notifications from "@/lib/utils/notifications";

// Governorate interface
interface Governorate {
  _id: string;
  name: string;
  code: string;
  regions: string[];
}

// Department options (security agencies)
const departments = [
  { id: "preventive_security", name: "الأمن الوقائي" },
  { id: "intelligence", name: "المخابرات العامة" },
  { id: "police", name: "الشرطة" },
  { id: "national_security", name: "الأمن الوطني" },
  { id: "presidential_security", name: "أمن الرئاسة" },
  { id: "military_intelligence", name: "الاستخبارات العسكرية" },
  { id: "other", name: "أخرى" }
];

export default function NewCoordinationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateCoordinationData>({
    requestTime: new Date().toISOString().split('T')[0] + 'T' + new Date().toTimeString().slice(0, 5),
    returnTime: "",
    fromLocation: "",
    toLocation: "",
    department: "",
    forces: 0,
    weapons: 0,
    purpose: "",
    governorate: ""
  });
  
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: "" });
  
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
    
    // Handle numeric values
    if (name === "forces" || name === "weapons") {
      const numValue = parseInt(value);
      setFormData({
        ...formData,
        [name]: isNaN(numValue) ? 0 : numValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fromLocation) {
      setFormStatus({
        type: 'error',
        message: "يرجى تحديد مكان الانطلاق"
      });
      return;
    }
    
    if (!formData.toLocation) {
      setFormStatus({
        type: 'error',
        message: "يرجى تحديد الوجهة"
      });
      return;
    }
    
    if (!formData.department) {
      setFormStatus({
        type: 'error',
        message: "يرجى اختيار الجهاز المسؤول"
      });
      return;
    }
    
    if (!formData.governorate) {
      setFormStatus({
        type: 'error',
        message: "يرجى اختيار المحافظة"
      });
      return;
    }
    
    if (formData.forces < 1) {
      setFormStatus({
        type: 'error',
        message: "يرجى تحديد عدد القوات (يجب أن يكون على الأقل 1)"
      });
      return;
    }
    
    if (!formData.purpose.trim()) {
      setFormStatus({
        type: 'error',
        message: "يرجى تحديد الغرض من التنسيق"
      });
      return;
    }
    
    if (!formData.returnTime) {
      setFormStatus({
        type: 'error',
        message: "يرجى تحديد وقت العودة المتوقع"
      });
      return;
    }
    
    setIsSubmitting(true);
    setFormStatus({ type: null, message: "" });
    
    try {
      const response = await coordinationsService.createCoordination(formData);
      
      if (!response.success) {
        throw new Error(response.message || "حدث خطأ أثناء إنشاء طلب التنسيق");
      }
      
      // Success notification
      notifications.success("تم إنشاء طلب التنسيق بنجاح");
      
      // Set form status for UI feedback
      setFormStatus({
        type: 'success',
        message: "تم إنشاء طلب التنسيق بنجاح"
      });
      
      // Redirect after successful creation
      setTimeout(() => {
        router.push('/dashboard/coordinations');
      }, 1500);
      
    } catch (error) {
      console.error("Error submitting coordination:", error);
      
      notifications.error(
        error instanceof Error ? error.message : "حدث خطأ أثناء إنشاء طلب التنسيق"
      );
      
      setFormStatus({
        type: 'error',
        message: error instanceof Error 
          ? error.message 
          : "حدث خطأ أثناء إنشاء طلب التنسيق",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-2 items-start md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">إنشاء طلب تنسيق جديد</h1>
          <p className="text-muted-foreground">قم بإدخال تفاصيل طلب التنسيق الجديد</p>
        </div>
        <Link
          href="/dashboard/coordinations"
          className="flex items-center gap-1 text-primary hover:underline"
        >
          <ArrowRight size={16} />
          العودة إلى قائمة التنسيقات
        </Link>
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
      
      <form onSubmit={handleSubmit} className="space-y-8 bg-card rounded-lg shadow-sm border p-6">
        {/* Times Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">الوقت والمكان</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Request Time */}
            <div>
              <label className="block text-sm font-medium mb-1">
                وقت التنسيق <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="datetime-local"
                  name="requestTime"
                  value={formData.requestTime}
                  onChange={handleChange}
                  className="w-full pl-3 pr-9 py-2 text-sm border rounded-md bg-background"
                  required
                />
              </div>
            </div>
            
            {/* Return Time */}
            <div>
              <label className="block text-sm font-medium mb-1">
                وقت العودة المتوقع <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="datetime-local"
                  name="returnTime"
                  value={formData.returnTime}
                  onChange={handleChange}
                  className="w-full pl-3 pr-9 py-2 text-sm border rounded-md bg-background"
                  required
                />
              </div>
            </div>
            
            {/* Governorate */}
            <div>
              <label className="block text-sm font-medium mb-1">
                المحافظة <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <select
                  name="governorate"
                  value={formData.governorate}
                  onChange={handleChange}
                  className="w-full pl-3 pr-9 py-2 text-sm border rounded-md bg-background"
                  required
                >
                  <option value="">اختر المحافظة</option>
                  {governorates.map((gov) => (
                    <option key={gov._id} value={gov._id}>
                      {gov.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Department */}
            <div>
              <label className="block text-sm font-medium mb-1">
                الجهاز المسؤول <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full pl-3 pr-9 py-2 text-sm border rounded-md bg-background"
                  required
                >
                  <option value="">اختر الجهاز</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Location Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2">تفاصيل التحرك</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* From Location */}
            <div>
              <label className="block text-sm font-medium mb-1">
                من موقع <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  name="fromLocation"
                  value={formData.fromLocation}
                  onChange={handleChange}
                  className="w-full pl-3 pr-9 py-2 text-sm border rounded-md bg-background"
                  placeholder="مكان الانطلاق"
                  required
                />
              </div>
            </div>
            
            {/* To Location */}
            <div>
              <label className="block text-sm font-medium mb-1">
                إلى موقع <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  name="toLocation"
                  value={formData.toLocation}
                  onChange={handleChange}
                  className="w-full pl-3 pr-9 py-2 text-sm border rounded-md bg-background"
                  placeholder="الوجهة"
                  required
                />
              </div>
            </div>
            
            {/* Number of Forces */}
            <div>
              <label className="block text-sm font-medium mb-1">
                عدد القوات <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Users className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="number"
                  name="forces"
                  value={formData.forces}
                  onChange={handleChange}
                  min="1"
                  className="w-full pl-3 pr-9 py-2 text-sm border rounded-md bg-background"
                  required
                />
              </div>
            </div>
            
            {/* Number of Weapons */}
            <div>
              <label className="block text-sm font-medium mb-1">
                عدد الأسلحة <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Shield className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="number"
                  name="weapons"
                  value={formData.weapons}
                  onChange={handleChange}
                  min="0"
                  className="w-full pl-3 pr-9 py-2 text-sm border rounded-md bg-background"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium mb-1">
              الغرض من التحرك <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <BookText className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                rows={3}
                className="w-full pl-3 pr-9 py-2 text-sm border rounded-md bg-background"
                placeholder="ادخل الغرض من التحرك بالتفصيل"
                required
              ></textarea>
            </div>
          </div>
        </div>
        
        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border rounded-md text-sm hover:bg-muted"
            disabled={isSubmitting}
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md flex items-center gap-2 text-sm"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                جاري الإرسال...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                إرسال طلب التنسيق
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
