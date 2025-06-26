const express = require('express');
const path = require('path');
const cors = require('cors');
const config = require('./config');
const lotteryRouter = require('./routes/lottery');

const app = express();

// 设置视图引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件
app.use(express.static(path.join(__dirname, 'public')));

// 路由
app.use('/api/lottery', lotteryRouter);

// 首页路由
app.get('/', async (req, res) => {
  try {
    // 获取最新一期双色球开奖结果
    const latest = await lotteryService.getLatest('ssq');
    // 获取彩种列表
    const types = lotteryService.getLotteryTypes();
    
    res.render('index', { 
      title: '彩票开奖查询系统',
      latest,
      types,
      currentType: 'ssq'
    });
  } catch (error) {
    console.error('渲染首页失败:', error);
    res.status(500).send('服务器错误');
  }
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '服务器内部错误' });
});

// 启动服务
app.listen(config.port, () => {
  console.log(`彩票开奖查询服务已启动，监听端口 ${config.port}`);
});
