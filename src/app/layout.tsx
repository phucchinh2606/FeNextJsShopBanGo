import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "../providers/ReactQueryProvider";
import { Toaster } from "sonner";
import { ChatBotWidget } from "../components/client/ChatBotWidget";
import { Suspense } from "react";

// Font Sans-serif cho văn bản thường
const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

// Font Serif sang trọng cho Tiêu đề
const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "WoodStore - Nội Thất Gỗ Mỹ Nghệ",
  description: "Cửa hàng bán đồ gỗ mỹ nghệ cao cấp",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReactQueryProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </ReactQueryProvider>
        <Toaster position="top-right" richColors closeButton />
        {/* Tích hợp Widget ChatBot AI cố định toàn trang */}
        <ChatBotWidget />
      </body>
    </html>
  );
}
