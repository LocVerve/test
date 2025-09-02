import { useState } from "react";
import { Problem } from "@/lib/api";


interface FillBlankProblemProps {
  problem: Problem;
  onSubmit: (answers: Record<number, string>) => void;
  initialAnswers?: Record<number, string>;
}

export const FillBlankProblem: React.FC<FillBlankProblemProps> = ({ 
  problem, 
  onSubmit, 
  initialAnswers = {} 
}) => {
  const [answers, setAnswers] = useState<Record<number, string>>(initialAnswers);
  const [submitted, setSubmitted] = useState(false);

  const handleAnswerChange = (blankId: number, value: string) => {
    setAnswers(prev => ({
      ...prev,
      [blankId]: value
    }));
  };

  const handleSubmit = () => {
    // 检查是否所有空格都已填写
    const allBlanksFilled = problem.blanks?.every(blank => answers[blank.id] !== undefined && answers[blank.id] !== "");

    if (!allBlanksFilled) {
      alert("请填写所有空格");
      return;
    }

    setSubmitted(true);
    onSubmit(answers);
  };

  // 渲染带空格的文本
  const renderContentWithBlanks = () => {
    if (!problem.blanks || problem.blanks.length === 0) {
      return  <div>{problem.content}</div>;
    }

    // 按位置排序空格
    const sortedBlanks = [...problem.blanks].sort((a, b) => a.position - b.position);

    let result = problem.content;
    let offset = 0;

    sortedBlanks.forEach(blank => {
      const blankIndex = result.indexOf("__", offset);
      if (blankIndex !== -1) {
        const beforeBlank = result.substring(0, blankIndex);
        const afterBlank = result.substring(blankIndex + 2);

        const userAnswer = answers[blank.id] || "";
        const isCorrect = submitted && userAnswer === blank.answer;

        result = beforeBlank + 
          `<span class="blank-input-container">
            <input 
              type="${blank.type === 'number' ? 'number' : 'text'}" 
              value="${userAnswer}" 
              onChange={(e) => handleAnswerChange(blank.id, e.target.value)}
              ${submitted ? 'disabled' : ''}
              class="blank-input ${submitted ? (isCorrect ? 'correct' : 'incorrect') : ''}"
              placeholder="${blank.type === 'code' ? '代码' : '答案'}"
            />
            ${submitted ? 
              `<i class="fas ${isCorrect ? 'fa-check-circle text-green-500' : 'fa-times-circle text-red-500'}"></i>` : 
              ''
            }
          </span>` + 
          afterBlank;

        offset = blankIndex + 1; // 更新偏移量，避免重复处理同一个空格
      }
    });

    return <div dangerouslySetInnerHTML={{ __html: result }} />;
  };

  return (
    <div className="problem-container">
      <div className="problem-content">
        <h2 className="text-xl font-bold mb-4">{problem.title}</h2>
        <div className="problem-description bg-white p-4 rounded-lg shadow mb-6">
          {renderContentWithBlanks()}
        </div>

        <div className="blanks-summary mb-6">
          <h3 className="font-medium mb-2">空格列表</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {problem.blanks?.map(blank => (
              <div key={blank.id} className="bg-gray-50 p-3 rounded-lg border">
                <div className="flex items-center">
                  <span className="font-medium">空格 {blank.position}:</span>
                  <span className="ml-2 text-sm text-gray-600">
                    ({blank.type === 'number' ? '数字' : blank.type === 'code' ? '代码' : '文本'})
                  </span>
                  {submitted && (
                    <span className={`ml-auto ${answers[blank.id] === blank.answer ? 'text-green-600' : 'text-red-600'}`}>
                      {answers[blank.id] === blank.answer ? '✓ 正确' : '✗ 错误'}
                    </span>
                  )}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  提示: {blank.answer}
                </div>
              </div>
            ))}
          </div>
        </div>

        {!submitted && (
          <div className="submit-section">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              提交答案
            </button>
          </div>
        )}

        {submitted && (
          <div className="mt-6">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
              <div className="flex items-center">
                <i className="fas fa-check-circle text-green-500 mr-2"></i>
                <p className="text-green-700">答案已提交！</p>
              </div>
              <div className="mt-3">
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  修改答案
                </button>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">正确答案</h3>
              <ul className="space-y-2">
                {problem.blanks?.map(blank => (
                  <li key={blank.id} className="flex items-center">
                    <span className="font-medium">空格 {blank.position}:</span>
                    <span className="ml-2">{blank.answer}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 添加样式
const blankStyles = `
.blank-input-container {
  display: inline-flex;
  align-items: center;
  margin: 0 4px;
}

.blank-input {
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 2px 6px;
  width: 120px;
  font-size: 14px;
}

.blank-input.correct {
  border-color: #10b981;
  background-color: #d1fae5;
}

.blank-input.incorrect {
  border-color: #ef4444;
  background-color: #fee2e2;
}
`;

// 创建样式元素
const styleElement = document.createElement('style');
styleElement.innerHTML = blankStyles;
document.head.appendChild(styleElement);
