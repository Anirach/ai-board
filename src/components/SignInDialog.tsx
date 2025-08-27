import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

interface SignInDialogProps {
  children: React.ReactNode;
}

const SignInDialog = ({ children }: SignInDialogProps) => {
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Demo admin credentials
    const DEMO_EMAIL = "anirach.m@fitm.kmutnb.ac.th";
    const DEMO_PASSWORD = "admin123";
    
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      toast({
        title: "Welcome Admin! 🎉",
        description: "Successfully signed in as demo admin",
      });
      // Set admin flag in localStorage for demo purposes
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("userEmail", email);
    } else {
      toast({
        title: "Invalid Credentials",
        description: "Please use demo admin credentials: anirach.m@fitm.kmutnb.ac.th / admin123",
        variant: "destructive",
      });
      return;
    }
    
    setOpen(false);
    setEmail("");
    setPassword("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>
            Enter your credentials to access your GenAI Boardroom
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Button type="submit" className="w-full">
              Sign In
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                toast({
                  title: "Forgot Password",
                  description: "Password reset link would be sent to your email",
                });
              }}
            >
              Forgot Password?
            </Button>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={() => {
                toast({
                  title: "Sign Up",
                  description: "Sign up functionality would open here",
                });
              }}
            >
              Sign up
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SignInDialog;