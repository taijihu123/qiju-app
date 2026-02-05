import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useBlockchain } from '../hooks/useBlockchain';
import { theme } from '../common/styles/theme';

/**
 * 区块链余额查询示例组件
 */
export default function BlockchainBalanceExample() {
  const [address, setAddress] = useState('0x5FbDB2315678afecb367f032d93F642f64180aa3');
  const { balance, loading, error, refetch, isValidAddress } = useBlockchain(address);

  const handleAddressChange = (text) => {
    setAddress(text);
  };

  const handleRefetch = async () => {
    if (!isValidAddress(address)) {
      Alert.alert('错误', '请输入有效的钱包地址');
      return;
    }
    await refetch();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>区块链余额查询</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="输入钱包地址"
          placeholderTextColor="#999"
          value={address}
          onChangeText={handleAddressChange}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRefetch}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? '查询中...' : '查询'}</Text>
        </TouchableOpacity>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!error && balance && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>钱包地址:</Text>
          <Text style={styles.addressText}>{address}</Text>
          
          <View style={styles.balanceContainer}>
            <Text style={styles.resultLabel}>余额:</Text>
            <Text style={styles.balanceText}>
              {balance.balance ? `${balance.balance} ETH` : '暂无数据'}
            </Text>
          </View>

          {balance.blockNumber && (
            <Text style={styles.blockInfo}>
              区块高度: {balance.blockNumber}
            </Text>
          )}
        </View>
      )}

      {!loading && !error && !balance && (
        <Text style={styles.emptyText}>请输入钱包地址并点击查询按钮</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginRight: 10,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  button: {
    width: 100,
    height: 50,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: theme.colors.border,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#FFF3F3',
    borderWidth: 1,
    borderColor: '#FFCCCC',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 14,
  },
  resultContainer: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 20,
  },
  resultLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 5,
  },
  addressText: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginBottom: 15,
    fontFamily: 'monospace',
    wordBreak: 'break-all',
  },
  balanceContainer: {
    marginBottom: 15,
  },
  balanceText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  blockInfo: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 50,
  },
});
