import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Menu, LogOut, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import AuthDialog from "./AuthDialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const Header = () => {
  const { toast } = useToast();
  const { isAuthenticated, user, logout } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || 'U';
  };

  return (
    <>
      <header className="border-b border-border bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Crown className="h-8 w-8 text-accent" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                GenAI Boardroom
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-foreground/80 hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#personas" className="text-foreground/80 hover:text-foreground transition-colors">
              Personas
            </a>
            <a href="#pricing" className="text-foreground/80 hover:text-foreground transition-colors">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/build-board">
                  <Button variant="outline" size="sm">
                    Build Board
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} alt={user?.username} />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.username}
                          </p>
                          {user?.isAdmin && (
                            <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 border-amber-200">
                              Admin
                            </Badge>
                          )}
                        </div>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setAuthDialogOpen(true)}
                >
                  Sign In
                </Button>
                <Button 
                  variant="premium" 
                  size="sm"
                  onClick={() => setAuthDialogOpen(true)}
                >
                  Start Free Trial
                </Button>
              </>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => toast({
                title: "Mobile Menu",
                description: "Mobile navigation would expand here",
              })}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      <AuthDialog 
        isOpen={authDialogOpen} 
        onClose={() => setAuthDialogOpen(false)} 
      />
    </>
  );
};

export default Header;