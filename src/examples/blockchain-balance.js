// Trae 前端示例代码 - 改进版

/**
 * 获取区块链地址余额
 * @param {string} address - 区块链地址
 * @returns {Promise<number|null>} 地址余额，如果出错返回null
 */
async function getBalance(address) {
  // 输入验证
  if (!address || typeof address !== 'string' || address.length < 20) {
    console.error('无效的地址参数');
    return null;
  }

  try {
    // 修复引号问题，使用正确的URL格式
    const url = `http://8.159.143.90:3000/api/balance/${address}`;
    
    // 发送API请求
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }

    // 解析响应数据
    const data = await response.json();
    
    // 数据验证
    if (!data || typeof data.balance === 'undefined') {
      throw new Error('无效的响应数据格式');
    }

    console.log('余额查询成功:', data);
    return parseFloat(data.balance);
  } catch (error) {
    console.error('获取余额失败:', error.message);
    return null;
  }
}

// 调用示例
(async () => {
  console.log('开始查询余额...');
  const address = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  const balance = await getBalance(address);
  
  if (balance !== null) {
    console.log(`地址 ${address} 的余额为: ${balance}`);
  } else {
    console.log('余额查询失败');
  }
})();
