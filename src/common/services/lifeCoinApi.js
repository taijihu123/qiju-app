import { get, post, put } from './request';
import { logger } from './logger';

// 生活币相关API
const lifeCoinApi = {
  /**
   * 获取生活币余额
   * @param {string} type - 类型（USER或LANDLORD）
   * @returns {Promise<number>} 生活币余额
   */
  getLifeCoinBalance: async (type = 'USER') => {
    try {
      const response = await get('/life-coin/balance', { type });
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.msg || '获取生活币余额失败');
      }
    } catch (error) {
      logger.error('获取生活币余额失败:', error);
      throw error;
    }
  },

  /**
   * 增加生活币
   * @param {number} amount - 增加数量
   * @param {string} type - 类型（USER或LANDLORD）
   * @param {string} reason - 增加原因
   * @param {number} [businessId] - 相关业务ID
   * @param {string} [businessType] - 业务类型
   * @returns {Promise<object>} 更新后的生活币信息
   */
  addLifeCoin: async (amount, type = 'USER', reason, businessId = null, businessType = null) => {
    try {
      const response = await post('/life-coin/add', { 
        amount, 
        type, 
        reason, 
        businessId, 
        businessType 
      });
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.msg || '增加生活币失败');
      }
    } catch (error) {
      logger.error('增加生活币失败:', error);
      throw error;
    }
  },

  /**
   * 扣除生活币
   * @param {number} amount - 扣除数量
   * @param {string} type - 类型（USER或LANDLORD）
   * @param {string} reason - 扣除原因
   * @param {number} [businessId] - 相关业务ID
   * @param {string} [businessType] - 业务类型
   * @returns {Promise<object>} 更新后的生活币信息
   */
  deductLifeCoin: async (amount, type = 'USER', reason, businessId = null, businessType = null) => {
    try {
      const response = await post('/life-coin/deduct', { 
        amount, 
        type, 
        reason, 
        businessId, 
        businessType 
      });
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.msg || '扣除生活币失败');
      }
    } catch (error) {
      logger.error('扣除生活币失败:', error);
      throw error;
    }
  },

  /**
   * 获取生活币记录
   * @param {number} [page=1] - 页码
   * @param {number} [size=10] - 每页数量
   * @returns {Promise<object>} 生活币记录分页列表
   */
  getLifeCoinRecords: async (page = 1, size = 10) => {
    try {
      const response = await get('/life-coin/records', { page, size });
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.msg || '获取生活币记录失败');
      }
    } catch (error) {
      logger.error('获取生活币记录失败:', error);
      throw error;
    }
  },

  /**
   * 根据操作类型获取生活币记录
   * @param {string} type - 操作类型（EARN或SPEND）
   * @param {number} [page=1] - 页码
   * @param {number} [size=10] - 每页数量
   * @returns {Promise<object>} 生活币记录分页列表
   */
  getLifeCoinRecordsByType: async (type, page = 1, size = 10) => {
    try {
      const response = await get('/life-coin/records/type', { type, page, size });
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.msg || '获取生活币记录失败');
      }
    } catch (error) {
      logger.error('获取生活币记录失败:', error);
      throw error;
    }
  },

  /**
   * 根据时间范围获取生活币记录
   * @param {string} startTime - 开始时间
   * @param {string} endTime - 结束时间
   * @param {number} [page=1] - 页码
   * @param {number} [size=10] - 每页数量
   * @returns {Promise<object>} 生活币记录分页列表
   */
  getLifeCoinRecordsByTimeRange: async (startTime, endTime, page = 1, size = 10) => {
    try {
      const response = await get('/life-coin/records/time-range', { startTime, endTime, page, size });
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.msg || '获取生活币记录失败');
      }
    } catch (error) {
      logger.error('获取生活币记录失败:', error);
      throw error;
    }
  },
};

export default lifeCoinApi;
