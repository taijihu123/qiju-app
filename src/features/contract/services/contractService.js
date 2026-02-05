import { get, post, put, del } from '../../../common/services/request';

// 电子合同服务（预留扩展）
const contractService = {
  // 获取合同列表
  async getContracts(params = {}) {
    try {
      return await get('/contracts', params);
    } catch (error) {
      console.error('Failed to get contracts:', error);
      throw error;
    }
  },

  // 获取合同详情
  async getContractDetail(id) {
    try {
      return await get(`/contracts/${id}`);
    } catch (error) {
      console.error('Failed to get contract detail:', error);
      throw error;
    }
  },

  // 创建合同
  async createContract(data) {
    try {
      return await post('/contracts', data);
    } catch (error) {
      console.error('Failed to create contract:', error);
      throw error;
    }
  },

  // 签署合同
  async signContract(id, data) {
    try {
      return await post(`/contracts/${id}/sign`, data);
    } catch (error) {
      console.error('Failed to sign contract:', error);
      throw error;
    }
  },

  // 取消合同
  async cancelContract(id, reason) {
    try {
      return await put(`/contracts/${id}/cancel`, { reason });
    } catch (error) {
      console.error('Failed to cancel contract:', error);
      throw error;
    }
  },

  // 删除合同
  async deleteContract(id) {
    try {
      return await del(`/contracts/${id}`);
    } catch (error) {
      console.error('Failed to delete contract:', error);
      throw error;
    }
  },

  // 获取合同模板
  async getContractTemplates(type) {
    try {
      return await get('/contracts/templates', { type });
    } catch (error) {
      console.error('Failed to get contract templates:', error);
      throw error;
    }
  },

  // 下载合同PDF
  async downloadContractPDF(id) {
    try {
      return await get(`/contracts/${id}/download`, { responseType: 'blob' });
    } catch (error) {
      console.error('Failed to download contract:', error);
      throw error;
    }
  },
};

export default contractService;