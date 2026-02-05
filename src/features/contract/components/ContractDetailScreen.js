import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ethers } from 'ethers';
import { theme } from '../../../common/styles/theme';
import contractService from '../services/contractService';
import { SEPOLIA_RPC_URL } from '../../../config/env';

const ContractDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { contractId } = route.params || {};
  
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [depositing, setDepositing] = useState(false);
  const [depositHash, setDepositHash] = useState(null);

  useEffect(() => {
    if (contractId) {
      loadContractDetail();
    } else {
      setError('合同ID不存在');
      setLoading(false);
    }
  }, [contractId]);

  const loadContractDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await contractService.getContractDetail(contractId);
      if (response.code === 200) {
        setContract(response.data);
      } else {
        setError('获取合同详情失败');
      }
    } catch (err) {
      console.error('加载合同详情失败:', err);
      setError('加载合同详情失败');
    } finally {
      setLoading(false);
    }
  };

  const generateContractHash = (contractData) => {
    const contractString = JSON.stringify({
      id: contractData.id,
      contractNumber: contractData.contractNumber,
      startDate: contractData.startDate,
      endDate: contractData.endDate,
      monthlyRent: contractData.monthlyRent,
      deposit: contractData.deposit,
      status: contractData.status,
      contractTerms: contractData.contractTerms,
      createTime: contractData.createTime
    });
    return ethers.keccak256(ethers.toUtf8Bytes(contractString));
  };

  const depositToBlockchain = async () => {
    try {
      setDepositing(true);
      setDepositHash(null);

      // 生成合同哈希值
      const contractHash = generateContractHash(contract);
      console.log('合同哈希值:', contractHash);

      // 连接到Sepolia测试网
      const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
      const network = await provider.getNetwork();
      console.log('连接到网络:', network.name);

      // 使用默认账户（在实际应用中，应该使用用户的钱包）
      const signer = new ethers.Wallet('0x0000000000000000000000000000000000000000000000000000000000000000', provider);

      // 模拟交易（在实际应用中，应该调用智能合约）
      const tx = {
        to: '0x0000000000000000000000000000000000000000',
        value: ethers.parseEther('0.001'),
        data: ethers.toUtf8Bytes(`Contract deposit: ${contractHash}`)
      };

      // 发送交易
      const transaction = await signer.sendTransaction(tx);
      console.log('交易哈希:', transaction.hash);
      setDepositHash(transaction.hash);

      // 等待交易确认
      await transaction.wait();
      console.log('交易已确认');

      Alert.alert(
        '存证成功',
        `合同已成功存证到区块链\n交易哈希: ${transaction.hash}`,
        [
          {
            text: '查看区块链',
            onPress: () => {
              const explorerUrl = `https://sepolia.etherscan.io/tx/${transaction.hash}`;
              Linking.openURL(explorerUrl);
            }
          },
          { text: '确定', style: 'default' }
        ]
      );

    } catch (err) {
      console.error('区块链存证失败:', err);
      Alert.alert('存证失败', '区块链存证失败，请稍后重试');
    } finally {
      setDepositing(false);
    }
  };

  const viewOnBlockchain = () => {
    if (depositHash) {
      const explorerUrl = `https://sepolia.etherscan.io/tx/${depositHash}`;
      Linking.openURL(explorerUrl);
    } else {
      Alert.alert('提示', '请先完成区块链存证');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'ACTIVE':
        return styles.statusActive;
      case 'EXPIRED':
        return styles.statusExpired;
      case 'TERMINATED':
        return styles.statusTerminated;
      case 'SIGNED':
        return styles.statusSigned;
      default:
        return styles.statusDefault;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ACTIVE':
        return '生效中';
      case 'EXPIRED':
        return '已过期';
      case 'TERMINATED':
        return '已终止';
      case 'SIGNED':
        return '已签署';
      default:
        return '未知状态';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>加载合同详情...</Text>
      </View>
    );
  }

  if (error || !contract) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={theme.colors.error} />
        <Text style={styles.errorText}>{error || '合同不存在'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadContractDetail}>
          <Text style={styles.retryButtonText}>重试</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>合同详情</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 合同基本信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>合同信息</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>合同编号:</Text>
              <Text style={styles.infoValue}>{contract.contractNumber || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>合同状态:</Text>
              <View style={[styles.statusBadge, getStatusStyle(contract.status)]}>
                <Text style={styles.statusText}>{getStatusText(contract.status)}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>创建时间:</Text>
              <Text style={styles.infoValue}>{contract.createTime || 'N/A'}</Text>
            </View>
            {depositHash && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>存证哈希:</Text>
                <Text style={[styles.infoValue, styles.hashValue]}>{depositHash}</Text>
              </View>
            )}
          </View>
        </View>

        {/* 租赁信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>租赁信息</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>租赁期限:</Text>
              <Text style={styles.infoValue}>
                {contract.startDate} 至 {contract.endDate}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>月租金:</Text>
              <Text style={styles.infoValue}>¥{contract.monthlyRent || '0'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>押金:</Text>
              <Text style={styles.infoValue}>¥{contract.deposit || '0'}</Text>
            </View>
          </View>
        </View>

        {/* 合同条款 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>合同条款</Text>
          <View style={[styles.infoCard, styles.termsCard]}>
            <Text style={styles.termsText}>
              {contract.contractTerms || '暂无合同条款'}
            </Text>
          </View>
        </View>

        {/* 区块链存证 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>区块链存证</Text>
          <View style={styles.infoCard}>
            <Text style={styles.depositInfo}>
              将合同哈希值存储到区块链上，确保合同的真实性和不可篡改性
            </Text>
            <View style={styles.depositButtons}>
              <TouchableOpacity 
                style={[styles.depositButton, depositing && styles.depositButtonDisabled]}
                onPress={depositToBlockchain}
                disabled={depositing}
              >
                {depositing ? (
                  <ActivityIndicator size="small" color={theme.colors.white} />
                ) : (
                  <>
                    <Ionicons name="lock-closed" size={20} color={theme.colors.white} />
                    <Text style={styles.depositButtonText}>区块链存证</Text>
                  </>
                )}
              </TouchableOpacity>
              {depositHash && (
                <TouchableOpacity 
                  style={styles.viewButton}
                  onPress={viewOnBlockchain}
                >
                  <Ionicons name="eye" size={20} color={theme.colors.primary} />
                  <Text style={styles.viewButtonText}>查看区块链</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* 操作按钮 */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="download-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.actionButtonText}>下载合同</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="print-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.actionButtonText}>打印合同</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={20} color={theme.colors.primary} />
            <Text style={styles.actionButtonText}>分享合同</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadow.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textPrimary,
    flex: 2,
    textAlign: 'right',
  },
  hashValue: {
    fontSize: 12,
    color: theme.colors.primary,
    wordBreak: 'break-all',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: theme.colors.successLight,
  },
  statusExpired: {
    backgroundColor: theme.colors.warningLight,
  },
  statusTerminated: {
    backgroundColor: theme.colors.errorLight,
  },
  statusSigned: {
    backgroundColor: theme.colors.primaryLight,
  },
  statusDefault: {
    backgroundColor: theme.colors.backgroundSecondary,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  termsCard: {
    padding: 20,
  },
  termsText: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.textPrimary,
  },
  depositInfo: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  depositButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  depositButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  depositButtonDisabled: {
    opacity: 0.7,
  },
  depositButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.white,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  viewButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: theme.colors.white,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  actionButtonText: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 20,
    fontSize: 16,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 25,
  },
  retryButtonText: {
    fontSize: 16,
    color: theme.colors.white,
    fontWeight: 'bold',
  },
});

export default ContractDetailScreen;