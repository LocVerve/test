
// 数据库查询工具函数
const db = require('../config/database');

// 解析JSON字段
const parseJSONFields = (obj, fields) => {
  fields.forEach(field => {
    if (obj[field]) {
      try {
        obj[field] = JSON.parse(obj[field]);
      } catch (e) {
        obj[field] = [];
      }
    }
  });
  return obj;
};

// 批量解析JSON字段
const parseJSONFieldsInArray = (array, fields) => {
  return array.map(item => parseJSONFields(item, fields));
};

// 检查用户是否存在
const checkUserExists = async (userId) => {
  const [users] = await db.execute('SELECT id FROM users WHERE id = ?', [userId]);
  return users.length > 0;
};

// 检查邮箱是否已被使用
const checkEmailExists = async (email, excludeId = null) => {
  let query = 'SELECT id FROM users WHERE email = ?';
  const params = [email];

  if (excludeId) {
    query += ' AND id != ?';
    params.push(excludeId);
  }

  const [users] = await db.execute(query, params);
  return users.length > 0;
};

// 检查用户名是否已被使用
const checkUsernameExists = async (username, excludeId = null) => {
  let query = 'SELECT id FROM users WHERE username = ?';
  const params = [username];

  if (excludeId) {
    query += ' AND id != ?';
    params.push(excludeId);
  }

  const [users] = await db.execute(query, params);
  return users.length > 0;
};

// 错误处理中间件
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: '服务器错误' });
};

module.exports = {
  parseJSONFields,
  parseJSONFieldsInArray,
  checkUserExists,
  checkEmailExists,
  checkUsernameExists,
  errorHandler
};
