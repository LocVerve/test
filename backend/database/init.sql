-- 删除现有数据库（如果存在）
DROP DATABASE IF EXISTS education_web;

-- 创建新数据库
CREATE DATABASE education_web;

-- 使用数据库
USE education_web;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'teacher', 'admin') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入用户数据（密码是明文）
INSERT INTO users (id, username, email, password, role) VALUES
(1, 'wuyu', 'wuyu@xaut.edu.cn', '123401', 'student'),
(2, 'tolei', 'tolei@xaut.edu.cn', '345601', 'student'),
(3, 'zhangsan', 'zhangsan@xaut.edu.cn', '789001', 'student'),
(4, 'lisi', 'lisi@xaut.edu.cn', '318301', 'student');

-- 创建问题表
CREATE TABLE IF NOT EXISTS problems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
  category VARCHAR(100) NOT NULL,
  tags JSON,
  completed BOOLEAN DEFAULT FALSE,
  bookmarked BOOLEAN DEFAULT FALSE,
  通过率 DECIMAL(5,2),
  template ENUM('coding', 'multiple-choice', 'essay') NOT NULL,
  content TEXT,
  sample_code TEXT,
  test_cases JSON,
  options JSON,
  correct_answer VARCHAR(255),
  expected_length INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 插入问题数据（修复JSON格式）
-- 问题1：两数之和
INSERT INTO problems (id, title, difficulty, category, tags, completed, bookmarked, 通过率, template, content, sample_code) 
VALUES (1, '两数之和', 'easy', '数据结构', '["数组", "哈希表", "双指针"]', TRUE, FALSE, 45.6, 'coding', 
'给定一个整数数组 nums 和一个目标值 target，请你在该数组中找出和为目标值的那两个整数，并返回它们的数组下标。你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。', 
'function twoSum(nums, target) {
  // 在此编写代码
  return [];
}');

-- 添加测试用例
UPDATE problems SET test_cases = JSON_ARRAY(
  JSON_OBJECT('input', '[2,7,11,15],9', 'output', '[0,1]'),
  JSON_OBJECT('input', '[3,2,4],6', 'output', '[1,2]')
) WHERE id = 1;

-- 问题2：JavaScript基础
INSERT INTO problems (id, title, difficulty, category, tags, completed, bookmarked, 通过率, template, content, options, correct_answer) 
VALUES (2, 'JavaScript基础', 'easy', '前端开发', '["JavaScript", "基础语法"]', TRUE, FALSE, 32.5, 'multiple-choice', 
'以下哪个不是JavaScript的基本数据类型？', 
'["Number", "String", "Array", "Boolean"]', 'Array');

-- 问题3：React Hooks理解
INSERT INTO problems (id, title, difficulty, category, tags, completed, bookmarked, 通过率, template, content, expected_length) 
VALUES (3, 'React Hooks理解', 'medium', '前端开发', '["React", "Hooks"]', FALSE, FALSE, 28.3, 'essay', 
'请简述React Hooks的优势，并举例说明useState和useEffect的使用场景。', 500);

-- 问题5：字符串相乘
INSERT INTO problems (id, title, difficulty, category, tags, completed, bookmarked, 通过率, template, content, sample_code) 
VALUES (5, '字符串相乘', 'medium', '字符串', '["字符串", "数学"]', FALSE, FALSE, 35.7, 'coding', 
'给定两个以字符串形式表示的非负整数 num1 和 num2，返回 num1 和 num2 的乘积，它们的乘积也表示为字符串形式。', 
'function multiply(num1, num2) {
  // 在此编写代码
  return "0";
}');

-- 添加测试用例
UPDATE problems SET test_cases = JSON_ARRAY(
  JSON_OBJECT('input', '"2","3"', 'output', '"6"'),
  JSON_OBJECT('input', '"123","456"', 'output', '"56088"')
) WHERE id = 5;

-- 问题6：最长回文子串
INSERT INTO problems (id, title, difficulty, category, tags, completed, bookmarked, 通过率, template, content, sample_code) 
VALUES (6, '最长回文子串', 'medium', '字符串', '["字符串", "动态规划"]', FALSE, FALSE, 31.8, 'coding', 
'给定一个字符串 s，找到 s 中最长的回文子串。你可以假设 s 的最大长度为 1000。', 
'function longestPalindrome(s) {
  // 在此编写代码
  return "";
}');

-- 添加测试用例
UPDATE problems SET test_cases = JSON_ARRAY(
  JSON_OBJECT('input', '"babad"', 'output', '"bab"'),
  JSON_OBJECT('input', '"cbbd"', 'output', '"bb"')
) WHERE id = 6;

-- 问题7：正则表达式匹配
INSERT INTO problems (id, title, difficulty, category, tags, completed, bookmarked, 通过率, template, content, sample_code) 
VALUES (7, '正则表达式匹配', 'hard', '字符串', '["字符串", "动态规划"]', TRUE, FALSE, 27.6, 'coding', 
'给你一个字符串 s 和一个字符规律 p，请你来实现一个支持 "." 和 "*" 的正则表达式匹配。', 
'function isMatch(s, p) {
  // 在此编写代码
  return false;
}');

-- 添加测试用例
UPDATE problems SET test_cases = JSON_ARRAY(
  JSON_OBJECT('input', '"aa","a"', 'output', 'false'),
  JSON_OBJECT('input', '"aa","a*"', 'output', 'true')
) WHERE id = 7;

