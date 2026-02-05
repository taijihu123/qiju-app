import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ethers } from 'ethers';
import { theme } from '../../../common/styles/theme';
import { useUser } from '../../../contexts/UserContext';
import { SEPOLIA_RPC_URL } from '../../../config/env';

const LifeCoinScreen = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('balance'); // balance, history, exchange, wallet

  // 模拟生活币余额
  const [coinBalance, setCoinBalance] = useState(1250);
  
  // 钱包相关状态
  const [walletAddress, setWalletAddress] = useState('0x7aC215B2B3F5aA1F0F5A1D52F7a6F5eF4f4F4f4f');
  const [privateKey, setPrivateKey] = useState('0x0000000000000000000000000000000000000000000000000000000000000000');
  const [mnemonic, setMnemonic] = useState('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about');
  const [walletBalance, setWalletBalance] = useState('0.001');
  const [isExporting, setIsExporting] = useState(false);

  // 模拟交易历史
  const transactionHistory = [
    { id: '1', type: 'earn', amount: 100, description: '完成租户满意度调查', date: '2024-01-15' },
    { id: '2', type: 'spend', amount: 50, description: '兑换50元电费抵扣券', date: '2024-01-10' },
    { id: '3', type: 'earn', amount: 150, description: '成功推荐好友租房', date: '2024-01-05' },
    { id: '4', type: 'earn', amount: 80, description: '参与社区活动', date: '2023-12-28' },
    { id: '5', type: 'spend', amount: 100, description: '兑换100元保洁服务抵扣券', date: '2023-12-20' },
  ];

  // 模拟可兑换商品
  const exchangeItems = [
    { id: '1', name: '50元电费抵扣券', price: 50, image: '⚡' },
    { id: '2', name: '100元保洁服务抵扣券', price: 100, image: '🧹' },
    { id: '3', name: '50元维修服务抵扣券', price: 50, image: '🔧' },
    { id: '4', name: '1个月免费WiFi', price: 200, image: '📶' },
    { id: '5', name: '社区活动优先参与权', price: 150, image: '🎉' },
  ];

  // 渲染交易历史项
  const renderHistoryItem = ({ item }) => {
    const isEarn = item.type === 'earn';
    return (
      <View style={styles.historyItem}>
        <View style={styles.historyItemLeft}>
          <View style={[styles.historyIcon, isEarn ? styles.earnIcon : styles.spendIcon]}>
            <Ionicons name={isEarn ? 'add-circle-outline' : 'remove-circle-outline'} size={24} color={isEarn ? '#4CAF50' : '#F44336'} />
          </View>
          <View style={styles.historyInfo}>
            <Text style={styles.historyDescription}>{item.description}</Text>
            <Text style={styles.historyDate}>{item.date}</Text>
          </View>
        </View>
        <Text style={[styles.historyAmount, isEarn ? styles.earnAmount : styles.spendAmount]}>
          {isEarn ? '+' : '-'}{item.amount} 生活币
        </Text>
      </View>
    );
  };

  // 渲染可兑换商品项
  const renderExchangeItem = ({ item }) => {
    return (
      <View style={styles.exchangeItem}>
        <View style={styles.exchangeItemLeft}>
          <View style={styles.exchangeIcon}>
            <Text style={styles.exchangeIconText}>{item.image}</Text>
          </View>
          <View style={styles.exchangeInfo}>
            <Text style={styles.exchangeName}>{item.name}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.exchangeButton, coinBalance < item.price && styles.disabledButton]} 
          onPress={() => handleExchange(item)}
          disabled={coinBalance < item.price}
        >
          <Text style={styles.exchangeButtonText}>{item.price} 生活币</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // 处理兑换
  const handleExchange = (item) => {
    if (coinBalance >= item.price) {
      setCoinBalance(prev => prev - item.price);
      // 这里可以添加兑换逻辑，比如调用API
      alert(`成功兑换 ${item.name}！`);
    }
  };

  // 钱包相关功能
  const handleExportPrivateKey = () => {
    Alert.alert(
      '导出私钥',
      '私钥是您钱包的最高权限凭证，请妥善保管，不要分享给任何人！\n\n私钥: ' + privateKey,
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '复制私钥', 
          onPress: () => {
            // 这里可以添加复制到剪贴板的功能
            Alert.alert('成功', '私钥已复制到剪贴板');
          }
        }
      ]
    );
  };

  const handleExportMnemonic = () => {
    Alert.alert(
      '导出助记词',
      '助记词是您钱包的备份凭证，请妥善保管，不要分享给任何人！\n\n助记词: ' + mnemonic,
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '复制助记词', 
          onPress: () => {
            // 这里可以添加复制到剪贴板的功能
            Alert.alert('成功', '助记词已复制到剪贴板');
          }
        }
      ]
    );
  };

  const viewWalletOnBlockchain = () => {
    const explorerUrl = `https://sepolia.etherscan.io/address/${walletAddress}`;
    Linking.openURL(explorerUrl);
  };

  const refreshWalletBalance = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
      const balance = await provider.getBalance(walletAddress);
      setWalletBalance(ethers.formatEther(balance).substring(0, 6));
      Alert.alert('成功', '钱包余额已更新');
    } catch (error) {
      console.error('刷新钱包余额失败:', error);
      Alert.alert('失败', '刷新钱包余额失败，请稍后重试');
    }
  };

  // 渲染余额卡片
  const renderBalanceCard = () => {
    return (
      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceTitle}>我的生活币</Text>
          <View style={styles.coinIconContainer}>
            <Ionicons name="star" size={24} color="#FFD700" />
          </View>
        </View>
        <Text style={styles.balanceAmount}>{coinBalance}</Text>
        <Text style={styles.balanceDescription}>可用于兑换服务、抵扣房租等</Text>
        <View style={styles.earnTips}>
          <Ionicons name="information-circle-outline" size={16} color="rgba(255,255,255,0.8)" />
          <Text style={styles.earnTipsText}>完成任务、参与活动可获得更多生活币</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>生活币</Text>
        <Text style={styles.headerSubtitle}>智慧生活，积分兑好礼</Text>
      </View>

      {/* 标签切换 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'balance' && styles.activeTab]} 
          onPress={() => setActiveTab('balance')}
        >
          <Text style={[styles.tabText, activeTab === 'balance' && styles.activeTabText]}>余额</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.activeTab]} 
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>交易历史</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'exchange' && styles.activeTab]} 
          onPress={() => setActiveTab('exchange')}
        >
          <Text style={[styles.tabText, activeTab === 'exchange' && styles.activeTabText]}>积分兑换</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'wallet' && styles.activeTab]} 
          onPress={() => setActiveTab('wallet')}
        >
          <Text style={[styles.tabText, activeTab === 'wallet' && styles.activeTabText]}>数字钱包</Text>
        </TouchableOpacity>
      </View>

      {/* 内容区域 */}
      {activeTab === 'balance' && (
        <View style={styles.content}>
          {renderBalanceCard()}
          
          {/* 如何获得生活币 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>如何获得生活币？</Text>
            <View style={styles.earnWays}>
              <View style={styles.earnWayItem}>
                <View style={styles.earnWayIcon}>
                  <Ionicons name="checkmark-circle-outline" size={24} color={theme.colors.primary} />
                </View>
                <Text style={styles.earnWayText}>完成租户满意度调查</Text>
              </View>
              <View style={styles.earnWayItem}>
                <View style={styles.earnWayIcon}>
                  <Ionicons name="people-outline" size={24} color={theme.colors.primary} />
                </View>
                <Text style={styles.earnWayText}>推荐好友租房</Text>
              </View>
              <View style={styles.earnWayItem}>
                <View style={styles.earnWayIcon}>
                  <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
                </View>
                <Text style={styles.earnWayText}>参与社区活动</Text>
              </View>
              <View style={styles.earnWayItem}>
                <View style={styles.earnWayIcon}>
                  <Ionicons name="star-outline" size={24} color={theme.colors.primary} />
                </View>
                <Text style={styles.earnWayText}>评价生活服务</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {activeTab === 'history' && (
        <View style={styles.content}>
          <FlatList
            data={transactionHistory}
            renderItem={renderHistoryItem}
            keyExtractor={item => item.id}
            style={styles.historyList}
          />
        </View>
      )}

      {activeTab === 'exchange' && (
        <View style={styles.content}>
          <FlatList
            data={exchangeItems}
            renderItem={renderExchangeItem}
            keyExtractor={item => item.id}
            style={styles.exchangeList}
          />
        </View>
      )}

      {activeTab === 'wallet' && (
        <View style={styles.content}>
          {/* 钱包信息卡片 */}
          <View style={styles.walletCard}>
            <View style={styles.walletHeader}>
              <Text style={styles.walletTitle}>我的数字钱包</Text>
              <View style={styles.walletIconContainer}>
                <Ionicons name="wallet" size={24} color={theme.colors.white} />
              </View>
            </View>
            
            {/* 钱包地址 */}
            <View style={styles.walletInfo}>
              <Text style={styles.walletLabel}>钱包地址</Text>
              <Text style={styles.walletAddress}>{walletAddress}</Text>
              <TouchableOpacity 
                style={styles.viewOnBlockchainButton}
                onPress={viewWalletOnBlockchain}
              >
                <Text style={styles.viewOnBlockchainText}>查看区块链</Text>
                <Ionicons name="open-outline" size={16} color={theme.colors.white} />
              </TouchableOpacity>
            </View>
            
            {/* 钱包余额 */}
            <View style={styles.walletBalanceSection}>
              <Text style={styles.walletBalanceLabel}>钱包余额</Text>
              <Text style={styles.walletBalanceAmount}>{walletBalance} ETH</Text>
              <TouchableOpacity 
                style={styles.refreshButton}
                onPress={refreshWalletBalance}
              >
                <Ionicons name="refresh" size={16} color={theme.colors.white} />
                <Text style={styles.refreshButtonText}>刷新余额</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* 钱包管理 */}
          <View style={styles.walletManagement}>
            <Text style={styles.sectionTitle}>钱包管理</Text>
            
            <View style={styles.walletActions}>
              <TouchableOpacity 
                style={styles.walletActionButton}
                onPress={handleExportPrivateKey}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#4CAF50' }]}>
                  <Ionicons name="key-outline" size={24} color={theme.colors.white} />
                </View>
                <Text style={styles.actionText}>导出私钥</Text>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.walletActionButton}
                onPress={handleExportMnemonic}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#2196F3' }]}>
                  <Ionicons name="list-outline" size={24} color={theme.colors.white} />
                </View>
                <Text style={styles.actionText}>导出助记词</Text>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
            
            {/* 安全提示 */}
            <View style={styles.securityTips}>
              <View style={styles.securityTipItem}>
                <Ionicons name="shield-checkmark-outline" size={20} color={theme.colors.success} />
                <Text style={styles.securityTipText}>私钥和助记词是钱包的最高权限凭证</Text>
              </View>
              <View style={styles.securityTipItem}>
                <Ionicons name="warning-outline" size={20} color={theme.colors.warning} />
                <Text style={styles.securityTipText}>不要将私钥或助记词分享给任何人</Text>
              </View>
              <View style={styles.securityTipItem}>
                <Ionicons name="cloud-download-outline" size={20} color={theme.colors.primary} />
                <Text style={styles.securityTipText}>建议定期备份钱包信息</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  balanceCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    padding: 24,
    marginBottom: 16,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.background,
  },
  coinIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 8,
  },
  balanceAmount: {
    fontSize: 40,
    fontWeight: 'bold',
    color: theme.colors.background,
    marginBottom: 12,
  },
  balanceDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  earnTips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  earnTipsText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 15,
  },
  earnWays: {
    gap: 15,
  },
  earnWayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  earnWayIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  earnWayText: {
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  historyList: {
    flex: 1,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  historyItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  earnIcon: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  spendIcon: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  historyInfo: {
    justifyContent: 'center',
  },
  historyDescription: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginBottom: 3,
  },
  historyDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  earnAmount: {
    color: '#4CAF50',
  },
  spendAmount: {
    color: '#F44336',
  },
  exchangeList: {
    flex: 1,
  },
  exchangeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    marginBottom: 15,
  },
  exchangeItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exchangeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  exchangeIconText: {
    fontSize: 24,
  },
  exchangeInfo: {
    justifyContent: 'center',
  },
  exchangeName: {
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  exchangeButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  disabledButton: {
    backgroundColor: theme.colors.textSecondary,
  },
  exchangeButtonText: {
    color: theme.colors.background,
    fontWeight: 'bold',
  },
  // 钱包相关样式
  walletCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  walletTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.background,
  },
  walletIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 5,
  },
  walletInfo: {
    marginBottom: 20,
  },
  walletLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  walletAddress: {
    fontSize: 14,
    color: theme.colors.background,
    wordBreak: 'break-all',
    marginBottom: 12,
  },
  viewOnBlockchainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  viewOnBlockchainText: {
    fontSize: 12,
    color: theme.colors.background,
    marginRight: 4,
  },
  walletBalanceSection: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 20,
  },
  walletBalanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  walletBalanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.background,
    marginBottom: 12,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  refreshButtonText: {
    fontSize: 12,
    color: theme.colors.background,
    marginLeft: 4,
  },
  walletManagement: {
    marginBottom: 20,
  },
  walletActions: {
    gap: 12,
    marginBottom: 20,
  },
  walletActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  securityTips: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  securityTipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  securityTipText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});

export default LifeCoinScreen;
