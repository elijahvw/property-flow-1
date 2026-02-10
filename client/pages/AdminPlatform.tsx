import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Mail, Building, User, Send, CheckCircle2 } from "lucide-react";

export default function AdminPlatform() {
  const { user, token } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [inviteLink, setInviteLink] = useState("");

  // Guard for platform admin role
  if (user?.role !== "admin") {
    return (
      <Layout>
        <div className="p-8 text-center">
          <h1 className="text-xl font-bold text-red-600">Access Denied</h1>
          <p>This area is for Platform Administrators only.</p>
        </div>
      </Layout>
    );
  }

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setInviteLink("");

    try {
      const response = await fetch("/api/auth/invite-landlord", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, companyName }),
      });

      if (!response.ok) throw new Error("Failed to send invite");

      const data = await response.json();
      setMessage("Landlord invited successfully!");
      setInviteLink(`${window.location.origin}/complete-registration?token=${data.token}`);
      
      // Clear form
      setName("");
      setEmail("");
      setCompanyName("");
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showSidebar>
      <div className="flex-1 bg-background p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Platform Administration</h1>
          <p className="text-muted-foreground mb-8">Onboard new Landlord companies and their administrators.</p>

          <div className="bg-white p-8 rounded-xl border border-border shadow-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              Invite New Landlord
            </h2>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg"
                    placeholder="John Landlord"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg"
                    placeholder="landlord@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Company Name</label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg"
                    placeholder="Luxury Properties LLC"
                  />
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Inviting..." : "Send Invitation"}
              </Button>
            </form>

            {message && (
              <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${message.startsWith('Error') ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                {!message.startsWith('Error') && <CheckCircle2 className="w-5 h-5" />}
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}

            {inviteLink && (
              <div className="mt-4 p-4 bg-secondary rounded-lg border border-border">
                <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider">Manual Invite Link (for demo):</p>
                <code className="text-xs break-all text-primary font-mono">{inviteLink}</code>
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 h-auto mt-2 text-xs"
                  onClick={() => navigator.clipboard.writeText(inviteLink)}
                >
                  Copy Link
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
