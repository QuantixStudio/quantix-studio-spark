import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, TrendingUp, Users, Activity } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {displayName}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your account today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Sparkles className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Activity className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">8 completed today</p>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+1 this week</p>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+32%</div>
            <p className="text-xs text-muted-foreground">Since last quarter</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full p-3 text-left rounded-lg border hover:border-accent transition-colors">
              <div className="font-medium">Create New Project</div>
              <div className="text-sm text-muted-foreground">Start a fresh project</div>
            </button>
            <button className="w-full p-3 text-left rounded-lg border hover:border-accent transition-colors">
              <div className="font-medium">Invite Team Member</div>
              <div className="text-sm text-muted-foreground">Collaborate with others</div>
            </button>
            <button className="w-full p-3 text-left rounded-lg border hover:border-accent transition-colors">
              <div className="font-medium">View Analytics</div>
              <div className="text-sm text-muted-foreground">Check your progress</div>
            </button>
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Project "Website Redesign" updated</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 mt-2 rounded-full bg-accent" />
              <div className="flex-1">
                <p className="text-sm font-medium">New task assigned to you</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">Team meeting completed</p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
