const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { checkEmailExists, checkUsernameExists } = require('../utils/helpers');
const router = express.Router();

// 用户注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role = 'student' } = req.body;

    // 检查用户名和邮箱是否已存在
    const emailExists = await checkEmailExists(email);
    const usernameExists = await checkUsernameExists(username);

    if (emailExists || usernameExists) {
      return res.status(400).json({ message: '用户名或邮箱已存在' });
    }

    // 创建新用户（使用明文密码）
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, password, role]
    );

    // 返回与前端db.json格式一致的用户对象
    res.status(201).json({ 
      id: result.insertId.toString(),
      username,
      email,
      role
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 用户登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body; 

    // 查找用户
    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    const user = users[0];

    // 验证密码（简单数值比较）
    if (password !== user.password) {
      return res.status(401).json({ message: '邮箱或密码错误' });
    }

    // 生成JWT令牌
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );
    res.json({
      id: user.id.toString(),
      email: user.email,
      username: user.username,
      studentId: user.id.toString(), // 添加studentId字段，使用id的值
      role: user.role,  //- 这个字段用于区分用户角色, 如 'student' 或 'admin'  后期在前端会有具体的判断和使用逻辑
      token 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;
