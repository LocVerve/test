import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/useTheme';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// Type definitions - these should ideally be in a separate types file
interface LearningStats {
  totalProblems: number;
  completedProblems: number;
  accuracyRate: number;
  dailyStreak: number;
  averageTimePerProblem: number;
  problemsByCategory: { name: string; value: number; }[];
  weeklyProgress: { day: string; problemsSolved: number; }[];
  difficultyDistribution: { name: string; value: number; }[];
}

interface WrongProblem {
  id: number;
  title: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastAttempt: string;
  mistakeCount: number;
}

interface BookmarkedProblem extends Omit<WrongProblem, 'mistakeCount'> {
  addedDate: string;
}

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  bio: string;
  preferences: {
    darkMode: boolean;
    emailNotifications: boolean;
    dailyReminders: boolean;
  };
}

// Mock data - this should ideally be fetched from an API
const MOCK_LEARNING_STATS: LearningStats = {
  totalProblems: 126,
  completedProblems: 48,
  accuracyRate: 78.5,
  dailyStreak: 12,
  averageTimePerProblem: 15.2,
  problemsByCategory: [
    { name: '数组', value: 12 },
    { name: '字符串', value: 8 },
    { name: '链表', value: 5 },
    { name: '树', value: 7 },
    { name: '动态规划', value: 6 },
    { name: '其他', value: 10 },
  ],
  weeklyProgress: [
    { day: '周一', problemsSolved: 3 },
    { day: '周二', problemsSolved: 5 },
    { day: '周三', problemsSolved: 2 },
    { day: '周四', problemsSolved: 7 },
    { day: '周五', problemsSolved: 4 },
    { day: '周六', problemsSolved: 8 },
    { day: '周日', problemsSolved: 6 },
  ],
  difficultyDistribution: [
    { name: '简单', value: 24 },
    { name: '中等', value: 18 },
    { name: '困难', value: 6 },
  ]
};

const MOCK_WRONG_PROBLEMS: WrongProblem[] = [
  { id: 15, title: '最长公共前缀', category: '字符串', difficulty: 'easy', lastAttempt: '2023-11-15', mistakeCount: 2 },
  { id: 23, title: '三数之和', category: '数组', difficulty: 'medium', lastAttempt: '2023-11-18', mistakeCount: 3 },
  { id: 42, title: '接雨水', category: '数组', difficulty: 'hard', lastAttempt: '2023-11-20', mistakeCount: 5 },
  { id: 76, title: '最小覆盖子串', category: '字符串', difficulty: 'hard', lastAttempt: '2023-11-22', mistakeCount: 4 }
];

const MOCK_BOOKMARKED_PROBLEMS: BookmarkedProblem[] = [
  { id: 5, title: '最长回文子串', category: '字符串', difficulty: 'medium', lastAttempt: '2023-11-10', addedDate: '2023-11-05' },
  { id: 10, title: '正则表达式匹配', category: '字符串', difficulty: 'hard', lastAttempt: '2023-11-12', addedDate: '2023-11-08' },
  { id: 22, title: '括号生成', category: '字符串', difficulty: 'medium', lastAttempt: '2023-11-14', addedDate: '2023-11-10' },
  { id: 30, title: '串联所有单词的子串', category: '字符串', difficulty: 'hard', lastAttempt: '2023-11-16', addedDate: '2023-11-12' }
];

