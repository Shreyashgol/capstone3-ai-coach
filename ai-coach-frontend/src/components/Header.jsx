import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PenBox,
  LayoutDashboard,
  FileText,
  GraduationCap,
  ChevronDown,
  StarsIcon,
  User,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isGrowthDropdownOpen, setIsGrowthDropdownOpen] = useState(false);

  const handleLogout = async () => {
    console.log('Logout button clicked');
    setIsProfileDropdownOpen(false);
    await logout();
    navigate('/auth/signin');
  };

  const handleProfileClick = () => {
    console.log('Profile button clicked');
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    setIsGrowthDropdownOpen(false);
  };

  const handleGrowthClick = () => {
    setIsGrowthDropdownOpen(!isGrowthDropdownOpen);
    setIsProfileDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="h-12 py-1 w-auto object-contain flex items-center">
            <h1 className="text-2xl font-bold gradient-title">AI Coach</h1>
          </div>
        </Link>

        {/* Right Section */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {isAuthenticated && (
            <>
              {/* Dashboard */}
              <Link to="/dashboard">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2 cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Industry Insights
                </Button>
                <Button variant="ghost" className="md:hidden w-10 h-10 p-0 cursor-pointer">
                  <LayoutDashboard className="h-4 w-4" />
                </Button>
              </Link>

              {/* Growth Tools Dropdown */}
              <div className="relative">
                <Button 
                  onClick={handleGrowthClick}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <StarsIcon className="h-4 w-4" />
                  <span className="hidden md:block">Growth Tools</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                {isGrowthDropdownOpen && (
                  <div className="absolute top-full mt-2 w-48 bg-popover border rounded-md shadow-lg z-50">
                    <Link 
                      to="/resume" 
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent cursor-pointer"
                      onClick={() => setIsGrowthDropdownOpen(false)}
                    >
                      <FileText className="h-4 w-4" />
                      Build Resume
                    </Link>
                    <Link 
                      to="/cover-letters" 
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent cursor-pointer"
                      onClick={() => setIsGrowthDropdownOpen(false)}
                    >
                      <PenBox className="h-4 w-4" />
                      Cover Letter
                    </Link>
                    <Link 
                      to="/interview" 
                      className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-accent cursor-pointer"
                      onClick={() => setIsGrowthDropdownOpen(false)}
                    >
                      <GraduationCap className="h-4 w-4" />
                      Interview Prep
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Auth Controls */}
          {!isAuthenticated ? (
            <>
              <Link to="/auth/signin">
                <Button variant="outline" className="cursor-pointer">Sign In</Button>
              </Link>
              <Link to="/auth/signup">
                <Button className="cursor-pointer">Sign Up</Button>
              </Link>
            </>
          ) : (
            <div className="relative">
              <Button 
                onClick={handleProfileClick}
                variant="ghost" 
                className="relative h-10 w-10 rounded-full cursor-pointer hover:bg-accent border-2 border-primary/20 hover:border-primary/40 transition-all duration-200"
                aria-label="User menu"
              >
                {user?.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt={user.name} 
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                )}
              </Button>
              {isProfileDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-popover border rounded-md shadow-lg z-50">
                  <div className="flex items-center justify-start gap-3 p-3 border-b">
                    {user?.imageUrl ? (
                      <img 
                        src={user.imageUrl} 
                        alt={user.name} 
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                    )}
                    <div className="flex flex-col space-y-1 leading-none">
                      {user?.name && (
                        <p className="font-medium text-sm">{user.name}</p>
                      )}
                      {user?.email && (
                        <p className="w-[180px] truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="p-1">
                    <button 
                      onClick={handleLogout} 
                      className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm w-full hover:bg-accent rounded"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
