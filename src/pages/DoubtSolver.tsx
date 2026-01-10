import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Eraser, Paperclip, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming shadcn or similar
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import TopBar from "@/components/TopBar"; 
import ReactMarkdown from "react-markdown";

interface Message {
  id: number;
  type: "ai" | "user";
  text: string;
  topic?: string;
}

const AskDoubts = () => {
  // Mock Data & State
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, type: "ai", text: "Hello! I'm your AI tutor. Ask me any question about your studies. I can explain concepts, solve problems, and help you understand better." }
  ]);
  const [topic, setTopic] = useState("");
  const [query, setQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;

    // Add User Message
    const userMsg: Message = { id: Date.now(), type: "user", text: query, topic: topic };
    setMessages((prev) => [...prev, userMsg]);
    const currentQuery = query;
    setQuery("");
    setIsTyping(true);

    // Add AI Message Placeholder
    const aiMsgId = Date.now() + 1;
    setMessages((prev) => [
      ...prev,
      { id: aiMsgId, type: "ai", text: "", topic: topic }
    ]);

    try {
      // Fetch Event Stream
      const response = await fetch(`https://low-signal-ai.onrender.com/chat/stream?question=${encodeURIComponent(currentQuery)}`);
      
      if (!response.ok) {
        throw new Error("Failed to connect to AI");
      }

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const token = line.slice(6);
            if (token) {
               setIsTyping(false);
               setMessages((prev) => 
                 prev.map((msg) => 
                   msg.id === aiMsgId 
                     ? { ...msg, text: msg.text + token } 
                     : msg
                 )
               );
            }
          }
        }
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === aiMsgId 
            ? { ...msg, text: "Sorry, I'm having trouble connecting right now. Please try again later." } 
            : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    "What is photosynthesis?",
    "Explain fractions simply",
    "How does electricity work?",
    "What is coding?"
  ];

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden font-sans">
      {/* 1. Fixed Top Bar */}
      <div className="flex-none z-50">
        <TopBar language="EN" isOnline={true} />
      </div>

      {/* 2. Main Split Layout 
          h-[calc(100vh-theme(spacing.20))] accounts for TopBar + BottomNav height 
          Adjust '140px' based on the actual height of your TopBar + BottomNav
      */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative max-w-7xl mx-auto w-full h-[calc(100vh-140px)] lg:h-[calc(100vh-80px)]">
        
        {/* --- LEFT PANEL: Controls & Inputs --- */}
        <div className="w-full lg:w-[400px] flex flex-col gap-6 p-6 border-b lg:border-b-0 lg:border-r border-border/40 bg-card/30 backdrop-blur-sm z-20 order-2 lg:order-1 overflow-y-auto">
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Ask a Doubt
            </h2>
            <p className="text-muted-foreground text-sm">
              Configure your query for the most accurate AI response.
            </p>
          </div>

          <div className="space-y-4">
            {/* Topic Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Subject / Topic</label>
              <Input 
                placeholder="e.g. Physics, Calculus, History" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="bg-background/50 border-primary/10 focus:border-primary/50 transition-all"
              />
            </div>

            {/* Main Query Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Question</label>
              <div className="relative">
                <Textarea 
                  placeholder="Type your doubt here..." 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="min-h-[120px] resize-none bg-background/50 border-primary/10 focus:border-primary/50 pr-2 pb-10 shadow-sm"
                />
                {/* Action Bar inside Textarea */}
                <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                   <button className="text-muted-foreground hover:text-foreground transition-colors">
                     <Paperclip className="w-4 h-4" />
                   </button>
                   <span className="text-[10px] text-muted-foreground/50 font-medium hidden sm:block">⌘ + Enter to send</span>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSend} 
              disabled={!query.trim() || isTyping}
              className="w-full h-12 text-base font-medium shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isTyping ? "Thinking..." : "Solve Doubt"} 
              {!isTyping && <ArrowUpRight className="ml-2 w-4 h-4" />}
            </Button>
          </div>

          {/* Quick Suggestions (Moved to Sidebar) */}
          <div className="mt-auto pt-6 border-t border-border/40">
            <p className="text-xs font-medium text-muted-foreground mb-3">Or try asking:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, i) => (
                <button 
                  key={i}
                  onClick={() => setQuery(q)}
                  className="text-xs text-left px-3 py-2 rounded-lg bg-background border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all truncate max-w-full"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT PANEL: Chat Area --- */}
        <div className="flex-1 flex flex-col bg-background/50 relative order-1 lg:order-2">
          
          {/* Messages Container */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 lg:p-8 space-y-6 scroll-smooth"
          >
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-4 max-w-3xl ${msg.type === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-sm
                  ${msg.type === 'ai' ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-muted border-border text-muted-foreground'}
                `}>
                  {msg.type === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div className={`flex flex-col gap-1 min-w-[120px] ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
                  
                  {/* Metadata */}
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                    {msg.type === 'user' ? 'You' : 'AI Tutor'}
                    {msg.topic && <span className="bg-muted px-1.5 py-0.5 rounded text-[9px]">{msg.topic}</span>}
                  </div>

                  <div className={`
                    rounded-2xl p-4 text-sm leading-relaxed shadow-sm
                    ${msg.type === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-white dark:bg-zinc-900 border border-border/40 rounded-tl-none prose dark:prose-invert max-w-none'}
                  `}>
                    {msg.type === 'ai' ? (
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4 max-w-3xl animate-pulse">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-10 w-64 bg-muted rounded-xl rounded-tl-none" />
                </div>
              </div>
            )}
            
            {/* Spacer for bottom scrolling */}
            <div className="h-4" />
          </div>

          {/* Floating 'Clear' or Status actions (Optional) */}
          <div className="absolute top-4 right-4">
             <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setMessages([])}>
                <Eraser className="w-4 h-4" />
             </Button>
          </div>
        </div>
      </main>

      {/* 3. Bottom Navigation Placeholder (Visible on mobile usually) */}
      <div className="lg:hidden flex-none h-[60px] border-t bg-background z-50">
         {/* Your existing BottomNavBar component goes here */}
         <div className="h-full flex items-center justify-center text-xs text-muted-foreground">Bottom Navigation</div>
      </div>
    </div>
  );
};

export default AskDoubts;