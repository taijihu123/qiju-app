import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { get } from '../common/services/request';
import { logger } from '../common/services/logger';
import { theme } from '../common/styles/theme';
import SidebarContainer from '../components/SidebarContainer';

const MyPage = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [ordersCount, setOrdersCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [lifeCoin, setLifeCoin] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  // 加载用户信息
  const loadUserInfo = async () => {
    try {
      const response = await get('/user/profile');
      if (response.data.code === 200 && response.data.data) {
        setUserInfo(response.data.data);
      } else {
        logger.error('获取用户信息失败:', response.data.msg);
        // 使用模拟数据作为后备
        setUserInfo({
          id: 1,
          name: '上海智能Ailake',
          phone: '138****1234',
          email: 'zhangsan@example.com',
          avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20portrait%20friendly%20face&image_size=square',
          memberLevel: '黄金会员',
          registrationDate: '2023-05-15',
          location: '上海'
        });
      }
    } catch (error) {
      logger.error('获取用户信息失败:', error);
      
      // 检查是否是认证错误
      if (error.isAuthError || error.name === 'AuthError' || error.status === 401) {
        console.log('🔐 认证错误，使用模拟数据');
        // 使用模拟数据作为后备，不跳转到登录页面
        setUserInfo({
          id: 1,
          name: '上海智能Ailake',
          phone: '138****1234',
          email: 'zhangsan@example.com',
          avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20portrait%20friendly%20face&image_size=square',
          memberLevel: '黄金会员',
          registrationDate: '2023-05-15',
          location: '上海'
        });
        return;
      }
      
      // 其他错误，使用模拟数据作为后备
      setUserInfo({
        id: 1,
        name: '上海智能Ailake',
        phone: '138****1234',
        email: 'zhangsan@example.com',
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20portrait%20friendly%20face&image_size=square',
        memberLevel: '黄金会员',
        registrationDate: '2023-05-15',
        location: '上海'
      });
    }
  };

  // 加载订单统计
  const loadOrdersCount = async () => {
    try {
      const response = await get('/order/count');
      if (response.data.code === 200) {
        setOrdersCount(response.data.data || 0);
      } else {
        logger.error('获取订单统计失败:', response.data.msg);
        setOrdersCount(5); // 模拟数据
      }
    } catch (error) {
      logger.error('获取订单统计失败:', error);
      
      // 检查是否是认证错误
      if (error.isAuthError || error.name === 'AuthError' || error.status === 401) {
        console.log('🔐 认证错误，使用模拟数据');
        // 使用模拟数据作为后备，不跳转到登录页面
        setOrdersCount(5); // 模拟数据
        return;
      }
      
      setOrdersCount(5); // 模拟数据
    }
  };

  // 加载收藏统计
  const loadFavoritesCount = async () => {
    try {
      const response = await get('/favorites/count');
      if (response.data.code === 200) {
        setFavoritesCount(response.data.data || 0);
      } else {
        logger.error('获取收藏统计失败:', response.data.msg);
        setFavoritesCount(8); // 模拟数据
      }
    } catch (error) {
      logger.error('获取收藏统计失败:', error);
      
      // 检查是否是认证错误
      if (error.isAuthError || error.name === 'AuthError' || error.status === 401) {
        console.log('🔐 认证错误，使用模拟数据');
        // 使用模拟数据作为后备，不跳转到登录页面
        setFavoritesCount(8); // 模拟数据
        return;
      }
      
      setFavoritesCount(8); // 模拟数据
    }
  };

  // 加载生活币余额
  const loadLifeCoin = async () => {
    try {
      const response = await get('/life-coin/balance');
      if (response.data.code === 200) {
        setLifeCoin(response.data.data || 0);
      } else {
        logger.error('获取生活币余额失败:', response.data.msg);
        setLifeCoin(520); // 模拟数据
      }
    } catch (error) {
      logger.error('获取生活币余额失败:', error);
      
      // 检查是否是认证错误
      if (error.isAuthError || error.name === 'AuthError' || error.status === 401) {
        console.log('🔐 认证错误，使用模拟数据');
        // 使用模拟数据作为后备，不跳转到登录页面
        setLifeCoin(520); // 模拟数据
        return;
      }
      
      setLifeCoin(520); // 模拟数据
    }
  };

  // 刷新数据
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      loadUserInfo(),
      loadOrdersCount(),
      loadFavoritesCount(),
      loadLifeCoin()
    ]);
    setRefreshing(false);
  };

  // 跳转到相应页面
  const navigateToPage = (pageName) => {
    navigation.navigate(pageName);
  };

  // 退出登录
  const logout = () => {
    // 这里可以调用退出登录接口
    logger.info('退出登录');
    navigation.navigate('Login');
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(false);
      // 并行加载所有数据，让每个函数自己处理错误
      await Promise.all([
        loadUserInfo(),
        loadOrdersCount(),
        loadFavoritesCount(),
        loadLifeCoin()
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>加载个人信息中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={theme.colors.error} />
        <Text style={styles.errorText}>加载失败，请稍后重试</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => {
            setLoading(true);
            loadUserInfo();
            loadOrdersCount();
            loadFavoritesCount();
            loadLifeCoin();
          }}
        >
          <Text style={styles.retryButtonText}>重试</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SidebarContainer navigation={navigation}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
        >
          {/* 顶部豆瓣风格个人信息区域 */}
          <View style={styles.headerContainer}>
            <View style={styles.headerBackground}>
              {/* 背景渐变效果 */}
            </View>
            <View style={styles.userInfoContainer}>
              {/* 头像 */}
              <View style={styles.avatarContainer}>
                <Image 
                  source={{ uri: userInfo.avatar || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20portrait%20friendly%20face&image_size=square' }} 
                  style={styles.avatar} 
                />
              </View>
              
              {/* 用户名和ID */}
              <Text style={styles.userName}>{userInfo.name}</Text>
              <Text style={styles.userDetail}>ID: {userInfo.id} / IP: {userInfo.location || '上海'}</Text>
              <Text style={styles.userBio}>欢迎合作</Text>
              <Text style={styles.userTag}>时尚社会学博主</Text>
              
              {/* 关注信息 */}
              <View style={styles.followInfo}>
                <TouchableOpacity style={styles.followItem}>
                  <Text style={styles.followValue}>关注</Text>
                  <Text style={styles.followLabel}>139</Text>
                </TouchableOpacity>
                <View style={styles.followDivider} />
                <TouchableOpacity style={styles.followItem}>
                  <Text style={styles.followValue}>被关注</Text>
                  <Text style={styles.followLabel}>50</Text>
                </TouchableOpacity>
              </View>
              
              {/* 我的背包 - 豆瓣风格 */}
              <View style={styles.backpackContainer}>
                <View style={styles.backpackItem}>
                  <Ionicons name="document-text-outline" size={20} color={theme.colors.primary} />
                  <Text style={styles.backpackText}>租赁合同</Text>
                </View>
                <View style={styles.backpackDivider} />
                <View style={styles.backpackItem}>
                  <Ionicons name="cash-outline" size={20} color={theme.colors.primary} />
                  <Text style={styles.backpackText}>生活币: {lifeCoin}</Text>
                </View>
                <View style={styles.backpackDivider} />
                <View style={styles.backpackItem}>
                  <Ionicons name="star-outline" size={20} color={theme.colors.primary} />
                  <Text style={styles.backpackText}>{userInfo.memberLevel || '普通会员'}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* 功能菜单区 - 豆瓣风格 */}
          <View style={styles.menuContainer}>
            {/* 第一行功能 */}
            <View style={styles.menuRow}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => navigateToPage('ContractList')}
              >
                <View style={styles.menuIcon}>
                  <Ionicons name="document-text-outline" size={24} color={theme.colors.primary} />
                </View>
                <Text style={styles.menuText}>租赁合同</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => navigateToPage('OrderList')}
              >
                <View style={styles.menuIcon}>
                  <Ionicons name="receipt-outline" size={24} color={theme.colors.primary} />
                </View>
                <Text style={styles.menuText}>我的订单</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => navigateToPage('Favorites')}
              >
                <View style={styles.menuIcon}>
                  <Ionicons name="heart-outline" size={24} color={theme.colors.primary} />
                </View>
                <Text style={styles.menuText}>我的收藏</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => navigateToPage('LifeCoin')}
              >
                <View style={styles.menuIcon}>
                  <Ionicons name="coin-outline" size={24} color={theme.colors.primary} />
                </View>
                <Text style={styles.menuText}>生活币</Text>
              </TouchableOpacity>
            </View>
            
            {/* 第二行功能 */}
            <View style={styles.menuRow}>
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => navigateToPage('ServicePage')}
              >
                <View style={styles.menuIcon}>
                  <Ionicons name="construct-outline" size={24} color={theme.colors.primary} />
                </View>
                <Text style={styles.menuText}>生活服务</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => navigateToPage('StewardList')}
              >
                <View style={styles.menuIcon}>
                  <Ionicons name="people-outline" size={24} color={theme.colors.primary} />
                </View>
                <Text style={styles.menuText}>我的管家</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => navigateToPage('EditUserInfo')}
              >
                <View style={styles.menuIcon}>
                  <Ionicons name="person-outline" size={24} color={theme.colors.primary} />
                </View>
                <Text style={styles.menuText}>个人信息</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => navigateToPage('Knowledge')}
              >
                <View style={styles.menuIcon}>
                  <Ionicons name="book-outline" size={24} color={theme.colors.primary} />
                </View>
                <Text style={styles.menuText}>知识管理</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 其他功能区域 */}
          <View style={styles.otherContainer}>
            <TouchableOpacity 
              style={styles.otherItem}
              onPress={() => navigateToPage('Assistant')}
            >
              <View style={styles.otherItemLeft}>
                <Ionicons name="chatbubbles-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.otherItemText}>智能助手</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.otherItem}
              onPress={() => navigateToPage('Settings')}
            >
              <View style={styles.otherItemLeft}>
                <Ionicons name="settings-outline" size={24} color={theme.colors.primary} />
                <Text style={styles.otherItemText}>设置</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
            </TouchableOpacity>
          </View>

          {/* 退出登录 */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={logout}
          >
            <Text style={styles.logoutButtonText}>退出登录</Text>
          </TouchableOpacity>

          {/* 底部留白 */}
          <View style={styles.bottomSpace} />
        </ScrollView>
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
  // 顶部区域样式
  headerContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 30,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: theme.colors.primary,
  },
  userInfoContainer: {
    alignItems: 'center',
    zIndex: 1,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: theme.colors.white,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.white,
    marginBottom: 8,
  },
  userDetail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
  },
  userBio: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  userTag: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  followInfo: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  followItem: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  followValue: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  followLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.white,
  },
  followDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  // 背包样式
  backpackContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  backpackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  backpackText: {
    fontSize: 14,
    color: theme.colors.white,
    marginLeft: 6,
  },
  backpackDivider: {
    width: 1,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 10,
  },
  // 功能菜单样式
  menuContainer: {
    backgroundColor: theme.colors.white,
    marginTop: -20,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    ...theme.shadow.sm,
  },
  menuRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  menuItem: {
    alignItems: 'center',
  },
  menuIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  // 其他功能样式
  otherContainer: {
    backgroundColor: theme.colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    ...theme.shadow.sm,
  },
  otherItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  otherItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  otherItemText: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    marginLeft: 12,
  },
  // 退出登录按钮
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    alignItems: 'center',
    ...theme.shadow.sm,
  },
  logoutButtonText: {
    fontSize: 16,
    color: theme.colors.error,
    fontWeight: '500',
  },
  bottomSpace: {
    height: 30,
  },
});

export default MyPage;
