
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
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

        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/" active={isActive('/')}>Home</NavLink>
          <NavLink to="/labs" active={isActive('/labs')}>Labs</NavLink>
          <NavLink to="/tests" active={isActive('/tests')}>Tests</NavLink>
          <NavLink to="/bookings" active={isActive('/bookings')}>My Bookings</NavLink>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Link to="/account">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
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
