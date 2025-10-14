import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-7xl font-bold text-accent">404</CardTitle>
          <CardDescription className="text-xl">
            Oops! Page not found
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p className="text-center text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Button 
            onClick={() => navigate("/")} 
            className="w-full gap-2"
            size="lg"
          >
            <Home className="h-4 w-4" />
            Return to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
