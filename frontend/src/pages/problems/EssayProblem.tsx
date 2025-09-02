import { useEffect,useState  } from "react";
import { Problem } from "@/lib/api";
interface EssayProblemProps {
  problem: Problem;
  onSubmit: (answer: string) => void;
  initialAnswer?: string;
}

export const EssayProblem: React.FC<EssayProblemProps> = ({ 
  problem, 
  onSubmit, 
  initialAnswer = "" 
}) => {
  const [answer, setAnswer] = useState(initialAnswer);
  const [wordCount, setWordCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 计算字数
  useEffect(() => {
    const count = answer.replace(/\s/g, '').length;
    setWordCount(count);
  }, [answer]);

  const handleSubmit = () => {
    if (answer.trim() === "") {
      alert("请输入答案");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      onSubmit(answer);
    }, 1000);
  };

  const isWithinLimit = !problem.expectedLength || wordCount <= problem.expectedLength;
  const isOverMinimum = problem.expectedLength && wordCount >= problem.expectedLength * 0.5;

  return (
    <div className="problem-container">
      <div className="problem-content">
        <h2 className="text-xl font-bold mb-4">{problem.title}</h2>
        <div className="problem-description bg-white p-4 rounded-lg shadow mb-6">
          {problem.content}

          {problem.expectedLength && (
            <div className={`mt-4 p-3 rounded-lg ${
              isWithinLimit ? "bg-blue-50" : "bg-red-50"
            }`}>
              <p className="text-sm">
                字数要求: <span className="font-medium">{problem.expectedLength}字</span>
                {wordCount > 0 && (
                  <span className="ml-2">
                    当前字数: <span className="font-medium">{wordCount}字</span>
                  </span>
                )}
              </p>
              {!isWithinLimit && (
                <p className="text-red-600 text-sm mt-1">
                  已超出字数限制！
                </p>
              )}
              {!isOverMinimum && wordCount > 0 && (
                <p className="text-yellow-600 text-sm mt-1">
                  建议至少完成 {Math.ceil(problem.expectedLength * 0.5)} 字
                </p>
              )}
            </div>
          )}
        </div>

        <div className="answer-section mb-6">
          <h3 className="font-medium mb-2">你的答案</h3>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[300px] resize-y"
            placeholder="请在此输入你的答案..."
            disabled={submitted}
          />
        </div>

        {!submitted && (
          <div className="submit-section">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  提交中...
                </>
              ) : (
                "提交答案"
              )}
            </button>
          </div>
        )}

        {submitted && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-2"></i>
              <p className="text-green-700">答案已提交！</p>
            </div>
            <div className="mt-3">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setIsSubmitting(false);
                }}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                修改答案
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
