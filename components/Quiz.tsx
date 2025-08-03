
import React from 'react';
import type { Question } from '../types';

interface QuizProps {
  question: Question;
  onAnswer: (questionId: number, answer: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

export function Quiz({ question, onAnswer, questionNumber, totalQuestions }: QuizProps): React.ReactNode {
  return (
    <div className="w-full max-w-3xl p-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl shadow-black/30">
      <div className="mb-6">
        <p className="text-lg font-semibold text-cyan-400 mb-2">
          Question {questionNumber} / {totalQuestions}
        </p>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-cyan-400 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          ></div>
        </div>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-100">{question.text}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onAnswer(question.id, option)}
            className="text-left p-4 bg-gray-700/80 border border-gray-600 rounded-lg hover:bg-purple-600 hover:border-purple-500 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 group"
          >
            <span className="text-gray-200 group-hover:text-white font-medium">{option}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
