const express = require('express');
const db = require('../config/database');
const { parseJSONFields, parseJSONFieldsInArray, errorHandler } = require('../utils/helpers');
const router = express.Router();

// 获取所有问题
router.get('/', async (req, res) => {
  try {
    const { difficulty, category, tags } = req.query;

    let query = 'SELECT * FROM problems WHERE 1=1';
    const params = [];

    // 添加筛选条件
    if (difficulty) {
      query += ' AND difficulty = ?';
      params.push(difficulty);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query += ' AND (';
      for (let i = 0; i < tagArray.length; i++) {
        if (i > 0) query += ' OR ';
        query += 'JSON_CONTAINS(tags, ?)';
        params.push(`"${tagArray[i]}"`);
      }
      query += ')';
    }

    query += ' ORDER BY id';

    const [problems] = await db.execute(query, params);

    // 转换JSON字段
    parseJSONFieldsInArray(problems, ['tags', 'test_cases', 'options']);

    res.json(problems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取特定问题详情
router.get('/:id', async (req, res) => {
  try {
    const problemId = req.params.id;

    const [problems] = await db.execute('SELECT * FROM problems WHERE id = ?', [problemId]);

    if (problems.length === 0) {
      return res.status(404).json({ message: '问题不存在' });
    }

    const problem = problems[0];

    // 转换JSON字段
    parseJSONFields(problem, ['tags', 'test_cases', 'options']);

    res.json(problem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 更新用户问题状态（完成/收藏）
router.put('/:id/status', async (req, res) => {
  try {
    const problemId = req.params.id;
    const { user_id, completed, bookmarked } = req.body;

    // 检查是否存在记录
    const [existing] = await db.execute(
      'SELECT id FROM user_problems WHERE user_id = ? AND problem_id = ?',
      [user_id, problemId]
    );

    if (existing.length > 0) {
      // 更新现有记录
      // 确保参数不为undefined，如果是undefined则使用null
      const completedValue = completed !== undefined ? completed : null;
      const bookmarkedValue = bookmarked !== undefined ? bookmarked : null;
      
      await db.execute(
        'UPDATE user_problems SET completed = ?, bookmarked = ?, completed_at = IF(?, NOW(), completed_at) WHERE user_id = ? AND problem_id = ?',
        [completedValue, bookmarkedValue, completedValue, user_id, problemId]
      );
    } else {
      // 创建新记录
      // 确保参数不为undefined，如果是undefined则使用null
      const completedValue = completed !== undefined ? completed : null;
      const bookmarkedValue = bookmarked !== undefined ? bookmarked : null;
      
      // 使用INSERT ON DUPLICATE KEY UPDATE避免并发问题
      await db.execute(
        `INSERT INTO user_problems (user_id, problem_id, completed, bookmarked, completed_at) 
         VALUES (?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE 
         completed = VALUES(completed), 
         bookmarked = VALUES(bookmarked), 
         completed_at = IF(VALUES(completed), NOW(), completed_at)`,
        [user_id, problemId, completedValue, bookmarkedValue, completedValue ? new Date() : null]
      );
    }

    // 获取更新后的题目信息
    const [updatedProblem] = await db.execute(
      'SELECT p.*, up.completed, up.bookmarked FROM problems p JOIN user_problems up ON p.id = up.problem_id WHERE up.user_id = ? AND up.problem_id = ?',
      [user_id, problemId]
    );
    
    if (updatedProblem.length > 0) {
      // 转换JSON字段
      parseJSONFieldsInArray(updatedProblem, ['tags']);
      res.json(updatedProblem[0]);
    } else {
      res.status(404).json({ message: '题目未找到' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取用户问题状态
router.get('/:id/status/:userId', async (req, res) => {
  try {
    const problemId = req.params.id;
    const userId = req.params.userId;

    const [status] = await db.execute(
      'SELECT completed, bookmarked, completed_at FROM user_problems WHERE user_id = ? AND problem_id = ?',
      [userId, problemId]
    );

    if (status.length === 0) {
      return res.json({ completed: false, bookmarked: false });
    }

    res.json(status[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取用户完成的问题列表
router.get('/user/:userId/completed', async (req, res) => {
  try {
    const userId = req.params.userId;

    const [problems] = await db.execute(`
      SELECT p.* 
      FROM problems p
      JOIN user_problems up ON p.id = up.problem_id
      WHERE up.user_id = ? AND up.completed = TRUE
      ORDER BY up.completed_at DESC
    `, [userId]);

    // 转换JSON字段
    parseJSONFieldsInArray(problems, ['tags']);

    res.json(problems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

// 获取用户收藏的问题列表
router.get('/user/:userId/bookmarked', async (req, res) => {
  try {
    const userId = req.params.userId;

    const [problems] = await db.execute(`
      SELECT p.* 
      FROM problems p
      JOIN user_problems up ON p.id = up.problem_id
      WHERE up.user_id = ? AND up.bookmarked = TRUE
      ORDER BY p.id
    `, [userId]);

    // 转换JSON字段
    parseJSONFieldsInArray(problems, ['tags']);

    res.json(problems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '服务器错误' });
  }
});

module.exports = router;
