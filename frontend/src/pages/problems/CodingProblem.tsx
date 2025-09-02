import { useState, useEffect, useRef } from "react";
import { Problem } from "@/lib/api";

interface CodingProblemProps {
  problem: Problem;
  onSubmit: (code: string) => void;
  initialCode?: string;
}

export const CodingProblem: React.FC<CodingProblemProps> = ({ 
  problem, 
  onSubmit, 
  initialCode = "" 
}) => {
  const [code, setCode] = useState(initialCode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    passed: number;
    total: number;
    errors: string[];
    executionTime: number;
  } | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const codeEditorRef = useRef<HTMLTextAreaElement>(null);

  // 自动调整代码编辑器高度
  useEffect(() => {
    if (codeEditorRef.current) {
      codeEditorRef.current.style.height = "auto";
      codeEditorRef.current.style.height = `${codeEditorRef.current.scrollHeight}px`;
    }
  }, [code]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      // 模拟API调用和代码执行
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 模拟测试结果
      const passed = Math.floor(Math.random() * (problem.testCases?.length || 3)) + 1;
      const total = problem.testCases?.length || 3;
      const executionTime = Math.floor(Math.random() * 100) + 30;
      const errors = [];

      if (passed < total) {
        const testCaseIndex = passed;
        errors.push(`测试用例 ${testCaseIndex + 1} 失败: 预期输出 "${problem.testCases?.[testCaseIndex]?.output || "正确答案"}", 实际输出 "错误结果"`);
      }

      setSubmissionResult({
        passed,
        total,
        errors,
        executionTime
      });

      onSubmit(code);
    } catch (error) {
      console.error("提交失败:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCode = () => {
    // 简单的代码格式化
    let indentLevel = 0;
    const indentSize = 2;
    const lines = code.split('\n');
    const formattedLines = lines.map(line => {
      // 简单处理花括号来调整缩进
      if (line.includes('}')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      const trimmedLine = line.trim();
      const indent = ' '.repeat(indentLevel * indentSize);

      if (trimmedLine.includes('{') && !trimmedLine.includes('}')) {
        indentLevel += 1;
      }

      return indent + trimmedLine;
    });

    setCode(formattedLines.join('\n'));

    if (codeEditorRef.current) {
      codeEditorRef.current.focus();
    }
  };

  return (
    <div className="problem-container">
      <div className="problem-content">
        <h2 className="text-xl font-bold mb-4">{problem.title}</h2>
        <div className="problem-description bg-white p-4 rounded-lg shadow mb-6">
          {problem.content}
        </div>

        <div className="code-editor-section mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">代码编辑器</h3>
            <button
              onClick={formatCode}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
            >
              <i className="fas fa-code mr-1"></i> 格式化代码
            </button>
          </div>
          <textarea
            ref={codeEditorRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[300px] resize-y"
            spellCheck="false"
          />
        </div>

        <div className="test-cases mb-6">
          <h3 className="font-medium mb-2">测试用例</h3>
          <div className="bg-white p-4 rounded-lg shadow">
            {problem.testCases?.map((testCase, index) => (
              <div key={index} className="mb-3 last:mb-0">
                <div className="text-sm text-gray-600 mb-1">
                  <span className="font-medium">输入:</span> {testCase.input}
                </div>
                <div className="text-sm text-gray-800">
                  <span className="font-medium">期望输出:</span> {testCase.output}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="submit-section mb-6">
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
              "提交代码"
            )}
          </button>
        </div>

        {submissionResult && (
          <div className={`submission-result p-4 rounded-lg ${
            submissionResult.passed === submissionResult.total 
              ? "bg-green-50 border border-green-200" 
              : "bg-red-50 border border-red-200"
          }`}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">
                提交结果
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  submissionResult.passed === submissionResult.total 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {submissionResult.passed}/{submissionResult.total} 测试通过
                </span>
              </h3>
              <span className="text-sm text-gray-600">
                执行时间: {submissionResult.executionTime}ms
              </span>
            </div>

            {submissionResult.errors.length > 0 && (
              <div className="mt-3">
                <h4 className="font-medium text-red-700 mb-2">错误信息:</h4>
                <ul className="list-disc pl-5 text-red-600">
                  {submissionResult.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {submissionResult.passed === submissionResult.total && (
              <div className="mt-3 p-3 bg-green-100 text-green-700 rounded">
                <i className="fas fa-check-circle mr-2"></i>
                恭喜！所有测试用例通过！
              </div>
            )}
          </div>
        )}

        {problem.sampleCode && (
          <div className="mt-6">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <i className={`fas ${showExplanation ? "fa-chevron-up" : "fa-chevron-down"} mr-2`}></i>
              {showExplanation ? "隐藏示例代码" : "查看示例代码"}
            </button>

            {showExplanation && (
              <div className="mt-3 bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-medium mb-2">示例代码</h3>
                <pre className="bg-white p-3 rounded border overflow-x-auto text-sm">
                  {problem.sampleCode}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
