import { ChatBotWidget } from "@/src/components/client/ChatBotWidget";
import { Footer } from "@/src/components/client/Footer";
import { Header } from "@/src/components/client/Header";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 relative selection:bg-amber-800 selection:text-white">
      {/* Header điều hướng chính */}
      <Header />

      {/* Main Content với flex-1 tự động lấp đầy chiều cao */}
      <main className="flex-1 w-full">{children}</main>

      {/* Footer chân trang */}
      <Footer />

      {/* Widget hỗ trợ / Chatbot cố định góc màn hình */}
      <ChatBotWidget />
    </div>
  );
}