-- 问题8：合并两个有序链表
INSERT INTO problems (id, title, difficulty, category, tags, completed, bookmarked, 通过率, template, content, sample_code) 
VALUES (8, '合并两个有序链表', 'easy', '链表', '["链表", "递归"]', TRUE, FALSE, 52.3, 'coding', 
'将两个升序链表合并为一个新的升序链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。', 
'function mergeTwoLists(l1, l2) {
  // 在此编写代码
  return null;
}');

-- 添加测试用例
UPDATE problems SET test_cases = JSON_ARRAY(
  JSON_OBJECT('input', '[1,2,4],[1,3,4]', 'output', '[1,1,2,3,4,4]'),
  JSON_OBJECT('input', '[]，[]', 'output', '[]')
) WHERE id = 8;

-- 问题9：计算机网络基础
INSERT INTO problems (id, title, difficulty, category, tags, completed, bookmarked, 通过率, template, content, options, correct_answer) 
VALUES (9, '计算机网络基础', 'medium', '计算机网络', '["网络协议", "TCP/IP"]', TRUE, FALSE, 40.5, 'multiple-choice', 
'以下关于TCP协议的说法，哪一个是错误的？', 
'["TCP是面向连接的协议", "TCP提供可靠的数据传输服务", "TCP是无连接的协议", "TCP提供全双工通信服务"]', 'TCP是无连接的协议');

-- 问题10：操作系统原理
INSERT INTO problems (id, title, difficulty, category, tags, completed, bookmarked, 通过率, template, content, expected_length) 
VALUES (10, '操作系统原理', 'hard', '操作系统', '["进程管理", "内存管理"]', FALSE, FALSE, 25.8, 'essay', 
'请详细解释虚拟内存的工作原理，并说明它如何提高内存利用率和程序执行效率。', 800);

-- 问题11：HTML5新特性
INSERT INTO problems (id, title, difficulty, category, tags, completed, bookmarked, 通过率, template, content, options, correct_answer) 
VALUES (11, 'HTML5新特性', 'easy', '前端开发', '["HTML5", "Web开发"]', FALSE, FALSE, 38.2, 'multiple-choice', 
'以下哪个不是HTML5新增的语义化标签？', 
'["<header>", "<section>", "<span>", "<article>"]', '<span>');

-- 问题12：Vue.js响应式原理
INSERT INTO problems (id, title, difficulty, category, tags, completed, bookmarked, 通过率, template, content, options, correct_answer) 
VALUES (12, 'Vue.js响应式原理', 'medium', '前端开发', '["Vue.js", "响应式"]', FALSE, FALSE, 29.7, 'multiple-choice', 
'Vue.js中实现数据响应式的核心技术是什么？', 
'["Object.defineProperty", "Proxy", "发布订阅模式", "以上都是"]', '以上都是');

-- 问题13：二叉树的最大深度
INSERT INTO problems (id, title, difficulty, category, tags, completed, bookmarked, 通过率, template, content, sample_code) 
VALUES (13, '二叉树的最大深度', 'easy', '数据结构', '["二叉树", "递归"]', FALSE, FALSE, 48.6, 'coding', 
'给定一个二叉树，找出其最大深度。二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。', 
'function maxDepth(root) {
  // 在此编写代码
  return 0;
}');

-- 添加测试用例
UPDATE problems SET test_cases = JSON_ARRAY(
  JSON_OBJECT('input', '[3,9,20,null,null,15,7]', 'output', '3'),
  JSON_OBJECT('input', '[1,null,2]', 'output', '2')
) WHERE id = 13;

-- 问题14：有效的括号
INSERT INTO problems (id, title, difficulty, category, tags, completed, bookmarked, 通过率, template, content, sample_code) 
VALUES (14, '有效的括号', 'easy', '数据结构', '["栈", "字符串"]', FALSE, FALSE, 42.3, 'coding', 
'给定一个只包括括号的字符串，判断字符串是否有效。', 
'function isValid(s) {
  // 在此编写代码
  return false;
}');

-- 添加测试用例
UPDATE problems SET test_cases = JSON_ARRAY(
  JSON_OBJECT('input', '"()"', 'output', 'true'),
  JSON_OBJECT('input', '()[]{}', 'output', 'true'),
  JSON_OBJECT('input', '(]', 'output', 'false')
) WHERE id = 14;

-- 问题15：数据库事务特性
INSERT INTO problems (id, title, difficulty, category, tags, completed, bookmarked, 通过率, template, content, options, correct_answer) 
VALUES (15, '数据库事务特性', 'medium', '数据库', '["事务", "ACID"]', FALSE, FALSE, 36.8, 'multiple-choice', 
'数据库事务的ACID特性中，C代表什么？', 
'["一致性(Consistency)", "并发性(Concurrency)", "连续性(Continuity)", "复杂性(Complexity)"]', '一致性(Consistency)');

-- 创建用户问题关联表（记录用户完成的问题和收藏的问题）
CREATE TABLE IF NOT EXISTS user_problems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  problem_id INT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  bookmarked BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_problem (user_id, problem_id)
);

-- 添加用户完成的问题记录
INSERT INTO user_problems (user_id, problem_id, completed, bookmarked, completed_at) VALUES
(1, 1, TRUE, FALSE, NOW()),
(1, 2, TRUE, FALSE, NOW()),
(1, 7, TRUE, FALSE, NOW()),
(1, 8, TRUE, FALSE, NOW()),
(1, 9, TRUE, FALSE, NOW());
