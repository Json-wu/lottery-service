const XLSX = require('xlsx');

function exportToExcel(data, filename = '彩票开奖记录.xlsx') {
  const wsData = [
    ['期号', '开奖日期', '开奖号码', '蓝球号码', '奖池金额', '总投注额', '一等奖注数', '一等奖奖金', '二等奖注数', '二等奖奖金'],
    ...data.map(item => [
      item.issue,
      item.date,
      item.numbers.join(','),
      item.blueNumbers.join(','),
      item.poolAmount,
      item.totalSales,
      item.prize1Count,
      item.prize1Amount,
      item.prize2Count,
      item.prize2Amount
    ])
  ];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '开奖记录');
  XLSX.writeFile(wb, filename);
  return filename;
}

module.exports = { exportToExcel };
