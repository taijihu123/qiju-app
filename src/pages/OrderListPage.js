// src/pages/OrderListPage.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getOrderList } from '../common/services/orderApi';
import { logger } from '../common/services/logger';

// 订单状态映射
const ORDER_STATUS_MAP = {
  'PENDING': '待处理',
  'CONFIRMED': '已确认',
  'PAID': '已支付',
  'IN_PROGRESS': '进行中',
  'COMPLETED': '已完成',
  'CANCELLED': '已取消',
  'REFUNDED': '已退款'
};

// 支付状态映射
const PAYMENT_STATUS_MAP = {
  'UNPAID': '未支付',
  'PAID': '已支付',
  'REFUNDING': '退款中',
  'REFUNDED': '已退款'
};

export default function OrderListPage() {
  // 订单列表数据
  const [orders, setOrders] = useState([]);
  // 加载状态
  const [loading, setLoading] = useState(true);
  // 加载更多状态
  const [loadingMore, setLoadingMore] = useState(false);
  // 错误信息
  const [error, setError] = useState(null);
  // 分页信息
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // 获取订单列表
  const fetchOrders = async (currentPage = 1, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      logger.debug(`开始获取订单列表，页码：${currentPage}`);
      const response = await getOrderList({ page: currentPage, size: 10 });

      // 数据校验
      if (!response || response.code !== 200 || !response.data) {
        throw new Error('订单数据格式异常');
      }

      const orderData = response.data;
      logger.debug('订单列表获取成功：', orderData);

      // 更新状态
      if (isLoadMore) {
        setOrders(prevOrders => [...prevOrders, ...(orderData.content || [])]);
      } else {
        setOrders(orderData.content || []);
      }

      // 更新分页信息
      setTotalPages(orderData.totalPages || 1);
      setTotalElements(orderData.totalElements || 0);
      setPage(currentPage);

    } catch (err) {
      logger.error('获取订单列表失败：', err);
      setError(err.message);
      if (!isLoadMore) {
        setOrders([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // 初始加载
  useEffect(() => {
    fetchOrders(1);
  }, []);

  // 刷新列表
  const handleRefresh = () => {
    fetchOrders(1);
  };

  // 加载更多
  const handleLoadMore = () => {
    if (!loadingMore && page < totalPages) {
      fetchOrders(page + 1, true);
    }
  };

  // 渲染订单项
  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      {/* 订单头部：订单号 + 订单状态 */}
      <View style={styles.orderHeader}>
        <Text style={styles.orderNo}>订单号：{item.orderNo}</Text>
        <Text style={[
          styles.orderStatus,
          item.orderStatus === 'COMPLETED' ? styles.statusCompleted :
          item.orderStatus === 'CANCELLED' ? styles.statusCancelled :
          item.orderStatus === 'PENDING' ? styles.statusPending :
          styles.statusDefault
        ]}>
          {ORDER_STATUS_MAP[item.orderStatus] || item.orderStatus}
        </Text>
      </View>

      {/* 订单信息 */}
      <View style={styles.orderInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>服务时间：</Text>
          <Text style={styles.infoValue}>{item.serviceTime || '未指定'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>服务地址：</Text>
          <Text style={styles.infoValue}>{item.serviceAddress || '未指定'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>支付状态：</Text>
          <Text style={[
            styles.infoValue,
            item.paymentStatus === 'PAID' ? styles.statusCompleted :
            item.paymentStatus === 'UNPAID' ? styles.statusPending :
            styles.statusDefault
          ]}>
            {PAYMENT_STATUS_MAP[item.paymentStatus] || item.paymentStatus}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>订单金额：</Text>
          <Text style={styles.totalAmount}>¥{item.totalAmount?.toFixed(2) || '0.00'}</Text>
        </View>
      </View>

      {/* 订单备注 */}
      {item.notes && (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>备注：</Text>
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      )}

      {/* 操作按钮 */}
      <View style={styles.actionButtons}>
        {item.orderStatus === 'PENDING' && (
          <>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>取消订单</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.payButton}>
              <Text style={styles.payButtonText}>立即支付</Text>
            </TouchableOpacity>
          </>
        )}
        {item.orderStatus === 'CONFIRMED' && item.paymentStatus === 'PAID' && (
          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactButtonText}>联系服务商</Text>
          </TouchableOpacity>
        )}
        {item.orderStatus === 'COMPLETED' && (
          <TouchableOpacity style={styles.evaluateButton}>
            <Text style={styles.evaluateButtonText}>评价服务</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  // 渲染空状态
  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📝</Text>
        <Text style={styles.emptyText}>你还没有订单哦~</Text>
        <Text style={styles.emptySubText}>快去下单体验我们的优质服务吧</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshButtonText}>刷新一下</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // 渲染错误状态
  const renderError = () => {
    if (!error) return null;
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshButtonText}>重新试试</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // 渲染加载更多
  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="small" color="#4A90E2" />
        <Text style={styles.loadingMoreText}>正在加载更多订单...</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 页面标题 */}
      <View style={styles.header}>
        <Text style={styles.title}>我的订单</Text>
        <Text style={styles.subtitle}>共 {totalElements} 条订单</Text>
      </View>

      {/* 错误提示 */}
      {renderError()}

      {/* 订单列表 */}
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        refreshing={loading && page === 1}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
      />

      {/* 初始加载指示器 */}
      {loading && orders.length === 0 && !error && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>正在为你加载订单...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
  },
  listContent: {
    padding: 16,
  },
  orderItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNo: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  orderStatus: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusCompleted: {
    color: '#52C41A',
    backgroundColor: '#F6FFED',
    border: '1px solid #B7EB8F',
  },
  statusCancelled: {
    color: '#FF4D4F',
    backgroundColor: '#FFF1F0',
    border: '1px solid #FFCCC7',
  },
  statusPending: {
    color: '#FAAD14',
    backgroundColor: '#FFFBE6',
    border: '1px solid #FFE58F',
  },
  statusDefault: {
    color: '#1890FF',
    backgroundColor: '#E6F7FF',
    border: '1px solid #91D5FF',
  },
  orderInfo: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666666',
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#333333',
    flex: 1,
  },
  totalAmount: {
    fontSize: 16,
    color: '#FF4D4F',
    fontWeight: '600',
  },
  notesContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  notesLabel: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 12,
    color: '#333333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#666666',
  },
  payButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#FF4D4F',
  },
  payButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  contactButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#1890FF',
  },
  contactButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  evaluateButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: '#52C41A',
  },
  evaluateButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666666',
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadingMoreText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666666',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999999',
    marginBottom: 8,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 16,
  },
  refreshButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    backgroundColor: '#1890FF',
  },
  refreshButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  errorContainer: {
    padding: 16,
    margin: 16,
    backgroundColor: '#FFF1F0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFCCC7',
  },
  errorText: {
    fontSize: 14,
    color: '#FF4D4F',
    marginBottom: 12,
    textAlign: 'center',
  },
  errorIcon: {
    fontSize: 32,
    marginBottom: 12,
    textAlign: 'center',
  },
});
