import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminRoute } from "@/components/AdminRoute";
import { DashboardLayout } from "@/components/DashboardLayout";
import { ScrollToTop } from "@/components/ScrollToTop";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import Privacy from "./pages/Privacy";
import ProjectDetail from "./pages/ProjectDetail";
import ProjectsManagement from "./pages/admin/ProjectsManagement";
import ToolsManagement from "./pages/admin/ToolsManagement";
import TestimonialsManagement from "./pages/admin/TestimonialsManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/:slug" element={<ProjectDetail />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/project/:slug" element={<Navigate to="/portfolio/:slug" replace />} />
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
                      <TestimonialsManagement />
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
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