const MOCK_USER_PROFILE: UserProfile = {
  name: '张明',
  email: 'zhangming@example.com',
  avatar: 'https://space.coze.cn/api/coze_space/gen_image?image_size=square&prompt=user%20avatar%20male&sign=ebabea4c1f7e5ee731c308221c34a2fe',
  joinDate: '2023-09-15',
  bio: '计算机科学专业大三学生，热爱编程和算法挑战。',
  preferences: { darkMode: false, emailNotifications: true, dailyReminders: true }
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function ProfilePanel() {
  const { toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('stats');
  const [userProfile, setUserProfile] = useState<UserProfile>(MOCK_USER_PROFILE);
  const [learningStats] = useState<LearningStats>(MOCK_LEARNING_STATS);
  const [wrongProblems, setWrongProblems] = useState<WrongProblem[]>(MOCK_WRONG_PROBLEMS);
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(MOCK_USER_PROFILE);

  const handleProfileSave = () => {
    setUserProfile(editedProfile);
    setIsEditingProfile(false);
    toast.success('个人资料更新成功！');
  };

  const handlePreferenceChange = (key: keyof UserProfile['preferences'], value: boolean) => {
    const updatedPreferences = { ...editedProfile.preferences, [key]: value };
    setEditedProfile({ ...editedProfile, preferences: updatedPreferences });
    if (key === 'darkMode') {
      toggleTheme();
    }
  };

  const removeFromWrongProblems = (id: number) => {
    setWrongProblems(prev => prev.filter(problem => problem.id !== id));
    toast.success('已从错题本中移除');
  };

  

  const completionPercentage = Math.round((learningStats.completedProblems / learningStats.totalProblems) * 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Left Column: User Info */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-24"></div>
          <div className="px-6 pb-6">
            <div className="flex justify-center -mt-12">
              <div className="relative">
                <img src={userProfile.avatar} alt={userProfile.name} className="h-24 w-24 rounded-full border-4 border-white object-cover" />
                <button className="absolute bottom-0 right-0 bg-blue-500 p-1.5 rounded-full border-2 border-white text-white hover:bg-blue-600 transition-colors">
                  <i className="fa-solid fa-camera text-xs"></i>
                </button>
              </div>
            </div>
            <div className="text-center mt-4">
              <h2 className="text-xl font-bold text-gray-900">{userProfile.name}</h2>
              <p className="text-gray-500 text-sm">{userProfile.email}</p>
              <div className="mt-4 flex justify-center space-x-3">
                <button onClick={() => setActiveTab('stats')} className={cn("px-3 py-1 rounded-full text-xs font-medium transition-colors", activeTab === 'stats' ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800 hover:bg-gray-200")}>学习数据</button>
                <button onClick={() => setActiveTab('wrong')} className={cn("px-3 py-1 rounded-full text-xs font-medium transition-colors", activeTab === 'wrong' ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800 hover:bg-gray-200")}>错题本</button>
                
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 text-center">
              <div className="bg-gray-50 rounded-lg p-3"><p className="text-2xl font-bold text-gray-900">{learningStats.completedProblems}</p><p className="text-xs text-gray-500">已完成题目</p></div>
              <div className="bg-gray-50 rounded-lg p-3"><p className="text-2xl font-bold text-gray-900">{learningStats.dailyStreak}</p><p className="text-xs text-gray-500">连续学习天数</p></div>
            </div>
            <div className="mt-6">
              <button onClick={() => { setIsEditingProfile(true); setEditedProfile({...userProfile}); }} className="w-full py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-200">编辑个人资料</button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">学习进度</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-gray-700">总体完成度</span><span className="font-medium">{completionPercentage}%</span></div>
              <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${completionPercentage}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-gray-700">准确率</span><span className="font-medium">{learningStats.accuracyRate}%</span></div>
              <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-green-600 h-2 rounded-full" style={{ width: `${learningStats.accuracyRate}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span className="text-gray-700">平均解题时间</span><span className="font-medium">{learningStats.averageTimePerProblem}分钟</span></div>
              <div className="w-full bg-gray-200 rounded-full h-2"><div className="bg-purple-600 h-2 rounded-full" style={{ width: `${Math.min(100, 100 - (learningStats.averageTimePerProblem - 5) * 5)}%` }}></div></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Content Area */}
      <div className="lg:col-span-3 space-y-6">
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">学习统计</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Stat cards */}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">周进度</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={learningStats.weeklyProgress}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="day" /><YAxis /><Tooltip formatter={(value) => [`${value}题`, '解决题目数']}/><Bar dataKey="problemsSolved" fill="#3b82f6" radius={[4, 4, 0, 0]}/></BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">题目难度分布</h3>
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart><Pie data={learningStats.difficultyDistribution} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>{learningStats.difficultyDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip formatter={(value) => [`${value}题`, '数��']}/><Legend /></PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">按类别统计</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={learningStats.problemsByCategory} margin={{ top: 5, right: 30, left: 60, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} /><XAxis type="number" /><YAxis dataKey="name" type="category" /><Tooltip formatter={(value) => [`${value}题`, '解决数量']}/><Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]}>{learningStats.problemsByCategory.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Bar></BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'wrong' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-gray-900">错题本</h2><button className="text-sm text-blue-600 hover:text-blue-800"><i className="fa-solid fa-download mr-1"></i>导出错题</button></div>
            {wrongProblems.length === 0 ? (
              <div className="text-center py-12"><div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4"><i className="fa-solid fa-check-circle text-gray-400 text-2xl"></i></div><h3 className="text-lg font-medium text-gray-900 mb-1">恭喜！没有错题</h3><p className="text-gray-500">继续保持良好的解题习惯</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50"><tr><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">题目</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类别</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">难度</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">错误次数</th><th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">上次尝试</th><th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th></tr></thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {wrongProblems.map((problem) => (
                      <tr key={problem.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900"><button onClick={() => navigate(`/problems/${problem.id}`)} className="hover:text-blue-600">{problem.title}</button></div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">{problem.category}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className={cn("px-2 py-1 text-xs font-medium rounded-full", problem.difficulty === 'easy' ? "bg-green-100 text-green-800" : problem.difficulty === 'medium' ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800")}>{problem.difficulty === 'easy' ? '简单' : problem.difficulty === 'medium' ? '中等' : '困难'}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="flex items-center">{[...Array(5)].map((_, i) => (<i key={i} className={i < problem.mistakeCount ? "fa-solid fa-circle text-red-400 text-xs" : "fa-regular fa-circle text-gray-300 text-xs"}></i>))}</div><span className="ml-2 text-sm text-gray-700">{problem.mistakeCount}次</span></div></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{problem.lastAttempt}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><div className="flex justify-end space-x-2"><button onClick={() => navigate(`/problems/${problem.id}`)} className="text-blue-600 hover:text-blue-800">重练</button><button onClick={() => removeFromWrongProblems(problem.id)} className="text-red-600 hover:text-red-800">移除</button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookmarks' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            {/* Bookmarks content */}
          </div>
        )}

        {isEditingProfile && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-gray-900">编辑个人资料</h2><button onClick={() => setIsEditingProfile(false)} className="text-gray-500 hover:text-gray-700"><i className="fa-solid fa-times"></i></button></div>
            <form className="space-y-6">
              {/* Form fields */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setIsEditingProfile(false)} className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">取消</button>
                <button type="button" onClick={handleProfileSave} className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">保存更改</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
