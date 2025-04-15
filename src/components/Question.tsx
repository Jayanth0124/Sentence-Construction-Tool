import React, { useState, useEffect, useRef } from 'react';

interface QuestionProps {
  questionText: string;
  options: string[];
  onAnswerUpdate: (answers: string[]) => void;
  initialAnswers?: string[];
  timerDuration: number;
  onTimeUp: () => void;
}

const Question: React.FC<QuestionProps> = ({
  questionText,
  options,
  onAnswerUpdate,
  initialAnswers = [],
  timerDuration,
  onTimeUp,
}) => {
  const blankPattern = /___________ /g;
  const blanksCount = (questionText.match(blankPattern) || []).length;

  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(initialAnswers);
  const [availableOptions, setAvailableOptions] = useState<string[]>(options);
  const [timeLeft, setTimeLeft] = useState(timerDuration);

  const onAnswerUpdateRef = useRef(onAnswerUpdate);

  useEffect(() => {
    onAnswerUpdateRef.current = onAnswerUpdate;
  }, [onAnswerUpdate]);

  useEffect(() => {
    const usedOptions = new Set(selectedAnswers);
    setAvailableOptions(options.filter((opt) => !usedOptions.has(opt)));
  }, [options, selectedAnswers]);

  useEffect(() => {
    setTimeLeft(timerDuration);
  }, [timerDuration]);

  useEffect(() => {
    onAnswerUpdateRef.current(selectedAnswers);
  }, [selectedAnswers]);

  useEffect(() => {
    if (timeLeft === 0) {
      onTimeUp();
      return;
    }

    const timerId = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [timeLeft, onTimeUp]);

  useEffect(() => {
    if (timeLeft === 10) {
      const audio = new Audio('/src/components/timer.mp3'); // Adjust the path if necessary
      audio.play().catch((error) => {
        console.error('Audio playback failed:', error);
      });
    }
  }, [timeLeft]);

  const handleOptionClick = (option: string) => {
    if (selectedAnswers.length >= blanksCount) return;
    const newAnswers = [...selectedAnswers, option];
    setSelectedAnswers(newAnswers);
  };

  const handleBlankClick = (index: number) => {
    const newAnswers = selectedAnswers.filter((_, i) => i !== index);
    setSelectedAnswers(newAnswers);
  };

  const handleUndo = () => {
    if (selectedAnswers.length === 0) return;
    const newAnswers = selectedAnswers.slice(0, -1);
    setSelectedAnswers(newAnswers);
  };

  const handleReset = () => {
    setSelectedAnswers([]);
  };

  const partsRaw = questionText.split(blankPattern);
  const parts = partsRaw.map((part) => part.replace(/_+$/, ''));

  return (
    <div className="w-full">
      {/* Sentence */}
      <div className="mb-6 text-lg font-medium text-slate-700 leading-8 flex flex-wrap gap-3 items-center justify-center break-words">
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            <span>{part}</span>
            {index < blanksCount && (
              <button
                type="button"
                onClick={() => handleBlankClick(index)}
                className={`inline-flex items-center justify-center min-w-[6rem] px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                  ${selectedAnswers[index]
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                title={selectedAnswers[index] || 'Click to remove'}
              >
                {selectedAnswers[index] || 'Blank'}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center mb-6">
        {availableOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleOptionClick(option)}
            disabled={selectedAnswers.length >= blanksCount}
            className="flex items-center justify-center outline-none cursor-pointer w-36 h-12 bg-gradient-to-t from-gray-300 to-white rounded-full border border-gray-400 transition-all duration-200 font-sourceSansPro text-sm font-semibold text-gray-600 shadow-lg hover:shadow-2xl hover:shadow-gray-500/50 active:translate-y-1 active:shadow-md active:shadow-gray-600/50 focus:shadow-xl focus:shadow-gray-400/50"
            title={option}
          >
            <span className="z-10 flex items-center gap-2">
              <span>{option}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Controls: Undo / Reset */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={handleUndo}
          disabled={selectedAnswers.length === 0}
          className="px-6 py-2 text-sm font-bold rounded-lg bg-blue-600 text-white transition-all duration-300 ease-in-out transform hover:bg-blue-700 hover:shadow-lg hover:scale-105 disabled:bg-blue-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7" />
            </svg>
            Undo
          </span>
        </button>

        <button
          onClick={handleReset}
          disabled={selectedAnswers.length === 0}
          className="px-6 py-2 text-sm font-bold rounded-lg bg-red-600 text-white transition-all duration-300 ease-in-out transform hover:bg-red-700 hover:shadow-lg hover:scale-105 disabled:bg-red-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-300"
        >
          <span className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m6-6H6" />
            </svg>
            Reset
          </span>
        </button>
      </div>

      {/* Timer */}
      <div className="flex justify-center mt-4 text-sm font-mono text-gray-600">
        <span
          className={`inline-block px-4 py-1 rounded-md 
      ${timeLeft <= 10
            ? 'bg-red-100 text-red-600 font-bold'
            : 'bg-green-100 text-green-700 font-medium'}`}
        >
          ⏱ {timeLeft}s
        </span>
      </div>
    </div>
  );
};

export default Question;
