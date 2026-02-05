import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { ethers } from 'ethers';
import { SEPOLIA_RPC_URL } from '../config/env';

const EthersBlockchainExample = () => {
  const [address, setAddress] = useState('0x5FbDB2315678afecb367f032d93F642f64180aa3');
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [blockNumber, setBlockNumber] = useState(null);

  // 直接使用ethers.js与区块链节点交互
  const checkConnection = async () => {
    try {
      setLoading(true);
      const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
      const blockNum = await provider.getBlockNumber();
      setBlockNumber(blockNum);
      Alert.alert('连接成功', `当前区块高度: ${blockNum}`);
    } catch (error) {
      console.error('连接失败:', error);
      Alert.alert('连接失败', `无法连接到区块链节点: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 使用ethers.js查询余额
  const fetchBalance = async () => {
    if (!address || address.length !== 42) {
      Alert.alert('错误', '请输入有效的以太坊地址');
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
      const balanceWei = await provider.getBalance(address);
      const balanceEth = ethers.formatEther(balanceWei);
      setBalance(balanceEth);
    } catch (error) {
      console.error('查询余额失败:', error);
      Alert.alert('查询失败', `无法获取余额: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ethers.js 区块链示例</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>连接测试</Text>
        <Button 
          title={loading ? '连接中...' : '测试区块链连接'} 
          onPress={checkConnection} 
          disabled={loading}
        />
        {blockNumber && (
          <Text style={styles.result}>当前区块高度: {blockNumber}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>余额查询</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="输入以太坊地址"
          autoCapitalize="none"
        />
        <Button 
          title={loading ? '查询中...' : '查询余额'} 
          onPress={fetchBalance} 
          disabled={loading}
        />
        {balance && (
          <Text style={styles.result}>余额: {balance} ETH</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  result: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#007AFF',
  },
});

export default EthersBlockchainExample;