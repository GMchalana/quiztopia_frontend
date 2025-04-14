'use client';

import { useState } from 'react';
import { FiPlus, FiX, FiCheck } from 'react-icons/fi';

export default function ManualGradingModule() {
  const [moduleName, setModuleName] = useState('');
  const [timeEstimate, setTimeEstimate] = useState('');
  const [questions, setQuestions] = useState<{ id: number; question: string; sampleAnswer: string }[]>([]);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    sampleAnswer: ''
  });

  const addNewQuestion = () => {
    setShowQuestionForm(true);
  };

  const saveQuestion = () => {
    if (!currentQuestion.question.trim() || !currentQuestion.sampleAnswer.trim()) {
      alert('Please fill both question and sample answer');
      return;
    }

    setQuestions([...questions, {
      id: Date.now(),
      ...currentQuestion
    }]);
    setCurrentQuestion({ question: '', sampleAnswer: '' });
    setShowQuestionForm(false);
  };

  const removeQuestion = (id : any) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const saveModule = async () => {
    try {
      if (!moduleName.trim() || questions.length === 0) {
        alert('Please provide a module name and at least one question');
        return;
      }

      const response = await fetch('http://localhost:3333/api/modules/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moduleName,
          timeEstimate,
          questions
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Manual grading module created successfully!');
        // Reset form
        setModuleName('');
        setTimeEstimate('');
        setQuestions([]);
      } else {
        throw new Error(result.message || 'Failed to save module');
      }
    } catch (error) {
      console.error('Error saving module:', error);
      if (error instanceof Error) {
        alert(`Error: ${error.message}`);
      } else {
        alert('An unknown error occurred');
      }
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

        {!showQuestionForm && (
            <div className="flex justify-center mt-4">
                <button
                onClick={addNewQuestion}
                className="flex items-center px-4 py-2 bg-[#F7CA21] text-black rounded hover:bg-blue-700"
                >
                    <FiPlus className="mr-2" />
                    Add New Question

                </button>
            </div>
            )}

        </div>











        






        {/* Question Form (shown when adding new question) */}
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
                    <i className="fa-solid fa-trash text-[#FF0000] text-lg hover:text-[#CC0000] transition-colors"></i>
                  </button>
                </div>
              </div>






              {/* <label className="block mb-2 font-medium text-[#000000]">Question *</label> */}
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

            {/* <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowQuestionForm(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={saveQuestion}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Question
              </button>
            </div> */}
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
                   <i className="fa-solid fa-trash text-[#FF0000] text-lg hover:text-[#CC0000] transition-colors"></i>
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
          <button className="px-6 py-2 border border-gray-300 text-[#4C4C4C] rounded bg-[#CACACA] hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={saveModule}
            className="px-6 py-2 bg-[#F7CA21] text-[#000000] rounded hover:bg-green-700"
            disabled={!moduleName.trim() || questions.length === 0}
          >
            Save & Publish
          </button>
        </div>
      </div>
    </div>
  );
}