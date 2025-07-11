import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, User, LogIn, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from '@/integrations/supabase/client';
import { useAdminRole } from "@/hooks/useAdminRole";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const { isAdmin, loading: adminLoading } = useAdminRole();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setIsLoggedIn(!!user);
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session?.user);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="w-full py-4 px-4 md:px-6 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-10 w-10 rounded-full bg-patho-primary text-white flex items-center justify-center text-xl font-bold">
              D
            </div>
            <span className="text-xl font-bold">Dr. Patho</span>
          </Link>
        </div>

        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/" active={isActive('/')}>Home</NavLink>
          <NavLink to="/labs" active={isActive('/labs')}>Labs</NavLink>
          <NavLink to="/tests" active={isActive('/tests')}>Tests</NavLink>
          <NavLink to="/bookings" active={isActive('/bookings')}>My Bookings</NavLink>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          
          {!loading && (
            isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <User className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {isAdmin && !adminLoading && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer text-blue-600 font-medium">
                        Admin
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/bookings" className="cursor-pointer">My Bookings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => navigate('/auth')}>
                <LogIn className="h-5 w-5" />
              </Button>
            )
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden mt-4 bg-white border-t pt-4">
          <div className="flex flex-col space-y-4 pb-4">
            <Link to="/" className="px-4 py-2 hover:bg-gray-100" onClick={toggleMenu}>Home</Link>
            <Link to="/labs" className="px-4 py-2 hover:bg-gray-100" onClick={toggleMenu}>Labs</Link>
            <Link to="/tests" className="px-4 py-2 hover:bg-gray-100" onClick={toggleMenu}>Tests</Link>
            <Link to="/bookings" className="px-4 py-2 hover:bg-gray-100" onClick={toggleMenu}>My Bookings</Link>
            
            {!loading && (
              isLoggedIn ? (
                <>
                  <Link to="/profile" className="px-4 py-2 hover:bg-gray-100" onClick={toggleMenu}>My Profile</Link>
                  <button onClick={handleLogout} className="px-4 py-2 text-left hover:bg-gray-100">Logout</button>
                </>
              ) : (
                <Link to="/auth" className="px-4 py-2 hover:bg-gray-100" onClick={toggleMenu}>Login / Sign Up</Link>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ 
  to, 
  active, 
  children 
}: { 
  to: string; 
  active: boolean; 
  children: React.ReactNode;
}) => {
  return (
    <Link 
      to={to}
      className={cn(
        "font-medium transition-colors hover:text-patho-primary", 
        active ? "text-patho-primary border-b-2 border-patho-primary pb-1" : "text-gray-600"
      )}
    >
      {children}
    </Link>
  );
};

export default Navbar;
