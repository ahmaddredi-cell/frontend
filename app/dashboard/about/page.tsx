"use client";

import {
  Shield,
  FileText,
  Calendar,
  BarChart3,
  MessageSquare,
  Server,
  Database,
  Layout,
  CheckCircle,
  Users,
  Eye,
  Settings
} from "lucide-react";

const features = [
  {
    icon: <FileText className="h-10 w-10 text-primary" />,
    title: "التقارير اليومية",
    description: "إنشاء وإدارة التقارير اليومية للأحداث الأمنية وتصنيفها حسب المحافظات"
  },
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    title: "تتبع الأحداث",
    description: "توثيق الأحداث الأمنية المختلفة وربطها بالمواقع الجغرافية والوقت الدقيق"
  },
  {
    icon: <Calendar className="h-10 w-10 text-primary" />,
    title: "إدارة التنسيقات",
    description: "تنظيم التنسيقات الأمنية بين الجهات المختلفة وتتبع حالتها"
  },
  {
    icon: <MessageSquare className="h-10 w-10 text-primary" />,
    title: "المذكرات والإفراجات",
    description: "إصدار وأرشفة المذكرات الرسمية والإفراجات بصيغة موحدة ومنظمة"
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-primary" />,
    title: "الإحصائيات والتحليلات",
    description: "تحليل البيانات وعرض إحصائيات شاملة مع رسوم بيانية تفاعلية"
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: "إدارة المستخدمين",
    description: "تحديد الصلاحيات وإدارة المستخدمين حسب الدور الوظيفي والمحافظة"
  }
];

const technologies = [
  {
    icon: <Layout className="h-8 w-8 text-blue-600" />,
    title: "Next.js",
    description: "واجهة مستخدم سريعة وتفاعلية مع دعم التصيير على الخادم"
  },
  {
    icon: <div className="text-3xl text-purple-600">Tw</div>,
    title: "Tailwind CSS",
    description: "تصميم متجاوب مع مختلف أحجام الشاشات والأجهزة"
  },
  {
    icon: <Server className="h-8 w-8 text-green-600" />,
    title: "Node.js & Express",
    description: "واجهة برمجية قوية وقابلة للتوسع"
  },
  {
    icon: <Database className="h-8 w-8 text-green-700" />,
    title: "MongoDB",
    description: "قاعدة بيانات مرنة لتخزين مختلف أنواع البيانات"
  },
  {
    icon: <Eye className="h-8 w-8 text-indigo-600" />,
    title: "Shadcn UI",
    description: "مكونات واجهة مستخدم متطورة وقابلة للتخصيص"
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-red-600" />,
    title: "Nunjucks & PDFKit",
    description: "توليد تقارير PDF احترافية وقابلة للتخصيص"
  }
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12 animate-fade-in-down">
        <h1 className="text-4xl font-bold mb-4">نظام إدارة التقارير الأمنية الشاملة</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          منصة متكاملة لإدارة التقارير الأمنية والتنسيقات بين الجهات المختلفة في المحافظات الفلسطينية
        </p>
      </div>
      
      <div className="mb-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-center mb-8 border-b pb-3">نظرة عامة على النظام</h2>
          <div className="bg-card p-6 rounded-lg shadow-sm">
            <p className="leading-7 mb-4">
              تم تصميم نظام إدارة التقارير الأمنية الشاملة لتوفير منصة موحدة ومتكاملة تتيح للمستخدمين إدارة جميع العمليات المتعلقة بالتقارير الأمنية والتنسيقات بين مختلف الجهات في المحافظات الفلسطينية.
            </p>
            <p className="leading-7 mb-4">
              يهدف النظام إلى تبسيط عملية جمع المعلومات وتوثيقها وتحليلها وعرضها، مما يسهل عملية اتخاذ القرار ويضمن دقة البيانات وأمنها.
            </p>
            <p className="leading-7">
              يعمل النظام كحلقة وصل بين جميع الجهات المعنية، مما يسهل التنسيق وتبادل المعلومات بشكل آمن وفعال، ويوفر قاعدة بيانات متكاملة يمكن الرجوع إليها بسهولة عند الحاجة.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8 border-b pb-3">المميزات الرئيسية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 rounded-full bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-center mb-8 border-b pb-3">البنية التقنية</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-card rounded-lg shadow-sm border"
              >
                <div className="mr-4 flex-shrink-0">
                  {tech.icon}
                </div>
                <div>
                  <h3 className="font-medium">{tech.title}</h3>
                  <p className="text-sm text-muted-foreground">{tech.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-card p-6 rounded-lg shadow-sm border">
            <h3 className="text-xl font-semibold mb-4 text-center">بنية النظام</h3>
            <div className="overflow-hidden rounded-lg bg-muted p-4">
              <pre className="text-sm whitespace-pre-wrap">
                {`نظام إدارة التقارير الأمنية الشاملة
|
├── الواجهة الأمامية (Next.js)
|   ├── الصفحة الرئيسية (لوحة التحكم)
|   ├── وحدة التقارير اليومية
|   ├── وحدة الأحداث
|   ├── وحدة التنسيقات
|   ├── وحدة المذكرات والإفراجات
|   ├── وحدة الإحصائيات
|   └── وحدة إدارة المستخدمين
|
└── الواجهة الخلفية (Node.js + Express)
    ├── نظام المصادقة وإدارة المستخدمين
    ├── وحدة معالجة البيانات
    ├── وحدة توليد التقارير
    └── قاعدة البيانات (MongoDB)`}
              </pre>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="inline-block border border-muted bg-card rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-3">الإصدار</h3>
          <p className="text-4xl font-bold text-primary">1.0.0</p>
          <p className="text-sm text-muted-foreground mt-2">آخر تحديث: أبريل 2025</p>
        </div>
      </div>
    </div>
  );
}
