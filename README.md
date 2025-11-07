# 前端
## 展示
![首页截图](home_page.png)


## 环境准备

- 安装 [Node.js](https://nodejs.org/en)
- 安装 [pnpm](https://pnpm.io/installation)


## 操作步骤

- 到达前端文件夹

```sh
cd frontend
```

- 安装依赖

```sh
pnpm install
```

- 启动 Dev Server

```sh
pnpm run dev
```

- 本项目现阶段使用 json-server 模拟 API,如果要登录的话运行运行如下代码

```sh
pnpm install -g json-server
json-server --watch db.json --port 3001
```

- 在浏览器访问 http://localhost:3000

## 项目介绍

- **React 18+** 作为核心 UI 框架
- **TypeScript** 提供类型安全
- **Vite** 作为构建工具
- **Tailwind CSS** 作为样式解决方案
- **React Router** 处理路由导航
- **Framer Motion** 提供动画效果
- **Recharts** 用于数据可视化
- **Context API** 进行状态管理
-

```
src/
├── components/         # 可复用组件
│   ├── Empty.tsx      # 空状态组件
│   └── Icon.tsx       # 图标组件
├── contexts/          # React Context
│   └── authContext.ts # 认证上下文
├── hooks/             # 自定义Hooks
│   └── useTheme.ts    # 主题切换Hook
├── lib/               # 工具函数
│   └── utils.ts       # 通用工具函数
├── pages/             # 页面组件
│   ├── Home.tsx       # 首页
│   ├── LoginPage.tsx  # 登录页
│   ├── ProblemSelectionPage.tsx # 题目选择页
│   ├── ProblemSolvingPage.tsx   # 题目解答页
│   └── ProfilePage.tsx         # 个人资料页
├── App.tsx            # 主应用组件
└── main.tsx           # 应用入口点
```

## 必要 vscode 插件

为了增加项目代码的可读性,建议安装 vscode 的插件  
1.**Btter Comments**(用于丰富注释形式):
并在 setting.json 中添加以下配置:

```json
"better-comments.tags": [
    {
      "tag": "!",
      "color": "rgba(201, 169, 25, 1)",
      "strikethrough": false,
      "underline": false,
      "backgroundColor": "transparent",
      "bold": true,
      "italic": false
    },
    {
      "tag": ">",
      "color": "#3498DB",
      "strikethrough": false,
      "underline": true,
      "backgroundColor": "transparent",
      "bold": false,
      "italic": false
    },
    {
      "tag": "/",
      "color": "#474747",
      "strikethrough": true,
      "underline": false,
      "backgroundColor": "transparent",
      "bold": false,
      "italic": false
    },

    {
      "tag": "*",
      "color": "#98C379",
      "strikethrough": false,
      "underline": false,
      "backgroundColor": "transparent",
      "bold": false,
      "italic": false
    },
    {
      "tag": "-",
      "color": "rgba(21, 215, 170, 0.7)",
      "strikethrough": false, // 是否有删除线
      "underline": false, // 是否有下划线
      "backgroundColor": "transparent",
      "bold": true, // 是都加粗
      "italic": false // 是都斜体
    },
    {
      "tag": "#",
      "color": "rgba(165, 84, 40, 1)",
      "strikethrough": false, // 是否有删除线
      "underline": false, // 是否有下划线
      "backgroundColor": "transparent",
      "bold": true, // 是都加粗
      "italic": false // 是都斜体
    }

```

2.**Color Highlight**(用于高亮注释颜色)

## 项目解释:

这个项目是提供计算机类大学生刷题的网站项目,我们在网页上提供了一些题目,用户可以登录后进行刷题,并且可以查看自己的做题记录,以及一些统计信息。并提供了 Ai 生成题目自动检查答案的功能。
---

## 工作流

### 1.下载git 
![alt text](流程照片/git_download.png)

[流程](https://blog.csdn.net/mukes/article/details/115693833)

### 2.fork项目
1.
![alt text](流程照片/fork1.png)
> 这里点击进行fork
2.
![alt text](流程照片/fork2.png)
> 将项目fork到自己的仓库

### 3.下载项目到本地文件夹

1.![alt text](流程照片/download.png)
> 点击克隆或者下载


### 4.将修改后的代码提交到自己账号上的仓库里面
1. 在vscode 里面"ctrl+j"打开终端打开git bash

2. 将本地仓库与远端仓库链接
![alt text](流程照片/链接.png)

- 使用下面的命令将本地仓库与远端仓库链接 

```sh
git remote add origin https://github.com/your_username/your_repo.git
```

3. 提交修改

```
git add .
git commit -m "your commit message"
git push origin main
```

---
# 后端
# 教育网站后端服务

这是一个基于Node.js和Express的教育网站后端服务，使用MySQL作为数据库。

## 环境要求

- Node.js (版本 14 或更高)
- MySQL (版本 5.7 或更高)
- npm 或 yarn

## 安装步骤

1. 安装依赖包：
   ```
   cd backend
   npm install
   ```

2. 配置环境变量：
   - 复制 `.env` 文件（已创建）
   - 修改 `.env` 文件中的数据库连接信息：
     ```
     DB_HOST=localhost
     DB_USER=你的MySQL用户名
     DB_PASSWORD=你的MySQL密码
     DB_NAME=education_web
     ```

3. 初始化数据库：
   - 登录到MySQL：`mysql -u 你的用户名 -p`
   - 执行SQL脚本：`source database/init.sql;`
   或者使用MySQL Workbench等工具导入 `database/init.sql` 文件

## 启动服务

1. 开发模式（自动重启）：
   ```
   npm run dev
   ```

2. 生产模式：
   ```
   npm start
   ```

服务默认运行在 http://localhost:3001

## API 端点

### 认证相关

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 课程相关

- `GET /api/courses` - 获取所有课程
- `GET /api/courses/:id` - 获取特定课程详情
- `POST /api/courses` - 创建新课程（需要教师或管理员权限）
- `POST /api/courses/:id/contents` - 添加课程内容
- `POST /api/courses/:id/enroll` - 用户加入课程
- `PUT /api/courses/:id/progress` - 更新用户学习进度

### 用户相关

- `GET /api/users/:id` - 获取用户信息
- `GET /api/users/:id/courses` - 获取用户的课程列表
- `GET /api/users/:id/courses/:courseId/progress` - 获取用户在特定课程中的学习进度

## 项目结构

```
backend/
├── config/
│   └── database.js         # 数据库连接配置
├── database/
│   └── init.sql           # 数据库初始化脚本
├── routes/
│   ├── auth.js            # 认证相关路由
│   ├── courses.js         # 课程相关路由
│   └── users.js           # 用户相关路由
├── .env                   # 环境变量配置
├── package.json           # 项目依赖和脚本
├── server.js              # 主服务器
└── README.md              # 项目文档
```

## 注意事项

1. 确保MySQL服务正在运行
2. 确保在.env文件中正确配置了数据库连接信息
3. 首次运行前需要执行数据库初始化脚本
4. 默认管理员账户：用户名admin，密码admin123
