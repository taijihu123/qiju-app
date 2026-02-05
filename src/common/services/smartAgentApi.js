import { get, post, put } from './request';
import { logger } from './logger';

// 智能助手相关API
const smartAgentApi = {
  /**
   * 启用智能体
   * @returns {Promise<string>} 操作结果
   */
  enableSmartAgent: async () => {
    try {
      const response = await post('/smart-agent/enable');
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.msg || '启用智能体失败');
      }
    } catch (error) {
      logger.error('启用智能体失败:', error);
      throw error;
    }
  },

  /**
   * 禁用智能体
   * @returns {Promise<string>} 操作结果
   */
  disableSmartAgent: async () => {
    try {
      const response = await post('/smart-agent/disable');
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.msg || '禁用智能体失败');
      }
    } catch (error) {
      logger.error('禁用智能体失败:', error);
      throw error;
    }
  },

  /**
   * 更新智能体偏好设置
   * @param {string} preferences - 偏好设置
   * @returns {Promise<string>} 操作结果
   */
  updateSmartAgentPreferences: async (preferences) => {
    try {
      const response = await put('/smart-agent/preferences', preferences);
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.msg || '更新偏好设置失败');
      }
    } catch (error) {
      logger.error('更新偏好设置失败:', error);
      throw error;
    }
  },

  /**
   * 获取个性化生活服务推荐
   * @param {number} [count=5] - 推荐数量
   * @returns {Promise<Array>} 推荐的生活服务项目列表
   */
  getPersonalizedServiceRecommendations: async (count = 5) => {
    try {
      const response = await get('/smart-agent/recommendations/services', { count });
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.msg || '获取个性化服务推荐失败');
      }
    } catch (error) {
      logger.error('获取个性化服务推荐失败:', error);
      throw error;
    }
  },

  /**
   * 获取生活币使用方案
   * @returns {Promise<object>} 生活币使用方案
   */
  getLifeCoinUsagePlan: async () => {
    try {
      const response = await get('/smart-agent/plan/life-coin');
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.msg || '获取生活币使用方案失败');
      }
    } catch (error) {
      logger.error('获取生活币使用方案失败:', error);
      throw error;
    }
  },

  /**
   * 获取租房套餐推荐
   * @param {number} [count=3] - 推荐数量
   * @returns {Promise<Array>} 推荐的租房套餐列表
   */
  getRentalPackageRecommendations: async (count = 3) => {
    try {
      const response = await get('/smart-agent/recommendations/rental-packages', { count });
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.msg || '获取租房套餐推荐失败');
      }
    } catch (error) {
      logger.error('获取租房套餐推荐失败:', error);
      throw error;
    }
  },

  /**
   * 根据需求筛选房源
   * @param {object} requirements - 筛选需求
   * @param {number} [count=5] - 推荐数量
   * @returns {Promise<Array>} 推荐的房源列表
   */
  filterHousesByRequirements: async (requirements, count = 5) => {
    try {
      const response = await post('/smart-agent/filter/houses', requirements, { count });
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.msg || '根据需求筛选房源失败');
      }
    } catch (error) {
      logger.error('根据需求筛选房源失败:', error);
      throw error;
    }
  },

  /**
   * 获取生活服务消费报告
   * @returns {Promise<object>} 消费报告
   */
  getConsumptionReport: async () => {
    try {
      const response = await get('/smart-agent/report/consumption');
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.msg || '获取消费报告失败');
      }
    } catch (error) {
      logger.error('获取消费报告失败:', error);
      throw error;
    }
  },

  /**
   * 预测未来生活服务需求
   * @param {number} [days=30] - 预测天数
   * @returns {Promise<Array>} 预测结果
   */
  predictFutureServiceNeeds: async (days = 30) => {
    try {
      const response = await get('/smart-agent/predict/needs', { days });
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.msg || '预测未来服务需求失败');
      }
    } catch (error) {
      logger.error('预测未来服务需求失败:', error);
      throw error;
    }
  },

  /**
   * 获取智能体状态
   * @returns {Promise<object>} 智能体状态
   */
  getSmartAgentStatus: async () => {
    try {
      const response = await get('/smart-agent/status');
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.msg || '获取智能体状态失败');
      }
    } catch (error) {
      logger.error('获取智能体状态失败:', error);
      throw error;
    }
  },

  /**
   * 处理智能体指令
   * @param {string} command - 指令内容
   * @returns {Promise<string>} 指令执行结果
   */
  processSmartAgentCommand: async (command) => {
    try {
      const response = await post('/smart-agent/command', { command });
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        throw new Error(response.data.msg || '处理智能体指令失败');
      }
    } catch (error) {
      logger.error('处理智能体指令失败:', error);
      throw error;
    }
  },
};

export default smartAgentApi;
