/**
 * QUANTIX STUDIO NAVBAR
 * 
 * PUBLIC MODE:
 * - Shows only: Home, Portfolio, Services, Contact navigation
 * - No login/register buttons visible
 * - No user profile or admin links
 * 
 * ADMIN ACCESS:
 * - Navigate directly to /auth URL to login
 * - Authentication system remains fully functional
 * - Admin dashboard accessible after login
 * - Role-based access control still enforced
 * 
 * TO RE-ENABLE PUBLIC AUTH:
 * - Uncomment auth UI blocks (search for "AUTHENTICATION DISABLED")
 * - Restore commented imports
 */

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
// import { LogOut, User, LayoutDashboard } from "lucide-react"; // Auth UI disabled
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import { cn } from "@/lib/utils";
import { getActiveLandingSection, hasReachedNavTarget, scrollToSection, type LandingNavSection } from "@/lib/navigation";
// import { useProfileModal } from "@/hooks/useProfileModal"; // Auth UI disabled
import { Link, useLocation, useNavigate } from "react-router-dom";
// import AuthModal from "@/components/modals/AuthModal"; // Auth UI disabled
// import ProfileEditModal from "@/components/modals/ProfileEditModal"; // Auth UI disabled
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"; // Auth UI disabled
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Auth UI disabled
// import { supabase } from "@/integrations/supabase/client"; // Auth UI disabled

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<LandingNavSection>("home");
  const [isAtTop, setIsAtTop] = useState(true);
  const pendingNavTargetRef = useRef<LandingNavSection | null>(null);
  const pendingNavTimeoutRef = useRef<number | null>(null);
  // const [authModalOpen, setAuthModalOpen] = useState(false); // Auth UI disabled
  // const [profileModalOpen, setProfileModalOpen] = useState(false); // Auth UI disabled
  const {
    user,
    signOut
  } = useAuth();
  const {
    data: roleData
  } = useUserRole();
  const navigate = useNavigate();
  const location = useLocation();
  // const { isOpen: autoProfileOpen, openModal, closeModal: closeAutoModal } = useProfileModal(); // Auth UI disabled

  // const [profile, setProfile] = useState<any>(null); // Auth UI disabled

  const clearPendingNavTarget = () => {
    pendingNavTargetRef.current = null;

    if (pendingNavTimeoutRef.current) {
      window.clearTimeout(pendingNavTimeoutRef.current);
      pendingNavTimeoutRef.current = null;
    }
  };

  const setPendingNavTarget = (target: LandingNavSection) => {
    clearPendingNavTarget();
    pendingNavTargetRef.current = target;
    pendingNavTimeoutRef.current = window.setTimeout(() => {
      pendingNavTargetRef.current = null;
      pendingNavTimeoutRef.current = null;
    }, 1400);
  };

  // Fetch profile when user is available (disabled for public)
  // useState(() => {
  //   if (user) {
  //     supabase
  //       .from("profiles")
  //       .select("*")
  //       .eq("id", user.id)
  //       .maybeSingle()
  //       .then(({ data }) => setProfile(data));
  //   }
  // });

  useEffect(() => {
    const syncNavigationState = () => {
      const scrollY = window.scrollY;
      setIsAtTop(scrollY < 24);

      if (location.pathname === "/") {
        const pendingTarget = pendingNavTargetRef.current;

        if (pendingTarget) {
          setActiveSection(pendingTarget);

          if (hasReachedNavTarget(pendingTarget, scrollY)) {
            clearPendingNavTarget();
          }

          return;
        }

        setActiveSection(getActiveLandingSection(scrollY));
      }
    };

    if (location.pathname !== "/") {
      setActiveSection("home");
      clearPendingNavTarget();
    }

    syncNavigationState();
    window.addEventListener("scroll", syncNavigationState, { passive: true });

    return () => {
      window.removeEventListener("scroll", syncNavigationState);
    };
  }, [location.pathname]);

  useEffect(() => {
    return () => {
      clearPendingNavTarget();
    };
  }, []);

  const handleNavigation = (target: string) => {
    setIsOpen(false);

    if (target === "home") {
      if (location.pathname === "/") {
        setPendingNavTarget("home");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
      }
      return;
    }

    if (target === "portfolio") {
      if (location.pathname === "/") {
        setPendingNavTarget("portfolio");
        scrollToSection("featured-work");
      } else {
        navigate("/#featured-work");
      }
      return;
    }

    if (target === "services") {
      if (location.pathname === "/") {
        setPendingNavTarget("services");
        scrollToSection("services");
      } else {
        navigate("/#services");
      }
      return;
    }

    if (target === "contact") {
      if (location.pathname === "/") {
        setPendingNavTarget("contact");
        scrollToSection("contact");
      } else {
        navigate("/#contact");
      }
      return;
    }
  };
  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const currentNavTarget = location.pathname === "/" ? activeSection : null;

  const getDesktopNavClassName = (target: "home" | "services" | "portfolio" | "contact") =>
    cn(
      "nav-link nav-link-button cursor-pointer",
      currentNavTarget === target ? "nav-link-active text-foreground font-medium" : "text-foreground/72 hover:text-foreground",
    );

  const getMobileNavClassName = (target: "home" | "services" | "portfolio" | "contact") =>
    cn(
      "block w-full rounded-xl px-4 py-3 text-left transition-colors",
      currentNavTarget === target ? "bg-foreground/6 text-foreground font-medium" : "text-foreground/72 hover:bg-foreground/6 hover:text-foreground",
    );

  return <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isAtTop ? "bg-background/45 backdrop-blur-xl" : "glass shadow-sm"}`}>
        <div className="container mx-auto px-5 sm:px-6 md:px-8">
          <div className="relative flex items-center justify-between h-16">
            {/* Logo - Fixed left */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-xl font-bold">
                QUANTIX STUDIO
              </Link>
            </div>

            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
              <button onClick={() => handleNavigation("home")} className={getDesktopNavClassName("home")}>
                Home
              </button>
              <button onClick={() => handleNavigation("services")} className={getDesktopNavClassName("services")}>
                Services
              </button>
              <button onClick={() => handleNavigation("portfolio")} className={getDesktopNavClassName("portfolio")}>
                Portfolio
              </button>
              <button onClick={() => handleNavigation("contact")} className={getDesktopNavClassName("contact")}>
                Contact
              </button>
            </div>

            {/* Right side spacer for balance */}
            <div className="hidden md:block flex-shrink-0 w-[200px]"></div>

            {/* AUTHENTICATION DISABLED FOR PUBLIC - Admin access via /auth only
             {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setProfileModalOpen(true)}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  {roleData?.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
             ) : (
              <Button onClick={() => setAuthModalOpen(true)}>Login / Register</Button>
             )}
             */}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-accent/10 transition-colors" aria-label="Toggle menu" aria-expanded={isOpen}>
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && <div className="animate-fade-in border-t border-border/70 py-4 md:hidden">
              <div className="space-y-2 rounded-2xl border border-border/60 bg-card/70 p-2">
                <button onClick={() => handleNavigation("home")} className={getMobileNavClassName("home")}>
                  Home
                </button>
                <button onClick={() => handleNavigation("portfolio")} className={getMobileNavClassName("portfolio")}>
                  Portfolio
                </button>
                <button onClick={() => handleNavigation("services")} className={getMobileNavClassName("services")}>
                  Services
                </button>
                <button onClick={() => handleNavigation("contact")} className={getMobileNavClassName("contact")}>
                  Contact
                </button>
              </div>
              {/* AUTHENTICATION DISABLED FOR PUBLIC - Admin access via /auth only
               {user ? (
                <>
                  <button
                    onClick={() => {
                      setProfileModalOpen(true);
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-accent/10 rounded-lg transition-colors"
                  >
                    Profile
                  </button>
                  {roleData?.isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-left px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-accent/10 rounded-lg transition-colors"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-accent/10 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </>
               ) : (
                <div className="px-4">
                  <Button onClick={() => {
                    setAuthModalOpen(true);
                    setIsOpen(false);
                  }} className="w-full">
                    Login / Register
                  </Button>
                </div>
               )}
               */}
            </div>}
        </div>
      </nav>

      {/* AUTHENTICATION MODALS DISABLED FOR PUBLIC
       <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => setProfileModalOpen(true)}
       />
       <ProfileEditModal
        isOpen={profileModalOpen || autoProfileOpen}
        onClose={() => {
          setProfileModalOpen(false);
          closeAutoModal();
        }}
        isFirstLogin={false}
       />
       */}
    </>;
}
