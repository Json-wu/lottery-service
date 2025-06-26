const express = require('express');
const router = express.Router();
const lotteryController = require('../controllers/lottery');

// 获取最新一期开奖结果
router.get('/latest', lotteryController.getLatest);

// 获取彩种列表
router.get('/types', lotteryController.getTypes);

// 获取开奖记录
router.get('/records', lotteryController.getRecords);

// 导出Excel
router.get('/export', lotteryController.exportRecords);

module.exports = router;
