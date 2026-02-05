import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../common/styles/theme';
import { get } from '../common/services/request';

const FavoritesPage = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('housing'); // housing, service
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // 加载收藏数据
  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 模拟收藏数据
      const mockFavorites = {
        housing: [
          {
            id: '1',
            title: '精装修两居室，近地铁',
            price: 6500,
            area: '89㎡',
            location: '北京市朝阳区望京',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20apartment%20interior%20with%20living%20room%20and%20bedroom&image_size=square',
            createTime: '2024-01-15'
          },
          {
            id: '2',
            title: '阳光充足一居室，配套齐全',
            price: 4200,
            area: '55㎡',
            location: '北京市海淀区中关村',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=bright%20studio%20apartment%20with%20modern%20furniture&image_size=square',
            createTime: '2024-01-10'
          },
          {
            id: '3',
            title: '豪华三居室，拎包入住',
            price: 12000,
            area: '135㎡',
            location: '北京市西城区金融街',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20three%20bedroom%20apartment%20with%20high%20end%20decor&image_size=square',
            createTime: '2024-01-05'
          }
        ],
        service: [
          {
            id: '1',
            title: '专业家政保洁',
            price: 80,
            unit: '小时',
            description: '专业保洁团队，全方位清洁',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20housekeeping%20service%20cleaning%20living%20room&image_size=square',
            createTime: '2024-01-12'
          },
          {
            id: '2',
            title: '家电维修服务',
            price: 100,
            unit: '次',
            description: '专业技师，快速上门',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20technician%20repairing%20home%20appliance&image_size=square',
            createTime: '2024-01-08'
          }
        ]
      };
      
      setFavorites(mockFavorites[activeTab]);
    } catch (err) {
      console.error('加载收藏失败:', err);
      setError('加载收藏失败');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  // 下拉刷新
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadFavorites();
    setRefreshing(false);
  };

  // 渲染收藏的房源项
  const renderHousingItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.favoriteItem}
      onPress={() => navigation.navigate('HouseDetail', { houseId: item.id })}
    >
      <View style={styles.itemImageContainer}>
        <Text style={styles.itemPrice}>¥{item.price}</Text>
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <View style={styles.itemDetails}>
          <Text style={styles.itemDetailText}>{item.area}</Text>
          <Text style={styles.itemDetailDivider}>|</Text>
          <Text style={styles.itemDetailText}>{item.location}</Text>
        </View>
        <Text style={styles.itemTime}>收藏时间: {item.createTime}</Text>
      </View>
    </TouchableOpacity>
  );

  // 渲染收藏的服务项
  const renderServiceItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.favoriteItem}
      onPress={() => navigation.navigate('ServiceDetail', { serviceId: item.id })}
    >
      <View style={styles.itemImageContainer}>
        <Text style={styles.itemPrice}>¥{item.price}/{item.unit}</Text>
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <Text style={styles.itemTime}>收藏时间: {item.createTime}</Text>
      </View>
    </TouchableOpacity>
  );

  // 渲染空状态
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons 
        name={activeTab === 'housing' ? 'home-outline' : 'construct-outline'} 
        size={64} 
        color={theme.colors.textSecondary} 
      />
      <Text style={styles.emptyText}>暂无收藏</Text>
      <Text style={styles.emptySubtext}>
        {activeTab === 'housing' ? '您还没有收藏任何房源' : '您还没有收藏任何服务'}
      </Text>
      <TouchableOpacity 
        style={styles.emptyButton}
        onPress={() => navigation.navigate(activeTab === 'housing' ? 'Housing' : 'ServicePage')}
      >
        <Text style={styles.emptyButtonText}>
          {activeTab === 'housing' ? '去寻找房源' : '去浏览服务'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    loadFavorites();
  }, [activeTab]);

  return (
    <View style={styles.container}>
      {/* 页面头部 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>我的收藏</Text>
        <View style={styles.placeholder} />
      </View>

      {/* 标签切换 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'housing' && styles.activeTab]} 
          onPress={() => setActiveTab('housing')}
        >
          <Text style={[styles.tabText, activeTab === 'housing' && styles.activeTabText]}>房源</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'service' && styles.activeTab]} 
          onPress={() => setActiveTab('service')}
        >
          <Text style={[styles.tabText, activeTab === 'service' && styles.activeTabText]}>服务</Text>
        </TouchableOpacity>
      </View>

      {/* 收藏列表 */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>加载收藏中...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={theme.colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadFavorites}>
            <Text style={styles.retryButtonText}>重试</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={activeTab === 'housing' ? renderHousingItem : renderServiceItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
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
      )}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
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
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: 40,
  },
  errorText: {
    marginTop: 20,
    fontSize: 16,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: 24,
  },
  retryButtonText: {
    fontSize: 16,
    color: theme.colors.white,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  favoriteItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    overflow: 'hidden',
  },
  itemImageContainer: {
    width: 120,
    height: 120,
    backgroundColor: theme.colors.backgroundSecondary,
    justifyContent: 'flex-end',
    padding: 12,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.white,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  itemInfo: {
    flex: 1,
    padding: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemDetailText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  itemDetailDivider: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginHorizontal: 8,
  },
  itemDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  itemTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
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
    textAlign: 'center',
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

export default FavoritesPage;