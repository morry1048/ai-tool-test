
export interface Question {
  id: number;
  text: string;
  options: string[];
}

export interface Answer {
  questionId: number;
  answer: string;
}

export interface Recommendation {
  toolName: string;
  plan: string;
  recommendationLevel: number;
  reason: string;
  keyFeatures: string[];
}

export interface OtherTool {
  toolName: string;
  description: string;
}

export interface APIResponse {
  recommendations: Recommendation[];
  otherTools: OtherTool[];
}
