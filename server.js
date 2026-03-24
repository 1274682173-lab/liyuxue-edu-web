const OpenAI = require('openai');
const express = require('express');
const mysql = require('mysql');
const path = require('path');

const app = express();
const PORT = 3000;

// 解析 JSON 和 URL 编码
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 提供静态文件（直接提供当前目录下的所有文件）
app.use(express.static(__dirname));  // __dirname 就是 D:\liyuxueeduweb

// 创建 MySQL 连接池（请修改密码）
const pool = mysql.createPool({
    host: 'localhost',
    user: 'USSRDog',
    password: 'wenxin123YU',  // ⚠️ 改成你自己的密码
    database: 'phone_db',
    connectionLimit: 10
});

// 创建通义千问客户端（使用 OpenAI 兼容接口）
const client = new OpenAI({
  apiKey: 'sk-5214e04cff4d4ed78322dbd4041c1572',  // 替换成你从阿里云获取的 API Key
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',  // 通义千问接口地址
});

// 处理手机号提交的 API
app.post('/api/phone', (req, res) => {
    const { phone } = req.body;

    if (!phone || !/^1[0-9]{10}$/.test(phone)) {
        return res.status(400).json({ error: '手机号格式不正确，请输入11位手机号' });
    }

    pool.query('INSERT INTO phones (phone) VALUES (?)', [phone], (err, result) => {
        if (err) {
            console.error('数据库错误:', err);
            return res.status(500).json({ error: '保存失败，请稍后重试' });
        }
        res.json({ success: true, message: '提交成功' });
    });
});
// 创建通义千问客户端（使用 OpenAI 兼容接口）
// 辅助函数：判断是否为有效手机号
function isValidPhone(phone) {
  return /^1[0-9]{10}$/.test(phone);
}

// AI 客服对话接口
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: '请输入消息' });
  }

  // 1. 提取用户消息中的手机号
  const phoneMatch = message.match(/(1[0-9]{10})/);
  if (phoneMatch) {
    const phone = phoneMatch[1];
    if (isValidPhone(phone)) {
      // 2. 将手机号保存到数据库（使用 INSERT IGNORE 避免重复）
      pool.query(
        'INSERT IGNORE INTO phones (phone) VALUES (?)',
        [phone],
        (err, result) => {
          if (err) console.error('保存手机号失败:', err);
          else if (result.affectedRows > 0) {
            console.log(`通过AI对话收集到手机号: ${phone}`);
          }
        }
      );
    }
  }

  // 3. 正常调用AI回复
  try {
    const completion = await client.chat.completions.create({
      model: 'qwen-turbo',
      messages: [
        {
          role: 'system',
          content: `你是一个专业K12教育机构和老年大学的在线客服助手。任何问题你都要尽量靠近问询用户的手机号。如果用户向你提供了手机号，你只需要简单回复“收到，我们会尽快联系您”，不要重复手机号。其他问题正常回答。`
        },
        { role: 'user', content: message }
      ],
      temperature: 0.8,
      max_tokens: 500
    });
    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('AI错误:', error);
    res.status(500).json({ error: '服务繁忙，请稍后再试' });
  }
});
// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器已启动：http://localhost:${PORT}`);
    console.log(`请访问：http://localhost:${PORT}/index.html`);
});