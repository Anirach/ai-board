import { Card } from "@/components/ui/card";
import { MessageSquare, Users, Brain, BarChart3, FileText, Settings } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "AI-Powered Conversations",
    description: "Chat with your virtual board members using advanced GPT-4 technology. Get personalized insights based on each advisor's unique perspective and expertise."
  },
  {
    icon: Users,
    title: "Multi-Persona Dialogues",
    description: "Facilitate group discussions between your advisors. Watch different viewpoints emerge and synthesize diverse perspectives into actionable strategies."
  },
  {
    icon: Brain,
    title: "Decision Support Engine",
    description: "Present complex scenarios and receive structured analysis from multiple angles. Our AI helps you navigate difficult choices with confidence."
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track your consultation patterns, identify blind spots, and measure decision confidence over time. Data-driven insights into your advisory usage."
  },
  {
    icon: FileText,
    title: "Session Documentation",
    description: "Automatically capture and organize your boardroom sessions. Export insights to your favorite tools or review past conversations for reference."
  },
  {
    icon: Settings,
    title: "Custom Persona Builder",
    description: "Create bespoke advisors tailored to your specific needs. Define expertise areas, personality traits, and thinking frameworks."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Powerful Features for Executive Excellence</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to harness the collective wisdom of history's greatest leaders
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card 
                key={index} 
                className="p-8 bg-gradient-card hover:shadow-card transition-all duration-300 border-0 group"
              >
                <div className="mb-6">
                  <div className="inline-flex p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <IconComponent className="h-6 w-6 text-primary" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;