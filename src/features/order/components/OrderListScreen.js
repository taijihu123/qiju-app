import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, SafeAreaView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Button from '../../../common/components/Button';
import { theme } from '../../../common/styles/theme';
import { get, post } from '../../../common/services/request';
import { useUser } from '../../../contexts/UserContext';

const OrderListScreen = () => {
  const navigation = useNavigation();
  const { user } = useUser();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // all, pending, completed, cancelled

  // 获取订单列表
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      // 调用后端订单接口
      const response = await get('/life-service/orders', { page: 1, size: 20 });
      const data = response.data.data.data.content || [];
      
      // 转换订单数据格式
      const formattedOrders = data.map(order => ({
        id: order.id?.toString() || '',
        orderNo: order.orderNo || '',
        serviceName: order.serviceItem?.name || '未知服务',
        stewardName: order.steward?.name || '未知管家',
        totalAmount: order.totalAmount || 0,
        orderStatus: order.orderStatus || 'PENDING',
        serviceTime: order.serviceTime || new Date().toISOString(),
        createTime: order.createTime || new Date().toISOString(),
        serviceAddress: order.serviceAddress || '未知地址'
      }));
      
      setOrders(formattedOrders);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('获取订单列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 下拉刷新
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  // 筛选订单
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    
    const statusMap = {
      'pending': ['PENDING', 'UNPAID'],
      'completed': ['COMPLETED', 'FINISHED'],
      'cancelled': ['CANCELLED', 'REFUNDED']
    };
    
    return statusMap[activeTab]?.includes(order.orderStatus) || false;
  });

  // 格式化订单状态
  const formatOrderStatus = (status) => {
    const statusMap = {
      'PENDING': { text: '待处理', color: theme.colors.warning },
      'UNPAID': { text: '待付款', color: theme.colors.warning },
      'IN_PROGRESS': { text: '服务中', color: theme.colors.info },
      'COMPLETED': { text: '已完成', color: theme.colors.success },
      'FINISHED': { text: '已完成', color: theme.colors.success },
      'CANCELLED': { text: '已取消', color: theme.colors.textSecondary },
      'REFUNDED': { text: '已退款', color: theme.colors.textSecondary }
    };
    
    return statusMap[status] || { text: '未知状态', color: theme.colors.textSecondary };
  };

  // 渲染订单项
  const renderOrderItem = ({ item }) => {
    const statusInfo = formatOrderStatus(item.orderStatus);
    
    return (
      <Pressable
        style={styles.orderItem}
        onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
        accessibilityLabel={`订单 ${item.orderNo}`}
        accessibilityRole="button"
      >
        {/* 订单头部 */}
        <View style={styles.orderHeader}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderNo}>订单号：{item.orderNo}</Text>
            <Text style={styles.orderDate}>
              {new Date(item.createTime).toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
          <Text style={[styles.orderStatus, { color: statusInfo.color }]}>
            {statusInfo.text}
          </Text>
        </View>

        {/* 订单内容 */}
        <View style={styles.orderContent}>
          <View style={styles.serviceInfo}>
            <Text style={styles.serviceName}>{item.serviceName}</Text>
            <Text style={styles.stewardName}>管家：{item.stewardName}</Text>
            <Text style={styles.serviceAddress}>
              <Ionicons name="location-outline" size={14} color={theme.colors.textSecondary} />
              {item.serviceAddress}
            </Text>
            <Text style={styles.serviceTime}>
              <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} />
              {new Date(item.serviceTime).toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>合计：</Text>
            <Text style={styles.priceValue}>¥{item.totalAmount}</Text>
          </View>
        </View>

        {/* 订单操作按钮 */}
        <View style={styles.orderActions}>
          {item.orderStatus === 'UNPAID' && (
            <>
              <Button
                title="取消订单"
                onPress={() => handleCancelOrder(item.id)}
                variant="outline"
                size="small"
                style={styles.actionButton}
                accessibilityLabel="取消订单"
                accessibilityRole="button"
              />
              <Button
                title="立即支付"
                onPress={() => handlePayOrder(item.id)}
                variant="primary"
                size="small"
                style={styles.actionButton}
                accessibilityLabel="立即支付"
                accessibilityRole="button"
              />
            </>
          )}
          
          {item.orderStatus === 'PENDING' && (
            <>
              <Button
                title="取消订单"
                onPress={() => handleCancelOrder(item.id)}
                variant="outline"
                size="small"
                style={styles.actionButton}
                accessibilityLabel="取消订单"
                accessibilityRole="button"
              />
              <Button
                title="联系管家"
                onPress={() => handleContactSteward(item.stewardId)}
                variant="primary"
                size="small"
                style={styles.actionButton}
                accessibilityLabel="联系管家"
                accessibilityRole="button"
              />
            </>
          )}
          
          {['COMPLETED', 'FINISHED'].includes(item.orderStatus) && (
            <Button
              title="评价服务"
              onPress={() => handleRateService(item.id)}
              variant="primary"
              size="small"
              style={styles.actionButton_full}
              accessibilityLabel="评价服务"
              accessibilityRole="button"
            />
          )}
        </View>
      </Pressable>
    );
  };

  // 取消订单
  const handleCancelOrder = async (orderId) => {
    try {
      // 调用后端取消订单接口
      const response = await post(`/life-service/orders/${orderId}/cancel`);
      
      // 更新订单状态
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, orderStatus: 'CANCELLED' } : order
      ));
      
      alert('订单已取消');
    } catch (err) {
      console.error('Failed to cancel order:', err);
      alert('取消订单失败');
    }
  };

  // 支付订单
  const handlePayOrder = (orderId) => {
    // 跳转到支付页面（预留功能）
    alert('支付功能开发中...');
  };

  // 联系管家
  const handleContactSteward = (stewardId) => {
    // 跳转到管家详情页面
    navigation.navigate('StewardDetail', { stewardId });
  };

  // 评价服务
  const handleRateService = (orderId) => {
    // 跳转到评价页面（预留功能）
    alert('评价功能开发中...');
  };

  // 渲染空状态
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="receipt-outline" size={64} color={theme.colors.textDisabled} />
      <Text style={styles.emptyText}>
        {loading ? '加载中...' : error || '暂无订单'}
      </Text>
      <Button
        title="去预约服务"
        onPress={() => navigation.navigate('ServicePage')}
        variant="primary"
        size="medium"
        style={styles.emptyButton}
        accessibilityLabel="去预约服务"
        accessibilityRole="button"
      />
    </View>
  );

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      {/* 页面头部 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>我的订单</Text>
      </View>

      {/* 订单状态标签 */}
      <View style={styles.tabContainer}>
        {[
          { key: 'all', label: '全部' },
          { key: 'pending', label: '待处理' },
          { key: 'completed', label: '已完成' },
          { key: 'cancelled', label: '已取消' }
        ].map((tab) => (
          <Pressable
            key={tab.key}
            style={[
              styles.tabItem,
              activeTab === tab.key && styles.tabItem_active
            ]}
            onPress={() => setActiveTab(tab.key)}
            accessibilityLabel={`${tab.label}订单`}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.tabText_active
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* 订单列表 */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[4],
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: theme.fontSize.xl2,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    paddingVertical: theme.spacing[3],
    marginBottom: theme.spacing[2],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing[2],
  },
  tabItem_active: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    fontWeight: theme.fontWeight.medium,
  },
  tabText_active: {
    color: theme.colors.primary,
  },
  listContainer: {
    paddingHorizontal: theme.spacing[6],
    paddingBottom: theme.spacing[6],
  },
  orderItem: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  orderInfo: {
    flex: 1,
  },
  orderNo: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing[1],
  },
  orderDate: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  orderStatus: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
  },
  orderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[3],
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing[1],
  },
  stewardName: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing[1],
  },
  serviceAddress: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing[1],
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceTime: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  priceValue: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  orderActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing[3],
  },
  actionButton: {
    marginLeft: theme.spacing[2],
    minWidth: 80,
  },
  actionButton_full: {
    width: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing[10],
  },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textDisabled,
    marginTop: theme.spacing[3],
    marginBottom: theme.spacing[5],
  },
  emptyButton: {
    minWidth: 150,
  },
});

export default OrderListScreen;