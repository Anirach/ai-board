import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Users, Brain, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-boardroom.jpg";

const Hero = () => {
  const { toast } = useToast();
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:24px_24px]" />
      </div>
      
      <div className="container mx-auto px-4 py-24 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Badge variant="secondary" className="w-fit">
              🚀 Revolutionizing Executive Decision Making
            </Badge>
            
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Your Always-Available
                <span className="text-accent block">Executive Advisors</span>
              </h1>
              <p className="text-xl text-primary-foreground/80 leading-relaxed max-w-xl">
                Create your personal AI boardroom with virtual advisors modeled after iconic leaders. 
                Get strategic guidance from history's greatest minds, available 24/7.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/build-board">
                <Button variant="accent" size="lg" className="group">
                  Start Building Your Board
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => toast({
                  title: "Demo Coming Soon! 🎬",
                  description: "Interactive demo will be available shortly",
                })}
              >
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-8">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                <span className="text-sm">500+ Leaders</span>
              </div>
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-accent" />
                <span className="text-sm">AI-Powered Insights</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                <span className="text-sm">Strategic Clarity</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-elegant">
              <img 
                src={heroImage} 
                alt="Executive AI Boardroom" 
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground rounded-lg p-4 shadow-glow animate-pulse">
              <div className="text-sm font-medium">Steve Jobs</div>
              <div className="text-xs opacity-80">Innovation Advisor</div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-card text-card-foreground rounded-lg p-4 shadow-card">
              <div className="text-sm font-medium">Warren Buffett</div>
              <div className="text-xs text-muted-foreground">Investment Strategy</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;