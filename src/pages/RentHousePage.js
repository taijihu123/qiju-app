import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { get } from '../common/services/request';
import { logger } from '../common/services/logger';
import { theme } from '../common/styles/theme';
import HouseCard from '../components/HouseCard';
import SearchBar from '../components/SearchBar';
import TagFilter from '../components/TagFilter';
import SidebarContainer from '../components/SidebarContainer';

const RentHousePage = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('dynamic'); // dynamic 或 recommend
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState([]);
  const [filteredHouses, setFilteredHouses] = useState([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('加载失败，请稍后重试');

  // 加载房源数据
  const loadHouses = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await get('/rent/houses');
      if (response.data.code === 200) {
        const housesData = Array.isArray(response.data.data) ? response.data.data : [];
        // 将后端返回的数据转换为HouseCard组件期望的格式
        const formattedHouses = housesData.map(house => ({
          ...house,
          title: house.name, // 后端是name，前端期望title
          price: house.rent, // 后端是rent，前端期望price
          imgUrl: house.imageUrl, // 后端是imageUrl，前端期望imgUrl
          // 将tags从JSON字符串转换为数组
          tags: Array.isArray(house.tags) ? house.tags : 
                typeof house.tags === 'string' ? JSON.parse(house.tags) : []
        }));
        console.log('获取到的房源数据:', formattedHouses);
        setHouses(formattedHouses);
        setFilteredHouses(formattedHouses);
      } else {
        logger.error('获取房源失败:', response.data.msg);
      }
    } catch (error) {
      logger.error('获取房源失败:', error);
      
      // 检查是否是认证错误
      if (error.isAuthError || error.name === 'AuthError' || error.status === 401) {
        console.log('🔐 认证错误，跳转到登录页面');
        // 跳转到登录页面
        navigation.navigate('Login');
        // 重置状态
        setLoading(false);
        setRefreshing(false);
        return;
      }
      
      // 其他错误，使用模拟数据作为后备
      setError(true);
      setErrorMessage(error.message || '加载失败，请稍后重试');
      
      const mockHouses = [
        {
          id: 1,
          title: '精装修两居室',
          area: '85㎡',
          price: 3500,
          address: '北京市朝阳区建国路88号',
          description: '南北通透，采光好，家具齐全，交通便利',
          tags: ['地铁附近', '拎包入住', '近商场'],
          images: ['/static/images/house1.jpg']
        },
        {
          id: 2,
          title: '温馨一居室',
          area: '55㎡',
          price: 2800,
          address: '上海市浦东新区陆家嘴环路168号',
          description: '高层景观房，视野开阔，周边配套完善',
          tags: ['高层', '景观房', '配套完善'],
          images: ['/static/images/house2.jpg']
        }
      ];
      setHouses(mockHouses);
      setFilteredHouses(mockHouses);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 刷新数据
  const onRefresh = () => {
    setRefreshing(true);
    loadHouses();
  };

  // 搜索和筛选房源
  const applyFilters = () => {
    let result = houses || [];

    // 应用搜索查询
    if (searchQuery.trim() && result.length > 0) {
      const query = searchQuery.toLowerCase();
      result = result.filter(house => 
        house && house.title && house.title.toLowerCase().includes(query) ||
        house && house.address && house.address.toLowerCase().includes(query) ||
        house && house.description && house.description.toLowerCase().includes(query)
      );
    }

    // 应用标签筛选
    if (filters.length > 0 && result.length > 0) {
      result = result.filter(house => 
        house && house.tags && Array.isArray(house.tags) &&
        filters.every(filter => house.tags.includes(filter))
      );
    }

    setFilteredHouses(result);
  };

  // 处理搜索查询变化
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  // 处理搜索提交
  const handleSearchSubmit = () => {
    applyFilters();
  };

  // 处理标签选择
  const handleTagSelect = (tag) => {
    setFilters(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  // 清除所有筛选
  const clearFilters = () => {
    setSearchQuery('');
    setFilters([]);
    setFilteredHouses(houses);
  };

  // 渲染房源项
  const renderHouse = ({ item }) => (
    <HouseCard
      house={item}
      onPress={() => navigation.navigate('HouseDetail', { houseId: item.id })}
    />
  );

  // 获取所有可用标签
  const getAllTags = () => {
    const tags = new Set();
    if (houses && houses.length > 0) {
      houses.forEach(house => {
        if (house.tags && Array.isArray(house.tags)) {
          house.tags.forEach(tag => tags.add(tag));
        }
      });
    }
    return Array.from(tags);
  };

  useEffect(() => {
    loadHouses();
  }, []);

  // 当筛选条件变化时重新筛选
  useEffect(() => {
    applyFilters();
  }, [filters]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>加载房源数据中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={theme.colors.error} />
        <Text style={styles.errorText}>{errorMessage}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => {
            setLoading(true);
            loadHouses();
          }}
        >
          <Text style={styles.retryButtonText}>重试</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 模拟社区帖子数据
  const mockPosts = [
    {
      id: '1',
      userName: 'BLACKMAMBA',
      content: 'Why she giving Ningning down here omg',
      createdAt: '2小时前',
      likes: 5379,
      comments: 284,
      shares: 163,
      groupName: '稿子不是这么写的小组'
    },
    {
      id: '2',
      userName: '礼拜天',
      content: '衣服虽然穿反了，但是科室挂对了',
      createdAt: '4小时前',
      likes: 128,
      comments: 43,
      shares: 4,
      groupName: '医疗行业交流'
    }
  ];

  // 渲染社区帖子
  const renderPost = (post) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Text style={styles.postGroupName}>{post.groupName}</Text>
      </View>
      <Text style={styles.postContent}>{post.content}</Text>
      <View style={styles.postMeta}>
        <Text style={styles.postAuthor}>{post.userName}</Text>
        <Text style={styles.postTime}>{post.createdAt}</Text>
      </View>
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.actionText}>{post.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.actionText}>{post.shares}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SidebarContainer navigation={navigation}>
      <View style={styles.container}>
        {/* 顶部搜索栏 */}
        <View style={styles.header}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.searchPlaceholder}>去油蓬松的邪恶...</Text>
          </View>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="headset-outline" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="mail-outline" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* 动态/推荐标签切换 */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'dynamic' && styles.tabActive]}
            onPress={() => setActiveTab('dynamic')}
          >
            <Text style={[styles.tabText, activeTab === 'dynamic' && styles.tabTextActive]}>
              动态
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'recommend' && styles.tabActive]}
            onPress={() => setActiveTab('recommend')}
          >
            <Text style={[styles.tabText, activeTab === 'recommend' && styles.tabTextActive]}>
              推荐
            </Text>
          </TouchableOpacity>
        </View>

        {/* 聚合信息流 */}
        <ScrollView
          contentContainerStyle={styles.feedContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        >
          {/* 推荐房源 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>推荐房源</Text>
            {filteredHouses.length > 0 ? (
              filteredHouses.slice(0, 3).map(item => (
                <HouseCard
                  key={item.id}
                  house={item}
                  onPress={() => navigation.navigate('HouseDetail', { houseId: item.id })}
                />
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="home-outline" size={64} color={theme.colors.textSecondary} />
                <Text style={styles.emptyText}>暂无推荐房源</Text>
              </View>
            )}
          </View>

          {/* 社区动态 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>社区动态</Text>
            {mockPosts.map(post => renderPost(post))}
          </View>

          {/* 栖居APP推荐 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>栖居APP</Text>
            <View style={styles.appCard}>
              <View style={styles.appInfo}>
                <Text style={styles.appTitle}>栖居APP</Text>
                <Text style={styles.appDescription}>您的智能生活管家</Text>
              </View>
              <TouchableOpacity style={styles.appButton}>
                <Text style={styles.appButtonText}>了解更多</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* 发布按钮 */}
        <TouchableOpacity style={styles.fab}>
          <Ionicons name="create" size={24} color={theme.colors.white} />
        </TouchableOpacity>
      </View>
    </SidebarContainer>
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
  header: {
    padding: 24,
    backgroundColor: theme.colors.white,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
  filterSection: {
    padding: 18,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },
  clearFilterButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  clearFilterText: {
    color: theme.colors.primaryActive,
    fontSize: 14,
    fontWeight: '500',
  },
  houseList: {
    padding: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 120,
  },
  emptyText: {
    marginTop: 24,
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
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
    ...theme.shadow.sm,
  },
  retryButtonText: {
    fontSize: 16,
    color: theme.colors.white,
    fontWeight: 'bold',
  },
});

export default RentHousePage;
