import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getServices, getServiceCategories } from '../common/services/serviceApi';
import { logger } from '../common/services/logger';
import { theme } from '../common/styles/theme';
import SidebarContainer from '../components/SidebarContainer';
import ServiceCard from '../components/ServiceCard';
import ServiceCategory from '../components/ServiceCategory';

const ServicePage = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredServices, setFilteredServices] = useState([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('加载失败，请稍后重试');

  // 加载服务分类
  const loadCategories = async () => {
    try {
      setError(false);
      const response = await getServiceCategories();
      if (response.code === 200) {
        const categoriesData = Array.isArray(response.data) ? response.data : [];
        console.log('分类数据:', categoriesData);
        setCategories(categoriesData);
      } else {
        logger.error('获取服务分类失败:', response.msg);
        setCategories([]);
      }
    } catch (error) {
      logger.error('获取服务分类失败:', error);
      
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
      
      setCategories([]);
    }
  };

  // 加载服务项目
  const loadServices = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await getServices();
      if (response.code === 200) {
        const servicesData = Array.isArray(response.data) ? response.data : [];
        console.log('收到的服务数据:', servicesData);
        setServices(servicesData);
        setFilteredServices(servicesData);
      } else {
        logger.error('获取服务项目失败:', response.msg);
        setServices([]);
        setFilteredServices([]);
      }
    } catch (error) {
      logger.error('获取服务项目失败:', error);
      
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
      
      // 其他错误
      setError(true);
      setErrorMessage(error.message || '加载失败，请稍后重试');
      setServices([]);
      setFilteredServices([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 刷新数据
  const onRefresh = () => {
    setRefreshing(true);
    loadCategories();
    loadServices();
  };

  // 筛选服务
  const filterServicesByCategory = (categoryId) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      setFilteredServices(Array.isArray(services) ? services : []);
    } else {
      setFilteredServices(Array.isArray(services) ? services.filter(service => service.categoryId === categoryId) : []);
    }
  };

  // 渲染服务项
  const renderService = ({ item }) => (
    <ServiceCard
      service={item}
      onPress={() => navigation.navigate('ServiceDetail', { serviceId: item?.id })}
    />
  );

  // 查看管家列表
  const viewStewards = () => {
    navigation.navigate('StewardList');
  };

  useEffect(() => {
    loadCategories();
    loadServices();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>加载服务数据中...</Text>
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
            loadCategories();
            loadServices();
          }}
        >
          <Text style={styles.retryButtonText}>重试</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>生活服务</Text>
          <Text style={styles.headerSubtitle}>您的生活好帮手</Text>
        </View>

        {/* 生活管家 */}
        <TouchableOpacity
          style={styles.stewardRecommend}
          onPress={viewStewards}
        >
          <View style={styles.stewardContent}>
            <View style={styles.stewardIconContainer}>
              <Ionicons name="people-circle-outline" size={48} color={theme.colors.primary} />
            </View>
            <View style={styles.stewardInfo}>
              <Text style={styles.stewardTitle}>生活管家</Text>
              <Text style={styles.stewardDescription}>为您提供贴心的生活服务</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward-outline" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        {/* 智能体 */}
        <TouchableOpacity
          style={styles.stewardRecommend}
          onPress={() => navigation.navigate('Assistant')}
        >
          <View style={styles.stewardContent}>
            <View style={styles.stewardIconContainer}>
              <Ionicons name="chatbubbles-outline" size={48} color={theme.colors.primary} />
            </View>
            <View style={styles.stewardInfo}>
              <Text style={styles.stewardTitle}>智能体</Text>
              <Text style={styles.stewardDescription}>为您提供智能的生活助手服务</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward-outline" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        {/* 自助菜单 */}
        <TouchableOpacity
          style={styles.stewardRecommend}
          onPress={() => navigation.navigate('MenuPage')}
        >
          <View style={styles.stewardContent}>
            <View style={styles.stewardIconContainer}>
              <Ionicons name="cafe-outline" size={48} color={theme.colors.primary} />
            </View>
            <View style={styles.stewardInfo}>
              <Text style={styles.stewardTitle}>自助菜单</Text>
              <Text style={styles.stewardDescription}>在线点餐，享受美味咖啡和甜品</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward-outline" size={24} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        {/* 服务列表 */}
        <View style={styles.servicesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'all' ? '全部服务' : 
               (Array.isArray(categories) && categories.find(c => c.id === selectedCategory))?.name || '服务列表'}
            </Text>
            <Text style={styles.serviceCount}>{Array.isArray(filteredServices) ? filteredServices.length : 0}项服务</Text>
          </View>

          <FlatList
            data={Array.isArray(filteredServices) ? filteredServices : []}
            renderItem={renderService}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.servicesList}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="cube-outline" size={64} color={theme.colors.textSecondary} />
                <Text style={styles.emptyText}>暂无相关服务</Text>
              </View>
            }
          />
        </View>
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
  categoriesContainer: {
    paddingVertical: 12,
    backgroundColor: theme.colors.white,
  },
  categoriesList: {
    paddingHorizontal: 18,
  },
  stewardRecommend: {
    margin: 18,
    padding: 20,
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...theme.shadow.md,
  },
  stewardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stewardIconContainer: {
    marginRight: 20,
  },
  stewardInfo: {
    flex: 1,
  },
  stewardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  stewardDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  servicesSection: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  serviceCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  servicesList: {
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

export default ServicePage;
