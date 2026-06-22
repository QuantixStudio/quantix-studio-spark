import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ScrollToTop } from "@/components/ScrollToTop";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";

const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const ProfilesManagement = lazy(() => import("./pages/admin/ProfilesManagement"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Privacy = lazy(() => import("./pages/Privacy"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const ContentManagement = lazy(() => import("./pages/admin/ContentManagement"));
const PortfolioSystemManagement = lazy(() => import("./pages/admin/PortfolioSystemManagement"));
const ProjectsManagement = lazy(() => import("./pages/admin/ProjectsManagement"));
const ToolsManagement = lazy(() => import("./pages/admin/ToolsManagement"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

const LegacyProjectRedirect = () => {
  const { slug } = useParams();

  return <Navigate to={slug ? `/portfolio/${slug}` : "/portfolio"} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/portfolio/:slug" element={<ProjectDetail />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/project/:slug" element={<LegacyProjectRedirect />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <DashboardLayout>
                        <Dashboard />
                      </DashboardLayout>
                    </AdminRoute>
                  }
                />
                <Route
                  path="/aus"
                  element={
                    <AdminRoute>
                      <DashboardLayout>
                        <Dashboard />
                      </DashboardLayout>
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/content"
                  element={
                    <AdminRoute>
                      <DashboardLayout>
                        <ContentManagement />
                      </DashboardLayout>
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/portfolio-system"
                  element={
                    <AdminRoute>
                      <DashboardLayout>
                        <PortfolioSystemManagement />
                      </DashboardLayout>
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/projects"
                  element={
                    <AdminRoute>
                      <DashboardLayout>
                        <ProjectsManagement />
                      </DashboardLayout>
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/tools"
                  element={
                    <AdminRoute>
                      <DashboardLayout>
                        <ToolsManagement />
                      </DashboardLayout>
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/testimonials"
                  element={
                    <AdminRoute>
                      <DashboardLayout>
                        <Navigate to="/admin/tools?collection=testimonials" replace />
                      </DashboardLayout>
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/profiles"
                  element={
                    <AdminRoute>
                      <DashboardLayout>
                        <ProfilesManagement />
                      </DashboardLayout>
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/profile"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Profile />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/settings"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Settings />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
