import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../common/styles/theme';

export default function RentHousePage() {
  const navigation = useNavigation();
  const [completedWishes, setCompletedWishes] = useState([]);
  const [contractOrders, setContractOrders] = useState([]);
  const [lifestyleProgress, setLifestyleProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  // 模拟从后端获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟数据
        const mockCompletedWishes = [
          {
            id: 1,
            title: '找到理想的三居室',
            completedAt: '2026-02-15'
          },
          {
            id: 2,
            title: '签约心仪的房源',
            completedAt: '2026-02-10'
          }
        ];
        
        const mockContractOrders = [
          {
            id: 1,
            houseTitle: '精装修三居室',
            contractNo: 'HT20260210001',
            status: '已生效'
          },
          {
            id: 2,
            houseTitle: '温馨两居室',
            contractNo: 'HT20260205001',
            status: '已完成'
          }
        ];
        
        const mockLifestyleProgress = [
          {
            id: 1,
            goal: '打造智能家居系统',
            progress: 75,
            estimatedDate: '2026-03-01'
          },
          {
            id: 2,
            goal: '布置理想的书房',
            progress: 45,
            estimatedDate: '2026-02-25'
          }
        ];
        
        setCompletedWishes(mockCompletedWishes);
        setContractOrders(mockContractOrders);
        setLifestyleProgress(mockLifestyleProgress);
      } catch (err) {
        console.error('获取数据失败:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 渲染单个愿望项
  const renderWishItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemSubtitle}>完成时间: {item.completedAt}</Text>
    </View>
  );

  // 渲染单个合同订单
  const renderOrderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Text style={styles.itemTitle}>{item.houseTitle}</Text>
      <Text style={styles.itemSubtitle}>合同编号: {item.contractNo} | 状态: {item.status}</Text>
    </View>
  );

  // 渲染生活方式进行式
  const renderProgressItem = ({ item }) => (
    <View style={styles.itemCard}>
      <Text style={styles.itemTitle}>{item.goal}</Text>
      <Text style={styles.itemSubtitle}>进度: {item.progress}% | 预计完成: {item.estimatedDate}</Text>
      <View style={styles.progressBarContainer}>
        <View 
          style={[
            styles.progressBar, 
            { width: `${item.progress}%` }
          ]} 
        />
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 顶部标题栏 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>理想居所</Text>
        <Text style={styles.subTitle}>理想生活方式进行式</Text>
      </View>

      {/* 搜索栏 */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
        <Text style={styles.searchPlaceholder}>搜索理想居所...</Text>
      </View>

      {/* 模块1：已完成的愿望 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✅ 已完成的愿望</Text>
        {completedWishes.length > 0 ? (
          <FlatList 
            data={completedWishes} 
            renderItem={renderWishItem} 
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <Text style={styles.emptyText}>暂无已完成的愿望</Text>
        )}
      </View>

      {/* 模块2：合同订单 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📄 合同订单</Text>
        {contractOrders.length > 0 ? (
          <FlatList 
            data={contractOrders} 
            renderItem={renderOrderItem} 
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <Text style={styles.emptyText}>暂无合同订单</Text>
        )}
      </View>

      {/* 模块3：理想生活方式进行式 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚀 理想生活方式进行式</Text>
        {lifestyleProgress.length > 0 ? (
          <FlatList 
            data={lifestyleProgress} 
            renderItem={renderProgressItem} 
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <Text style={styles.emptyText}>暂无进行中的生活方式计划</Text>
        )}
      </View>
    </ScrollView>
  );
}

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
  header: {
    backgroundColor: theme.colors.white,
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    height: 50,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  searchPlaceholder: {
    marginLeft: 8,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  section: {
    backgroundColor: theme.colors.white,
    marginTop: 10,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: theme.colors.textPrimary,
  },
  listContent: {
    paddingBottom: 10,
  },
  itemCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: theme.colors.textPrimary,
  },
  itemSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 40,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
});

