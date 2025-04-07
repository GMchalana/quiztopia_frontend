import QuizCard from '../components/QuizCard';

const quizData = [
  { title: "Basic Fundamentals of Geography", questionCount: 10 },
  { title: "Graphic Design Fundamentals", questionCount: 10 },
  { title: "Business Marketing Stage : 01", questionCount: 30 },
  { title: "Python for Beginners", questionCount: 20 },
  { title: "UML Diagrams for IT", questionCount: 20 },
  { title: "Accounting & IT", questionCount: 10 },
  { title: "Basic Data Structures", questionCount: 35 },
  { title: "Business Intelligence Basics", questionCount: 10 },
  { title: "Linux Fundamentals", questionCount: 20 },
];

export default function DashboardPage() {
  return (
    <div className="p-6">
      {/* <h1 className="text-2xl font-bold text-gray-800 mb-6">Available Quizzes</h1> */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizData.map((quiz, index) => (
          <QuizCard 
            key={index}
            title={quiz.title}
            questionCount={quiz.questionCount}
          />
        ))}
      </div>
    </div>
  );
}