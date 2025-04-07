import Link from 'next/link';
import Image from 'next/image';
import edit from '../../assets/edit.png';
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
            <Image 
              src={edit} 
              alt="Edit" 
              width={20} 
              height={20}
              className="w-5 h-5"
            />
          </button>
          
          {/* View Answers button (center) */}
          <Link 
            href="#" 
            className="inline-block px-4 py-2 bg-[#E6E6E666] text-black font-medium rounded hover:bg-[#fce280] transition-colors"
          >
            View Answers
          </Link>
          
          {/* Delete button right of View Answers */}
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Image 
              src={delet} 
              alt="Delete" 
              width={20} 
              height={20}
              className="w-5 h-5"
            />
          </button>
        </div>
      </div>
    </div>
  );
}