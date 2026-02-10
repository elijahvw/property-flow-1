import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Lock, ArrowRight, CheckCircle2 } from "lucide-react";

export default function CompleteRegistration() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!token) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Invalid Link</h1>
            <p className="text-muted-foreground mb-4">The registration link is missing or invalid.</p>
            <Button onClick={() => navigate("/")}>Go Home</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/complete-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to complete registration");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full text-center bg-white p-8 rounded-xl border border-border shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Account Activated!</h1>
            <p className="text-muted-foreground mb-8">Your password has been set and your account is now ready.</p>
            <Button className="w-full" onClick={() => navigate("/login")}>
              Sign In Now
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-secondary to-white py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg border border-border shadow-lg p-8">
            <div className="mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-ai rounded-lg"></div>
                <span className="text-xl font-bold text-primary">PropertyFlow</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground text-center mb-2">Complete Registration</h1>
              <p className="text-center text-muted-foreground">Set your password to activate your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              <Button type="submit" disabled={isLoading} className="w-full bg-primary">
                {isLoading ? "Activating..." : "Activate Account"}
                {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
