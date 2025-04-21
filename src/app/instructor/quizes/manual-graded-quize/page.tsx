'use client';

import { useState } from 'react';
import { FiPlus, FiX, FiCheck } from 'react-icons/fi';
import Swal from 'sweetalert2';

interface Question {
  id: number;
  question: string;
  sampleAnswer: string;
}

export default function ManualGradingModule() {
  const [moduleName, setModuleName] = useState('');
  const [timeEstimate, setTimeEstimate] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    sampleAnswer: ''
  });

  const addNewQuestion = () => {
    setShowQuestionForm(true);
  };

  const saveQuestion = () => {
    if (!currentQuestion.question.trim() || !currentQuestion.sampleAnswer.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Incomplete Fields',
        text: 'Please fill both question and sample answer',
        confirmButtonColor: '#F7CA21',
      });
      return;
    }

    setQuestions([...questions, {
      id: Date.now(),
      ...currentQuestion
    }]);
    setCurrentQuestion({ question: '', sampleAnswer: '' });
    setShowQuestionForm(false);
    
    Swal.fire({
      icon: 'success',
      title: 'Question Added',
      text: 'Your question has been saved successfully',
      showConfirmButton: false,
      timer: 1500
    });
  };

  const removeQuestion = (id: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F7CA21',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setQuestions(questions.filter(q => q.id !== id));
        Swal.fire(
          'Deleted!',
          'Your question has been deleted.',
          'success'
        );
      }
    });
  };

  const saveModule = async () => {
    try {
      if (!moduleName.trim() || questions.length === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Incomplete Information',
          text: 'Please provide a module name and at least one question',
          confirmButtonColor: '#F7CA21',
        });
        return;
      }
  
      setIsLoading(true);
      
      const response = await fetch(`${baseUrl}/modules/store-manual-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moduleName,
          timeEstimate,
          questions: questions.map(q => ({
            question: q.question,
            sampleAnswer: q.sampleAnswer
          }))
        })
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'Failed to save module');
      }
  
      setIsLoading(false);
      
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Manual grading module created successfully!',
        confirmButtonColor: '#F7CA21',
      });
      
      // Reset form
      setModuleName('');
      setTimeEstimate('');
      setQuestions([]);
      
    } catch (error) {
      setIsLoading(false);
      console.error('Error saving module:', error);
      
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error instanceof Error ? error.message : 'An unknown error occurred',
        confirmButtonColor: '#F7CA21',
      });
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-full mx-auto bg-white rounded-lg shadow p-6">
        {/* Basic Information */}
        <div className="mb-8">
          <div className="rounded-lg p-6 mb-6 bg-white shadow">
            <h2 className="text-xl font-semibold mb-4 text-[#000000]">Basic Information</h2>
            
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="w-full">
                <label className="block mb-2 font-medium text-[#000000]">Quiz Name *</label>
                <input
                  type="text"
                  value={moduleName}
                  onChange={(e) => setModuleName(e.target.value)}
                  placeholder="Type Quiz Name here"
                  className="w-full p-3 bg-[#f5f5f5] rounded focus:outline-none focus:ring-2 focus:ring-[#F7CA21] placeholder-[#969696] text-[#000000]"
                  required
                />
              </div>
              
              <div className="w-full">
                <label className="block mb-2 font-medium text-[#000000]">Estimation Time (minutes) *</label>
                <input
                  type="number"
                  value={timeEstimate}
                  onChange={(e) => setTimeEstimate(e.target.value)}
                  placeholder="e.g. 40"
                  className="w-full p-3 bg-[#f5f5f5] rounded focus:outline-none focus:ring-2 focus:ring-[#F7CA21] placeholder-[#969696] text-[#000000]"
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          {!showQuestionForm && (
            <div className="flex justify-center mt-4">
              <button
                onClick={addNewQuestion}
                className="flex items-center px-4 py-2 bg-[#F7CA21] text-black rounded hover:bg-[#f8d34d] transition"
              >
                <FiPlus className="mr-2" />
                Add New Question
              </button>
            </div>
          )}
        </div>

        {/* Question Form */}
        {showQuestionForm && (
          <div className="mb-8 p-4 border border-gray-200 rounded-lg">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-4">
                <label className="block mb-2 font-medium text-[#000000]">Question *</label>
                <div className='flex items-center space-x-2'>
                  <button
                    onClick={saveQuestion}
                    className="flex items-center bg-[#F7CA21] text-black py-1 px-3 rounded text-sm hover:bg-[#f8d34d] transition"
                  >
                    <FiCheck className="mr-1" />
                    Done
                  </button>
                  <button
                    onClick={() => setShowQuestionForm(false)}
                    className="flex items-center bg-[#FFDFDF66] text-black py-1 px-3 rounded text-sm hover:bg-[#FFDFDF99] transition"
                  >
                    <FiX className="text-[#FF0000] hover:text-[#CC0000] transition-colors" />
                  </button>
                </div>
              </div>

              <textarea
                value={currentQuestion.question}
                onChange={(e) => setCurrentQuestion({
                  ...currentQuestion,
                  question: e.target.value
                })}
                placeholder="Type Question here"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#000000]"
                rows={3}
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-2 font-medium text-[#000000]">Sample Answer *</label>
              <textarea
                value={currentQuestion.sampleAnswer}
                onChange={(e) => setCurrentQuestion({
                  ...currentQuestion,
                  sampleAnswer: e.target.value
                })}
                placeholder="Provide a sample answer"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#000000]"
                rows={5}
                required
              />
            </div>
          </div>
        )}

        {/* Saved Questions List */}
        {questions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-[#000000]">Saved Questions ({questions.length})</h2>
            
            {questions.map((q, index) => (
              <div key={q.id} className="mb-4 p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-[#000000]">Question {index + 1}</h3>
                  <button
                    onClick={() => removeQuestion(q.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiX className="text-[#FF0000] hover:text-[#CC0000] transition-colors" />
                  </button>
                </div>
                
                <div className="mb-3">
                  <p className="font-medium text-[#000000]">Question:</p>
                  <p className="whitespace-pre-line text-[#000000]">{q.question}</p>
                </div>
                
                <div>
                  <p className="font-medium text-[#000000]">Sample Answer:</p>
                  <p className="whitespace-pre-line text-[#000000]">{q.sampleAnswer}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button 
            onClick={() => {
              setModuleName('');
              setTimeEstimate('');
              setQuestions([]);
            }}
            className="px-6 py-2 border border-gray-300 text-[#4C4C4C] rounded bg-[#CACACA] hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={saveModule}
            className="px-6 py-2 bg-[#F7CA21] text-[#000000] rounded hover:bg-[#f8d34d] transition flex items-center justify-center min-w-[150px]"
            disabled={!moduleName.trim() || questions.length === 0 || isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save & Publish'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}