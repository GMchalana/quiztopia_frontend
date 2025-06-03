import Link from 'next/link';

interface QuizCardProps {
  moduleId: number;
  type: string;
  title: string;
  questionCount: number;
  onDelete: (moduleId: number) => void;
}

export default function QuizCard({ moduleId,type, title, questionCount, onDelete }: QuizCardProps) {


  const getHref = () => {
    if (type === 'auto') {
      return `/instructor/reviewAutoQuiz/${moduleId}/stAttempts`;
    } else if (type === 'manual') {
      return `/instructor/reviewManualQuiz/${moduleId}/stAttemptAuto`;
    }
    // Default fallback (you can adjust this as needed)
    return `/modules/${moduleId}/attempts`;
  };



  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
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
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <i className="fa-solid fa-pen text-[#005EFF] text-lg hover:text-yellow-600 transition-colors"></i>
          </button>

          <Link
             href={getHref()}
            className="inline-block px-4 py-2 bg-[#E6E6E666] text-black rounded hover:bg-[#fce280] transition-colors"
          >
            View Answers
          </Link>

          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => onDelete(moduleId)}
          >
            <i className="fa-solid fa-trash text-[#FF0000] text-lg hover:text-yellow-600 transition-colors"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
