import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import Navbar from "@/components/landing/Navbar";

const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email too long"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password too long"),
});

const signInSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const resetSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
});

export default function Auth() {
  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { signUp, signIn, resetPassword, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "signup") {
        const validated = signUpSchema.parse({ fullName, email, password });
        const { error } = await signUp(validated.email, validated.password, validated.fullName);
        
        if (error) throw error;
        
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
        setMode("signin");
      } else if (mode === "signin") {
        const validated = signInSchema.parse({ email, password });
        const { error } = await signIn(validated.email, validated.password);
        
        if (error) throw error;
        
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      } else {
        const validated = resetSchema.parse({ email });
        const { error } = await resetPassword(validated.email);
        
        if (error) throw error;
        
        toast({
          title: "Reset email sent",
          description: "Check your email for password reset instructions.",
        });
        setMode("signin");
      }
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
          description: error.message || "An error occurred. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen items-center justify-center p-4 bg-muted/30">
        <Card className="w-full max-w-md border">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-xl border-2 border-accent flex items-center justify-center text-accent font-bold text-xl">
              Q
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            {mode === "signin" && "Admin Access"}
            {mode === "signup" && "Create Admin Account"}
            {mode === "reset" && "Reset Password"}
          </CardTitle>
          <CardDescription className="text-center">
            {mode === "signin" && "Authorized personnel only"}
            {mode === "signup" && "Create your admin account"}
            {mode === "reset" && "Enter your email to reset your password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            {mode !== "reset" && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              ) : (
                <>
                  {mode === "signin" && "Sign In"}
                  {mode === "signup" && "Create Account"}
                  {mode === "reset" && "Send Reset Email"}
                </>
              )}
            </Button>

            <div className="text-center text-sm space-y-2">
              {mode === "signin" && (
                <>
                  <button
                    type="button"
                    onClick={() => setMode("reset")}
                    className="text-primary hover:underline block"
                  >
                    Forgot password?
                  </button>
                  <div>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("signup")}
                      className="text-primary hover:underline"
                    >
                      Sign up
                    </button>
                  </div>
                </>
              )}
              
              {mode === "signup" && (
                <div>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="text-primary hover:underline"
                  >
                    Sign in
                  </button>
                </div>
              )}
              
              {mode === "reset" && (
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-primary hover:underline"
                >
                  Back to sign in
                </button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
    </>
  );
}
