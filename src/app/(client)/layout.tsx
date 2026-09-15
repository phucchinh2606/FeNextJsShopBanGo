import { ChatBotWidget } from "@/src/components/client/ChatBotWidget";
import { Footer } from "@/src/components/client/Footer";
import { Header } from "@/src/components/client/Header";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 relative">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />

      
    </div>
  );
}
