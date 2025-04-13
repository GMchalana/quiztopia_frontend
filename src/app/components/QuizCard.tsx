import Link from 'next/link';
import Image from 'next/image';

import delet from '../../assets/delete.png';

interface QuizCardProps {
  title: string;
  questionCount: number;
}

export default function QuizCard({ title, questionCount }: QuizCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      {/* Centered content */}
      <div className="p-6 flex flex-col items-center justify-center text-center flex-grow">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {title.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </h3>
        <p className="text-gray-600 mb-4">{questionCount} Questions</p>
        
        <div className="flex items-center justify-center space-x-4">
          {/* Edit button left of View Answers */}
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <i className="fa-solid fa-pen text-[#005EFF] text-lg hover:text-yellow-600 transition-colors"></i>

          </button>
          
          <Link 
            href="#" 
            className="inline-block px-4 py-2 bg-[#E6E6E666] text-black rounded hover:bg-[#fce280] transition-colors"
          >
            View Answers
          </Link>
          
          {/* Delete button right of View Answers */}
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <i className="fa-solid fa-trash text-[#FF0000] text-lg hover:text-yellow-600 transition-colors"></i>
          </button>
        </div>
      </div>
    </div>
  );
}