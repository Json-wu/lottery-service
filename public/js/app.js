document.addEventListener('DOMContentLoaded', function() {
  const lotteryTypeSelect = document.getElementById('lotteryType');
  const queryForm = document.getElementById('queryForm');
  const exportBtn = document.getElementById('exportBtn');
  const resultsBody = document.getElementById('resultsBody');
  const pagination = document.getElementById('pagination');
  
  let currentLotteryType = lotteryTypeSelect.value;
  let currentPage = 1;
  let totalPages = 1;
  
  // 切换彩种
  lotteryTypeSelect.addEventListener('change', function() {
    currentLotteryType = this.value;
    window.location.href = `/?type=${currentLotteryType}`;
  });
  
  // 查询历史开奖
  queryForm.addEventListener('submit', function(e) {
    e.preventDefault();
    currentPage = 1;
    fetchResults();
  });
  
  // 导出Excel
  exportBtn.addEventListener('click', function() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (!startDate || !endDate) {
      alert('请选择起止日期');
      return;
    }
    
    const url = `/api/lottery/export?type=${currentLotteryType}&startDate=${startDate}&endDate=${endDate}`;
    window.open(url, '_blank');
  });
  
  // 获取查询结果
  function fetchResults() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (!startDate || !endDate) {
      alert('请选择起止日期');
      return;
    }
    
    const url = `/api/lottery/records?type=${currentLotteryType}&startDate=${startDate}&endDate=${endDate}&page=${currentPage}`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        renderResults(data.data);
        renderPagination(data.total, data.pageSize);
      })
      .catch(error => {
        console.error('获取数据失败:', error);
        alert('获取数据失败');
      });
  }
  
  // 渲染结果表格
  function renderResults(results) {
    resultsBody.innerHTML = '';
    
    if (results.length === 0) {
      resultsBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">没有找到相关开奖记录</td></tr>';
      return;
    }
    
    results.forEach(result => {
      const row = document.createElement('tr');
      
      // 期号
      const issueCell = document.createElement('td');
      issueCell.textContent = result.issue;
      row.appendChild(issueCell);
      
      // 开奖日期
      const dateCell = document.createElement('td');
      dateCell.textContent = result.date;
      row.appendChild(dateCell);
      
      // 开奖号码
      const numbersCell = document.createElement('td');
      result.numbers.forEach(num => {
        const numSpan = document.createElement('span');
        numSpan.className = 'number red';
        numSpan.textContent = num;
        numbersCell.appendChild(numSpan);
      });
      
      if (result.blueNumbers && result.blueNumbers.length > 0) {
        result.blueNumbers.forEach(num => {
          const numSpan = document.createElement('span');
          numSpan.className = 'number blue';
          numSpan.textContent = num;
          numbersCell.appendChild(numSpan);
        });
      }
      row.appendChild(numbersCell);
      
      // 奖池金额
      const poolCell = document.createElement('td');
      poolCell.textContent = result.poolAmount || '-';
      row.appendChild(poolCell);
      
      // 一等奖
      const prizeCell = document.createElement('td');
      prizeCell.textContent = `${result.prize1Count || 0}注 ${result.prize1Amount || '-'}`;
      row.appendChild(prizeCell);
      
      resultsBody.appendChild(row);
    });
  }
  
  // 渲染分页
  function renderPagination(total, pageSize) {
    pagination.innerHTML = '';
    totalPages = Math.ceil(total / pageSize);
    
    if (totalPages <= 1) return;
    
    // 上一页按钮
    if (currentPage > 1) {
      const prevBtn = document.createElement('button');
      prevBtn.textContent = '上一页';
      prevBtn.addEventListener('click', () => {
        currentPage--;
        fetchResults();
      });
      pagination.appendChild(prevBtn);
    }
    
    // 页码按钮
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.textContent = i;
      if (i === currentPage) {
        pageBtn.className = 'active';
      }
      pageBtn.addEventListener('click', () => {
        currentPage = i;
        fetchResults();
      });
      pagination.appendChild(pageBtn);
    }
    
    // 下一页按钮
    if (currentPage < totalPages) {
      const nextBtn = document.createElement('button');
      nextBtn.textContent = '下一页';
      nextBtn.addEventListener('click', () => {
        currentPage++;
        fetchResults();
      });
      pagination.appendChild(nextBtn);
    }
  }
  
  // 初始化日期为最近一个月
  function initDates() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 1);
    
    document.getElementById('startDate').valueAsDate = startDate;
    document.getElementById('endDate').valueAsDate = endDate;
  }
  
  initDates();
});
