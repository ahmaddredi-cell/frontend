"use client";

import { useState } from "react";
import { 
  BarChart, 
  Calendar, 
  ChevronDown, 
  Download, 
  Filter, 
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  Calendar as CalendarIcon,
  Shield,
  ClipboardList,
  Clock
} from "lucide-react";

// Mock data for demonstration
const monthlyData = [
  { month: "يناير", events: 120, coordinations: 85 },
  { month: "فبراير", events: 135, coordinations: 92 },
  { month: "مارس", events: 142, coordinations: 88 },
  { month: "أبريل", events: 158, coordinations: 105 },
  { month: "مايو", events: 165, coordinations: 112 },
  { month: "يونيو", events: 178, coordinations: 125 },
  { month: "يوليو", events: 190, coordinations: 130 },
  { month: "أغسطس", events: 182, coordinations: 120 },
  { month: "سبتمبر", events: 195, coordinations: 132 },
  { month: "أكتوبر", events: 210, coordinations: 145 },
  { month: "نوفمبر", events: 228, coordinations: 152 },
  { month: "ديسمبر", events: 240, coordinations: 165 },
];

const eventsByGovernorate = [
  { name: "رام الله", events: 310, percentage: 25 },
  { name: "نابلس", events: 245, percentage: 20 },
  { name: "الخليل", events: 195, percentage: 16 },
  { name: "القدس", events: 150, percentage: 12 },
  { name: "جنين", events: 120, percentage: 10 },
  { name: "بيت لحم", events: 95, percentage: 8 },
  { name: "طولكرم", events: 65, percentage: 5 },
  { name: "أريحا", events: 55, percentage: 4 },
];

const eventsByType = [
  { type: "اعتقال", count: 340, color: "bg-blue-500" },
  { type: "مداهمة", count: 280, color: "bg-amber-500" },
  { type: "حواجز عسكرية", count: 210, color: "bg-green-500" },
  { type: "إطلاق نار", count: 180, color: "bg-red-500" },
  { type: "مستوطنون", count: 150, color: "bg-purple-500" },
  { type: "أخرى", count: 120, color: "bg-gray-500" },
];

const coordinationStatus = [
  { status: "منجز", count: 580, percentage: 60, color: "bg-green-500" },
  { status: "مرفوض", count: 195, percentage: 20, color: "bg-red-500" },
  { status: "قيد الانتظار", count: 145, percentage: 15, color: "bg-amber-500" },
  { status: "ملغي", count: 50, percentage: 5, color: "bg-slate-500" },
];

