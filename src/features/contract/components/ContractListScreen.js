import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../common/styles/theme';
import contractService from '../services/contractService';

const ContractListScreen = () => {
  const navigation = useNavigation();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await contractService.getContracts();
      if (response.code === 200) {
        setContracts(response.data || []);
      } else {
        setContracts([]);
      }
    } catch (err) {
      console.error('加载合同列表失败:', err);
      setError('加载合同列表失败');
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  const renderContract = ({ item }) => (
    <TouchableOpacity 
      style={styles.contractItem}
      onPress={() => navigation.navigate('ContractDetail', { contractId: item.id })}
    >
      <View style={styles.contractHeader}>
        <Text style={styles.contractNumber}>{item.propertyName || '租赁合同'}</Text>
        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      <View style={styles.contractInfo}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.infoText}>
            {item.startDate} 至 {item.endDate}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="cash-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.infoText}>月租金: ¥{item.monthlyRent || '0'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="lock-closed-outline" size={16} color={theme.colors.textSecondary} />
          <Text style={styles.infoText}>押金: ¥{item.deposit || '0'}</Text>
        </View>
      </View>
      <View style={styles.contractFooter}>
        <Text style={styles.createTime}>{item.createTime}</Text>
        <TouchableOpacity style={styles.detailButton}>
          <Text style={styles.detailButtonText}>查看详情</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

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
        <Text style={styles.loadingText}>加载合同列表...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={theme.colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadContracts}>
          <Text style={styles.retryButtonText}>重试</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>我的租赁合同</Text>
        <Text style={styles.headerSubtitle}>查看和管理您的租赁合同</Text>
      </View>

      <FlatList
        data={contracts}
        renderItem={renderContract}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={styles.emptyText}>暂无合同</Text>
            <Text style={styles.emptySubtext}>您还没有任何租赁合同</Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => navigation.navigate('Housing')}
            >
              <Text style={styles.emptyButtonText}>去寻找房源</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
  header: {
    padding: 24,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  contractItem: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  contractHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  contractNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#E8F5E9',
  },
  statusExpired: {
    backgroundColor: '#FFF3E0',
  },
  statusTerminated: {
    backgroundColor: '#FFEBEE',
  },
  statusSigned: {
    backgroundColor: '#E8F5E9',
  },
  statusDefault: {
    backgroundColor: theme.colors.backgroundSecondary,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  contractInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  contractFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  createTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailButtonText: {
    fontSize: 14,
    color: theme.colors.primary,
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 120,
    paddingHorizontal: 40,
  },
  emptyText: {
    marginTop: 24,
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: 24,
  },
  emptyButtonText: {
    fontSize: 16,
    color: theme.colors.white,
    fontWeight: '600',
  },
});

export default ContractListScreen;