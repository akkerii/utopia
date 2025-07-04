import { ModuleType, DashboardModule } from "@/types";

export const moduleConfig: Record<
  ModuleType,
  Omit<DashboardModule, "status" | "summary" | "data">
> = {
  [ModuleType.IDEA_CONCEPT]: {
    type: ModuleType.IDEA_CONCEPT,
    title: "Your Idea",
    description: "Define and refine your business concept",
    icon: "lightbulb",
  },
  [ModuleType.TARGET_MARKET]: {
    type: ModuleType.TARGET_MARKET,
    title: "Target Market",
    description: "Identify your ideal customers",
    icon: "users",
  },
  [ModuleType.VALUE_PROPOSITION]: {
    type: ModuleType.VALUE_PROPOSITION,
    title: "Value Proposition",
    description: "What unique value do you offer?",
    icon: "diamond",
  },
  [ModuleType.BUSINESS_MODEL]: {
    type: ModuleType.BUSINESS_MODEL,
    title: "Business Model",
    description: "How will you make money?",
    icon: "building",
  },
  [ModuleType.MARKETING_STRATEGY]: {
    type: ModuleType.MARKETING_STRATEGY,
    title: "Marketing Strategy",
    description: "How will you reach customers?",
    icon: "megaphone",
  },
  [ModuleType.OPERATIONS_PLAN]: {
    type: ModuleType.OPERATIONS_PLAN,
    title: "Operations Plan",
    description: "How will you deliver your product/service?",
    icon: "cog",
  },
  [ModuleType.FINANCIAL_PLAN]: {
    type: ModuleType.FINANCIAL_PLAN,
    title: "Financial Plan",
    description: "Numbers and projections",
    icon: "dollar-sign",
  },
};

// Define the logical progression order
export const MODULE_PROGRESSION: ModuleType[] = [
  ModuleType.IDEA_CONCEPT,
  ModuleType.TARGET_MARKET,
  ModuleType.VALUE_PROPOSITION,
  ModuleType.BUSINESS_MODEL,
  ModuleType.MARKETING_STRATEGY,
  ModuleType.OPERATIONS_PLAN,
  ModuleType.FINANCIAL_PLAN,
];

export const getModuleTitle = (moduleType: ModuleType): string => {
  return moduleConfig[moduleType]?.title || moduleType;
};

export const getModuleDescription = (moduleType: ModuleType): string => {
  return moduleConfig[moduleType]?.description || "";
};

export const getModuleIcon = (moduleType: ModuleType): string => {
  return moduleConfig[moduleType]?.icon || "circle";
};

export const getModulesByOrder = (): ModuleType[] => {
  return MODULE_PROGRESSION;
};

export const getAgentColor = (agent: string): string => {
  const colors: Record<string, string> = {
    idea: "bg-yellow-500",
    strategy: "bg-blue-500",
    finance: "bg-green-500",
    operations: "bg-purple-500",
  };
  return colors[agent] || "bg-gray-500";
};

// Module progression utilities
export const getModuleIndex = (moduleType: ModuleType): number => {
  return MODULE_PROGRESSION.indexOf(moduleType);
};

export const getNextModule = (currentModule: ModuleType): ModuleType | null => {
  const currentIndex = getModuleIndex(currentModule);
  if (currentIndex === -1 || currentIndex === MODULE_PROGRESSION.length - 1) {
    return null;
  }
  return MODULE_PROGRESSION[currentIndex + 1];
};

export const getPreviousModule = (
  currentModule: ModuleType
): ModuleType | null => {
  const currentIndex = getModuleIndex(currentModule);
  if (currentIndex <= 0) {
    return null;
  }
  return MODULE_PROGRESSION[currentIndex - 1];
};

export const isModuleAccessible = (
  moduleType: ModuleType,
  completedModules: ModuleType[]
): boolean => {
  const moduleIndex = getModuleIndex(moduleType);

  // First module is always accessible
  if (moduleIndex === 0) return true;

  // Check if all previous modules are completed
  for (let i = 0; i < moduleIndex; i++) {
    if (!completedModules.includes(MODULE_PROGRESSION[i])) {
      return false;
    }
  }

  return true;
};

export const getProgressPercentage = (
  completedModules: ModuleType[]
): number => {
  return (completedModules.length / MODULE_PROGRESSION.length) * 100;
};

export const getModuleTransitionMessage = (
  fromModule: ModuleType,
  toModule: ModuleType
): string => {
  const transitionMessages: Record<string, string> = {
    [`${ModuleType.IDEA_CONCEPT}-${ModuleType.TARGET_MARKET}`]:
      "Great! Now that we have your business idea clear, let's identify who your customers will be.",
    [`${ModuleType.TARGET_MARKET}-${ModuleType.VALUE_PROPOSITION}`]:
      "Perfect! Now that we know your target market, let's define what unique value you'll offer them.",
    [`${ModuleType.VALUE_PROPOSITION}-${ModuleType.BUSINESS_MODEL}`]:
      "Excellent! With your value proposition defined, let's figure out how you'll make money.",
    [`${ModuleType.BUSINESS_MODEL}-${ModuleType.MARKETING_STRATEGY}`]:
      "Great! Now that we understand your business model, let's plan how to reach your customers.",
    [`${ModuleType.MARKETING_STRATEGY}-${ModuleType.OPERATIONS_PLAN}`]:
      "Wonderful! With your marketing strategy in place, let's work on how you'll deliver your product/service.",
    [`${ModuleType.OPERATIONS_PLAN}-${ModuleType.FINANCIAL_PLAN}`]:
      "Perfect! Now let's put together the financial projections for your business.",
  };

  const key = `${fromModule}-${toModule}`;
  const moduleTitle =
    moduleConfig[toModule]?.title || toModule.replace(/_/g, " ");
  return (
    transitionMessages[key] ||
    `Let's move on to working on your ${moduleTitle.toLowerCase()}.`
  );
};
