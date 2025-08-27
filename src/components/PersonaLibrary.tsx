import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Brain, Target, Heart, Zap, Shield, Globe, type LucideProps } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const personas = [
  {
    id: 1,
    name: "Steve Jobs",
    title: "Innovation Catalyst",
    category: "Innovation",
    icon: Zap,
    expertise: ["Product Design", "User Experience", "Innovation Strategy"],
    personality: "Perfectionist, Visionary, Direct",
    description: "Ruthlessly focused on simplicity and user delight. Challenges every assumption.",
  },
  {
    id: 2,
    name: "Warren Buffett",
    title: "Value Investor",
    category: "Strategy",
    icon: Target,
    expertise: ["Investment Strategy", "Business Valuation", "Long-term Thinking"],
    personality: "Patient, Analytical, Folksy Wisdom",
    description: "Champions long-term value creation and prudent risk management.",
  },
  {
    id: 3,
    name: "Oprah Winfrey",
    title: "Empathy Leader",
    category: "Leadership",
    icon: Heart,
    expertise: ["Emotional Intelligence", "Storytelling", "Team Building"],
    personality: "Empathetic, Inspiring, Authentic",
    description: "Focuses on human connection and authentic leadership approaches.",
  },
  {
    id: 4,
    name: "Sun Tzu",
    title: "Strategic Warrior",
    category: "Strategy",
    icon: Shield,
    expertise: ["Strategic Planning", "Competitive Analysis", "Risk Assessment"],
    personality: "Calculated, Patient, Wise",
    description: "Masters the art of strategic thinking and competitive positioning.",
  },
  {
    id: 5,
    name: "Nelson Mandela",
    title: "Ethical Compass",
    category: "Ethics",
    icon: Globe,
    expertise: ["Ethical Decision Making", "Conflict Resolution", "Moral Leadership"],
    personality: "Principled, Forgiving, Steadfast",
    description: "Provides guidance on moral courage and ethical leadership.",
  },
  {
    id: 6,
    name: "Marie Curie",
    title: "Research Pioneer",
    category: "Innovation",
    icon: Brain,
    expertise: ["Scientific Method", "Perseverance", "Breaking Barriers"],
    personality: "Curious, Determined, Rigorous",
    description: "Champions evidence-based thinking and breakthrough innovation.",
  },
];

const categoryColors = {
  Innovation: "bg-purple-100 text-purple-800",
  Strategy: "bg-blue-100 text-blue-800",
  Leadership: "bg-green-100 text-green-800",
  Ethics: "bg-amber-100 text-amber-800",
};

type PersonaLite = {
  id: number;
  name: string;
  title: string;
  category: string;
  icon: React.ComponentType<LucideProps>;
  expertise: string[];
  personality: string;
  description: string;
};

const PersonaLibrary = () => {
  const { toast } = useToast();
  const [addedPersonas, setAddedPersonas] = useState<number[]>([]);

  const handleAddToBoard = (persona: PersonaLite) => {
    if (addedPersonas.includes(persona.id)) {
      toast({
        title: "Already Added",
        description: `${persona.name} is already on your board`,
        variant: "destructive",
      });
      return;
    }

    setAddedPersonas(prev => [...prev, persona.id]);
    toast({
      title: "Advisor Added! ✨",
      description: `${persona.name} has been added to your board`,
    });
  };
  return (
    <section id="personas" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Your Executive Advisory Team</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from our curated library of iconic leaders, or create your own custom advisors
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {personas.map((persona) => {
            const IconComponent = persona.icon;
            return (
              <Card
                key={persona.id}
                className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gray-100">
                      <IconComponent className="h-6 w-6 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[1.15rem] text-gray-900 leading-tight">{persona.name}</h3>
                      <p className="text-[0.98rem] text-gray-500 leading-tight">{persona.title}</p>
                    </div>
                  </div>
                  <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                    persona.category === 'Innovation'
                      ? 'bg-purple-100 text-purple-700'
                      : persona.category === 'Strategy'
                      ? 'bg-blue-100 text-blue-700'
                      : persona.category === 'Leadership'
                      ? 'bg-green-100 text-green-700'
                      : persona.category === 'Ethics'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>{persona.category}</span>
                </div>
                <div className="text-gray-700 text-[0.98rem] mb-4 leading-snug">{persona.description}</div>
                <div className="mb-2">
                  <span className="block text-xs font-bold text-gray-800 mb-1">Expertise:</span>
                  <div className="flex flex-wrap gap-2">
                    {persona.expertise.map((skill) => (
                      <span
                        key={skill}
                        className="text-sm font-semibold bg-gray-100 text-gray-800 px-3 py-1.5 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <span className="block text-xs font-bold text-gray-800 mb-1">Personality:</span>
                  <span className="text-sm text-gray-400">{persona.personality}</span>
                </div>
                <button
                  onClick={() => handleAddToBoard(persona)}
                  className={`w-full flex items-center justify-center gap-2 text-base px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors font-medium mt-4 ${
                    addedPersonas.includes(persona.id)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : ''
                  }`}
                >
                  <Plus className="h-5 w-5 mr-1" />
                  <span>{addedPersonas.includes(persona.id) ? 'Added to Board' : 'Add to Board'}</span>
                </button>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button 
            variant="premium" 
            size="lg"
            onClick={() => toast({
              title: "Custom Persona Builder",
              description: "Opening persona creation wizard...",
            })}
          >
            Create Custom Persona
            <Plus className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PersonaLibrary;