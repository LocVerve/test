const API_BASE_URL = 'http://localhost:3001/api';

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
  explanation?: string; // 题目解释
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
    try {
      // 获取用户信息，增加错误处理
      let user;
      try {
        const userStr = localStorage.getItem("user") || sessionStorage.getItem("user") || "{}";
        user = JSON.parse(userStr);
      } catch (e) {
        console.error("Failed to parse user data:", e);
        throw new Error("用户信息无效，请重新登录");
      }
      
      if (!user || !user.id) {
        throw new Error("用户未登录，请先登录");
      }
      
      const response = await fetch(`${API_BASE_URL}/problems/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          ...data
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "请求失败" }));
        throw new Error(errorData.message || `请求失败，状态码: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error("API请求失败:", error);
      throw error; // 重新抛出错误，让调用方处理
    }
  }
};

