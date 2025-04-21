'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import logo from '../../assets/logo.png';
import Image from 'next/image';

interface Option {
  id?: number;
  answer: string;
  trueOrFalse?: number;
}

interface Question {
  id: number;
  questionIndex: number;
  question: string;
  type: 'multiple-choice' | 'true-false';
  options: Option[] | string[];
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
  const [userId, setUserId] = useState<number | null>(null);
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {

    const userData = localStorage.getItem('userId');
    setUserId(userData ? parseInt(userData, 10) || null : null);

    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${baseUrl}/modules/questions/${moduleId}`);
        const data = await response.json();
        // Normalize questions to ensure consistent structure
        const normalizedQuestions = data.questions.map((question: Question) => {
          if (question.type === 'true-false') {
            return {
              ...question,
              options: question.options.map((option, index) => ({
                answer: option,
                trueOrFalse: index === 0 ? 1 : 0 // First option is True (1), second is False (0)
              }))
            };
          }
          return question;
        });
        setQuestions(normalizedQuestions);
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
  
    const currentQuestion = questions[currentQuestionIndex];
    const selectedOption = currentQuestion.options[selectedAnswer] as Option;
  
    if (!selectedOption?.id) return;
  
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: selectedOption.id!
    }));
  
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      handleFinish();
    }
  };
  

  const handleFinish = async () => {
    try {
      const currentQuestion = questions[currentQuestionIndex];
  
      // Ensure the last selected answer is saved
      const finalAnswers = { ...answers };
      if (
        selectedAnswer !== null &&
        !Object.prototype.hasOwnProperty.call(finalAnswers, currentQuestion.id)
      ) {
        const selectedOption = currentQuestion.options[selectedAnswer] as Option;
        if (selectedOption?.id) {
          finalAnswers[currentQuestion.id] = selectedOption.id;
        }
      }
  
      // Submit all answers to the server
      const response = await fetch(`${baseUrl}/answers/submit-answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moduleId,
          answers: finalAnswers,
          userId
        }),
      });
  
      if (!response.ok) throw new Error('Failed to submit answers');
  
      // Show success message and then rating popup
      await Swal.fire({
        title: 'Quiz Completed!',
        text: 'Your answers have been submitted successfully.',
        icon: 'success'
      });
  
      // Show rating popup
      setShowRating(true);
      
    } catch (error) {
      console.error('Error submitting answers:', error);
      Swal.fire('Error', 'Failed to submit answers', 'error');
    }
  };

  const handleRatingSubmit = async () => {
    try {
      const response = await fetch(`${baseUrl}/modules/submit-rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moduleId,
          userId,
          numOfStars: rating
        }),
      });
  
      if (!response.ok) throw new Error('Failed to submit rating');
  
      Swal.fire('Thank You!', 'Your rating has been submitted.', 'success');
      setShowRating(false);
      onFinish();
    } catch (error) {
      console.error('Error submitting rating:', error);
      Swal.fire('Error', 'Failed to submit rating', 'error');
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

  // Get options in consistent format
  const options = currentQuestion.options.map((option, index) => {
    if (typeof option === 'string') {
      return {
        answer: option,
        trueOrFalse: index === 0 ? 1 : 0 // True is 1, False is 0
      };
    }
    return option;
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[url('/quizbg.png')] bg-cover bg-no-repeat bg-center">
      {/* Main Question Area */}
      <div className="w-full md:w-3/4 p-6 rounded-lg shadow-md">
        <div className="mb-6 flex items-center justify-center">
          <h2 className="text-xl font-semibold text-[#F7CA21]">Question {currentQuestionIndex + 1}</h2>
        </div>

        <div className="mb-6 flex items-center justify-center bg-[#292732E5]">
          <p className="mt-2 text-[#FFFFFF] p-4">{currentQuestion.question}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {options.map((option, index) => (
            <div
              key={option.id || index}
              className={`p-4 cursor-pointer transition-colors bg-[#292732E5] ${
                selectedAnswer === index
                  ? 'bg-[#FF5C93CC] border-blue-500'
                  : 'hover:bg-[#000000] border-gray-300'
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
              className="px-6 py-2 text-black transition-colors bg-gradient-to-r from-[#FE9247] to-[#FFDF36] hover:opacity-90"
            >
              {isLastQuestion ? 'Submit & Finish' : 'Submit & Go Next'}
            </button>
          </div>
        )}
      </div>

      {/* Side Panel */}
      <div className="w-full md:w-1/4 p-6 md:ml-4 mt-4 md:mt-0 bg-[#181820] shadow-md flex flex-col items-center justify-between text-center min-h-[90vh] relative">
        {/* Top Logo */}
        <div>
          <Image
            src={logo}
            alt="Logo" 
            className="hidden md:block top-5 right-5 max-w-[150px] h-auto"
          />
        </div>

        {/* Timer Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-2">Time Remaining</h3>
          <div className="relative w-24 h-24 flex items-center justify-center mx-auto">
            <svg className="absolute w-full h-full" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#374151"
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
            <span className="text-2xl font-bold text-yellow-400 relative z-10">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white">Progress</h3>
          <p className="text-gray-300">
            {currentQuestionIndex} of {questions.length} questions completed
          </p>
        </div>

        {/* Finish Button */}
        <button
          onClick={handleFinish}
          className="w-full px-6 py-2 bg-gradient-to-r from-[#FE9247] to-[#FFDF36] text-black rounded-lg hover:opacity-90 transition"
        >
          Finish
        </button>
      </div>

      {showRating && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-[#292732E5] p-8 rounded-lg max-w-md w-full">
      <h2 className="text-xl font-semibold text-[#F7CA21] mb-4 text-center">How was it?</h2>
      <p className="text-white mb-6 text-center">Please Rate the Quiz</p>
      
      <div className="flex justify-center mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className="text-3xl mx-1 focus:outline-none"
          >
            {star <= rating ? '★' : '☆'}
          </button>
        ))}
      </div>
      
      <button
        onClick={handleRatingSubmit}
        disabled={rating === 0}
        className={`w-full px-6 py-2 bg-gradient-to-r from-[#FE9247] to-[#FFDF36] text-black rounded-lg hover:opacity-90 transition ${
          rating === 0 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Submit
      </button>
    </div>
  </div>
)}
    </div>

    
  );
}