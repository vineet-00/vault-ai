import {
  createThread,
  deleteThread,
  getMessages,
  getThreads,
  Message,
  renameThread,
  sendMessage,
  Thread,
} from "@/lib/tauri";
import { listen } from "@tauri-apps/api/event";
import { Bot } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import ThreadSidebar from "./ThreadSidebar";

export const AIAssistant = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const selectedThreadRef = useRef<Thread | null>(null);
  const messagesRef = useRef<Message[]>([]);

  // Keep refs in sync
  useEffect(() => {
    selectedThreadRef.current = selectedThread;
  }, [selectedThread]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Load threads on mount
  useEffect(() => {
    getThreads().then(setThreads).catch(console.error);
  }, []);

  // Load messages when thread changes
  useEffect(() => {
    if (!selectedThread) return;
    getMessages(selectedThread.id).then(setMessages).catch(console.error);
  }, [selectedThread]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  // Listen for streaming tokens — set up ONCE on mount
  useEffect(() => {
    let unlistenToken: (() => void) | null = null;
    let unlistenComplete: (() => void) | null = null;

    listen<string>("token", (e) => {
      setStreamingContent((prev) => prev + e.payload);
    }).then((fn) => (unlistenToken = fn));

    listen<string>("message_complete", (e) => {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        thread_id: selectedThreadRef.current?.id ?? "",
        role: "assistant",
        content: e.payload,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingContent("");
      setIsStreaming(false);
    }).then((fn) => (unlistenComplete = fn));

    return () => {
      unlistenToken?.();
      unlistenComplete?.();
    };
  }, []); // empty deps — only set up once

  const handleNewThread = async () => {
    try {
      const thread = await createThread("New Chat");
      setThreads((prev) => [thread, ...prev]);
      setSelectedThread(thread);
      setMessages([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteThread = async (id: string) => {
    try {
      await deleteThread(id);
      setThreads((prev) => prev.filter((t) => t.id !== id));
      if (selectedThreadRef.current?.id === id) {
        setSelectedThread(null);
        setMessages([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSend = async (content: string) => {
    if (!selectedThreadRef.current || isStreaming) return;
    const thread = selectedThreadRef.current;

    // Auto-title from first message
    if (messagesRef.current.length === 0) {
      const title = content.slice(0, 40);
      try {
        await renameThread(thread.id, title);
        setThreads((prev) =>
          prev.map((t) => (t.id === thread.id ? { ...t, title } : t)),
        );
        setSelectedThread((prev) => (prev ? { ...prev, title } : prev));
      } catch (err) {
        console.error(err);
      }
    }

    // Add user message to UI immediately
    const userMessage: Message = {
      id: crypto.randomUUID(),
      thread_id: thread.id,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);
    setStreamingContent("");

    try {
      await sendMessage(thread.id, content);
    } catch (err) {
      console.error(err);
      setIsStreaming(false);
    }
  };

  return (
    <div className="h-full flex overflow-hidden">
      <div className="w-[260px] shrink-0">
        <ThreadSidebar
          threads={threads}
          selectedThreadId={selectedThread?.id ?? null}
          onSelectThread={setSelectedThread}
          onNewThread={handleNewThread}
          onDeleteThread={handleDeleteThread}
        />
      </div>

      {selectedThread ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-border shrink-0">
            <p className="text-sm font-medium text-foreground">
              {selectedThread.title}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {isStreaming && (
              <div className="flex gap-3 px-4 py-3">
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-muted-foreground" />
                </div>
                <div className="max-w-[75%] rounded-xl px-3 py-2 bg-muted text-foreground text-sm">
                  {streamingContent ? (
                    <div
                      className="prose prose-sm prose-invert max-w-none
                      [&>p]:mb-2 [&>p]:leading-relaxed
                      [&>ul]:mb-2 [&>ul]:pl-4 [&>ul>li]:mb-1
                      [&>ol]:mb-2 [&>ol]:pl-4 [&>ol>li]:mb-1
                      [&>h1]:text-base [&>h1]:font-bold [&>h1]:mb-2
                      [&>h2]:text-sm [&>h2]:font-semibold [&>h2]:mb-2
                      [&>h3]:text-sm [&>h3]:font-medium [&>h3]:mb-1
                      [&>code]:bg-background/40 [&>code]:px-1 [&>code]:rounded [&>code]:text-xs [&>code]:font-mono
                      [&>pre]:bg-background/40 [&>pre]:p-2 [&>pre]:rounded-lg [&>pre]:mb-2 [&>pre]:overflow-x-auto
                      [&>pre>code]:bg-transparent [&>pre>code]:p-0
                      [&>strong]:font-semibold
                      [&>blockquote]:border-l-2 [&>blockquote]:border-muted-foreground [&>blockquote]:pl-3 [&>blockquote]:italic"
                    >
                      <ReactMarkdown>{streamingContent}</ReactMarkdown>
                    </div>
                  ) : (
                    <span className="text-muted-foreground animate-pulse">
                      Thinking...
                    </span>
                  )}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <ChatInput onSend={handleSend} disabled={isStreaming} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Bot size={32} className="text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Start a new chat or select an existing one
          </p>
          <button
            onClick={handleNewThread}
            className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:opacity-90 transition-opacity"
          >
            New Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
