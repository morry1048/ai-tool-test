
import React, { useState, useCallback } from 'react';
import { QUIZ_QUESTIONS } from './constants';
import type { Answer, APIResponse } from './types';
import { getAIRecommendation } from './services/geminiService';
import { Quiz } from './components/Quiz';
import { Results } from './components/Results';
import { LoadingSpinner } from './components/LoadingSpinner';
import { BrainCircuitIcon } from './components/icons';

type AppState = 'welcome' | 'quiz' | 'loading' | 'results' | 'error';

export default function App(): React.ReactNode {
  const [appState, setAppState] = useState<AppState>('welcome');
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState<APIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartQuiz = () => {
    setAppState('quiz');
  };

  const handleAnswer = (questionId: number, answer: string) => {
    const newAnswers = [...answers.filter(a => a.questionId !== questionId), { questionId, answer }];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        fetchRecommendations(newAnswers);
      }
    }, 300);
  };

  const fetchRecommendations = useCallback(async (finalAnswers: Answer[]) => {
    setAppState('loading');
    setError(null);
    try {
      const recommendation = await getAIRecommendation(finalAnswers);
      setResults(recommendation);
      setAppState('results');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
      setAppState('error');
    }
  }, []);

  const handleReset = () => {
    setAnswers([]);
    setCurrentQuestionIndex(0);
    setResults(null);
    setError(null);
    setAppState('welcome');
  };

  const renderContent = () => {
    switch (appState) {
      case 'welcome':
        return (
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
              AIツール最適解診断
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              どのAIツールに課金するか迷っていますか？ <br />
              簡単な10の質問に答えるだけで、あなたにぴったりのAIツールとプランを見つけます。
            </p>
            <button
              onClick={handleStartQuiz}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg shadow-purple-500/30"
            >
              診断を始める
            </button>
          </div>
        );
      case 'quiz':
        return <Quiz
          question={QUIZ_QUESTIONS[currentQuestionIndex]}
          onAnswer={handleAnswer}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={QUIZ_QUESTIONS.length}
        />;
      case 'loading':
        return <LoadingSpinner />;
      case 'results':
        return results && <Results results={results} onReset={handleReset} />;
      case 'error':
        return (
          <div className="text-center bg-red-900/20 border border-red-500 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-red-400 mb-4">診断エラー</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            <button
              onClick={handleReset}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
            >
              もう一度試す
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-gray-700/[0.2] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <header className="absolute top-0 left-0 w-full p-4 flex items-center justify-center z-10">
          <div className="flex items-center space-x-3 text-gray-300">
              <BrainCircuitIcon className="w-8 h-8 text-cyan-400"/>
              <span className="text-xl font-semibold">AI Tool Recommender</span>
          </div>
      </header>
      <main className="w-full max-w-4xl mx-auto z-10 flex items-center justify-center" style={{ minHeight: 'calc(100vh - 100px)' }}>
        {renderContent()}
      </main>
    </div>
  );
}
