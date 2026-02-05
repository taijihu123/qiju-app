import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Button from '../../../common/components/Button';
import { theme } from '../../../common/styles/theme';
import { get, post } from '../../../common/services/request';

const StewardDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { stewardId } = route.params;
  
  const [steward, setSteward] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedService, setSelectedService] = useState(null);

  // 获取管家详情
  const fetchStewardDetail = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await get(`/life-service/stewards/${stewardId}`);
      setSteward(response.data);
    } catch (err) {
      console.error('Failed to fetch steward details:', err);
      setError('获取管家详情失败');
    } finally {
      setLoading(false);
    }
  };

  // 预约服务
  const handleBookService = () => {
    if (!selectedService) {
      alert('请选择服务项目');
      return;
    }
    
    // 跳转到预约页面（预留功能）
    alert(`预约服务：${selectedService.name}`);
  };

  // 联系管家
  const handleContactSteward = () => {
    // 调用管家功能（预留功能）
    alert('联系管家功能开发中...');
  };

  useEffect(() => {
    fetchStewardDetail();
  }, [stewardId]);

  if (loading || !steward) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>管家详情</Text>
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
        {/* 管家基本信息 */}
        <View style={styles.basicInfoSection}>
          <Image
            source={{ uri: steward.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces' }}
            style={styles.avatar}
            resizeMode="cover"
          />
          
          <Text style={styles.name}>{steward.name}</Text>
          <Text style={styles.specialty}>{steward.specialty || '生活管家'}</Text>
          
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.rating}>{steward.rating || 4.5}</Text>
            <Text style={styles.ratingText}>({steward.serviceCount || 0}次服务)</Text>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{steward.serviceCount || 0}</Text>
              <Text style={styles.statLabel}>服务次数</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{steward.completionRate || '100%'}</Text>
              <Text style={styles.statLabel}>完成率</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{steward.responseTime || '15'}</Text>
              <Text style={styles.statLabel}>响应时间(分钟)</Text>
            </View>
          </View>
        </View>

        {/* 服务项目 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>服务项目</Text>
          <View style={styles.servicesContainer}>
            {([
              { id: 1, name: '日常清洁', price: 150, duration: '2小时' },
              { id: 2, name: '深度清洁', price: 300, duration: '4小时' },
              { id: 3, name: '烹饪服务', price: 200, duration: '2小时' },
              { id: 4, name: '衣物护理', price: 100, duration: '1小时' }
            ]).map((service) => (
              <Pressable
                key={service.id}
                style={[
                  styles.serviceItem,
                  selectedService?.id === service.id && styles.serviceItem_selected
                ]}
                onPress={() => setSelectedService(service)}
                accessibilityLabel={`服务 ${service.name}`}
                accessibilityRole="button"
              >
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDuration}>{service.duration}</Text>
                </View>
                <Text style={styles.servicePrice}>¥{service.price}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* 管家介绍 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>管家介绍</Text>
          <Text style={styles.description}>{steward.description || '专业的生活管家，为您提供优质服务'}</Text>
        </View>

        {/* 服务评价 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>服务评价</Text>
          <View style={styles.reviewsContainer}>
            {([
              { id: 1, user: '张先生', content: '服务态度非常好，专业度高', rating: 5, date: '2025-12-15' },
              { id: 2, user: '李女士', content: '准时到达，工作认真负责', rating: 4, date: '2025-12-10' }
            ]).map((review) => (
              <View key={review.id} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewUser}>{review.user}</Text>
                  <Text style={styles.reviewDate}>{review.date}</Text>
                </View>
                <View style={styles.reviewRating}>
                  {Array(review.rating).fill(0).map((_, i) => (
                    <Ionicons key={i} name="star" size={16} color="#FFD700" />
                  ))}
                </View>
                <Text style={styles.reviewContent}>{review.content}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View style={styles.bottomBar}>
        <Pressable
          style={styles.actionButton}
          onPress={handleContactSteward}
          accessibilityLabel="联系管家"
          accessibilityRole="button"
        >
          <Ionicons name="call" size={24} color={theme.colors.primary} />
          <Text style={styles.actionButtonText}>联系管家</Text>
        </Pressable>
        <Button
          title="立即预约"
          onPress={handleBookService}
          variant="primary"
          size="large"
          style={styles.bookButton}
        />
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
  basicInfoSection: {
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    padding: theme.spacing[6],
    marginBottom: theme.spacing[2],
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: theme.spacing[4],
  },
  name: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing[1],
  },
  specialty: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    marginBottom: theme.spacing[3],
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  rating: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing[1],
  },
  ratingText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing[2],
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing[1],
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
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
  servicesContainer: {
    gap: theme.spacing[3],
  },
  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing[3],
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.base,
  },
  serviceItem_selected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing[1],
  },
  serviceDuration: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  servicePrice: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  description: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: theme.fontSize.md * 1.5,
  },
  reviewsContainer: {
    gap: theme.spacing[3],
  },
  reviewItem: {
    paddingBottom: theme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[1],
  },
  reviewUser: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textPrimary,
  },
  reviewDate: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  reviewRating: {
    flexDirection: 'row',
    marginBottom: theme.spacing[1],
  },
  reviewContent: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    lineHeight: theme.fontSize.md * 1.5,
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[4],
    marginRight: theme.spacing[3],
  },
  actionButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    marginLeft: theme.spacing[1],
  },
  bookButton: {
    flex: 1,
  },
});

export default StewardDetailScreen;