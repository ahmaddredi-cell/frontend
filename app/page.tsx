import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 md:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm flex flex-col">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            نظام إدارة التقارير الأمنية الشاملة
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            منصة متكاملة لإدارة التقارير الأمنية والتنسيقات بين الجهات المختلفة في المحافظات الفلسطينية
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            <Link 
              href="/login" 
              className="px-6 py-3 text-lg font-medium text-white bg-primary hover:bg-primary/90 rounded-md"
            >
              تسجيل الدخول
            </Link>
            <Link 
              href="/about" 
              className="px-6 py-3 text-lg font-medium text-primary bg-secondary hover:bg-secondary/80 rounded-md"
            >
              حول النظام
            </Link>
          </div>
        </div>

        <div className="mt-16 grid text-center md:grid-cols-3 md:text-left gap-4">
          <div className="group rounded-lg border border-border px-5 py-4 bg-card">
            <h2 className="mb-3 text-xl font-semibold text-primary">
              تقارير شاملة{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className="m-0 text-muted-foreground text-sm opacity-80">
              إدارة التقارير اليومية والأحداث بطريقة منظمة وفعالة
            </p>
          </div>

          <div className="group rounded-lg border border-border px-5 py-4 bg-card">
            <h2 className="mb-3 text-xl font-semibold text-primary">
              متابعة التنسيقات{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className="m-0 text-muted-foreground text-sm opacity-80">
              تتبع حالة طلبات التنسيق بين الجهات المختلفة
            </p>
          </div>

          <div className="group rounded-lg border border-border px-5 py-4 bg-card">
            <h2 className="mb-3 text-xl font-semibold text-primary">
              احصائيات متقدمة{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className="m-0 text-muted-foreground text-sm opacity-80">
              رسوم بيانية وتحليلات للأحداث والتقارير
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
