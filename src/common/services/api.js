import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:5001/api';

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

// 公开接口列表
const publicEndpoints = [
  '/auth/register',
  '/auth/login',
  '/auth/forgot-password',
  '/auth/reset-password'
];

// 请求拦截器
instance.interceptors.request.use(
  async (config) => {
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url.startsWith(endpoint)
    );
    
    if (!isPublicEndpoint) {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let errorMessage = '网络请求失败，请稍后重试';
    
    if (error.response?.status === 401) {
      errorMessage = '登录已过期，请重新登录';
    } else if (error.response?.status === 404) {
      errorMessage = '请求的资源不存在';
    } else if (error.response?.status === 500) {
      errorMessage = '服务器内部错误，请稍后重试';
    } else if (error.response?.data?.msg) {
      errorMessage = error.response.data.msg;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    const newError = new Error(errorMessage);
    newError.originalError = error;
    newError.status = error.response?.status;
    
    return Promise.reject(newError);
  }
);

// API 服务
export const api = {
  // 基础请求方法
  get: (url, params = {}) => instance.get(url, { params }),
  post: (url, data = {}) => instance.post(url, data),
  put: (url, data = {}) => instance.put(url, data),
  delete: (url) => instance.delete(url),
  
  // 栖居业务
  qiju: {
    getShops: () => instance.get('/qiju/shop/list'),
    createOrder: (data) => instance.post('/qiju/order/create', data),
    getMemberProfile: (userId) => instance.get('/qiju/member/profile', { params: { user_id: userId } }),
    getShareholderStatus: (userId) => instance.get('/qiju/shareholder/status', { params: { user_id: userId } }),
  },
  
  // 知识库
  knowledge: {
    search: (query, topK = 5) => instance.post('/knowledge/search', { query, top_k: topK }),
    add: (content, metadata = {}) => instance.post('/knowledge/add', { content, metadata }),
    delete: (docId) => instance.delete('/knowledge/delete', { data: { doc_id: docId } }),
    getStats: () => instance.get('/knowledge/stats'),
  },
  
  // 钱包
  wallet: {
    getBalance: (userId) => instance.get('/wallet/balance', { params: { user_id: userId } }),
    transfer: (fromUserId, toUserId, amount) => instance.post('/wallet/transfer', { from_user_id: fromUserId, to_user_id: toUserId, amount }),
    getHistory: (userId) => instance.get('/wallet/history', { params: { user_id: userId } }),
    reward: (userId, amount, reason) => instance.post('/wallet/reward', { user_id: userId, amount, reason }),
  },
  
  // 评估
  assessment: {
    start: (userId, assessmentType) => instance.post('/assessment/start', { user_id: userId, assessment_type: assessmentType }),
    submit: (assessmentId, answers) => instance.post('/assessment/submit', { assessment_id: assessmentId, answers }),
    getHistory: (userId) => instance.get('/assessment/history', { params: { user_id: userId } }),
    getReport: (assessmentId) => instance.get('/assessment/report', { params: { assessment_id: assessmentId } }),
  },
};