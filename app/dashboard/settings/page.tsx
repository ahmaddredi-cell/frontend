"use client";

import { useState } from "react";
import { 
  Save, 
  Settings as SettingsIcon, 
  User,
  Bell,
  Database,
  Globe,
  Moon,
  Sun,
  Laptop,
  FileUp,
  DownloadCloud,
  RefreshCw,
  Check,
  X,
  Shield,
  Key
} from "lucide-react";

// Mock data for system settings
const systemSettings = {
  companyName: "وزارة الداخلية",
  systemTitle: "نظام إدارة التقارير الأمنية الشاملة",
  logoPath: "/assets/logo.png",
  defaultGovernorate: "المقر العام",
  sessionTimeout: 30, // minutes
  maxLoginAttempts: 5,
  twoFactorAuth: false,
  mainColor: "#1E40AF",
  secondaryColor: "#6B7280",
  apiUrl: "https://api.example.com/v1",
  apiTimeout: 30000, // milliseconds
  autoBackup: true,
  backupFrequency: "daily", // daily, weekly, monthly
  backupTime: "02:00", // 24-hour format
  dataRetentionPeriod: 365, // days
  maxFileSize: 10, // MB
  allowedFileTypes: "pdf,docx,xlsx,jpg,png",
  notifyOnLogin: true,
  notifyOnReportCreation: true,
  notifyOnCoordinationResponse: true,
  enableDarkMode: true,
  rtlLayout: true,
  language: "ar",
};

