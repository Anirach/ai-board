import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Users, TrendingUp, Plus, Crown, Zap, Target, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const myBoard = [
  { name: "Steve Jobs", role: "Innovation", avatar: "SJ", sessions: 12, color: "text-purple-600" },
  { name: "Warren Buffett", role: "Strategy", avatar: "WB", sessions: 8, color: "text-blue-600" },
  { name: "Oprah Winfrey", role: "Leadership", avatar: "OW", sessions: 15, color: "text-green-600" },
  { name: "Sun Tzu", role: "Strategy", avatar: "ST", sessions: 6, color: "text-red-600" },
];

const recentSessions = [
  { 
    title: "Product Roadmap Strategy", 
    participants: ["Steve Jobs", "Warren Buffett"], 
    time: "2 hours ago",
    outcome: "Consensus on mobile-first approach"
  },
  { 
    title: "Team Restructuring Decision", 
    participants: ["Oprah Winfrey", "Sun Tzu"], 
    time: "1 day ago",
    outcome: "Phased approach with clear communication"
  },
  { 
    title: "Investment Opportunity Analysis", 
    participants: ["Warren Buffett"], 
    time: "3 days ago",
    outcome: "Recommended thorough due diligence"
  },
];

const Dashboard = () => {
  const { toast } = useToast();
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Your Executive Command Center</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Monitor your advisory sessions, track insights, and manage your personal board of directors
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="p-6 text-center bg-gradient-card border-0">
              <div className="flex items-center justify-center mb-3">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-2xl font-bold">4</div>
              <div className="text-sm text-muted-foreground">Active Advisors</div>
            </Card>
            
            <Card className="p-6 text-center bg-gradient-card border-0">
              <div className="flex items-center justify-center mb-3">
                <MessageSquare className="h-8 w-8 text-accent" />
              </div>
              <div className="text-2xl font-bold">41</div>
              <div className="text-sm text-muted-foreground">Total Sessions</div>
            </Card>
            
            <Card className="p-6 text-center bg-gradient-card border-0">
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold">89%</div>
              <div className="text-sm text-muted-foreground">Decision Confidence</div>
            </Card>
            
            <Card className="p-6 text-center bg-gradient-card border-0">
              <div className="flex items-center justify-center mb-3">
                <Crown className="h-8 w-8 text-accent" />
              </div>
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">Key Insights</div>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* My Board */}
            <Card className="p-8 bg-card border-0 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">My Board</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast({
                    title: "Add New Advisor",
                    description: "Opening persona selection...",
                  })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Advisor
                </Button>
              </div>
              
              <div className="space-y-4">
                {myBoard.map((member) => (
                  <div key={member.name} className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className={`${member.color} bg-muted font-semibold`}>
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.role}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{member.sessions} sessions</div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-auto p-1 text-xs"
                        onClick={() => toast({
                          title: `Consulting ${member.name}`,
                          description: "Opening AI conversation interface...",
                        })}
                      >
                        Consult
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Sessions */}
            <Card className="p-8 bg-card border-0 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Recent Sessions</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => toast({
                    title: "Session History",
                    description: "Loading complete session archive...",
                  })}
                >
                  View All
                </Button>
              </div>
              
              <div className="space-y-6">
                {recentSessions.map((session, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-sm">{session.title}</h4>
                      <span className="text-xs text-muted-foreground">{session.time}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {session.participants.map((participant) => (
                        <Badge key={participant} variant="secondary" className="text-xs">
                          {participant}
                        </Badge>
                      ))}
                    </div>
                    
                    <p className="text-sm text-muted-foreground italic">
                      "{session.outcome}"
                    </p>
                    
                    {index < recentSessions.length - 1 && (
                      <div className="border-b border-border/50 mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button 
              variant="premium" 
              size="lg"
              onClick={() => toast({
                title: "New Consultation Starting! 🎯",
                description: "Preparing your AI boardroom...",
              })}
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Start New Consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;