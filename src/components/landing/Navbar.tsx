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

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
// import { LogOut, User, LayoutDashboard } from "lucide-react"; // Auth UI disabled
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
// import { useProfileModal } from "@/hooks/useProfileModal"; // Auth UI disabled
import { Link } from "react-router-dom";
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
  const [activeSection, setActiveSection] = useState('');
  // const [authModalOpen, setAuthModalOpen] = useState(false); // Auth UI disabled
  // const [profileModalOpen, setProfileModalOpen] = useState(false); // Auth UI disabled
  const { user, signOut } = useAuth();
  const { data: roleData } = useUserRole();
  // const { isOpen: autoProfileOpen, openModal, closeModal: closeAutoModal } = useProfileModal(); // Auth UI disabled

  // const [profile, setProfile] = useState<any>(null); // Auth UI disabled

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

  // Track active section with Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px 0px -50% 0px' }
    );

    const sections = ['featured-work', 'services', 'contact'];
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavigation = (target: string) => {
    const offset = 64; // Fixed header height
    
    // Close mobile menu first
    setIsOpen(false);
    
    // Handle HOME - scroll to top
    if (target === "home") {
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }
    
    // Handle PORTFOLIO - scroll to Featured Work section
    if (target === "portfolio") {
      if (window.location.pathname !== '/') {
        window.location.href = '/#featured-work';
      } else {
        const element = document.getElementById('featured-work');
        if (element) {
          const y = element.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: y, behavior: "smooth" });
          
          element.classList.add('section-active');
          setTimeout(() => element.classList.remove('section-active'), 1200);
        }
      }
      return;
    }
    
    // Handle SERVICES, CONTACT and other sections
    if (window.location.pathname !== '/') {
      window.location.href = `/#${target}`;
    } else {
      const element = document.getElementById(target);
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: "smooth" });
        
        element.classList.add('section-active');
        setTimeout(() => element.classList.remove('section-active'), 1200);
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-4">
          <div className="relative flex items-center justify-between h-16">
            {/* Logo - Fixed left */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-xl font-bold">
                QUANTIX STUDIO
              </Link>
            </div>

            {/* Desktop Navigation - Centered */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2">
              <nav className="flex items-center gap-8">
                <button
                  onClick={() => handleNavigation("home")}
                  className={`nav-link cursor-pointer ${
                    activeSection === '' && window.location.pathname === '/' && window.scrollY === 0
                      ? 'text-accent font-medium' 
                      : 'text-foreground/80 hover:text-foreground'
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => handleNavigation("portfolio")}
                  className={`nav-link cursor-pointer ${
                    activeSection === 'featured-work' 
                      ? 'text-accent font-medium' 
                      : 'text-foreground/80 hover:text-foreground'
                  }`}
                >
                  Portfolio
                </button>
                <button
                  onClick={() => handleNavigation("services")}
                  className={`nav-link cursor-pointer ${
                    activeSection === 'services' 
                      ? 'text-accent font-medium' 
                      : 'text-foreground/80 hover:text-foreground'
                  }`}
                >
                  Services
                </button>
                <button
                  onClick={() => handleNavigation("contact")}
                  className={`nav-link cursor-pointer ${
                    activeSection === 'contact' 
                      ? 'text-accent font-medium' 
                      : 'text-foreground/80 hover:text-foreground'
                  }`}
                >
                  Contact
                </button>
              </nav>
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
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-accent/10 transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden py-4 space-y-2 animate-fade-in">
              <button
                onClick={() => handleNavigation("home")}
                className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeSection === '' && window.location.pathname === '/' && window.scrollY === 0
                    ? 'text-accent font-medium bg-accent/10'
                    : 'text-foreground/80 hover:text-foreground hover:bg-accent/10'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavigation("portfolio")}
                className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeSection === 'featured-work'
                    ? 'text-accent font-medium bg-accent/10'
                    : 'text-foreground/80 hover:text-foreground hover:bg-accent/10'
                }`}
              >
                Portfolio
              </button>
              <button
                onClick={() => handleNavigation("services")}
                className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeSection === 'services'
                    ? 'text-accent font-medium bg-accent/10'
                    : 'text-foreground/80 hover:text-foreground hover:bg-accent/10'
                }`}
              >
                Services
              </button>
              <button
                onClick={() => handleNavigation("contact")}
                className={`block w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeSection === 'contact'
                    ? 'text-accent font-medium bg-accent/10'
                    : 'text-foreground/80 hover:text-foreground hover:bg-accent/10'
                }`}
              >
                Contact
              </button>
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
            </div>
          )}
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
    </>
  );
}
