import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";

export default function AcceptInvite() {
  const { isAuthenticated, isLoading: authLoading, login, getToken, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"pending" | "accepting" | "success" | "error">("pending");
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      login();
      return;
    }

    if (token && status === "pending") {
      acceptInvite();
    }
  }, [isAuthenticated, authLoading, token]);

  const acceptInvite = async () => {
    if (!token) return;

    setStatus("accepting");
    try {
      const accessToken = await getToken();
      await apiClient(`/invites/${token}/accept`, {
        method: "POST",
        token: accessToken,
      });
      await refreshProfile();
      setStatus("success");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err: any) {
      setError(err.message);
      setStatus("error");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Invalid Link
            </CardTitle>
            <CardDescription>This invite link is invalid or has expired.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} className="w-full">Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          {status === "accepting" && (
            <>
              <CardTitle>Accepting Invite...</CardTitle>
              <CardDescription>Please wait while we process your invitation.</CardDescription>
            </>
          )}
          {status === "success" && (
            <>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Invite Accepted!
              </CardTitle>
              <CardDescription>Redirecting to dashboard...</CardDescription>
            </>
          )}
          {status === "error" && (
            <>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                Failed
              </CardTitle>
              <CardDescription>{error}</CardDescription>
            </>
          )}
        </CardHeader>
        {status === "error" && (
          <CardContent>
            <Button onClick={() => navigate("/dashboard")} className="w-full">Go to Dashboard</Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
