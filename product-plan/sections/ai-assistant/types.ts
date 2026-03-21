// =============================================================================
// UI Data Shapes — AI Assistant
// =============================================================================

export type MessageRole = "user" | "assistant";
export type FeedbackType = "up" | "down" | null;

export interface Citation {
  id: string;
  documentId: string;
  documentTitle: string;
  excerpt: string;
  page?: number;
}

export interface Thread {
  id: string;
  title: string;
  topic: string;
  documentId: string | null;
  lastMessage: string;
  updatedAt: string;
  messageCount: number;
}

export interface Message {
  id: string;
  threadId: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  attachedDocument?: string | null;
  isStreaming?: boolean;
  confidence?: number;
  citations?: Citation[];
  followUps?: string[];
  feedback?: FeedbackType;
}

// =============================================================================
// Component Props
// =============================================================================

export interface AIAssistantProps {
  threads: Thread[];
  messages: Message[];
  selectedThread?: string | null;
  isStreaming?: boolean;

  /** Called when user selects a thread */
  onSelectThread?: (threadId: string) => void;

  /** Called when user creates a new thread */
  onNewThread?: () => void;

  /** Called when user sends a message */
  onSendMessage?: (content: string, attachedDocumentId?: string) => void;

  /** Called when user clicks a follow-up suggestion */
  onFollowUp?: (question: string) => void;

  /** Called when user clicks a quick action chip */
  onQuickAction?: (action: "summarize" | "explain" | "find-related") => void;

  /** Called when user copies a response */
  onCopyResponse?: (messageId: string) => void;

  /** Called when user inserts response into current note */
  onInsertIntoNote?: (messageId: string) => void;

  /** Called when user gives feedback on a response */
  onFeedback?: (messageId: string, feedback: "up" | "down") => void;

  /** Called when user clicks regenerate */
  onRegenerate?: (messageId: string) => void;

  /** Called when user clicks voice input */
  onVoiceInput?: () => void;

  /** Called when user attaches a document */
  onAttachDocument?: () => void;
}
