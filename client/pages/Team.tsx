import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus, Trash2 } from "lucide-react";
import type { CompanyMember, Invite } from "@shared/api";

export default function Team() {
  const { getToken, currentCompanyId, currentRole } = useAuth();
  const navigate = useNavigate();
  const [members, setMembers] = useState<CompanyMember[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"staff" | "tenant">("staff");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      const token = await getToken();
      const [membersData, invitesData] = await Promise.all([
        apiClient<CompanyMember[]>(`/companies/${currentCompanyId}/members`, { token }),
        apiClient<Invite[]>("/invites", { token }),
      ]);
      setMembers(membersData);
      setInvites(invitesData);
    } catch (err: any) {
      console.error("Failed to fetch team data:", err);
    }
  };

  useEffect(() => {
    if (currentCompanyId) fetchData();
  }, [currentCompanyId]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const token = await getToken();
      await apiClient("/invites", {
        method: "POST",
        body: { email, role },
        token,
      });
      setEmail("");
      await fetchData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeInvite = async (inviteId: string) => {
    try {
      const token = await getToken();
      await apiClient(`/invites/${inviteId}`, { method: "DELETE", token });
      await fetchData();
    } catch (err: any) {
      console.error("Failed to revoke invite:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>

        <h1 className="text-2xl font-bold mb-6">Team Management</h1>

        {currentRole === "owner" && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Invite Member
              </CardTitle>
              <CardDescription>Send an invite to add staff or tenants</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInvite} className="flex gap-3 items-end">
                <div className="flex-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    required
                  />
                </div>
                <div className="w-32">
                  <Label>Role</Label>
                  <Select value={role} onValueChange={(v: any) => setRole(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="tenant">Tenant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Invite"}
                </Button>
              </form>
              {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            </CardContent>
          </Card>
        )}

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.email}</p>
                  </div>
                  <Badge variant={member.role === "owner" ? "default" : "secondary"} className="capitalize">
                    {member.role}
                  </Badge>
                </div>
              ))}
              {members.length === 0 && (
                <p className="text-gray-500 text-sm">No members yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {invites.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Invites</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invites
                  .filter((i) => i.status === "pending")
                  .map((invite) => (
                    <div key={invite.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-medium">{invite.email}</p>
                        <p className="text-sm text-gray-500 capitalize">Role: {invite.role}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Pending</Badge>
                        {currentRole === "owner" && (
                          <Button variant="ghost" size="sm" onClick={() => handleRevokeInvite(invite.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
