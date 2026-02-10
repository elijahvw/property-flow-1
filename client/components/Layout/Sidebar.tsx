import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Users,
  CreditCard,
  FileText,
  Settings,
  Shield,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const adminNavItems: NavItem[] = [
  { label: "Platform Admin", href: "/platform-admin", icon: Shield, adminOnly: true },
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Properties", href: "/admin/properties", icon: Building2 },
  { label: "Tenants", href: "/admin/tenants", icon: Users },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Documents & AI", href: "/admin/documents", icon: FileText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigation = (href: string) => {
    navigate(href);
    onClose?.();
  };

  const visibleNavItems = adminNavItems.filter(item => 
    !item.adminOnly || (item.adminOnly && user?.role === "admin")
  );

  return (
    <>
      {/* Mobile overlay */}
      {!isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r border-border bg-sidebar transition-transform duration-200 ease-in-out md:relative md:top-0 md:h-full md:translate-x-0 z-40",
          !isOpen && "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Close button on mobile */}
          <div className="md:hidden p-4 border-b border-border">
            <button
              onClick={onClose}
              className="p-2 hover:bg-sidebar-accent rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {visibleNavItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <button
                  key={item.href}
                  onClick={() => handleNavigation(item.href)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent",
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer info */}
          <div className="border-t border-border p-4 text-xs text-sidebar-foreground">
            <div className="font-medium">PropertyFlow</div>
            <div className="text-sidebar-accent-foreground">v1.0</div>
          </div>
        </div>
      </aside>
    </>
  );
}
