import Link from 'next/link';
import Image from 'next/image';
import router from 'next/router';
import { useRouter } from 'next/navigation';

interface QuizCardProps {
    moduleId: number;
    title: string;
    type: string;
    questionCount: number;
    time: number;
    averageRating?: number | string | null; // Accept string too
  }
  
  export default function QuizCardSt({
    moduleId,
    title,
    type,
    questionCount,
    time,
    averageRating,
  }: QuizCardProps) {
      const router = useRouter();
    const safeRating =
      averageRating !== null && averageRating !== undefined
        ? parseFloat(averageRating as string)
        : 0;
  
    const renderStars = () => {
      const stars = [];
      const fullStars = Math.floor(safeRating);
      const hasHalfStar = safeRating % 1 >= 0.5;
  
      for (let i = 0; i < fullStars; i++) {
        stars.push(<span key={i} className="text-yellow-400 text-xl">&#9733;</span>);
      }
  
      if (hasHalfStar) {
        stars.push(<span key="half" className="text-yellow-400 text-xl">&#9733;</span>);
      }
  
      while (stars.length < 5) {
        stars.push(
          <span key={`empty-${stars.length}`} className="text-gray-300 text-xl">
            &#9733;
          </span>
        );
      }
  
      return stars;
    };



    const handleStartQuiz = () => {
        router.push(`/student/quizPage/${moduleId}/${type}`);
      };
  
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex justify-between"
      onClick={handleStartQuiz}
      >
        <div className="p-6 flex flex-col items-start justify-center text-left flex-grow">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {title.split('\n').map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ))}
          </h3>
          <p className="text-gray-600 mb-2">{questionCount} Questions</p>
          
        </div>
  
        <div className="p-6 flex flex-col items-end justify-center text-right flex-grow">
          <div className="flex items-center gap-1 mb-2">{renderStars()}</div>
          <p className="text-gray-600">{Math.round(time)} Minutes</p>
        </div>
      </div>
    );
  }
  