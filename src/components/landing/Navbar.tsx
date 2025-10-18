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

import { useState } from "react";
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ 
        behavior: "smooth", 
        block: "start",
        inline: "nearest"
      });
      setIsOpen(false);
      
      // Add active state visual feedback
      element.classList.add('section-active');
      setTimeout(() => element.classList.remove('section-active'), 1000);
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
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-bold">
              QUANTIX STUDIO
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
                Home
              </Link>
              <Link to="/portfolio" className="text-foreground/80 hover:text-foreground transition-colors">
                Portfolio
              </Link>
              <button
                onClick={() => scrollToSection("services")}
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
              Contact
              </button>

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
            </div>

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
            <div className="md:hidden py-4 space-y-4">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block w-full text-left px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-accent/10 rounded-lg transition-colors"
              >
                Home
              </Link>
              <Link
                to="/portfolio"
                onClick={() => setIsOpen(false)}
                className="block w-full text-left px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-accent/10 rounded-lg transition-colors"
              >
                Portfolio
              </Link>
              <button
                onClick={() => scrollToSection("services")}
                className="block w-full text-left px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-accent/10 rounded-lg transition-colors"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="block w-full text-left px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-accent/10 rounded-lg transition-colors"
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
