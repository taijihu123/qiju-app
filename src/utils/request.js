import axios from 'axios';

// 创建独立的 axios 实例
const api = axios.create({
  baseURL: 'https://your-api-domain.com', // 替换成你的后端地址
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 添加响应拦截器
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 || error.message.includes('未登录或登录已过期')) {
      // 网页端跳转
      window.location.href = '/login';
      // 如果是 React Native，用导航跳转：navigation.navigate('Login');
    }
    return Promise.reject(error);
  }
);

export default api;
