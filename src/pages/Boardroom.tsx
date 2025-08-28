import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Send, Users, Sparkles, Brain, Target, Heart, Shield, User, UserCheck, Loader2 } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useBoard } from "@/hooks/useBoards";
import { ai, conversations } from "@/lib/api";
import type { ServerMessage } from "@/lib/api";
import ConversationSummaryDialog from "@/components/ConversationSummary";

// Helper function to get icon based on role/expertise
function getPersonaIcon(role: string) {
  const roleLower = role.toLowerCase();
  if (roleLower.includes('innovation') || roleLower.includes('catalyst')) return Sparkles;
  if (roleLower.includes('investment') || roleLower.includes('financial')) return Target;
  if (roleLower.includes('empathy') || roleLower.includes('leader')) return Heart;
  if (roleLower.includes('strategic') || roleLower.includes('tactician')) return Shield;
  if (roleLower.includes('marketing') || roleLower.includes('cmo')) return Brain;
  if (roleLower.includes('operations') || roleLower.includes('coo')) return Users;
  if (roleLower.includes('product') || roleLower.includes('cpo')) return User;
  return UserCheck;
}

// Helper function to get color based on persona ID
function getPersonaColor(id: string) {
  const colors = [
    "text-purple-600",
    "text-blue-600", 
    "text-green-600",
    "text-red-600",
    "text-yellow-600",
    "text-indigo-600",
    "text-pink-600",
    "text-gray-600"
  ];
  return colors[id.length % colors.length];
}

interface Message {
  id: string;
  sender: string;
  avatar: string;
  content: string;
  timestamp: string;
  pending?: boolean; // for optimistic UI
}

