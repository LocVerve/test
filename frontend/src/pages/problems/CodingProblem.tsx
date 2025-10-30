import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Problem } from "@/lib/api";
import { Timer } from "@/components/Timer";


interface CodingProblemProps {
  problem: Problem;
  onSubmit: (code: string) => void;
  initialCode?: string;
}

// 模拟提交历史数据
const submissionHistoryData = [
  { name: "1s", 执行时间: 120 },
  { name: "2s", 执行时间: 90 },
  { name: "3s", 执行时间: 150 },
  { name: "4s", 执行时间: 80 },
  { name: "5s", 执行时间: 65 },
  { name: "6s", 执行时间: 70 },
  { name: "7s", 执行时间: 55 },
];

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
  const [setRunResult] = useState<any>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [language, setLanguage] = useState("javascript");
  const codeEditorRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  
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
      
      if (passed === total) {
        toast.success("恭喜！所有测试用例通过！");
      } else {
        toast.error(`提交失败，${passed}/${total} 测试用例通过`);
      }
    } catch (error) {
      console.error("提交失败:", error);
      toast.error("提交失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRun = async () => {
    try {
      const response = await fetch('/api/run-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const result = await response.json();
      setRunResult(result); // 显示运行结果
    } catch (error) {
      console.error('运行失败:', error);
      toast.error("运行失败，请重试");
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 顶部导航栏 */}
      <header className="bg-c_tbar shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/problems')}
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                <i className="iconfont icon-zuojiantou"></i>
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 truncate max-w-md">
                  {problem.title}
                </h1>
                <div className="flex items-center mt-0.5">
                 <Timer/>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowExplanation(!showExplanation)}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-200"
              >
                {showExplanation ? '隐藏解析' : '查看解析'}
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                    提交中...
                  </>
                ) : (
                  "提交解答"
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-c_main">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：题目描述 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 标签页 */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('description')}
                  className={cn(
                    "py-4 px-1 border-b-2 font-medium text-sm",
                    activeTab === 'description'
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  题目描述
                </button>
                <button
                  onClick={() => setActiveTab('submissions')}
                  className={cn(
                    "py-4 px-1 border-b-2 font-medium text-sm",
                    activeTab === 'submissions'
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  提交记录
                </button>
                <button
                  onClick={() => setActiveTab('discussion')}
                  className={cn(
                    "py-4 px-1 border-b-2 font-medium text-sm",
                    activeTab === 'discussion'
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  讨论区
                </button>
              </nav>
            </div>

            {/* 题目内容 */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              {activeTab === 'description' && (
                <>
                  <div className="prose max-w-none">
                    <h2 className="text-xl font-semibold mb-4">题目描述</h2>
                    <div className="text-gray-800 whitespace-pre-line mb-6">
                      {problem.content}
                    </div>

                    <h3 className="text-lg font-medium mt-8 mb-3">测试用例</h3>
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      {problem.testCases?.map((testCase, index) => (
                        <div key={index} className="mb-3 last:mb-0">
                          <div className="mb-2">
                            <span className="font-medium text-gray-700">输入:</span>
                            <pre className="bg-gray-100 p-2 rounded mt-1 text-sm overflow-x-auto">{testCase.input}</pre>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">期望输出:</span>
                            <pre className="bg-gray-100 p-2 rounded mt-1 text-sm overflow-x-auto">{testCase.output}</pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 题目解析 */}
                  {showExplanation && problem.sampleCode && (
                    <div className="mt-8 pt-6 border-t border-gray-200 bg-blue-50 rounded-lg p-5">
                      <h3 className="text-lg font-medium text-blue-800 mb-3">
                        <i className="fa-solid fa-lightbulb mr-2"></i>解题思路
                      </h3>
                      <div className="text-blue-900 space-y-3">
                        <p>这是一道编程题，需要编写函数解决特定问题。</p>
                        <p>解题思路：</p>
                        <ol className="list-decimal pl-5 space-y-1">
                          <li>仔细阅读题目描述，理解需求</li>
                          <li>分析测试用例，理解输入和输出的关系</li>
                          <li>考虑边界条件和特殊情况</li>
                          <li>编写代码实现解决方案</li>
                          <li>测试代码确保通过所有测试用例</li>
                        </ol>

                        <div className="mt-4 pt-4 border-t border-blue-200">
                          <h4 className="font-medium mb-2">参考代码：</h4>
                          <pre className="bg-gray-900 text-white p-3 rounded text-sm overflow-x-auto">
                            {problem.sampleCode}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'submissions' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">提交记录</h3>
                    <p className="text-gray-500 text-sm mb-6">查看你的解题历史和性能分析</p>

                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <h4 className="text-sm font-medium mb-3">性能趋势</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={submissionHistoryData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip
                              formatter={(value) => [`${value}ms`, '执行时间']}
                              labelFormatter={(label) => `提交 ${label}`}
                            />
                            <Line
                              type="monotone"
                              dataKey="执行时间"
                              stroke="#3b82f6"
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm font-medium text-gray-500 border-b pb-2">
                        <div className="w-1/4">提交时间</div>
                        <div className="w-1/4">状态</div>
                        <div className="w-1/4">执行时间</div>
                        <div className="w-1/4">操作</div>
                      </div>

                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex justify-between items-center text-sm border-b pb-3 pt-3">
                          <div className="w-1/4 text-gray-700">
                            {new Date(Date.now() - i * 3600000).toLocaleString()}
                          </div>
                          <div className="w-1/4">
                            <span className={i % 3 === 0 ? "text-green-600" : "text-red-600"}>
                              {i % 3 === 0 ? "通过" : "未通过"}
                            </span>
                          </div>
                          <div className="w-1/4 text-gray-700">{55 + i * 10}ms</div>
                          <div className="w-1/4">
                            <button className="text-blue-600 hover:text-blue-800">查看</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'discussion' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium mb-4">讨论区</h3>
                  <p className="text-gray-500 text-sm mb-6">与其他用户交流解题思路和技巧</p>

                  <div className="space-y-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border-b pb-6">
                        <div className="flex items-start">
                          <img
                            src={`https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=user%20avatar%20${i}`}
                            alt="User avatar"
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="ml-3">
                            <div className="flex items-center">
                              <span className="font-medium text-gray-900">用户{i + 1}</span>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className="text-sm text-gray-500">
                                {i + 2} 天前
                              </span>
                            </div>
                            <p className="mt-2 text-gray-700">
                              {i === 0 ?
                                "我用了双指针的方法，时间复杂度O(n^2)，空间复杂度O(1)，也通过了所有测试用例。" :
                                i === 1 ?
                                "哈希表方法确实更优，时间复杂度O(n)，就是需要额外的空间。" :
                                "有没有考虑过边界情况？比如数组中有负数的情况？"}
                            </p>
                            <div className="mt-3 flex items-center space-x-4">
                              <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                                <i className="fa-regular fa-thumbs-up mr-1"></i>
                                <span>{12 + i * 5}</span>
                              </button>
                              <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                                <i className="fa-regular fa-comment mr-1"></i>
                                <span>回复</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <textarea
                      placeholder="分享你的解题思路..."
                      className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                      rows={4}
                    ></textarea>
                    <div className="flex justify-end mt-3">
                      <button className="px-4 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition duration-200">
                        发表评论
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 提交结果 */}
            {submissionResult && (
              <div className={cn(
                "p-5 rounded-xl border",
                submissionResult.passed === submissionResult.total
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              )}>
                <div className="flex items-start">
                  <div className={cn(
                    "flex-shrink-0 p-2 rounded-full",
                    submissionResult.passed === submissionResult.total
                      ? "bg-green-100 text-green-500"
                      : "bg-red-100 text-red-500"
                  )}>
                    {submissionResult.passed === submissionResult.total ? (
                      <i className="fa-solid fa-check text-xl"></i>
                    ) : (
                      <i className="fa-solid fa-times text-xl"></i>
                    )}
                  </div>

                  <div className="ml-4">
                    <h3 className={cn(
                      "text-lg font-medium",
                      submissionResult.passed === submissionResult.total
                        ? "text-green-800"
                        : "text-red-800"
                    )}>
                      {submissionResult.passed === submissionResult.total
                        ? '恭喜！解答正确'
                        : '解答错误'}
                    </h3>

                    <div className="mt-2 text-sm">
                      <p className={cn(
                        submissionResult.passed === submissionResult.total
                          ? "text-green-700"
                          : "text-red-700"
                      )}>
                        {submissionResult.passed}/{submissionResult.total} 测试用例通过
                      </p>

                      {submissionResult.passed === submissionResult.total && (
                        <p className="text-green-700 mt-1">
                          执行时间: {submissionResult.executionTime}ms
                        </p>
                      )}

                      {submissionResult.passed !== submissionResult.total && submissionResult.errors.length > 0 && (
                        <div className="mt-3 bg-white rounded-md p-3 border border-red-200">
                          <h4 className="font-medium text-red-800 mb-2">错误信息:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-red-700">
                            {submissionResult.errors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() => setSubmissionResult(null)}
                        className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-200"
                      >
                        关闭
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 右侧：代码编辑器 */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
              <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-gray-700">代码编辑器</span>
                  <div className="flex items-center text-xs text-gray-500">
                    <span className="w-3 h-3 rounded-full bg-red-400 mr-1"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-400 mr-1"></span>
                    <span className="w-3 h-3 rounded-full bg-green-400"></span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="p-2 border rounded text-sm"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                  </select>
                  <button
                    onClick={handleRun}
                    className="px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 flex items-center"
                  >
                    运行代码
                  </button>
                  <button
                    onClick={formatCode}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                    title="格式化代码"
                  >
                    <i className="fa-solid fa-code"></i>
                  </button>
                </div>
              </div>

              <div className="flex-grow flex flex-col">
                <div className="flex-grow">
                  <textarea
                    ref={codeEditorRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-full p-4 font-mono text-sm resize-none focus:outline-none"
                    placeholder="在此输入你的代码..."
                  />
                </div>

                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      {language === 'javascript' ? 'JavaScript (ES6+)' : 
                       language === 'python' ? 'Python' :
                       language === 'java' ? 'Java' : 'C++'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 提示卡片 */}
            {problem.sampleCode && (
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                  <i className="fa-solid fa-lightbulb mr-2"></i>解题提示
                </h3>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} CodeMaster. 保留所有权利。</p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <a href="#" className="hover:text-gray-700">使用条款</a>
              <a href="#" className="hover:text-gray-700">隐私政策</a>
              <a href="#" className="hover:text-gray-700">帮助中心</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
