import React, { useEffect, useState } from 'react';
import Question from './components/Question';
import Feedback from './components/Feedback';
import Footer from './components/Footer';
import { Question as QuestionType } from './types';
import { mockQuestions } from './api/mockData';

const TIMER_DURATION = 30; // seconds

const App: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({});
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    setQuestions(mockQuestions);
  }, []);

  const handleAnswerUpdate = (answers: string[]) => {
    const questionId = questions[currentIndex].questionId;
    setUserAnswers((prev) => ({ ...prev, [questionId]: answers }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowFeedback(true);
    }
  };

  const handleTimeUp = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowFeedback(true);
    }
  };

  const handleRestart = () => {
    setUserAnswers({});
    setCurrentIndex(0);
    setShowFeedback(false);
  };

  if (questions.length === 0) {
    return <div className="p-4 text-center text-gray-500">Loading questions...</div>;
  }

  if (showFeedback) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <Feedback questions={questions} userAnswers={userAnswers} onRestart={handleRestart} />
          <Footer />
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentUserAnswer = userAnswers[currentQuestion.questionId] || [];
  const blanksCount = (currentQuestion.question.match(/___________/g) || []).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Header */}
      <header className="relative w-full max-w-4xl py-6 px-6 text-center bg-white/20 backdrop-blur-md border-b border-white/10 shadow-md overflow-hidden">
  {/* Background Aura Strip */}
  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -z-10 w-[120%] h-32 bg-gradient-to-r from-blue-400 via-fuchsia-500 to-yellow-300 blur-3xl opacity-30 rotate-2 rounded-full" />

  {/* Logo + Heading Flex Container */}
  <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
    {/* Logo */}
    <img src="src/components/header.svg" alt="Logo" className="w-8 h-8 sm:w-10 sm:h-10" />

    {/* Main Heading */}
    <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-blue-600 via-purple-600 to-yellow-400 drop-shadow-md">
      Sentence Construction Tool
    </h1>
  </div>

  {/* Subheading */}
  <p className="mt-2 text-sm sm:text-base text-slate-700 font-medium tracking-wide">
    Build sentences with logic, speed, and intuition
  </p>
</header>


      {/* Main Question Area */}
      <main className="flex-grow px-4 py-8 flex flex-col items-center max-w-4xl w-full">
        <Question
          key={currentQuestion.questionId}
          questionText={currentQuestion.question}
          options={currentQuestion.options}
          onAnswerUpdate={handleAnswerUpdate}
          initialAnswers={currentUserAnswer}
          timerDuration={TIMER_DURATION}
          onTimeUp={handleTimeUp}
        />
        <div className="text-center mt-4">
          <button
            onClick={handleNext}
            disabled={currentUserAnswer.length !== blanksCount}
            className={`custom-btn btn-1 ${currentUserAnswer.length !== blanksCount ? 'disabled-btn' : ''
              }`}
          >
            Next
          </button>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;
