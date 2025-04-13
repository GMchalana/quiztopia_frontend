'use client';

import { useState } from 'react';
import { FiPlus, FiX, FiCheck } from 'react-icons/fi';

type Question = {
  id: string;
  type: 'multiple-choice' | 'true-false';
  question: string;
  options?: string[];
  correctAnswer?: any;
  timeEstimate?: string;
};

export default function AutoGradedQuiz() {
  const [quizName, setQuizName] = useState('');
  const [timeEstimate, setTimeEstimate] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [showQuestionTypeSelector, setShowQuestionTypeSelector] = useState(false);

  const addQuestion = (type: 'multiple-choice' | 'true-false') => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      question: '',
      options: type === 'multiple-choice' ? ['', ''] : ['True', 'False'],
      correctAnswer: undefined,
    };
    setCurrentQuestion(newQuestion);
    setShowQuestionTypeSelector(false);
  };

  const cancelCurrentQuestion = () => {
    setCurrentQuestion(null);
  };

  const saveCurrentQuestion = () => {
    if (
      currentQuestion && 
      currentQuestion.question.trim() && 
      (currentQuestion.type !== 'multiple-choice' || 
        (currentQuestion.options && 
         currentQuestion.options.every(opt => opt.trim()) && 
         currentQuestion.correctAnswer !== undefined)
    )) {
      setQuestions([...questions, currentQuestion]);
      setCurrentQuestion(null);
    }
  };

  const addOption = () => {
    if (currentQuestion) {
      setCurrentQuestion({
        ...currentQuestion,
        options: [...(currentQuestion.options || []), ''],
      });
    }
  };

  const updateOption = (index: number, value: string) => {
    if (currentQuestion) {
      const newOptions = [...(currentQuestion.options || [])];
      newOptions[index] = value;
      setCurrentQuestion({
        ...currentQuestion,
        options: newOptions,
      });
    }
  };

  const saveQuiz = () => {
    if (quizName.trim() && questions.length > 0) {
      console.log({
        quizName,
        timeEstimate,
        questions,
      });
      alert('Quiz saved and published successfully!');
    } else {
      alert('Please add at least one question and provide a quiz name');
    }
  };

  const renderSavedQuestion = (question: Question, index: number) => {
    return (
      <div key={question.id} className="rounded-lg p-4 mb-4 border border-[#A4A4A4] bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium text-[#000000]">
            {question.type === 'multiple-choice' ? 'Multiple Choice' : 'True/False'}
          </h3>
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-[#000000]">Question {index + 1} *</label>
          <div className="w-full p-3 bg-[#f5f5f5] rounded text-[#000000]">
            {question.question}
          </div>
        </div>

        {question.type === 'multiple-choice' && question.options && (
          <div>
            <label className="block mb-2 text-[#000000]">Choices *</label>
            {question.options.map((option, i) => (
              <div key={i} className="flex items-center mb-2">
                <input
                  type="radio"
                  name={`correctAnswer-${question.id}`}
                  checked={question.correctAnswer === i}
                  readOnly
                  className="mr-3"
                />
                <div className="flex-1 p-2 bg-[#f5f5f5] rounded text-[#000000]">
                  {option}
                </div>
                {question.correctAnswer === i && (
                  <span className="ml-2 text-green-500">✓ Correct</span>
                )}
              </div>
            ))}
          </div>
        )}

        {question.type === 'true-false' && (
          <div>
            <label className="block mb-2 text-[#000000]">Answer *</label>
            {question.options?.map((option, i) => (
              <div key={i} className="flex items-center mb-2">
                <input
                  type="radio"
                  name={`correctAnswer-${question.id}`}
                  checked={question.correctAnswer === i}
                  readOnly
                  className="mr-3"
                />
                <div className="flex-1 p-2 bg-[#f5f5f5] rounded text-[#000000]">
                  {option}
                </div>
                {question.correctAnswer === i && (
                  <span className="ml-2 text-green-500">✓ Correct</span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              setQuestions(questions.filter(q => q.id !== question.id));
            }}
            className="flex items-center text-red-500 hover:text-red-700"
          >
            <FiX className="mr-1" />
            Remove Question
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-full mx-auto">
        {/* Basic Information Section */}
        <div className="rounded-lg p-6 mb-6 bg-white shadow">
          <h2 className="text-xl font-semibold mb-4 text-[#000000]">Basic Information</h2>
          
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="w-full">
              <label className="block mb-2 font-medium text-[#000000]">Quiz Name *</label>
              <input
                type="text"
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
                placeholder="Type Quiz Name here"
                className="w-full p-3 bg-[#f5f5f5] rounded focus:outline-none focus:ring-2 focus:ring-[#F7CA21] placeholder-[#969696] text-[#000000]"
                required
              />
            </div>
            
            <div className="w-full">
              <label className="block mb-2 font-medium text-[#000000]">Estimation Time *</label>
              <div className="flex">
                <input
                  type="text"
                  value={timeEstimate}
                  onChange={(e) => setTimeEstimate(e.target.value)}
                  placeholder="e.g. 40"
                  className="w-full p-3 bg-[#f5f5f5] rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#F7CA21] placeholder-[#969696] text-[#000000]"
                />
                <div className="p-3 bg-[#f5f5f5] rounded-r-lg text-[#000000] border-l border-gray-300">
                  Minutes
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="rounded-lg p-6 mb-6 bg-white shadow">
          <div className="mb-6">
            <div className="p-2 border-b border-[#A4A4A4] mb-4">
              <h3 className="font-medium mb-2 text-[#525554] text-center">Select Question Type</h3>
            </div>
            
            <div className='flex flex-col md:flex-row justify-center gap-4'>
              <button
                onClick={() => addQuestion('multiple-choice')}
                className="flex items-center justify-center p-3 text-[#1E3050] bg-[#F7CA21] hover:bg-[#f8d34d] rounded transition"
              >
                <FiPlus className="mr-2" />
                Multiple Choice Question
              </button>
              <button
                onClick={() => addQuestion('true-false')}
                className="flex items-center justify-center p-3 text-[#1E3050] bg-[#F7CA21] hover:bg-[#f8d34d] rounded transition"
              >
                <FiPlus className="mr-2" />
                True / False Question
              </button>
            </div>
          </div>

          {/* Current Question Editor */}
          {currentQuestion && (
            <div className="rounded-lg p-4 mb-4 border border-[#A4A4A4] bg-[#f9f9f9]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-[#000000]">
                  {currentQuestion.type === 'multiple-choice' ? 'Multiple Choice' : 'True/False'}
                </h3>
                <div className='flex items-center space-x-2'>
                  <button
                    onClick={saveCurrentQuestion}
                    className="flex items-center bg-[#F7CA21] text-black py-1 px-3 rounded text-sm hover:bg-[#f8d34d] transition"
                  >
                    <FiCheck className="mr-1" />
                    Done
                  </button>
                  <button
                    onClick={cancelCurrentQuestion}
                    className="flex items-center bg-[#FFDFDF66] text-black py-1 px-3 rounded text-sm hover:bg-[#FFDFDF99] transition"
                  >
                    <i className="fa-solid fa-trash text-[#FF0000] text-lg hover:text-[#CC0000] transition-colors"></i>
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-[#000000]">Question *</label>
                <input
                  type="text"
                  value={currentQuestion.question}
                  onChange={(e) => setCurrentQuestion({
                    ...currentQuestion,
                    question: e.target.value,
                  })}
                  placeholder="Type Question here"
                  className="w-full p-3 bg-white rounded focus:outline-none focus:ring-2 focus:ring-[#F7CA21] placeholder-[#969696] text-[#000000]"
                  required
                />
              </div>

              {currentQuestion.type === 'multiple-choice' && (
                <div>
                  <label className="block mb-2 text-[#000000]">Choices * (Please select the correct answer)</label>
                  {currentQuestion.options?.map((option, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={currentQuestion.correctAnswer === index}
                        onChange={() => setCurrentQuestion({
                          ...currentQuestion,
                          correctAnswer: index,
                        })}
                        className="mr-3"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Choice ${index + 1}`}
                        className="flex-1 p-2 bg-white rounded focus:outline-none focus:ring-2 focus:ring-[#F7CA21] placeholder-[#969696] text-[#000000]"
                        required
                      />
                      {currentQuestion.options && currentQuestion.options.length > 2 && (
                        <button
                          onClick={() => {
                            const newOptions = [...currentQuestion.options || []];
                            newOptions.splice(index, 1);
                            setCurrentQuestion({
                              ...currentQuestion,
                              options: newOptions,
                              correctAnswer: currentQuestion.correctAnswer === index ? undefined : 
                                           currentQuestion.correctAnswer > index ? currentQuestion.correctAnswer - 1 : 
                                           currentQuestion.correctAnswer,
                            });
                          }}
                          className="ml-2 text-red-400 hover:text-red-300"
                        >
                          <i className="fa-solid fa-trash text-[#FF0000] text-lg hover:text-[#CC0000] transition-colors"></i>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={addOption}
                    className="flex items-center text-sm text-[#1E3050] hover:text-[#1E3050] mt-2 border border-[#1E3050] rounded px-3 py-1"
                  >
                    <FiPlus className="mr-1" />
                    Add Choice
                  </button>
                </div>
              )}

              {currentQuestion.type === 'true-false' && (
                <div>
                  <label className="block mb-2 text-[#000000]">Answer * (Please select the correct answer)</label>
                  {currentQuestion.options?.map((option, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={currentQuestion.correctAnswer === index}
                        onChange={() => setCurrentQuestion({
                          ...currentQuestion,
                          correctAnswer: index,
                        })}
                        className="mr-3"
                      />
                      <span className='text-[#000000]'>{option}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* List of Saved Questions */}
          {questions.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-3 text-[#000000]">Saved Questions ({questions.length})</h3>
              <div className="space-y-4">
                {questions.map((q, index) => renderSavedQuestion(q, index))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button className="px-6 py-2 rounded bg-[#CACACA] hover:bg-gray-300 transition text-[#4C4C4C]">
            Cancel
          </button>
          <button
            onClick={saveQuiz}
            className="px-6 py-2 bg-[#F7CA21] text-black rounded font-medium hover:bg-[#f8d34d] transition"
            disabled={questions.length === 0 || !quizName.trim()}
          >
            Save & Publish
          </button>
        </div>
      </div>
    </div>
  );
}