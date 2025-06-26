module.exports = {
  port: 3000,
  lotteryApi: 'http://www.cwl.gov.cn/cwl_admin/front/cwlkj/search/kjxx/findDrawNotice',
  latestApi: 'http://www.cwl.gov.cn/cwl_admin/front/cwlkj/search/kjxx/findRecentDrawNotice',
  pageSize: 10,
  maxExportSize: 1000,
  lotteryTypes: {
    'ssq': { name: '双色球', prizeName: '一等奖' },
    'dlt': { name: '大乐透', prizeName: '一等奖' },
    'qlc': { name: '七乐彩', prizeName: '一等奖' },
    '3d': { name: '福彩3D', prizeName: '直选奖' },
    'qxc': { name: '七星彩', prizeName: '一等奖' }
  }
};
