import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onSidebarToggle?: () => void;
  showSidebarToggle?: boolean;
}

export function Header({ onSidebarToggle, showSidebarToggle = false }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <button 
          onClick={() => handleNavigation("/")}
          className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-80 transition"
        >
          <div className="w-8 h-8 bg-gradient-ai rounded-lg"></div>
          <span>PropertyFlow</span>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {!user ? (
            <>
              <button 
                onClick={() => handleNavigation("/")}
                className="text-sm font-medium text-foreground hover:text-primary transition"
              >
                Home
              </button>
              <button 
                onClick={() => handleNavigation("/")}
                className="text-sm font-medium text-foreground hover:text-primary transition"
              >
                Features
              </button>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => handleNavigation("/login")}
              >
                Login
              </Button>
              <Button 
                size="sm"
                onClick={() => handleNavigation("/signup")}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <>
              <div className="text-sm text-muted-foreground">
                Welcome, {user.name}
              </div>
              <Button 
                variant="outline"
                size="sm"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        {showSidebarToggle && (
          <button 
            onClick={onSidebarToggle}
            className="md:hidden p-2"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          {isOpen && (
            <div className="absolute top-16 left-0 right-0 bg-white border-b border-border p-4 flex flex-col gap-2">
              {!user ? (
                <>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => handleNavigation("/")}
                  >
                    Home
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => handleNavigation("/")}
                  >
                    Features
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => handleNavigation("/login")}
                  >
                    Login
                  </Button>
                  <Button 
                    className="w-full"
                    onClick={() => handleNavigation("/signup")}
                  >
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-sm text-muted-foreground px-2 py-2">
                    Welcome, {user.name}
                  </div>
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
