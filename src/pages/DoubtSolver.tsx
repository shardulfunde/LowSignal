import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Send, Mic, Wifi } from "lucide-react";
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
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const [topicInput, setTopicInput] = useState("");
  const [doubtInput, setDoubtInput] = useState("");
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

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

  const handleSend = (text?: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim() || isStreaming) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { content: messageText, isUser: true, timestamp: "Now" },
    ]);
    setInputValue("");

    // Add empty assistant message that we'll fill as tokens arrive
    setMessages((prev) => [
      ...prev,
      { content: "", isUser: false, timestamp: "" },
    ]);

    setIsStreaming(true);

    // Open SSE connection to backend stream endpoint
    try {
      const es = new EventSource(`${API_BASE}/chat/stream?question=${encodeURIComponent(messageText)}`);
      eventSourceRef.current = es;

      es.onmessage = (e) => {
        const token = e.data;
        if (!token) return;

        setMessages((prev) => {
          const msgs = [...prev];
          // append token to last assistant message
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
        // When the server closes the stream EventSource often triggers onerror.
        if (es.readyState === EventSource.CLOSED) {
          es.close();
        } else {
          es.close();
        }
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

  // New: Ask using topic + doubt inputs
  const handleAsk = () => {
    if (!topicInput.trim() && !doubtInput.trim()) return;
    if (isStreaming) return;

    const combined = `Topic: ${topicInput.trim()}\nDoubt: ${doubtInput.trim()}`.trim();

    // Add user-visible compact message
    setMessages((prev) => [
      ...prev,
      { content: `Topic: ${topicInput.trim()} — Doubt: ${doubtInput.trim()}`, isUser: true, timestamp: "Now" },
    ]);

    // start streaming the combined prompt
    // Add empty assistant message
    setMessages((prev) => [
      ...prev,
      { content: "", isUser: false, timestamp: "" },
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

  // Cleanup EventSource on unmount
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
      { content: "[Streaming stopped by user]", isUser: false, timestamp: "" },
    ]);
  };

  const copyMessage = async (idx: number) => {
    const text = messages[idx]?.content || "";
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  const toggleExpand = (idx: number) => {
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar language={getLanguageLabel()} isOnline={isOnline} showBack title={t('doubtSolver.title')} />

      {/* Online Required Notice */}
      {!isOnline && (
        <div className="px-4 py-2 bg-warning/20 border-b border-warning/30">
          <p className="text-sm text-center font-semibold text-warning-foreground">
            {t('doubtSolver.connectToAsk')}
          </p>
        </div>
      )}

      {isOnline && (
        <div className="px-4 py-2 bg-secondary/10 border-b border-secondary/20 flex items-center justify-center gap-2">
          <Wifi className="w-4 h-4 text-secondary" />
          <p className="text-sm font-semibold text-secondary">{t('common.requiresInternet')}</p>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-48">
        <div className="max-w-lg mx-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index}>
              {msg.isUser ? (
                <ChatMessage content={msg.content} isUser={true} timestamp={msg.timestamp} />
              ) : (
                <div className="flex justify-start animate-slide-up">
                  <div className="relative max-w-[85%] px-4 py-3 rounded-2xl bg-muted text-foreground rounded-bl-md">
                      <div className="prose prose-sm max-w-none">
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

                      <div className="flex items-center gap-2 mt-2">
                      <button
                        className="text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => copyMessage(index)}
                        aria-label="Copy answer"
                      >
                        Copy
                      </button>
                        {msg.content && msg.content.length > 100 && (
                          <button
                        className="text-sm text-muted-foreground hover:text-foreground"
                          onClick={() => toggleExpand(index)}
                        >
                          {expanded[index] ? "Collapse" : "Expand"}
                        </button>
                        )}
                      {isStreaming && (
                        <span className="text-xs text-muted-foreground">Streaming…</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-4 max-w-lg mx-auto w-full">
          <p className="text-sm text-muted-foreground mb-2">{t('doubtSolver.tryAsking')}</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <SuggestionChip
                key={index}
                label={suggestion}
                onClick={() => {
                  setTopicInput(suggestion);
                  setDoubtInput("");
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Topic + Doubt Input Area */}
      <div className="fixed bottom-20 left-0 right-0 bg-card border-t border-border p-4">
        <div className="max-w-lg mx-auto space-y-3">
          <div className="flex items-center gap-3">
            <input
              className="flex-1 p-3 border rounded-xl"
              placeholder="Topic (e.g. Photosynthesis)"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              disabled={!isOnline}
            />
            <button
              className="px-3 py-2 rounded-xl bg-muted hover:bg-muted/80"
              onClick={() => { setTopicInput(''); setDoubtInput(''); }}
            >
              Clear
            </button>
          </div>

          <textarea
            className="w-full p-3 border rounded-xl h-28 resize-none"
            placeholder="Describe your doubt clearly (one sentence) or paste the question/prompt here"
            value={doubtInput}
            onChange={(e) => setDoubtInput(e.target.value)}
            disabled={!isOnline}
          />

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">{isStreaming ? 'Streaming answer...' : ''}</div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleAsk}
                disabled={isStreaming || !isOnline || (!topicInput.trim() && !doubtInput.trim())}
                className="h-12"
              >
                Ask
              </Button>
              <Button
                variant="outline"
                onClick={() => { setTopicInput(''); setDoubtInput(''); }}
                className="h-12"
              >
                Reset
              </Button>
              {isStreaming && (
                <Button variant="destructive" onClick={stopStreaming} className="h-12">
                  Stop
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default DoubtSolver;
