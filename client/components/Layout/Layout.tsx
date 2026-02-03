import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

export function Layout({ children, showSidebar = false }: LayoutProps) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Show sidebar for authenticated users in admin sections
  const shouldShowSidebar = showSidebar && user && user.role === "landlord";

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header 
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        showSidebarToggle={shouldShowSidebar}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {shouldShowSidebar && (
          <Sidebar 
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}
        
        <main className="flex-1 overflow-y-auto">
          <div className="flex flex-col min-h-full">
            <div className="flex-1">
              {children}
            </div>
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
