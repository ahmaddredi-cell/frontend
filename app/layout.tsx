import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from 'react-hot-toast';

// Use the Tajawal font for Arabic support
const tajawal = Tajawal({
  weight: ["300", "400", "500", "700"],
  subsets: ["arabic"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "نظام إدارة التقارير الأمنية الشاملة",
  description: "منصة متكاملة لإدارة التقارير الأمنية والتنسيقات بين الجهات المختلفة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <body className={`${tajawal.className} min-h-screen`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
