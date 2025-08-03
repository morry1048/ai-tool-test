
import React from 'react';
import type { APIResponse, Recommendation } from '../types';
import { StarRating } from './StarRating';
import { CheckCircleIcon, SparklesIcon } from './icons';

interface ResultsProps {
  results: APIResponse;
  onReset: () => void;
}

const getToolColor = (toolName: string): string => {
    if (toolName.toLowerCase().includes('chatgpt')) return 'bg-green-500/10 border-green-500';
    if (toolName.toLowerCase().includes('gemini')) return 'bg-blue-500/10 border-blue-500';
    if (toolName.toLowerCase().includes('claude')) return 'bg-yellow-500/10 border-yellow-500';
    return 'bg-gray-500/10 border-gray-500';
}

const ToolCard: React.FC<{ recommendation: Recommendation }> = ({ recommendation }) => {
    return (
        <div className={`flex flex-col p-6 rounded-2xl border ${getToolColor(recommendation.toolName)} backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-2xl font-bold text-white">{recommendation.toolName}</h3>
                    <p className="text-lg font-semibold text-purple-400">{recommendation.plan}</p>
                </div>
                <StarRating rating={recommendation.recommendationLevel} />
            </div>
            <p className="text-gray-300 mb-4 flex-grow">{recommendation.reason}</p>
            <div>
                <h4 className="font-semibold text-gray-200 mb-2">おすすめの機能:</h4>
                <ul className="space-y-2">
                    {recommendation.keyFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start">
                           <CheckCircleIcon className="w-5 h-5 text-cyan-400 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
};

export function Results({ results, onReset }: ResultsProps): React.ReactNode {
  const sortedRecommendations = [...results.recommendations].sort((a, b) => b.recommendationLevel - a.recommendationLevel);
    
  return (
    <div className="w-full max-w-5xl p-4 md:p-8">
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-3">
          診断結果
        </h2>
        <p className="text-lg text-gray-300">あなたに最適なAIツールはこちらです。</p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {sortedRecommendations.map((rec) => (
          <ToolCard key={rec.toolName} recommendation={rec} />
        ))}
      </div>

      {results.otherTools && results.otherTools.length > 0 && (
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-3">
            <SparklesIcon className="w-7 h-7 text-yellow-400"/>
            その他のおすすめツール
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {results.otherTools.map((tool, index) => (
              <div key={index} className="bg-gray-800/60 p-4 border border-gray-700 rounded-lg">
                <h4 className="font-bold text-purple-300">{tool.toolName}</h4>
                <p className="text-sm text-gray-400">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="text-center">
        <button
          onClick={onReset}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out"
        >
          もう一度診断する
        </button>
      </div>
    </div>
  );
}
