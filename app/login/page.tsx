"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService, LoginCredentials } from "@/lib/api/auth-service";
import notifications from "@/lib/utils/notifications";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Log the login attempt
      console.log(`Attempting login with username: ${username}`);
      
      // Create credentials object
      const credentials: LoginCredentials = {
        username,
        password
      };
      
      // Attempt to login using the auth service
      console.log("Sending login request...");
      const response = await authService.login(credentials);
      console.log("Login API response:", response);
      
      if (response.success && response.data) {
        // Show success notification
        notifications.success("تم تسجيل الدخول بنجاح");
        console.log("Login successful");
        
        // Short delay before redirecting to ensure token is properly stored
        setTimeout(() => {
          console.log("Redirecting to dashboard...");
          window.location.href = '/dashboard';
        }, 300);
      } else {
        // Show error from response or default message
        const errorMessage = response.message || "فشل تسجيل الدخول. يرجى التحقق من اسم المستخدم وكلمة المرور.";
        console.error("Login failed:", errorMessage);
        setError(errorMessage);
        notifications.error(errorMessage);
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("فشل تسجيل الدخول. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.");
      }
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">تسجيل الدخول</h1>
          <p className="text-sm text-muted-foreground mt-2">
            أدخل بيانات الاعتماد الخاصة بك للوصول إلى لوحة التحكم
          </p>
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive text-destructive text-sm rounded-md">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              اسم المستخدم
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              كلمة المرور
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              disabled={isLoading}
            >
              {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-primary hover:underline">
            العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </main>
  );
}
