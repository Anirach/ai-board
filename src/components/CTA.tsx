import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Crown, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CTA = () => {
  const { toast } = useToast();
  return (
    <section className="py-24 bg-gradient-hero text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:32px_32px]" />
      </div>
      
      <div className="container mx-auto px-4 relative">
        <Card className="max-w-4xl mx-auto p-12 bg-card/95 backdrop-blur border-0 shadow-elegant text-center">
          <div className="mb-8">
            <Crown className="h-16 w-16 text-accent mx-auto mb-6" />
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">
              Ready to Transform Your
              <span className="text-primary block">Decision Making?</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join thousands of executives who've already assembled their AI boardroom. 
              Start consulting with history's greatest minds today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              variant="premium" 
              size="lg" 
              className="group"
              onClick={() => toast({
                title: "Free Trial Activated! 🚀",
                description: "Your 14-day premium access starts now. Welcome aboard!",
              })}
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Start Free 14-Day Trial
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-muted-foreground/20"
              onClick={() => toast({
                title: "Demo Scheduled! 📅",
                description: "We'll contact you to arrange a personalized demonstration",
              })}
            >
              Schedule Demo
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span>Setup in under 5 minutes</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-accent rounded-full" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default CTA;