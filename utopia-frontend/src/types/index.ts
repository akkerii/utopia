// Modes of operation
export enum Mode {
  ENTREPRENEUR = "entrepreneur",
  CONSULTANT = "consultant",
}

// AI Agent types
export enum AgentType {
  IDEA = "idea",
  STRATEGY = "strategy",
  FINANCE = "finance",
  OPERATIONS = "operations",
}

// Business modules
export enum ModuleType {
  IDEA_CONCEPT = "idea_concept",
  TARGET_MARKET = "target_market",
  VALUE_PROPOSITION = "value_proposition",
  BUSINESS_MODEL = "business_model",
  MARKETING_STRATEGY = "marketing_strategy",
  OPERATIONS_PLAN = "operations_plan",
  FINANCIAL_PLAN = "financial_plan",
}

// Context bucket for module data
export interface ContextBucket {
  id: string;
  moduleType: ModuleType;
  data: any;
  summary?: string;
  lastUpdated: Date;
  completionStatus: "empty" | "in_progress" | "completed";
}

// Conversation message
export interface ConversationMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  agent?: AgentType;
  module?: ModuleType;
  timestamp: Date;
}

// Module update info
export interface ModuleUpdate {
  moduleType: ModuleType;
  data: any;
  summary: string;
  completionStatus: "empty" | "in_progress" | "completed";
}

// Chat request interface
export interface ChatRequest {
  message: string;
  sessionId?: string;
  mode?: Mode;
}

// Chat response interface
export interface ChatResponse {
  sessionId: string;
  message: string;
  agent: AgentType;
  currentModule?: ModuleType;
  updatedModules?: ModuleUpdate[];
  suggestedNextModule?: ModuleType;
  isModuleTransition?: boolean;
}

// Session data interface
export interface SessionData {
  sessionId: string;
  mode: Mode;
  currentAgent: AgentType;
  currentModule?: ModuleType;
  modules: {
    moduleType: ModuleType;
    data: any;
    summary?: string;
    completionStatus: "empty" | "in_progress" | "completed";
    lastUpdated: Date;
  }[];
  conversationHistory: ConversationMessage[];
}

// UI State interfaces
export interface ChatState {
  messages: ConversationMessage[];
  isLoading: boolean;
  sessionId?: string;
  mode?: Mode;
  currentAgent?: AgentType;
  currentModule?: ModuleType;
}

export interface DashboardModule {
  type: ModuleType;
  title: string;
  description: string;
  icon: string;
  status: "empty" | "in_progress" | "completed";
  summary?: string;
  data?: any;
}
