import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Send, Wifi, Trash2, StopCircle, Play, RotateCcw } from "lucide-react"; // Added icons for better UI
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";
import ChatMessage from "@/components/ChatMessage";
import SuggestionChip from "@/components/SuggestionChip";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const API_BASE = "https://low-signal-ai.onrender.com";

const DoubtSolver = () => {
  const { language, t } = useLanguage();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Ref for auto-scrolling
  const messagesEndRef = useRef(null);

  const initialMessages = [
    {
      content: t('doubtSolver.initialMessage'),
      isUser: false,
      timestamp: "Now",
    },
  ];

  const suggestions = [
    t('doubtSolver.suggestions.photosynthesis'),
    t('doubtSolver.suggestions.fractions'),
    t('doubtSolver.suggestions.electricity'),
    t('doubtSolver.suggestions.coding'),
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [isStreaming, setIsStreaming] = useState(false);
  const eventSourceRef = useRef(null);
  const [topicInput, setTopicInput] = useState("");
  const [doubtInput, setDoubtInput] = useState("");
  const [expanded, setExpanded] = useState({});

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  // Reset messages when language changes
  useEffect(() => {
    setMessages([{
      content: t('doubtSolver.initialMessage'),
      isUser: false,
      timestamp: "Now",
    }]);
  }, [language]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const getLanguageLabel = () => {
    if (language === "hi") return "हिंदी";
    if (language === "mr") return "मराठी";
    return "EN";
  };

  const handleAsk = () => {
    if (!topicInput.trim() && !doubtInput.trim()) return;
    if (isStreaming) return;

    const combined = `Topic: ${topicInput.trim()}\nDoubt: ${doubtInput.trim()}`.trim();

    setMessages((prev) => [
      ...prev,
      { content: `Topic: ${topicInput.trim()} — Doubt: ${doubtInput.trim()}`, isUser: true, timestamp: "Now" },
      { content: "", isUser: false, timestamp: "" }, // Placeholder for answer
    ]);

    setIsStreaming(true);

    try {
      const es = new EventSource(`${API_BASE}/chat/stream?question=${encodeURIComponent(combined)}`);
      eventSourceRef.current = es;

      es.onmessage = (e) => {
        const token = e.data;
        if (!token) return;

        setMessages((prev) => {
          const msgs = [...prev];
          const lastIdx = msgs.length - 1;
          msgs[lastIdx] = {
            ...msgs[lastIdx],
            content: (msgs[lastIdx].content || "") + token,
            timestamp: "Just now",
          };
          return msgs;
        });
      };

      es.onerror = () => {
        es.close();
        eventSourceRef.current = null;
        setIsStreaming(false);
      };
    } catch (err) {
      console.error(err);
      setIsStreaming(false);
      setMessages((prev) => [
        ...prev,
        { content: "Failed to connect to stream.", isUser: false, timestamp: "" },
      ]);
    }
  };

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  const stopStreaming = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsStreaming(false);
    setMessages((prev) => [
      ...prev,
      { content: prev[prev.length - 1].content + "\n\n[Stopped by user]", isUser: false, timestamp: "" },
    ]);
  };

  const copyMessage = async (idx) => {
    const text = messages[idx]?.content || "";
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const toggleExpand = (idx) => {
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const clearInputs = () => {
    setTopicInput(''); 
    setDoubtInput('');
  }

  return (
    // 1. CHANGED: h-[100dvh] ensures it fits mobile screens perfectly without scrollbars on body
    // flex-col creates the vertical stack
    <div className="flex flex-col h-[100dvh] bg-background overflow-hidden relative">
      
      {/* Top Section */}
      <div className="shrink-0 z-20">
        <TopBar language={getLanguageLabel()} isOnline={isOnline} showBack title={t('doubtSolver.title')} />
        
        {!isOnline && (
          <div className="px-4 py-2 bg-yellow-500/10 border-b border-yellow-500/20">
            <p className="text-xs text-center font-medium text-yellow-600 dark:text-yellow-400">
              {t('doubtSolver.connectToAsk')}
            </p>
          </div>
        )}
      </div>

      {/* 2. CHANGED: Chat Area - flex-1 takes all REMAINING space. 
          overflow-y-auto handles scrolling strictly inside this area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 scroll-smooth">
        
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.isUser ? (
              <ChatMessage content={msg.content} isUser={true} timestamp={msg.timestamp} />
            ) : (
              <div className="flex justify-start animate-in slide-in-from-left-2 duration-300">
                <div className="relative max-w-[90%] md:max-w-[80%] px-5 py-4 rounded-3xl rounded-tl-sm bg-muted/50 border border-border/50 text-foreground">
                  <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed">
                    {(() => {
                      const full = msg.content || "";
                      const isLong = full.length > 300;
                      const showFull = !!expanded[index] || !isLong;
                      const display = showFull ? full : full.slice(0, 300) + "...";
                      return (
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                          {display}
                        </ReactMarkdown>
                      );
                    })()}
                  </div>

                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/10">
                    <button
                      className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                      onClick={() => copyMessage(index)}
                    >
                      Copy
                    </button>
                    {msg.content && msg.content.length > 300 && (
                      <button
                        className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
                        onClick={() => toggleExpand(index)}
                      >
                        {expanded[index] ? "Show less" : "Show more"}
                      </button>
                    )}
                    {isStreaming && index === messages.length - 1 && (
                      <span className="flex items-center gap-1 text-xs text-primary animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"/> Generating...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Suggestions appear at the bottom of chat if empty */}
        {messages.length <= 1 && (
          <div className="mt-8 space-y-3">
             <p className="text-sm text-muted-foreground text-center">{t('doubtSolver.tryAsking')}</p>
             <div className="flex flex-wrap justify-center gap-2">
               {suggestions.map((s, i) => (
                 <SuggestionChip key={i} label={s} onClick={() => setTopicInput(s)} />
               ))}
             </div>
          </div>
        )}
        
        {/* Invisible element to auto-scroll to */}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* 3. CHANGED: Input Area - Removed 'fixed', 'bottom-20'.
          This is now a natural block element (shrink-0) that sits below the chat. */}
      <div className="shrink-0 bg-background border-t border-border shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.05)] z-20">
        <div className="p-4 space-y-3 max-w-3xl mx-auto">
          
          <div className="flex gap-2">
            <input
              className="flex-1 px-4 py-2.5 bg-muted/50 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Topic (e.g. Physics)"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              disabled={!isOnline}
            />
            {/* Clear Button */}
            {(topicInput || doubtInput) && (
                <Button variant="ghost" size="icon" onClick={clearInputs} className="h-10 w-10 text-muted-foreground">
                    <Trash2 className="w-4 h-4" />
                </Button>
            )}
          </div>

          <div className="relative">
            <textarea
              className="w-full p-4 bg-muted/50 border border-border/50 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[100px]"
              placeholder="Type your question here..."
              value={doubtInput}
              onChange={(e) => setDoubtInput(e.target.value)}
              disabled={!isOnline}
            />
            
            {/* Action Buttons positioned nicely */}
            <div className="absolute bottom-3 right-3 flex gap-2">
                {isStreaming ? (
                    <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={stopStreaming}
                        className="h-8 px-3 rounded-lg shadow-sm"
                    >
                        <StopCircle className="w-4 h-4 mr-1.5" /> Stop
                    </Button>
                ) : (
                    <Button 
                        onClick={handleAsk}
                        disabled={!isOnline || (!topicInput.trim() && !doubtInput.trim())}
                        size="sm"
                        className="h-8 px-4 rounded-lg shadow-sm bg-primary hover:bg-primary/90"
                    >
                        Ask <Send className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                )}
            </div>
          </div>
        </div>
        
        {/* 4. Spacer for BottomNav. Assuming BottomNav is fixed at bottom, 
            we need padding here so the input isn't hidden behind it. */}
        <div className="h-16 md:h-0" /> 
      </div>

      <BottomNav />
    </div>
  );
};

export default DoubtSolver;