type SettingsTab = "system" | "profile" | "appearance" | "notifications" | "security" | "backup";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("system");
  const [settings, setSettings] = useState(systemSettings);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Handle checkboxes
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setSettings({ ...settings, [name]: checked });
    } else {
      setSettings({ ...settings, [name]: value });
    }
  };
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would call an API to save settings
    console.log("Saving settings:", settings);
    
    // Simulate API success
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };
  
  const handleBackup = () => {
    // In a real app, this would trigger a backup process
    console.log("Backing up data");
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };
  
  const handleRestore = () => {
    // In a real app, this would handle file upload and restoration
    console.log("Restoring data");
  };
  
  const getTabContent = () => {
    switch (activeTab) {
      case "system":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  اسم المؤسسة
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={settings.companyName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  عنوان النظام
                </label>
                <input
                  type="text"
                  name="systemTitle"
                  value={settings.systemTitle}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  المحافظة الافتراضية
                </label>
                <select
                  name="defaultGovernorate"
                  value={settings.defaultGovernorate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="المقر العام">المقر العام</option>
                  <option value="رام الله">رام الله</option>
                  <option value="نابلس">نابلس</option>
                  <option value="الخليل">الخليل</option>
                  <option value="القدس">القدس</option>
                  <option value="جنين">جنين</option>
                  <option value="بيت لحم">بيت لحم</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  الحد الأقصى لمحاولات تسجيل الدخول
                </label>
                <input
                  type="number"
                  name="maxLoginAttempts"
                  value={settings.maxLoginAttempts}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border rounded-md bg-background"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  مدة الجلسة (بالدقائق)
                </label>
                <input
                  type="number"
                  name="sessionTimeout"
                  value={settings.sessionTimeout}
                  onChange={handleChange}
                  min="5"
                  max="120"
                  className="w-full px-3 py-2 border rounded-md bg-background"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  اللغة الافتراضية
                </label>
                <select
                  name="language"
                  value={settings.language}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="ar">العربية</option>
                  <option value="en">الإنجليزية</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2 md:col-span-2">
                <input
                  type="checkbox"
                  id="twoFactorAuth"
                  name="twoFactorAuth"
                  checked={settings.twoFactorAuth}
                  onChange={handleChange}
                  className="h-4 w-4 ml-2 text-primary bg-background rounded border-input"
                />
                <label htmlFor="twoFactorAuth" className="text-sm">
                  تفعيل المصادقة الثنائية لتسجيل الدخول
                </label>
              </div>
            </div>
          </div>
        );
        
      case "appearance":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  اللون الأساسي
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    name="mainColor"
                    value={settings.mainColor}
                    onChange={handleChange}
                    className="h-10 w-10 rounded-full overflow-hidden ml-2 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.mainColor}
                    onChange={handleChange}
                    name="mainColor"
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  اللون الثانوي
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    name="secondaryColor"
                    value={settings.secondaryColor}
                    onChange={handleChange}
                    className="h-10 w-10 rounded-full overflow-hidden ml-2 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.secondaryColor}
                    onChange={handleChange}
                    name="secondaryColor"
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-medium mb-4">وضع العرض</h3>
              <div className="grid grid-cols-3 gap-4">
                <button
                  onClick={() => setIsDarkMode(false)}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                    !isDarkMode ? "bg-primary/10 border-primary" : ""
                  }`}
                >
                  <Sun size={24} className={!isDarkMode ? "text-primary" : ""} />
                  <span className="mt-2 text-sm">فاتح</span>
                </button>
                
                <button
                  onClick={() => setIsDarkMode(true)}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                    isDarkMode ? "bg-primary/10 border-primary" : ""
                  }`}
                >
                  <Moon size={24} className={isDarkMode ? "text-primary" : ""} />
                  <span className="mt-2 text-sm">داكن</span>
                </button>
                
                <button
                  onClick={() => setIsDarkMode(false)}
                  className="flex flex-col items-center justify-center p-4 rounded-lg border"
                >
                  <Laptop size={24} />
                  <span className="mt-2 text-sm">تلقائي</span>
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="rtlLayout"
                name="rtlLayout"
                checked={settings.rtlLayout}
                onChange={handleChange}
                className="h-4 w-4 ml-2 text-primary bg-background rounded border-input"
              />
              <label htmlFor="rtlLayout" className="text-sm">
                تفعيل تخطيط من اليمين إلى اليسار (RTL)
              </label>
            </div>
          </div>
        );
        
      case "notifications":
        return (
          <div className="space-y-6">
            <div className="bg-card p-4 rounded-lg border space-y-4">
              <h3 className="font-medium mb-2">إعدادات الإشعارات</h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="ml-2" size={18} />
                  <label htmlFor="notifyOnLogin" className="text-sm">
                    إشعار عند تسجيل الدخول
                  </label>
                </div>
                <input
                  type="checkbox"
                  id="notifyOnLogin"
                  name="notifyOnLogin"
                  checked={settings.notifyOnLogin}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary bg-background rounded border-input"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="ml-2" size={18} />
                  <label htmlFor="notifyOnReportCreation" className="text-sm">
                    إشعار عند إنشاء تقرير جديد
                  </label>
                </div>
                <input
                  type="checkbox"
                  id="notifyOnReportCreation"
                  name="notifyOnReportCreation"
                  checked={settings.notifyOnReportCreation}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary bg-background rounded border-input"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="ml-2" size={18} />
                  <label htmlFor="notifyOnCoordinationResponse" className="text-sm">
                    إشعار عند الرد على طلب تنسيق
                  </label>
                </div>
                <input
                  type="checkbox"
                  id="notifyOnCoordinationResponse"
                  name="notifyOnCoordinationResponse"
                  checked={settings.notifyOnCoordinationResponse}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary bg-background rounded border-input"
                />
              </div>
            </div>
          </div>
        );
        
      case "backup":
        return (
          <div className="space-y-6">
            <div className="bg-card p-4 rounded-lg border space-y-4">
              <h3 className="font-medium mb-2">إعدادات النسخ الاحتياطي</h3>
              
              <div className="flex items-center space-x-2 mb-4">
                <input
                  type="checkbox"
                  id="autoBackup"
                  name="autoBackup"
                  checked={settings.autoBackup}
                  onChange={handleChange}
                  className="h-4 w-4 ml-2 text-primary bg-background rounded border-input"
                />
                <label htmlFor="autoBackup" className="text-sm">
                  تفعيل النسخ الاحتياطي التلقائي
                </label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    تكرار النسخ الاحتياطي
                  </label>
                  <select
                    name="backupFrequency"
                    value={settings.backupFrequency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    disabled={!settings.autoBackup}
                  >
                    <option value="daily">يومي</option>
                    <option value="weekly">أسبوعي</option>
                    <option value="monthly">شهري</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    وقت النسخ الاحتياطي
                  </label>
                  <input
                    type="time"
                    name="backupTime"
                    value={settings.backupTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    disabled={!settings.autoBackup}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    مدة الاحتفاظ بالبيانات (بالأيام)
                  </label>
                  <input
                    type="number"
                    name="dataRetentionPeriod"
                    value={settings.dataRetentionPeriod}
                    onChange={handleChange}
                    min="30"
                    max="3650"
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </div>
              </div>
              
              <div className="pt-4 border-t mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={handleBackup}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md flex items-center text-sm"
                >
                  <DownloadCloud size={16} className="ml-2" />
                  إنشاء نسخة احتياطية الآن
                </button>
                
                <label className="bg-muted text-muted-foreground hover:bg-muted/80 px-4 py-2 rounded-md flex items-center text-sm cursor-pointer">
                  <FileUp size={16} className="ml-2" />
                  استعادة من نسخة احتياطية
                  <input type="file" className="hidden" onChange={handleRestore} />
                </label>
              </div>
            </div>
          </div>
        );
        
      case "security":
        return (
          <div className="space-y-6">
            <div className="bg-card p-4 rounded-lg border space-y-4">
              <h3 className="font-medium mb-2">إعدادات الأمان</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    الحد الأدنى لطول كلمة المرور
                  </label>
                  <input
                    type="number"
                    name="minPasswordLength"
                    value={8}
                    min="6"
                    max="16"
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">
                    تغيير كلمة المرور الإجباري (بالأيام)
                  </label>
                  <input
                    type="number"
                    name="passwordChangeInterval"
                    value={90}
                    min="30"
                    max="365"
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </div>
              </div>
              
              <div className="pt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="requireUppercase"
                    checked
                    className="h-4 w-4 ml-2 text-primary bg-background rounded border-input"
                  />
                  <label htmlFor="requireUppercase" className="text-sm">
                    تتطلب كلمة المرور حروف كبيرة
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="requireNumbers"
                    checked
                    className="h-4 w-4 ml-2 text-primary bg-background rounded border-input"
                  />
                  <label htmlFor="requireNumbers" className="text-sm">
                    تتطلب كلمة المرور أرقام
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="requireSpecialChars"
                    checked
                    className="h-4 w-4 ml-2 text-primary bg-background rounded border-input"
                  />
                  <label htmlFor="requireSpecialChars" className="text-sm">
                    تتطلب كلمة المرور رموز خاصة
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="twoFactorAuth"
                    name="twoFactorAuth"
                    checked={settings.twoFactorAuth}
                    onChange={handleChange}
                    className="h-4 w-4 ml-2 text-primary bg-background rounded border-input"
                  />
                  <label htmlFor="twoFactorAuth" className="text-sm">
                    تفعيل المصادقة الثنائية لتسجيل الدخول
                  </label>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-4 rounded-lg border">
              <h3 className="font-medium mb-4">مفاتيح API</h3>
              
              <div className="border rounded-md p-3 bg-muted/20 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-sm font-medium">المفتاح الرئيسي</h4>
                    <div className="flex items-center mt-1">
                      <input 
                        type="password" 
                        value="sk_live_51Abcdefghijklmnopqrstuvwxyz"
                        readOnly
                        className="bg-background border px-2 py-1 text-xs rounded w-64"
                      />
                      <button className="text-xs text-primary hover:underline mr-2">
                        عرض
                      </button>
                    </div>
                  </div>
                  <button className="text-xs text-primary hover:underline">
                    إعادة توليد
                  </button>
                </div>
              </div>
              
              <button className="text-xs flex items-center text-primary hover:underline">
                <Key size={12} className="ml-1" />
                إنشاء مفتاح API جديد
              </button>
            </div>
          </div>
        );
        
      case "profile":
        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3">
                <div className="bg-card p-4 rounded-lg border flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold mb-4">
                    أم
                  </div>
                  
                  <h3 className="text-lg font-medium">أحمد محمود</h3>
                  <p className="text-muted-foreground text-sm">مدير النظام</p>
                  
                  <button className="mt-4 text-sm text-primary hover:underline">
                    تغيير الصورة
                  </button>
                </div>
              </div>
              
              <div className="md:w-2/3">
                <div className="bg-card p-4 rounded-lg border">
                  <h3 className="font-medium mb-4">المعلومات الشخصية</h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          الاسم الكامل
                        </label>
                        <input
                          type="text"
                          value="أحمد محمود"
                          className="w-full px-3 py-2 border rounded-md bg-background"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          اسم المستخدم
                        </label>
                        <input
                          type="text"
                          value="admin"
                          className="w-full px-3 py-2 border rounded-md bg-background"
                          readOnly
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          البريد الإلكتروني
                        </label>
                        <input
                          type="email"
                          value="admin@example.com"
                          className="w-full px-3 py-2 border rounded-md bg-background"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          رقم الهاتف
                        </label>
                        <input
                          type="tel"
                          value="+970 59 123 4567"
                          className="w-full px-3 py-2 border rounded-md bg-background"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card p-4 rounded-lg border mt-4">
                  <h3 className="font-medium mb-4">تغيير كلمة المرور</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        كلمة المرور الحالية
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border rounded-md bg-background"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        كلمة المرور الجديدة
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border rounded-md bg-background"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        تأكيد كلمة المرور الجديدة
                      </label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border rounded-md bg-background"
                      />
                    </div>
                    
                    <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm">
                      تغيير كلمة المرور
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <SettingsIcon className="ml-2" size={24} />
          الإعدادات
        </h1>
      </div>
      
      {/* Settings tabs */}
      <div className="border-b">
        <div className="flex overflow-x-auto">
          <button
            className={`px-4 py-2 font-medium text-sm border-b-2 -mb-px flex items-center ${
              activeTab === "system"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("system")}
          >
            <Globe className="ml-2" size={16} />
            النظام
          </button>
          
          <button
            className={`px-4 py-2 font-medium text-sm border-b-2 -mb-px flex items-center ${
              activeTab === "appearance"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("appearance")}
          >
            <Sun className="ml-2" size={16} />
            المظهر
          </button>
          
          <button
            className={`px-4 py-2 font-medium text-sm border-b-2 -mb-px flex items-center ${
              activeTab === "notifications"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("notifications")}
          >
            <Bell className="ml-2" size={16} />
            الإشعارات
          </button>
          
          <button
            className={`px-4 py-2 font-medium text-sm border-b-2 -mb-px flex items-center ${
              activeTab === "security"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("security")}
          >
            <Shield className="ml-2" size={16} />
            الأمان
          </button>
          
          <button
            className={`px-4 py-2 font-medium text-sm border-b-2 -mb-px flex items-center ${
              activeTab === "backup"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("backup")}
          >
            <Database className="ml-2" size={16} />
            النسخ الاحتياطي والاستعادة
          </button>
          
          <button
            className={`px-4 py-2 font-medium text-sm border-b-2 -mb-px flex items-center ${
              activeTab === "profile"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <User className="ml-2" size={16} />
            الملف الشخصي
          </button>
        </div>
      </div>
      
      {/* Tab content */}
      <div className="pt-6">
        {getTabContent()}
      </div>
      
      {/* Save button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md flex items-center text-sm font-medium"
        >
          <Save size={16} className="ml-2" />
          حفظ الإعدادات
        </button>
      </div>
      
      {/* Success/Error notifications */}
      {isSuccess && (
        <div className="fixed bottom-4 left-4 bg-green-50 border border-green-200 text-green-800 px-4 py-2 rounded-md flex items-center shadow-md">
          <Check size={16} className="ml-2 text-green-500" />
          تم حفظ الإعدادات بنجاح
        </div>
      )}
      
      {isError && (
        <div className="fixed bottom-4 left-4 bg-red-50 border border-red-200 text-red-800 px-4 py-2 rounded-md flex items-center shadow-md">
          <X size={16} className="ml-2 text-red-500" />
          حدث خطأ أثناء حفظ الإعدادات
        </div>
      )}
    </div>
  );
}
