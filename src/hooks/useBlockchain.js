import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { logger } from '../common/services/logger';
import { BLOCKCHAIN_API_BASE_URL, SEPOLIA_RPC_URL } from '../config/env';

/**
 * 区块链余额查询Hook
 * @param {string} address - 要查询的钱包地址
 * @returns {Object} 包含余额数据、加载状态和错误信息的对象
 */
export const useBlockchain = (address) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 地址格式验证
  const isValidAddress = useCallback((addr) => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  }, []);

  // 获取余额
  const fetchBalance = useCallback(async (addr) => {
    if (!isValidAddress(addr)) {
      const errMsg = '钱包地址格式不正确';
      logger.error(errMsg);
      setError(errMsg);
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      // 调用区块链余额接口
      const response = await fetch(`${BLOCKCHAIN_API_BASE_URL}/balance/${addr}`);

      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`);
      }

      const data = await response.json();
      logger.info('余额查询成功:', data);
      
      setBalance(data);
      return data;
    } catch (err) {
      const errMsg = `余额查询失败: ${err.message}`;
      logger.error(errMsg);
      setError(errMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isValidAddress]);

  // 当地址变化时自动获取余额
  useEffect(() => {
    if (address) {
      fetchBalance(address);
    }
  }, [address, fetchBalance]);

  // 手动触发获取余额的方法
  const refetch = useCallback(() => {
    if (address) {
      return fetchBalance(address);
    }
    return Promise.resolve(null);
  }, [address, fetchBalance]);

  return {
    balance,
    loading,
    error,
    refetch,
    isValidAddress,
  };
};

/**
 * 区块链交易Hook
 * @returns {Object} 包含交易状态和方法的对象
 */
export const useBlockchainTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transactionHash, setTransactionHash] = useState(null);

  // 发送交易
  const sendTransaction = useCallback(async (transactionData) => {
    try {
      setLoading(true);
      setError(null);
      setTransactionHash(null);

      // 这里可以添加实际的交易发送逻辑
      // 例如调用后端的交易接口
      const response = await fetch(`${BLOCKCHAIN_API_BASE_URL}/transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        throw new Error(`HTTP错误: ${response.status}`);
      }

      const data = await response.json();
      logger.info('交易发送成功:', data);
      
      setTransactionHash(data.transactionHash);
      return data;
    } catch (err) {
      const errMsg = `交易发送失败: ${err.message}`;
      logger.error(errMsg);
      setError(errMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    transactionHash,
    sendTransaction,
  };
};
