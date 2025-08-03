
import { GoogleGenAI, Type } from "@google/genai";
import type { Answer, APIResponse } from "../types";
import { QUIZ_QUESTIONS } from "../constants";

const getApiKey = (): string => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable not set.");
  }
  return apiKey;
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    recommendations: {
      type: Type.ARRAY,
      description: "ChatGPT, Gemini, Claudeの3つのツールに対する推奨事項。",
      items: {
        type: Type.OBJECT,
        properties: {
          toolName: { type: Type.STRING, description: "ツールの名称 (例: ChatGPT)" },
          plan: { type: Type.STRING, description: "推奨するプラン (例: Plus, Pro, 無料など)" },
          recommendationLevel: { type: Type.INTEGER, description: "1から5までの推奨度レベル。" },
          reason: { type: Type.STRING, description: "なぜこのツールとプランを推奨するのかの具体的な理由。" },
          keyFeatures: { type: Type.ARRAY, items: { type: Type.STRING }, description: "ユーザーの回答にマッチする主要な機能のリスト。" }
        },
        required: ["toolName", "plan", "recommendationLevel", "reason", "keyFeatures"]
      }
    },
    otherTools: {
      type: Type.ARRAY,
      description: "その他にユーザーに役立ちそうなツールの提案。",
      items: {
        type: Type.OBJECT,
        properties: {
          toolName: { type: Type.STRING, description: "ツールの名称" },
          description: { type: Type.STRING, description: "そのツールがどのようなものかの簡単な説明。" }
        },
        required: ["toolName", "description"]
      }
    }
  },
  required: ["recommendations", "otherTools"]
};

export async function getAIRecommendation(answers: Answer[]): Promise<APIResponse> {
  const formattedAnswers = answers
    .map(answer => {
      const question = QUIZ_QUESTIONS.find(q => q.id === answer.questionId);
      return question ? `${question.id}. ${question.text}: ${answer.answer}` : '';
    })
    .filter(Boolean)
    .join('\n');

  const prompt = `
あなたはAIツールの専門家です。以下のユーザーの回答に基づいて、ChatGPT, Gemini, Claudeの中から最適なツールとプランを診断してください。また、その他のおすすめツールも提案してください。
回答は必ず指定されたJSON形式で、日本語で出力してください。recommendationLevelはユーザーへの推奨度を1(非推奨)から5(強く推奨)の5段階で評価してください。

ユーザーの回答:
${formattedAnswers}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as APIResponse;
  } catch (error) {
    console.error("Error fetching AI recommendation:", error);
    throw new Error("AIからの診断結果の取得に失敗しました。AIの応答が正しくないか、サーバーが混み合っている可能性があります。");
  }
}
