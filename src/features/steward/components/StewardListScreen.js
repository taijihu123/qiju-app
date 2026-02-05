import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Pressable, SafeAreaView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Button from '../../../common/components/Button';
import { theme } from '../../../common/styles/theme';
import { get } from '../../../common/services/request';

const StewardListScreen = () => {
  const navigation = useNavigation();
  const [stewards, setStewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // 获取所有管家
  const fetchStewards = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await get('/life-service/stewards', { page: 1, size: 20 });
      setStewards(response.data.content || []);
    } catch (err) {
      console.error('Failed to fetch stewards:', err);
      setError('获取管家列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 下拉刷新
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchStewards();
    setRefreshing(false);
  };

  // 点击管家卡片，进入管家详情页
  const handleStewardPress = (steward) => {
    navigation.navigate('StewardDetail', { stewardId: steward.id });
  };

  // 渲染管家卡片
  const renderStewardCard = ({ item }) => {
    return (
      <Pressable
        style={styles.stewardCard}
        onPress={() => handleStewardPress(item)}
        accessibilityLabel={`管家 ${item.name}`}
        accessibilityRole="button"
      >
        {/* 管家头像 */}
        <Image
          source={{ uri: item.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces' }}
          style={styles.avatar}
          resizeMode="cover"
        />

        {/* 管家信息 */}
        <View style={styles.stewardInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{item.name}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>{item.rating || 4.5}</Text>
            </View>
          </View>

          <Text style={styles.specialty}>{item.specialty || '生活管家'}</Text>
          
          <View style={styles.statsRow}>
            <Text style={styles.stat}>{item.serviceCount || 0}次服务</Text>
            <Text style={styles.stat}>平均评分 {item.rating || 4.5}</Text>
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {item.description || '专业的生活管家，为您提供优质服务'}
          </Text>

          <View style={styles.tagsContainer}>
            {(item.serviceTypes || ['日常清洁', '烹饪']).slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 预约按钮 */}
        <Button
          title="预约"
          onPress={() => handleStewardPress(item)}
          variant="outline"
          size="small"
          style={styles.bookButton}
          accessibilityLabel="预约管家"
          accessibilityRole="button"
        />
      </Pressable>
    );
  };

  // 渲染空状态
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="people-outline" size={64} color={theme.colors.textDisabled} />
      <Text style={styles.emptyText}>{loading ? '加载中...' : error || '暂无管家数据'}</Text>
    </View>
  );

  useEffect(() => {
    fetchStewards();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* 页面头部 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>生活管家</Text>
        <Text style={styles.headerSubtitle}>专业的生活服务团队为您服务</Text>
      </View>

      {/* 搜索栏 */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
        <Text style={styles.searchPlaceholder}>搜索管家</Text>
      </View>

      {/* 管家列表 */}
      <FlatList
        data={stewards}
        renderItem={renderStewardCard}
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
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[3],
  },
  headerTitle: {
    fontSize: theme.fontSize.xl2,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing[1],
  },
  headerSubtitle: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.borderRadius.base,
    marginHorizontal: theme.spacing[6],
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    marginBottom: theme.spacing[4],
  },
  searchIcon: {
    marginRight: theme.spacing[2],
  },
  searchPlaceholder: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textDisabled,
  },
  listContainer: {
    paddingHorizontal: theme.spacing[6],
    paddingBottom: theme.spacing[6],
  },
  stewardCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: theme.spacing[4],
  },
  stewardInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[1],
  },
  name: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing[1],
  },
  specialty: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    marginBottom: theme.spacing[2],
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing[2],
  },
  stat: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing[3],
  },
  description: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    lineHeight: theme.fontSize.sm * 1.5,
    marginBottom: theme.spacing[2],
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing[2],
    marginBottom: theme.spacing[1],
  },
  tagText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
  },
  bookButton: {
    marginLeft: theme.spacing[3],
    alignSelf: 'flex-start',
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
  },
});

export default StewardListScreen;