import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AuthMiddleware() {
  const router = useRouter();

  useEffect(() => {
    function checkAuth() {
      // Check for token in local storage
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      
      console.log('Auth middleware - checking token:', !!token);
      console.log('Auth middleware - checking user:', !!user);
      
      if (token) {
        // User is logged in, redirect to dashboard
        console.log('Auth middleware - redirecting to dashboard');
        // Use window.location.href for a hard redirect instead of router.push
        // This ensures a complete page refresh and proper loading of the dashboard
        window.location.href = '/dashboard';
      } else {
        // User is not logged in, redirect to login
        console.log('Auth middleware - redirecting to login');
        window.location.href = '/login';
      }
    }
    
    // First attempt immediately
    checkAuth();
    
    // Then try again after a short delay to ensure localStorage is fully populated
    // This helps with race conditions where tokens might still be getting stored
    const timeoutId = setTimeout(() => {
      console.log('Auth middleware - re-checking authentication after delay');
      checkAuth();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">جاري التحميل...</h1>
        <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}
