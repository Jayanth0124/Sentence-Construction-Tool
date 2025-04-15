import React from 'react';
import { Question } from '../types';

interface FeedbackProps {
  questions: Question[];
  userAnswers: Record<string, string[]>;
  onRestart: () => void;
}

const Feedback: React.FC<FeedbackProps> = ({ questions, userAnswers, onRestart }) => {
  const totalQuestions = questions.length;
  let score = 0;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Feedback Summary</h2>
      <div className="mb-8 space-y-6 max-h-[60vh] overflow-y-auto px-4">
        {questions.map((q, idx) => {
          const userAns = userAnswers[q.questionId] || [];
          const isCorrect =
            userAns.length === q.correctAnswer.length &&
            userAns.every((ans, i) => ans === q.correctAnswer[i]);
          if (isCorrect) score++;
          return (
            <div
              key={q.questionId}
              className={`p-5 rounded-lg border ${isCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'
                } shadow-sm`}
            >
              <h3 className="font-semibold mb-3 text-lg text-gray-900">Question {idx + 1}</h3>
              <p className="mb-3 text-gray-700">{q.question}</p>
              <p className="mb-1">
                Your answer:{' '}
                <span className={isCorrect ? 'text-green-700 font-semibold' : 'text-red-700 font-semibold'}>
                  {userAns.length > 0 ? userAns.join(', ') : 'No answer'}
                </span>
              </p>
              {!isCorrect && (
                <p>
                  Correct answer:{' '}
                  <span className="text-green-700 font-semibold">{q.correctAnswer.join(', ')}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="text-2xl font-bold mb-6 text-center text-gray-800">
        Score: {score} / {totalQuestions}
      </div>
      <div className="flex justify-center">
        <button
          onClick={onRestart}
          className="custom-btn btn-1"
        >
          Restart
        </button>

      </div>
    </div>
  );
};

export default Feedback;
