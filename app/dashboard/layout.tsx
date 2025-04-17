"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authService } from "@/lib/api/auth-service";
import notifications from "@/lib/utils/notifications";
import {
  BarChart3,
  Calendar,
  FileText,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Shield,
  User,
  X,
  Info,
} from "lucide-react";

interface SidebarLink {
  title: string;
  href: string;
  icon: React.ReactNode;
}

const mainLinks: SidebarLink[] = [
  { title: "الرئيسية", href: "/dashboard", icon: <Home className="ml-2" /> },
  {
    title: "التقارير اليومية",
    href: "/dashboard/reports",
    icon: <FileText className="ml-2" />,
  },
  {
    title: "الأحداث",
    href: "/dashboard/events",
    icon: <Shield className="ml-2" />,
  },
  {
    title: "التنسيقات",
    href: "/dashboard/coordinations",
    icon: <Calendar className="ml-2" />,
  },
  {
    title: "المذكرات والإفراجات",
    href: "/dashboard/memos",
    icon: <MessageSquare className="ml-2" />,
  },
  {
    title: "الإحصائيات",
    href: "/dashboard/statistics",
    icon: <BarChart3 className="ml-2" />,
  },
];

const adminLinks: SidebarLink[] = [
  {
    title: "المستخدمين",
    href: "/dashboard/users",
    icon: <User className="ml-2" />,
  },
  {
    title: "الإعدادات",
    href: "/dashboard/settings",
    icon: <Settings className="ml-2" />,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const isAuthenticated = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();
      
      if (!isAuthenticated || !currentUser) {
        // Redirect to login if not authenticated
        setIsLoading(false); // Set loading false before redirect to avoid stuck loading state
        router.push('/login');
        return;
      }
      
      setUser(currentUser);
      setIsLoading(false);
    };
    
    // Only show loading on initial mount, not during page navigation
    if (typeof window !== 'undefined') {
      // Check if we've already verified auth in this session
      const authVerified = sessionStorage.getItem('authVerified');
      
      if (authVerified) {
        // Auth already verified in this session, no need to show loading
        setIsLoading(false);
        setUser(authService.getCurrentUser());
      } else {
        // First time checking auth in this session
        checkAuth();
        // Mark auth as verified for this session
        sessionStorage.setItem('authVerified', 'true');
      }
    } else {
      checkAuth();
    }
  }, [router]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      notifications.success("تم تسجيل الخروج بنجاح");
      router.push('/login');
    } catch (error) {
      console.error("Logout error:", error);
      notifications.error("حدث خطأ أثناء تسجيل الخروج");
    }
  };
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-card shadow-lg transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-muted focus:outline-none lg:hidden"
          >
            <X size={20} />
          </button>
          <h1 className="text-xl font-bold">نظام التقارير الأمنية</h1>
        </div>

        <div className="py-4 flex flex-col h-[calc(100%-64px)] justify-between">
          <div className="space-y-1 px-3">
            {mainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-4 py-2 text-sm rounded-md ${
                  pathname === link.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {link.icon}
                {link.title}
              </Link>
            ))}

            <Link
              href="/dashboard/about"
              className={`flex items-center px-4 py-2 text-sm rounded-md ${
                pathname === "/dashboard/about"
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <Info className="ml-2" />
              حول النظام
            </Link>

            <div className="pt-4 pb-2">
              <div className="px-4 py-2 text-xs text-muted-foreground">الإدارة</div>
            </div>

            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center px-4 py-2 text-sm rounded-md ${
                  pathname === link.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                {link.icon}
                {link.title}
              </Link>
            ))}
          </div>

          <div className="px-3 mt-auto">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md"
            >
              <LogOut className="ml-2" size={18} />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-card border-b px-4 py-3 flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-muted focus:outline-none"
          >
            <Menu size={24} />
          </button>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium">{user?.fullName || 'مدير النظام'}</div>
              <div className="text-xs text-muted-foreground">{user?.username || 'admin'}</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <span className="text-sm font-medium">{user?.fullName?.[0] || 'م'}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
