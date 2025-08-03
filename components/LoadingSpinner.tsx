
import React from 'react';
import { BrainCircuitIcon } from './icons';

export function LoadingSpinner(): React.ReactNode {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <BrainCircuitIcon className="w-20 h-20 text-cyan-400 animate-pulse mb-6" />
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-2">
        AIが診断中...
      </h2>
      <p className="text-lg text-gray-300">あなたに最適なプランを分析しています。少々お待ちください。</p>
    </div>
  );
}
