const lotteryService = require('../services/lottery');
const path = require('path');
const fs = require('fs');

class LotteryController {
  // 获取最新一期开奖结果
  async getLatest(req, res) {
    try {
      const { type = 'ssq' } = req.query;
      const result = await lotteryService.getLatest(type);
      res.json(result);
    } catch (error) {
      console.error('获取最新开奖结果失败:', error);
      res.status(500).json({ error: '获取最新开奖结果失败' });
    }
  }
  
  // 查询开奖记录
  async getRecords(req, res) {
    try {
      const { type = 'ssq', startDate, endDate, page = 1, pageSize } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ error: '请提供起止日期' });
      }
      
      const result = await lotteryService.getRecords(
        type, 
        startDate, 
        endDate, 
        parseInt(page, 10), 
        parseInt(pageSize, 10) || undefined
      );
      
      res.json(result);
    } catch (error) {
      console.error('查询开奖记录失败:', error);
      res.status(500).json({ error: '查询开奖记录失败' });
    }
  }
  
  // 导出Excel
  async exportRecords(req, res) {
    try {
      const { type = 'ssq', startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ error: '请提供起止日期' });
      }
      
      const filename = await lotteryService.exportRecords(type, startDate, endDate);
      
      // 设置响应头
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(filename)}`);
      
      // 发送文件
      const filePath = path.join(__dirname, '../', filename);
      const fileStream = fs.createReadStream(filePath);
      
      fileStream.pipe(res).on('finish', () => {
        // 删除临时文件
        fs.unlink(filePath, (err) => {
          if (err) console.error('删除临时文件失败:', err);
        });
      });
    } catch (error) {
      console.error('导出Excel失败:', error);
      res.status(500).json({ error: '导出Excel失败' });
    }
  }
  
  // 获取彩种列表
  async getTypes(req, res) {
    try {
      const types = lotteryService.getLotteryTypes();
      res.json(types);
    } catch (error) {
      console.error('获取彩种列表失败:', error);
      res.status(500).json({ error: '获取彩种列表失败' });
    }
  }
}

module.exports = new LotteryController();
