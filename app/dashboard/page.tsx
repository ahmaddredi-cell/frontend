"use client";

import { useState } from "react";
import {
  BarChart,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  ShieldAlert,
  Users,
  AlarmClock,
} from "lucide-react";
import Link from "next/link";

// Mock data for demonstration
const stats = [
  { 
    title: "إجمالي التقارير", 
    value: 124, 
    icon: <FileText className="text-blue-500" size={24} />,
    change: "+12% من الشهر الماضي",
    positive: true
  },
  { 
    title: "الأحداث النشطة", 
    value: 42, 
    icon: <ShieldAlert className="text-red-500" size={24} />,
    change: "+5% من الشهر الماضي",
    positive: false
  },
  { 
    title: "تنسيقات قيد الانتظار", 
    value: 8, 
    icon: <Clock className="text-orange-500" size={24} />,
    change: "-10% من الشهر الماضي",
    positive: true
  },
  { 
    title: "المستخدمون النشطون", 
    value: 18, 
    icon: <Users className="text-green-500" size={24} />,
    change: "مستقر",
    positive: true
  },
];

const recentReports = [
  { id: 1, type: "صباحي", date: "14/04/2025", status: "مكتمل", events: 5 },
  { id: 2, type: "مسائي", date: "13/04/2025", status: "مكتمل", events: 7 },
  { id: 3, type: "صباحي", date: "13/04/2025", status: "مكتمل", events: 3 },
  { id: 4, type: "مسائي", date: "12/04/2025", status: "مكتمل", events: 9 },
  { id: 5, type: "صباحي", date: "12/04/2025", status: "مكتمل", events: 4 },
];

const pendingCoordinations = [
  { id: 101, requestTime: "09:15", fromLocation: "نابلس", toLocation: "رام الله", purpose: "نقل معدات", status: "قيد الانتظار" },
  { id: 102, requestTime: "10:30", fromLocation: "الخليل", toLocation: "بيت لحم", purpose: "مهمة أمنية", status: "قيد الانتظار" },
  { id: 103, requestTime: "11:45", fromLocation: "جنين", toLocation: "طوباس", purpose: "تفتيش دوري", status: "قيد الانتظار" },
];

const eventsByGovernorate = [
  { name: "رام الله", events: 28 },
  { name: "نابلس", events: 22 },
  { name: "الخليل", events: 19 },
  { name: "القدس", events: 15 },
  { name: "جنين", events: 11 },
  { name: "بيت لحم", events: 9 },
];

export default function DashboardPage() {
  const [selectedTab, setSelectedTab] = useState("overview");
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground ml-2">{new Date().toLocaleDateString('ar-EG')}</span>
          <Calendar size={16} />
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-card rounded-lg p-4 shadow-sm border">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className={`text-xs mt-1 ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.change}
                </p>
              </div>
              <div className="p-2 bg-background rounded-full">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Tabs */}
      <div className="border-b">
        <div className="flex space-x-4">
          <button
            className={`py-2 px-1 text-sm font-medium ${
              selectedTab === "overview"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
            onClick={() => setSelectedTab("overview")}
          >
            نظرة عامة
          </button>
          <button
            className={`py-2 px-1 text-sm font-medium ${
              selectedTab === "reports"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
            onClick={() => setSelectedTab("reports")}
          >
            التقارير
          </button>
          <button
            className={`py-2 px-1 text-sm font-medium ${
              selectedTab === "coordinations"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
            onClick={() => setSelectedTab("coordinations")}
          >
            التنسيقات
          </button>
        </div>
      </div>
      
      {/* Content based on selected tab */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent reports */}
        <div className="lg:col-span-2 bg-card rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">آخر التقارير</h2>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-muted-foreground">
                    <th className="text-right p-2">رقم</th>
                    <th className="text-right p-2">النوع</th>
                    <th className="text-right p-2">التاريخ</th>
                    <th className="text-right p-2">الحالة</th>
                    <th className="text-right p-2">الأحداث</th>
                    <th className="text-right p-2">عرض</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReports.map((report) => (
                    <tr key={report.id} className="border-t text-sm">
                      <td className="p-2">{report.id}</td>
                      <td className="p-2">{report.type}</td>
                      <td className="p-2" dir="ltr">{report.date}</td>
                      <td className="p-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle size={12} className="ml-1" /> {report.status}
                        </span>
                      </td>
                      <td className="p-2">{report.events}</td>
                      <td className="p-2">
                        <Link
                          href={`/dashboard/reports/${report.id}`}
                          className="text-primary hover:underline"
                        >
                          عرض
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/dashboard/reports"
                className="text-sm text-primary hover:underline"
              >
                عرض جميع التقارير
              </Link>
            </div>
          </div>
        </div>

        {/* Pending coordinations */}
        <div className="lg:col-span-1 bg-card rounded-lg shadow-sm border">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium">تنسيقات قيد الانتظار</h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {pendingCoordinations.map((coordination) => (
                <div key={coordination.id} className="border rounded-md p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">طلب #{coordination.id}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      <AlarmClock size={12} className="ml-1" /> {coordination.status}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <div className="flex justify-between mb-1">
                      <span>من: {coordination.fromLocation}</span>
                      <span>إلى: {coordination.toLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>الغرض: {coordination.purpose}</span>
                      <span dir="ltr">{coordination.requestTime}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex space-x-2 justify-end">
                    <Link
                      href={`/dashboard/coordinations/${coordination.id}`}
                      className="text-xs text-primary hover:underline"
                    >
                      عرض التفاصيل
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/dashboard/coordinations"
                className="text-sm text-primary hover:underline"
              >
                عرض جميع التنسيقات
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Events by governorate */}
      <div className="bg-card rounded-lg shadow-sm border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-medium">الأحداث حسب المحافظة</h2>
        </div>
        <div className="p-4">
          <div className="flex items-center">
            <div className="w-full">
              <div className="space-y-4">
                {eventsByGovernorate.map((gov) => (
                  <div key={gov.name} className="flex items-center">
                    <div className="w-32 font-medium text-sm">{gov.name}</div>
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(gov.events / Math.max(...eventsByGovernorate.map(g => g.events))) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-12 text-right text-sm font-medium">{gov.events}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>نظام إدارة التقارير الأمنية | جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}