const Boardroom = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const boardId = searchParams.get("boardId");

  // Fetch board data
  const { data: board, isLoading: boardLoading, error: boardError } = useBoard(boardId || "");

  // State for messages and UI
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedAdvisors, setSelectedAdvisors] = useState<string[]>([]);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [summaryDialogOpen, setSummaryDialogOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message when board is loaded
  useEffect(() => {
    if (board && board.personas && board.personas.length > 0 && messages.length === 0) {
      const firstPersona = board.personas[0];
      const welcomeMessage: Message = {
        id: 'welcome-1',
        sender: firstPersona.name,
        avatar: firstPersona.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        content: `Welcome to your AI Boardroom! I'm ${firstPersona.name}, and I'm here along with your other advisors to help with strategic guidance and insights.`,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages([welcomeMessage]);
      
      // Initialize with all advisors selected
      setSelectedAdvisors(board.personas.map(p => p.id));
    }
  }, [board, messages.length]);

  // Handle missing or invalid board ID
  useEffect(() => {
    if (!boardId) {
      toast({
        title: "No Board Selected",
        description: "Please select a board to continue",
        variant: "destructive",
      });
      navigate('/build-board');
      return;
    }
  }, [boardId, navigate, toast]);

  // Handle board loading error
  useEffect(() => {
    if (boardError) {
      toast({
        title: "Error Loading Board",
        description: "Failed to load board data. Please try again.",
        variant: "destructive",
      });
      navigate('/build-board');
    }
  }, [boardError, navigate, toast]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const switchAdvisor = (personaId: string) => {
    setSelectedAdvisors(prev => {
      if (prev.includes(personaId)) {
        return prev.filter(id => id !== personaId);
      } else {
        return [...prev, personaId];
      }
    });
  };

  const selectAllAdvisors = () => {
    if (board?.personas) {
      setSelectedAdvisors(board.personas.map(p => p.id));
    }
  };

  const deselectAllAdvisors = () => {
    setSelectedAdvisors([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
  if (!newMessage.trim() || !board || isGeneratingResponse) return;

  // Determine selected persona IDs before use
  const selectedPersonaIds = selectedAdvisors.length > 0 ? selectedAdvisors : undefined;

  // Create conversation if this is the first message
  if (!currentConversationId && messages.length <= 1) {
      try {
        const conversationResponse = await conversations.create({
          title: `Boardroom Discussion - ${new Date().toLocaleDateString()}`,
          context: `Discussion with ${board.name} advisory board`,
          boardId: board.id
        });
        
        if (conversationResponse.success && conversationResponse.data?.conversation) {
          setCurrentConversationId(conversationResponse.data.conversation.id);
        }
      } catch (error) {
        console.error('Error creating conversation:', error);
        // Continue without conversation ID for now
      }
    }

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      sender: "You",
      avatar: "U",
      content: newMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = newMessage;
    setNewMessage("");
    setIsGeneratingResponse(true);

    try {
      // Optimistic UI: insert placeholder AI messages immediately
      const optimisticPlaceholders: Message[] = (board?.personas || []).filter(p => selectedPersonaIds?.includes(p.id) || !selectedPersonaIds).slice(0,3).map((p, i) => ({
        id: `optimistic-${Date.now()}-${i}`,
        sender: p.name,
        avatar: p.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        content: '...',
        timestamp: new Date().toLocaleTimeString(),
        pending: true
      }));

      setMessages(prev => [...prev, ...optimisticPlaceholders]);

      // Generate AI responses from the board personas
      const response = await ai.generateResponse(board.id, {
        message: currentMessage,
        conversationId: currentConversationId || undefined,
        selectedPersonaIds
      });

      if (response.success && response.data?.responses) {
        // If backend created or returned a conversationId, persist it locally
        type AIResponseData = { responses: { personaId: string; personaName: string; response: string }[]; conversationId?: string };
        const respData = response.data as AIResponseData | undefined;
        if (respData?.conversationId) {
          setCurrentConversationId(respData.conversationId);

          // Refresh messages from the server to include persisted messages
          try {
            const msgsRes = await conversations.get(respData.conversationId, { messageLimit: 100 });
            if (msgsRes.success && msgsRes.data?.conversation) {
              const serverMessages = (msgsRes.data.conversation.messages as ServerMessage[]).map((m) => ({
                id: m.id,
                sender: m.type === 'USER' ? 'You' : (m.persona?.name || 'Advisor'),
                avatar: m.type === 'USER' ? 'U' : (m.persona?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'A'),
                content: m.content,
                timestamp: new Date(m.createdAt).toLocaleTimeString()
              }));
              setMessages(serverMessages);
            }
          } catch (fetchErr) {
            console.error('Failed to refresh messages after AI response:', fetchErr);
          }
        }

        // Replace optimistic placeholders with actual AI responses
        const aiMessages: Message[] = response.data.responses.map((res, index) => ({
          id: `ai-${Date.now()}-${index}`,
          sender: res.personaName,
          avatar: res.personaName.split(' ').map(n => n[0]).join('').toUpperCase(),
          content: res.response,
          timestamp: new Date().toLocaleTimeString()
        }));

        setMessages(prev => {
          // remove pending placeholders
          const withoutPlaceholders = prev.filter(m => !m.pending);
          return [...withoutPlaceholders, ...aiMessages];
        });
      
      } else {
        throw new Error(response.message || 'Failed to generate AI response');
      }
    } catch (error) {
      console.error('Error generating AI response:', error);
      toast({
        title: "Error",
        description: "Failed to get response from your board advisors. Please try again.",
        variant: "destructive",
      });

      // Add fallback message
      const fallbackMessage: Message = {
        id: `fallback-${Date.now() + 999}`,
        sender: "System",
        avatar: "S",
        content: "I apologize, but I'm having trouble connecting to your advisory board right now. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsGeneratingResponse(false);
    }
  };

  // Show loading state
  if (boardLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading boardroom...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (boardError || !board) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Board Not Found</h2>
          <p className="text-muted-foreground mb-4">The requested board could not be loaded.</p>
          <Link to="/build-board">
            <Button>Back to Builder</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
  <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Link to="/build-board">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Builder
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">AI Boardroom</h1>
              <p className="text-sm text-muted-foreground">Your Executive Advisory Session</p>
            </div>
          </div>
          {/* Persistent Summary Button in Header */}
          <div>
            <ConversationSummaryDialog
              conversationId={currentConversationId || ""}
              conversationTitle={board?.name ? `${board.name} Discussion` : "Boardroom Discussion"}
              boardName={board?.name || ""}
              messageCount={messages.length}
              participants={board?.personas?.map(p => p.name) || []}
              forceButtonLabel="View & Export Summary"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Sidebar - Advisors */}
        <div className="w-80 border-r border-border bg-muted/30 p-4 flex-shrink-0 flex flex-col h-full overflow-hidden">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Your Board ({board?.personas?.length || 0})
              </h3>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectAllAdvisors}
                  className="text-xs h-6 px-2"
                >
                  All
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={deselectAllAdvisors}
                  className="text-xs h-6 px-2"
                >
                  None
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            {board?.personas?.length > 0 ? (
              board.personas.map((persona) => {
                const IconComponent = getPersonaIcon((persona.role || persona.expertise || 'advisor') as string);
                return (
                  <Card 
                    key={persona.id}
                    className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                      selectedAdvisors.includes(persona.id)
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:bg-card'
                    }`}
                    onClick={() => switchAdvisor(persona.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className={`${getPersonaColor(persona.id)} bg-muted font-semibold`}>
                          {persona.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm truncate">{persona.name}</h4>
                          <IconComponent className="h-3 w-3 text-muted-foreground" />
                          {selectedAdvisors.includes(persona.id) && (
                            <UserCheck className="h-3 w-3 text-primary" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{persona.role}</p>
                        <p className="text-xs text-muted-foreground/80 truncate">
                          {persona.personality || persona.mindset || "Professional advisor"}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              <div className="text-sm text-muted-foreground text-center py-4">
                No personas in this board
              </div>
            )}
          </div>

          <Separator className="my-4" />
          
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              {selectedAdvisors.length > 0 ? (
                <div>
                  <span className="font-medium">Selected advisors ({selectedAdvisors.length}):</span>
                  <br />
                  {selectedAdvisors.length <= 3 ? (
                    selectedAdvisors.map(id => 
                      board?.personas?.find(p => p.id === id)?.name
                    ).join(', ')
                  ) : (
                    `${board?.personas?.find(p => p.id === selectedAdvisors[0])?.name || 'Unknown'} and ${selectedAdvisors.length - 1} others`
                  )}
                  <br />
                  <span className="text-xs">Only selected advisors will respond</span>
                </div>
              ) : (
                <div>
                  <span className="font-medium">All advisors active</span>
                  <br />
                  <span>All advisors will respond to your questions</span>
                </div>
              )}
            </div>
            
            <div className="text-center">
              <Badge variant="secondary" className="text-xs">
                Active Session
              </Badge>
            </div>
          </div>

          <Separator className="my-4" />
          {/* Persistent Summary Button */}
          <div className="flex justify-end mb-2">
            <ConversationSummaryDialog
              conversationId={currentConversationId || ""}
              conversationTitle={board?.name ? `${board.name} Discussion` : "Boardroom Discussion"}
              boardName={board?.name || ""}
              messageCount={messages.length}
              participants={board?.personas?.map(p => p.name) || []}
              forceButtonLabel="View & Export Summary"
            />
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs font-medium">
                    {message.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{message.sender}</span>
                    <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                  </div>
                  <div className="text-sm bg-muted p-3 rounded-lg">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4">
            {isGeneratingResponse && (
              <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Your advisory board is thinking...</span>
              </div>
            )}
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {selectedAdvisors.length > 0 ? (
                  `Asking ${selectedAdvisors.length} advisor${selectedAdvisors.length > 1 ? 's' : ''}`
                ) : (
                  `Asking all ${board?.personas?.length || 0} advisors`
                )}
              </div>
              {selectedAdvisors.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={deselectAllAdvisors}
                  className="text-xs h-5 px-2"
                >
                  Reset to All
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Ask your advisory board for guidance..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isGeneratingResponse}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isGeneratingResponse}
                size="sm"
              >
                {isGeneratingResponse ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Boardroom;
