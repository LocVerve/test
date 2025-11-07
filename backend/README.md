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