export default function StatisticsPage() {
  const [timeRange, setTimeRange] = useState("year");
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedGovernorate, setSelectedGovernorate] = useState("all");
  
  // Summary metrics
  const totalReports = 685;
  const totalEvents = 1280;
  const totalCoordinations = 970;
  const pendingCoordinations = 145;
  
  const eventsChange = +12.5; // percentage change
  const coordinationsChange = +8.3; // percentage change
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center">
          <BarChart className="ml-2" size={24} />
          الإحصائيات والتحليلات
        </h1>
        
        <div className="flex space-x-2">
          <button className="flex items-center px-4 py-2 text-sm font-medium bg-muted rounded-md hover:bg-muted/80">
            <Filter size={16} className="ml-2" />
            فلترة متقدمة
          </button>
          <button className="flex items-center px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            <Download size={16} className="ml-2" />
            تصدير التقرير
          </button>
        </div>
      </div>
      
      {/* Time period selection */}
      <div className="flex items-center justify-between bg-card rounded-lg shadow-sm border p-4">
        <div className="flex items-center">
          <CalendarIcon size={18} className="ml-2 text-muted-foreground" />
          <span className="text-sm font-medium">الفترة الزمنية:</span>
        </div>
        
        <div className="flex space-x-1">
          <button
            className={`px-4 py-2 text-sm rounded-md ${
              timeRange === "month" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
            onClick={() => setTimeRange("month")}
          >
            شهر
          </button>
          <button
            className={`px-4 py-2 text-sm rounded-md ${
              timeRange === "quarter" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
            onClick={() => setTimeRange("quarter")}
          >
            ربع سنوي
          </button>
          <button
            className={`px-4 py-2 text-sm rounded-md ${
              timeRange === "year" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
            onClick={() => setTimeRange("year")}
          >
            سنة
          </button>
        </div>
        
        <div className="relative">
          <select
            className="appearance-none px-4 py-2 pr-8 border rounded-md bg-background text-sm"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            <option value={2025}>2025</option>
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
          </select>
          <ChevronDown size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-muted-foreground" />
        </div>
        
        <div className="relative">
          <select
            className="appearance-none px-4 py-2 pr-8 border rounded-md bg-background text-sm"
            value={selectedGovernorate}
            onChange={(e) => setSelectedGovernorate(e.target.value)}
          >
            <option value="all">جميع المحافظات</option>
            <option value="ramallah">رام الله</option>
            <option value="nablus">نابلس</option>
            <option value="hebron">الخليل</option>
            <option value="jerusalem">القدس</option>
            <option value="jenin">جنين</option>
            <option value="bethlehem">بيت لحم</option>
          </select>
          <ChevronDown size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-muted-foreground" />
        </div>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg shadow-sm border p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground mb-1">إجمالي التقارير</p>
              <h3 className="text-2xl font-bold">{totalReports}</h3>
              <p className="text-xs mt-1 text-green-500">
                +5.2% من الفترة السابقة
              </p>
            </div>
            <div className="p-2 bg-background rounded-full text-primary">
              <ClipboardList size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground mb-1">إجمالي الأحداث</p>
              <h3 className="text-2xl font-bold">{totalEvents}</h3>
              <p className={`text-xs mt-1 ${eventsChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {eventsChange > 0 ? '+' : ''}{eventsChange}% من الفترة السابقة
              </p>
            </div>
            <div className="p-2 bg-background rounded-full text-red-500">
              <Shield size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground mb-1">إجمالي التنسيقات</p>
              <h3 className="text-2xl font-bold">{totalCoordinations}</h3>
              <p className={`text-xs mt-1 ${coordinationsChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {coordinationsChange > 0 ? '+' : ''}{coordinationsChange}% من الفترة السابقة
              </p>
            </div>
            <div className="p-2 bg-background rounded-full text-primary">
              <Calendar size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg shadow-sm border p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground mb-1">تنسيقات قيد الانتظار</p>
              <h3 className="text-2xl font-bold">{pendingCoordinations}</h3>
              <p className="text-xs mt-1 text-amber-500">
                تحتاج إلى مراجعة
              </p>
            </div>
            <div className="p-2 bg-background rounded-full text-amber-500">
              <Clock size={24} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Events and Coordinations Trend */}
        <div className="bg-card rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">اتجاهات الأحداث والتنسيقات</h3>
            <div className="flex items-center text-xs space-x-3">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-primary mr-1"></div>
                <span>الأحداث</span>
              </div>
              <div className="flex items-center mr-3">
                <div className="w-3 h-3 rounded-full bg-amber-400 mr-1"></div>
                <span>التنسيقات</span>
              </div>
            </div>
          </div>
          
          {/* Simulated line chart */}
          <div className="relative h-60">
            <div className="absolute inset-0">
              {/* Y-axis labels */}
              <div className="absolute -right-10 top-0 text-xs text-muted-foreground">250</div>
              <div className="absolute -right-10 top-1/4 text-xs text-muted-foreground">200</div>
              <div className="absolute -right-10 top-1/2 text-xs text-muted-foreground">150</div>
              <div className="absolute -right-10 top-3/4 text-xs text-muted-foreground">100</div>
              <div className="absolute -right-10 bottom-0 text-xs text-muted-foreground">50</div>
              
              {/* Grid lines */}
              <div className="absolute left-0 right-0 top-0 border-t border-dashed border-muted"></div>
              <div className="absolute left-0 right-0 top-1/4 border-t border-dashed border-muted"></div>
              <div className="absolute left-0 right-0 top-1/2 border-t border-dashed border-muted"></div>
              <div className="absolute left-0 right-0 top-3/4 border-t border-dashed border-muted"></div>
              <div className="absolute left-0 right-0 bottom-0 border-t border-dashed border-muted"></div>
              
              {/* Chart lines (simulated) */}
              <div className="absolute left-0 right-0 bottom-0 h-3/4 bg-primary/10 rounded-lg"></div>
              <div className="absolute left-0 right-0 bottom-0 h-1/2 bg-amber-400/10 rounded-lg"></div>
              
              {/* Trend indicators */}
              <div className="absolute top-4 right-4 flex items-center bg-green-50 text-green-700 px-2 py-1 rounded text-xs">
                <TrendingUp size={14} className="ml-1" />
                +15% من العام السابق
              </div>
            </div>
          </div>
          
          {/* X-axis labels */}
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            {monthlyData.map((item, index) => (
              <div key={index} className={index % 2 === 0 ? "" : "invisible md:visible"}>
                {item.month.substring(0, 3)}
              </div>
            ))}
          </div>
        </div>

        {/* Events by governorate */}
        <div className="bg-card rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium mb-6">توزيع الأحداث حسب المحافظة</h3>
          
          <div className="space-y-4">
            {eventsByGovernorate.map((gov, index) => (
              <div key={index} className="flex items-center">
                <div className="w-28 font-medium text-sm">{gov.name}</div>
                <div className="flex-1 mx-2">
                  <div className="h-4 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${gov.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-16 text-right text-sm">{gov.events}</div>
                <div className="w-12 text-right text-xs text-muted-foreground">{gov.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Event types pie chart */}
        <div className="bg-card rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium mb-6">أنواع الأحداث</h3>
          
          <div className="flex">
            {/* Simulated pie chart */}
            <div className="relative w-44 h-44">
              <div className="absolute inset-0 rounded-full bg-muted"></div>
              
              {/* Pie slices (simulated) */}
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-blue-500 rounded-full clip-circle-right" style={{ clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 50% 100%)' }}></div>
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-amber-500 rounded-full" style={{ clipPath: 'polygon(50% 50%, 50% 0, 0 0, 0 50%)' }}></div>
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-green-500 rounded-full" style={{ clipPath: 'polygon(50% 50%, 0 50%, 0 100%, 30% 100%)' }}></div>
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-red-500 rounded-full" style={{ clipPath: 'polygon(50% 50%, 30% 100%, 70% 100%)' }}></div>
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-purple-500 rounded-full" style={{ clipPath: 'polygon(50% 50%, 70% 100%, 100% 100%, 100% 80%)' }}></div>
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-gray-500 rounded-full" style={{ clipPath: 'polygon(50% 50%, 100% 80%, 100% 40%)' }}></div>
              
              {/* Center white circle */}
              <div className="absolute inset-0 m-4 bg-card rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">1,280</div>
                  <div className="text-xs text-muted-foreground">إجمالي الأحداث</div>
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex-1 mr-4 space-y-3">
              {eventsByType.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${item.color} mr-2`}></div>
                    <span className="text-sm">{item.type}</span>
                  </div>
                  <div className="text-sm font-medium">{item.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Coordination status */}
        <div className="bg-card rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-medium mb-6">حالة طلبات التنسيق</h3>
          
          <div className="space-y-6">
            <div className="flex justify-between text-sm">
              <div>
                <span className="font-medium text-3xl">970</span>
                <span className="text-muted-foreground mr-2">طلب تنسيق</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-green-500 flex items-center">
                  <TrendingUp size={14} className="ml-1" />
                  8.3%+
                </span>
                <span className="text-xs text-muted-foreground">من الفترة السابقة</span>
              </div>
            </div>
            
            <div className="h-4 w-full bg-muted rounded-full overflow-hidden flex">
              {coordinationStatus.map((status, index) => (
                <div 
                  key={index}
                  className={`h-full ${status.color}`}
                  style={{ width: `${status.percentage}%` }}
                ></div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {coordinationStatus.map((status, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${status.color} ml-2`}></div>
                  <div className="flex-1">
                    <div className="text-sm">{status.status}</div>
                    <div className="text-xs text-muted-foreground">{status.count} ({status.percentage}%)</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
