import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, LogIn, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogin = (method: string) => {
    console.log(`Logging in with ${method}`);
    setIsLoggedIn(true);
    // In a real app, this would handle actual authentication
  };

  const handleLogout = () => {
    console.log('Logging out');
    setIsLoggedIn(false);
    // In a real app, this would handle actual logout
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
          
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <User className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <LogIn className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleLogin('google')} className="cursor-pointer">
                  Login with Google
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLogin('guest')} className="cursor-pointer">
                  Continue as Guest
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="px-4 py-2 hover:bg-gray-100" onClick={toggleMenu}>My Profile</Link>
                <button onClick={handleLogout} className="px-4 py-2 text-left hover:bg-gray-100">Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => handleLogin('google')} className="px-4 py-2 text-left hover:bg-gray-100">Login with Google</button>
                <button onClick={() => handleLogin('guest')} className="px-4 py-2 text-left hover:bg-gray-100">Continue as Guest</button>
              </>
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
