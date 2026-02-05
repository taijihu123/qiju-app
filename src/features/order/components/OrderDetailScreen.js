import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Button from '../../../common/components/Button';
import { theme } from '../../../common/styles/theme';
import { get, post } from '../../../common/services/request';
import { useUser } from '../../../contexts/UserContext';

const OrderDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useUser();
  
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 获取订单详情
  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      setError('');
      
      // 调用后端订单详情接口
      const response = await get(`/life-service/orders/${orderId}`);
      const data = response.data.data.data || {};
      
      // 转换订单数据格式
      const formattedOrder = {
        id: data.id?.toString() || '',
        orderNo: data.orderNo || '',
        serviceName: data.serviceItem?.name || '未知服务',
        servicePrice: data.serviceItem?.price || 0,
        serviceDuration: data.serviceItem?.duration || '0小时',
        stewardName: data.steward?.name || '未知管家',
        stewardPhone: data.steward?.phone || '',
        totalAmount: data.totalAmount || 0,
        orderStatus: data.orderStatus || 'PENDING',
        paymentStatus: data.paymentStatus || 'UNPAID',
        serviceTime: data.serviceTime || new Date().toISOString(),
        serviceAddress: data.serviceAddress || '未知地址',
        notes: data.notes || '无备注',
        createTime: data.createTime || new Date().toISOString(),
        updateTime: data.updateTime || new Date().toISOString(),
        paymentTime: data.paymentTime,
        finishTime: data.finishTime
      };
      
      setOrder(formattedOrder);
    } catch (err) {
      console.error('Failed to fetch order detail:', err);
      setError('获取订单详情失败');
    } finally {
      setLoading(false);
    }
  };

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

  // 格式化支付状态
  const formatPaymentStatus = (status) => {
    const statusMap = {
      'UNPAID': { text: '未支付', color: theme.colors.warning },
      'PAID': { text: '已支付', color: theme.colors.success },
      'REFUNDED': { text: '已退款', color: theme.colors.textSecondary }
    };
    
    return statusMap[status] || { text: '未知状态', color: theme.colors.textSecondary };
  };

  // 取消订单
  const handleCancelOrder = async () => {
    try {
      // 调用后端取消订单接口
      const response = await post(`/life-service/orders/${orderId}/cancel`);
      
      // 更新订单状态
      setOrder(prev => prev ? { ...prev, orderStatus: 'CANCELLED' } : null);
      
      alert('订单已取消');
    } catch (err) {
      console.error('Failed to cancel order:', err);
      alert('取消订单失败');
    }
  };

  // 支付订单
  const handlePayOrder = () => {
    // 跳转到支付页面（预留功能）
    alert('支付功能开发中...');
  };

  // 联系管家
  const handleContactSteward = () => {
    // 调用管家功能（预留功能）
    alert(`联系管家：${order?.stewardPhone || '未知号码'}`);
  };

  // 评价服务
  const handleRateService = () => {
    // 跳转到评价页面（预留功能）
    alert('评价功能开发中...');
  };

  useEffect(() => {
    if (user && orderId) {
      fetchOrderDetail();
    }
  }, [user, orderId]);

  if (loading || !order) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusInfo = formatOrderStatus(order.orderStatus);
  const paymentInfo = formatPaymentStatus(order.paymentStatus);

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
          accessibilityLabel="返回"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>订单详情</Text>
        <Pressable
          onPress={() => alert('分享功能开发中...')}
          style={styles.headerButton}
          accessibilityLabel="分享"
          accessibilityRole="button"
        >
          <Ionicons name="share-outline" size={24} color={theme.colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        {/* 订单状态 */}
        <View style={styles.statusContainer}>
          <Ionicons 
            name={
              order.orderStatus === 'COMPLETED' || order.orderStatus === 'FINISHED' 
                ? 'checkmark-circle' 
                : order.orderStatus === 'CANCELLED' 
                  ? 'close-circle' 
                  : 'time'
            } 
            size={48} 
            color={statusInfo.color} 
          />
          <Text style={[styles.statusText, { color: statusInfo.color }]}>
            {statusInfo.text}
          </Text>
          <Text style={styles.statusSubtext}>
            订单号：{order.orderNo}
          </Text>
        </View>

        {/* 服务信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>服务信息</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>服务名称</Text>
            <Text style={styles.infoValue}>{order.serviceName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>服务价格</Text>
            <Text style={styles.infoValue}>¥{order.servicePrice}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>服务时长</Text>
            <Text style={styles.infoValue}>{order.serviceDuration}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>服务管家</Text>
            <View style={styles.stewardRow}>
              <Text style={styles.infoValue}>{order.stewardName}</Text>
              <Pressable
                onPress={handleContactSteward}
                style={styles.contactButton}
                accessibilityLabel="联系管家"
                accessibilityRole="button"
              >
                <Ionicons name="call" size={16} color={theme.colors.primary} />
                <Text style={styles.contactButtonText}>联系</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* 服务时间和地址 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>服务详情</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>服务时间</Text>
            <Text style={styles.infoValue}>
              {new Date(order.serviceTime).toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>服务地址</Text>
            <Text style={[styles.infoValue, styles.infoValue_multiline]}>
              {order.serviceAddress}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>订单备注</Text>
            <Text style={[styles.infoValue, styles.infoValue_multiline]}>
              {order.notes}
            </Text>
          </View>
        </View>

        {/* 支付信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>支付信息</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>支付状态</Text>
            <Text style={[styles.infoValue, { color: paymentInfo.color }]}>
              {paymentInfo.text}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>订单金额</Text>
            <Text style={styles.infoValue}>¥{order.totalAmount}</Text>
          </View>
          {order.paymentTime && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>支付时间</Text>
              <Text style={styles.infoValue}>
                {new Date(order.paymentTime).toLocaleString('zh-CN')}
              </Text>
            </View>
          )}
        </View>

        {/* 订单日志 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>订单日志</Text>
          <View style={styles.logItem}>
            <View style={styles.logTimeContainer}>
              <Text style={styles.logTime}>
                {new Date(order.createTime).toLocaleString('zh-CN')}
              </Text>
            </View>
            <View style={styles.logContent}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <Text style={styles.logText}>订单创建成功</Text>
            </View>
          </View>
          {order.paymentTime && (
            <View style={styles.logItem}>
              <View style={styles.logTimeContainer}>
                <Text style={styles.logTime}>
                  {new Date(order.paymentTime).toLocaleString('zh-CN')}
                </Text>
              </View>
              <View style={styles.logContent}>
                <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
                <Text style={styles.logText}>支付成功</Text>
              </View>
            </View>
          )}
          {order.finishTime && (
            <View style={styles.logItem}>
              <View style={styles.logTimeContainer}>
                <Text style={styles.logTime}>
                  {new Date(order.finishTime).toLocaleString('zh-CN')}
                </Text>
              </View>
              <View style={styles.logContent}>
                <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
                <Text style={styles.logText}>服务完成</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View style={styles.bottomBar}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>合计：</Text>
          <Text style={styles.totalValue}>¥{order.totalAmount}</Text>
        </View>
        <View style={styles.actionsContainer}>
          {order.orderStatus === 'UNPAID' && (
            <>
              <Button
                title="取消订单"
                onPress={handleCancelOrder}
                variant="outline"
                size="medium"
                style={styles.actionButton}
                accessibilityLabel="取消订单"
                accessibilityRole="button"
              />
              <Button
                title="立即支付"
                onPress={handlePayOrder}
                variant="primary"
                size="medium"
                style={styles.actionButton}
                accessibilityLabel="立即支付"
                accessibilityRole="button"
              />
            </>
          )}
          
          {order.orderStatus === 'PENDING' && (
            <>
              <Button
                title="取消订单"
                onPress={handleCancelOrder}
                variant="outline"
                size="medium"
                style={styles.actionButton}
                accessibilityLabel="取消订单"
                accessibilityRole="button"
              />
              <Button
                title="联系管家"
                onPress={handleContactSteward}
                variant="primary"
                size="medium"
                style={styles.actionButton}
                accessibilityLabel="联系管家"
                accessibilityRole="button"
              />
            </>
          )}
          
          {['COMPLETED', 'FINISHED'].includes(order.orderStatus) && (
            <Button
              title="评价服务"
              onPress={handleRateService}
              variant="primary"
              size="medium"
              style={styles.actionButton_full}
              accessibilityLabel="评价服务"
              accessibilityRole="button"
            />
          )}
        </View>
      </View>
    </SafeAreaView>
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
  },
  loadingText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerButton: {
    padding: theme.spacing[2],
  },
  headerTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textPrimary,
  },
  content: {
    flex: 1,
  },
  statusContainer: {
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    padding: theme.spacing[6],
    marginBottom: theme.spacing[2],
  },
  statusText: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    marginTop: theme.spacing[2],
  },
  statusSubtext: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing[1],
  },
  section: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[2],
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing[3],
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  infoLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  infoValue: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textPrimary,
    flex: 2,
    textAlign: 'right',
  },
  infoValue_multiline: {
    textAlign: 'right',
    flex: 2,
  },
  stewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing[2],
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.sm,
  },
  contactButtonText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.sm,
    marginLeft: theme.spacing[1],
  },
  logItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing[3],
  },
  logTimeContainer: {
    width: 100,
  },
  logTime: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  logContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  logText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing[2],
  },
  bottomBar: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing[4],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  totalLabel: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  totalValue: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    marginLeft: theme.spacing[1],
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginLeft: theme.spacing[2],
    minWidth: 100,
  },
  actionButton_full: {
    width: '100%',
  },
});

export default OrderDetailScreen;