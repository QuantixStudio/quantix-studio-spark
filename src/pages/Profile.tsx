import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Mail, User as UserIcon, Shield } from "lucide-react";
import { z } from "zod";

const profileSchema = z.object({
  full_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
});

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (!error && data) {
        setProfile(data);
        setFullName(data.full_name || "");
        setEmail(data.email || user.email || "");
      } else {
        setEmail(user.email || "");
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const validated = profileSchema.parse({ full_name: fullName, email });
      setSaving(true);

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: validated.full_name,
          email: validated.email,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: error.errors[0].message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to update profile.",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || email.charAt(0).toUpperCase();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">
          Manage your account information and preferences.
        </p>
      </div>

      <Card className="border">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl bg-accent text-background">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{fullName || "User"}</CardTitle>
              <CardDescription>{email}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                <UserIcon className="inline h-4 w-4 mr-2" />
                Full Name
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="inline h-4 w-4 mr-2" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

          {/* Role field removed for security - roles now managed via user_roles table */}

            <Button type="submit" disabled={saving}>
              {saving ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
