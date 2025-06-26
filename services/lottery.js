const axios = require('axios');
const moment = require('moment');
const config = require('../config');
const { exportToExcel } = require('../utils/excel');

class LotteryService {
  // 获取最新一期开奖结果
  async getLatest(lotteryType = 'ssq') {
    try {
      const params = {
        name: lotteryType,
        count: 1,
        systemType: 'PC'
      };
      
      const response = await axios.get(config.latestApi, { params });
      
      if (response.data && response.data.state === 0 && response.data.result.length > 0) {
        return this._formatData(response.data.result, lotteryType)[0];
      }
      
      throw new Error('获取最新开奖结果失败');
    } catch (error) {
      console.error('获取最新开奖结果失败:', error);
      throw error;
    }
  }
  
  // 获取彩票开奖记录
  async getRecords(lotteryType, startDate, endDate, page = 1, pageSize = config.pageSize) {
    try {
      const params = {
        name: lotteryType,
        issueStart: '',
        issueEnd: '',
        dateStart: moment(startDate).format('YYYY-MM-DD'),
        dateEnd: moment(endDate).format('YYYY-MM-DD'),
        pageNo: page,
        pageSize: pageSize,
        systemType: 'PC'
      };
      
      const response = await axios.get(config.lotteryApi, { params });
      
      if (response.data && response.data.state === 0) {
        return {
          data: this._formatData(response.data.result, lotteryType),
          total: response.data.total,
          page,
          pageSize
        };
      }
      
      throw new Error('获取数据失败');
    } catch (error) {
      console.error('获取彩票数据失败:', error);
      throw error;
    }
  }
  
  // 导出Excel
  async exportRecords(lotteryType, startDate, endDate) {
    // 获取所有数据（不翻页）
    const { data } = await this.getRecords(lotteryType, startDate, endDate, 1, config.maxExportSize);
    const filename = `彩票开奖记录_${config.lotteryTypes[lotteryType].name}.xlsx`;
    exportToExcel(data, filename);
    return filename;
  }
  
  // 格式化数据
  _formatData(result, lotteryType) {
    if (!result) return [];
    
    return result.map(item => ({
      lotteryType: lotteryType,
      issue: item.code,
      date: item.date,
      numbers: item.red ? item.red.split(',') : [],
      blueNumbers: item.blue ? item.blue.split(',') : [],
      poolAmount: item.poolmoney,
      totalSales: item.sales,
      prize1Count: item.firstnum,
      prize1Amount: item.firstmoney,
      prize2Count: item.secondnum,
      prize2Amount: item.secondmoney,
      prize3Count: item.thirdnum,
      prize3Amount: item.thirdmoney
    }));
  }
  
  // 获取支持的彩种列表
  getLotteryTypes() {
    return config.lotteryTypes;
  }
}

module.exports = new LotteryService();
