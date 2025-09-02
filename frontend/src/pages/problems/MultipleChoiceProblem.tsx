import { useState } from "react";
import { Problem } from "@/lib/api";

interface MultipleChoiceProblemProps {
  problem: Problem;
  onSubmit: (answer: string) => void;
  initialAnswer?: string;
}

export const MultipleChoiceProblem: React.FC<MultipleChoiceProblemProps> = ({ 
  problem, 
  onSubmit, 
  initialAnswer = "" 
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>(initialAnswer);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit(selectedAnswer);
  };

  const isCorrect = submitted && selectedAnswer === problem.correctAnswer;

  return (
    <div className="problem-container">
      <div className="problem-content">
        <h2 className="text-xl font-bold mb-4">{problem.title}</h2>
        <div className="problem-description bg-white p-4 rounded-lg shadow mb-6">
          {problem.content}
        </div>

        <div className="options space-y-3">
          {problem.options?.map((option, index) => (
            <label 
              key={index}
              className={`option block p-4 rounded-lg border cursor-pointer transition-all ${
                submitted 
                  ? (option === problem.correctAnswer 
                    ? "border-green-500 bg-green-50" 
                    : selectedAnswer === option 
                      ? "border-red-500 bg-red-50" 
                      : "border-gray-200")
                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  disabled={submitted}
                  className="mr-3"
                />
                <span>{option}</span>
                {submitted && option === problem.correctAnswer && (
                  <i className="fas fa-check-circle text-green-500 ml-auto"></i>
                )}
                {submitted && selectedAnswer === option && option !== problem.correctAnswer && (
                  <i className="fas fa-times-circle text-red-500 ml-auto"></i>
                )}
              </div>
            </label>
          ))}
        </div>

        {!submitted && (
          <div className="mt-6">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              提交答案
            </button>
          </div>
        )}

        {submitted && isCorrect && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700">
              <i className="fas fa-check-circle mr-2"></i>
              回答正确！
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
