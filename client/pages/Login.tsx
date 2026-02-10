import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"landlord" | "tenant">("landlord");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      login(email, password, role);
      navigate(role === "landlord" ? "/admin" : "/");
      setIsLoading(false);
    }, 500);
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-secondary to-white py-12 px-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-lg border border-border shadow-lg p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-ai rounded-lg"></div>
                <span className="text-xl font-bold text-primary">
                  PropertyFlow
                </span>
              </div>
              <h1 className="text-2xl font-bold text-foreground text-center mb-2">
                Welcome Back
              </h1>
              <p className="text-center text-muted-foreground">
                Sign in to your account to continue
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  I am a:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "landlord", label: "Landlord" },
                    { value: "tenant", label: "Tenant" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRole(option.value as typeof role)}
                      className={`p-3 rounded-lg border-2 transition font-medium ${
                        role === option.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-foreground hover:border-primary"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <a href="#" className="text-primary hover:underline">
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {isLoading ? "Signing in..." : "Sign In"}
                {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-muted-foreground">Or</span>
              </div>
            </div>

            {/* Demo Login */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                login("admin@propertyflow.com", "admin");
                navigate("/platform-admin");
              }}
            >
              Platform Admin Demo
            </Button>
          </div>

          {/* Footer Text */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            By signing in, you agree to our{" "}
            <a href="#" className="underline hover:text-primary">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-primary">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
