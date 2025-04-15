'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

interface Question {
  id: number;
  questionIndex: number;
  question: string;
  type: 'multiple-choice' | 'true-false';
  options: {
    id?: number;
    answer: string;
    trueOrFalse?: number;
  }[];
  correctAnswer?: number;
}

interface QuizProps {
  moduleId: string;
  onFinish: () => void;
}

export default function QuizComponent({ moduleId, onFinish }: QuizProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(11 * 60 + 2); // 11:02 in seconds
  const [isLoading, setIsLoading] = useState(true);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const router = useRouter();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${baseUrl}/modules/questions/${moduleId}`);
        const data = await response.json();
        setQuestions(data.questions);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
        Swal.fire('Error', 'Failed to load questions', 'error');
        onFinish();
      }
    };

    fetchQuestions();
  }, [moduleId, baseUrl, onFinish]);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
  };

  const handleSubmitAndNext = () => {
    if (selectedAnswer === null) return;

    // Save the answer
    const currentQuestion = questions[currentQuestionIndex];
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: selectedAnswer
    }));

    // Move to next question or finish if last question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    try {
      // Submit all answers to the server
      const response = await fetch(`${baseUrl}/api/modules/submit-answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moduleId,
          answers
        }),
      });

      if (!response.ok) throw new Error('Failed to submit answers');

      Swal.fire({
        title: 'Quiz Completed!',
        text: 'Your answers have been submitted successfully.',
        icon: 'success'
      });

      onFinish();
    } catch (error) {
      console.error('Error submitting answers:', error);
      Swal.fire('Error', 'Failed to submit answers', 'error');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">No questions available for this module.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-4 bg-gray-50">
      {/* Main Question Area */}
      <div className="w-full md:w-2/3 p-6 bg-white rounded-lg shadow-md">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Question {currentQuestionIndex + 1}</h2>
          <p className="mt-2 text-gray-600">{currentQuestion.question}</p>
        </div>

        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => (
            <div
              key={option.id || index}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedAnswer === index
                  ? 'bg-blue-100 border-blue-500'
                  : 'hover:bg-gray-100 border-gray-300'
              }`}
              onClick={() => handleAnswerSelect(index)}
            >
              {option.answer}
            </div>
          ))}
        </div>

        {selectedAnswer !== null && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSubmitAndNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isLastQuestion ? 'Submit & Finish' : 'Submit & Go Next'}
            </button>
          </div>
        )}
      </div>

      {/* Side Panel */}
      <div className="w-full md:w-1/3 p-6 md:ml-4 mt-4 md:mt-0 bg-white rounded-lg shadow-md">
        {/* Circular Timer */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Time Remaining</h3>
          <div className="relative w-24 h-24 flex items-center justify-center mx-auto">
            <svg className="absolute w-full h-full" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              {/* Animated progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset={283 * (1 - timeLeft / (11 * 60 + 2))}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <span className="text-2xl font-bold text-blue-600 relative z-10">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Progress</h3>
          <p className="text-gray-600">
            {currentQuestionIndex} of {questions.length} questions completed
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <button
          onClick={handleFinish}
          className="w-full px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Finish
        </button>
      </div>
    </div>
  );
}