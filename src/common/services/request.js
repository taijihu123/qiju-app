import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_API, isDev } from '../../config/env';
import apiSignature from '../../common/utils/apiSignature';

const API_BASE_URL = BASE_API;

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

// 公开接口列表，这些接口不需要Token认证
const publicEndpoints = [
  '/auth/register',
  '/auth/login',
  '/auth/forgot-password',
  '/auth/reset-password'
];

// 设置请求拦截器
instance.interceptors.request.use(
  async (config) => {
    console.log('\n🔍 请求拦截器被调用:', config.url);
    
    // 检查当前请求的URL是否是公开接口
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url.startsWith(endpoint)
    );
    
    // 特别确认 /users/me 请求是否需要授权
    const isUsersMeRequest = config.url === '/users/me';
    console.log('🔍 公开接口检查:', {
      url: config.url,
      isPublicEndpoint: isPublicEndpoint,
      isUsersMeRequest: isUsersMeRequest,
      needsAuthorization: !isPublicEndpoint
    });
    
    // 只有非公开接口才需要添加Token
    if (!isPublicEndpoint) {
      console.log('🔍 非公开接口，准备获取Token');
      const token = await AsyncStorage.getItem('token');
      console.log('🔍 从AsyncStorage获取到Token:', token ? `Bearer ${token.substring(0, 10)}...` : '不存在');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('🔍 Token已添加到Authorization头');
      } else {
        console.error('🔍 ERROR: 无法从AsyncStorage获取到Token');
        // 抛出错误，让调用者知道需要登录
        const error = new Error('未登录或登录已过期，请重新登录');
        error.name = 'AuthError';
        error.status = 401;
        error.isAuthError = true;
        return Promise.reject(error);
      }
    }
    
    // 临时禁用API签名验证，测试是否是签名导致的403错误
    console.log('🔍 临时禁用API签名验证');
    // 注释掉签名生成代码，直接发送请求
    // try {
    //   // 生成时间戳
    //   const timestamp = Date.now().toString();
    //   config.headers['X-API-Timestamp'] = timestamp;
    //   console.log('🔍 添加X-API-Timestamp请求头:', timestamp);
    //   
    //   // 构建请求数据
    //   const requestData = apiSignature.buildRequestData(config);
    //   console.log('🔍 构建的请求数据:', requestData);
    //   
    //   // 生成API签名（同步方法）
    //   const signature = apiSignature.generateTimestampedSignature(requestData, timestamp);
    //   config.headers['X-API-Signature'] = signature;
    //   console.log('🔍 添加X-API-Signature请求头:', signature);
    // } catch (error) {
    //   console.error('API签名生成失败:', error);
    //   // 签名生成失败不影响请求继续发送
    // }
    
    // 打印最终请求头，用于调试
    console.log('🔍 最终请求头:', {
      'X-API-Timestamp': config.headers['X-API-Timestamp'],
      'X-API-Signature': config.headers['X-API-Signature'],
      'Authorization': config.headers['Authorization'],
      'Content-Type': config.headers['Content-Type']
    });
    
    // 开发环境下打印详细的请求日志
    if (isDev) {
      console.log('\n🚀 API Request:', {
        method: config.method.toUpperCase(),
        url: `${config.baseURL}${config.url}`,
        params: config.params || {},
        data: config.data || {},
        headers: {
          ...config.headers,
          // 隐藏敏感信息
          Authorization: config.headers.Authorization ? 'Bearer [REDACTED]' : undefined,
          'X-API-Signature': config.headers['X-API-Signature'] ? '[PROVIDED]' : '[MISSING]'
        }
      });
      // 打印更详细的登录请求参数日志
      if (config.url === '/auth/login') {
        console.log('\n🔐 Login Request Parameters:', {
          username: config.data.username ? config.data.username : '[MISSING]',
          password: config.data.password ? config.data.password : '[MISSING]',
          hasUsername: !!config.data.username,
          hasPassword: !!config.data.password
        });
      }
    }
    
    return config;
  },
  (error) => {
    // 开发环境下打印请求错误日志
    if (isDev) {
      console.error('\n❌ API Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// 设置响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 开发环境下打印详细的响应日志
    if (isDev) {
      console.log('\n✅ API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    // 开发环境下打印详细的错误日志
    if (isDev) {
      console.error('\n❌ API Response Error:', {
        status: error.response?.status || 'Network Error',
        statusText: error.response?.statusText || 'Network Error',
        url: error.config?.url,
        data: error.response?.data || error.message,
        headers: error.response?.headers
      });
    }
    
    // 处理不同类型的错误，提供友好的错误提示
    let errorMessage = '网络请求失败，请稍后重试';
    
    if (error.response?.status === 401) {
      errorMessage = '登录已过期，请重新登录';
      // 可以在这里添加自动登出逻辑
    } else if (error.response?.status === 404) {
      errorMessage = '请求的资源不存在';
    } else if (error.response?.status === 500) {
      errorMessage = '服务器内部错误，请稍后重试';
    } else if (error.response?.data?.msg) {
      errorMessage = error.response.data.msg;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // 创建一个新的错误对象，包含友好的错误提示
    const newError = new Error(errorMessage);
    newError.originalError = error;
    newError.status = error.response?.status;
    // 添加认证错误标记
    if (error.response?.status === 401 || error.name === 'AuthError' || errorMessage.includes('未登录') || errorMessage.includes('登录已过期')) {
      newError.isAuthError = true;
      newError.name = 'AuthError';
    }
    
    return Promise.reject(newError);
  }
);

export const request = instance;
export { instance };

export const get = (url, params = {}) => instance.get(url, { params });
export const post = (url, data = {}) => instance.post(url, data);
export const put = (url, data = {}) => instance.put(url, data);
export const del = (url) => instance.delete(url);