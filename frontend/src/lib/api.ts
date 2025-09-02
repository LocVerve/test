const API_BASE_URL = 'http://localhost:3001';

export const api = {
  // 获取所有题目
  getProblems: async (): Promise<Problem[]> => {
    const response = await fetch(`${API_BASE_URL}/problems`);
    return response.json();
  },

  // 获取单个题目
  getProblem: async (id: number): Promise<Problem> => {
    const response = await fetch(`${API_BASE_URL}/problems/${id}`);
    return response.json();
  },

  // 更新题目状态（完成/收藏等）
  updateProblem: async (id: number, data: Partial<Problem>): Promise<Problem> => {
    const response = await fetch(`${API_BASE_URL}/problems/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }
};

// 题目类型定义
export interface Problem {
  id: number;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  tags: string[];
  completed: boolean;
  bookmarked: boolean;
  通过率: number;
  template: "multiple-choice" | "coding" | "essay" | "fill-blank";
  content: string;
  // 根据题目类型添加特定字段
  options?: string[]; // 选择题选项
  correctAnswer?: string | string[]; // 正确答案
  sampleCode?: string; // 编程题示例代码
  testCases?: TestCase[]; // 编程题测试用例
  expectedLength?: number; // 解答题期望字数
  blanks?: Blank[]; // 填空题空格信息
}

interface TestCase {
  input: string;
  output: string;
}

interface Blank {
  id: number;
  position: number;
  type: "text" | "number" | "code";
  answer: string;
}
