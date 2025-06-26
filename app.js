const express = require('express');
const path = require('path');
const cors = require('cors');
const config = require('./config');
const lotteryRouter = require('./routes/lottery');
const lotteryService = require('./services/lottery');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/lottery', lotteryRouter);

app.get('/', async (req, res) => {
  try {
    const latest = await lotteryService.getLatest('ssq');
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

app.listen(config.port, () => {
  console.log(`彩票开奖查询服务已启动，监听端口 ${config.port}`);
});
