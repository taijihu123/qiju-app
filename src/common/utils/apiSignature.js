// API签名生成工具
// 使用HMAC-SHA256算法生成API签名

// API签名密钥（与后端保持一致）
const API_SIGNATURE_SECRET = '33750f4f0975f5bd686241b15bb85915950319bf62410116e8eb81c0db1712e3';

// 确保CryptoJS已安装
let CryptoJS;
try {
  CryptoJS = require('crypto-js');
} catch (error) {
  console.error('CryptoJS库加载失败:', error);
}

// 生成HMAC-SHA256签名
// 使用UTF-8编码确保前后端字符编码一致
const generateSignature = (data) => {
  if (!CryptoJS) {
    console.error('CryptoJS未加载，无法生成签名');
    return '';
  }
  
  try {
    // 生成HMAC-SHA256签名
    const signature = CryptoJS.HmacSHA256(data, API_SIGNATURE_SECRET);
    // 返回Base64编码的签名
    return CryptoJS.enc.Base64.stringify(signature);
  } catch (error) {
    console.error('API签名生成失败:', error);
    // 签名生成失败不影响请求继续发送，返回空字符串
    return '';
  }
};

// 生成带时间戳的API签名
const generateTimestampedSignature = (data, timestamp) => {
  const signedData = `${data}&timestamp=${timestamp}`;
  return generateSignature(signedData);
};

// 构建请求数据（与后端保持一致）
const buildRequestData = (config) => {
  const { method, url, params, data } = config;
  
  // 使用原始URL，因为baseURL已经包含了/api前缀
  let fullUrl = url;
  
  let requestData = `${method.toUpperCase()}&${fullUrl}`;
  
  // 添加请求参数（按字母顺序排序）
  if (params && Object.keys(params).length > 0) {
    const sortedParams = Object.keys(params).sort().map(key => 
      `${key}=${params[key]}`
    ).join('&');
    requestData += `&${sortedParams}`;
  }
  
  // 添加请求体
  if (data && typeof data === 'object') {
    requestData += `&body=${JSON.stringify(data)}`;
  } else if (data && typeof data === 'string') {
    requestData += `&body=${data}`;
  }
  
  return requestData;
};

export default {
  generateSignature,
  generateTimestampedSignature,
  buildRequestData
};
