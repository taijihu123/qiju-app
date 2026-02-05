import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../common/styles/theme';

const DoubanSidebar = ({ navigation, onClose }) => {
  // 模拟用户数据
  const userData = {
    id: '1',
    name: '上海智能Ailake',
    avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=green%20plant%20avatar%20circle%20douban%20style&image_size=square',
    backpack: {
      items: 11,
      hasNew: true
    }
  };

  // 功能菜单项
  const menuItems = [
    {
      id: 'drafts',
      title: '草稿箱',
      icon: 'document-text-outline',
      onPress: () => {
        navigation.navigate('Favorites');
        onClose();
      }
    },
    {
      id: 'collections',
      title: '我的收藏/豆列',
      subtitle: '我的豆列在这里',
      icon: 'bookmark-outline',
      onPress: () => {
        navigation.navigate('Favorites');
        onClose();
      }
    },
    {
      id: 'following',
      title: '我的关注',
      icon: 'add-circle-outline',
      onPress: () => {
        navigation.navigate('Community');
        onClose();
      }
    },
    {
      id: 'history',
      title: '浏览历史',
      icon: 'time-outline',
      onPress: () => {
        navigation.navigate('My');
        onClose();
      }
    },
    {
      id: 'minor',
      title: '未成年人模式',
      icon: 'shield-checkmark-outline',
      onPress: () => {
        navigation.navigate('Settings');
        onClose();
      }
    },
    {
      id: 'settings',
      title: '设置',
      icon: 'settings-outline',
      onPress: () => {
        navigation.navigate('Settings');
        onClose();
      }
    },
    {
      id: 'help',
      title: '帮助与反馈',
      icon: 'help-circle-outline',
      onPress: () => {
        navigation.navigate('My');
        onClose();
      }
    },
    {
      id: 'community',
      title: '社区管理中心',
      icon: 'people-outline',
      onPress: () => {
        navigation.navigate('Community');
        onClose();
      }
    }
  ];

  // 快捷功能项
  const quickItems = [
    {
      id: 'orders',
      title: '订单',
      icon: 'receipt-outline',
      onPress: () => {
        navigation.navigate('OrderList');
        onClose();
      }
    },
    {
      id: 'cart',
      title: '购物车',
      icon: 'cart-outline',
      onPress: () => {
        navigation.navigate('Supermarket');
        onClose();
      }
    },
    {
      id: 'wallet',
      title: '钱包',
      icon: 'wallet-outline',
      onPress: () => {
        navigation.navigate('LifeCoin');
        onClose();
      }
    },
    {
      id: 'time',
      title: '豆瓣时间',
      icon: 'time-outline',
      onPress: () => {
        navigation.navigate('Community');
        onClose();
      }
    },
    {
      id: 'reading',
      title: '豆瓣阅读',
      icon: 'book-outline',
      onPress: () => {
        navigation.navigate('Knowledge');
        onClose();
      }
    },
    {
      id: 'welfare',
      title: '每日福利',
      icon: 'gift-outline',
      onPress: () => {
        navigation.navigate('LifeCoin');
        onClose();
      }
    }
  ];

  return (
    <View style={styles.container}>
      {/* 顶部用户信息 */}
      <View style={styles.header}>
        <Image source={{ uri: userData.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userData.name}</Text>
          <TouchableOpacity style={styles.backpackButton}>
            <Text style={styles.backpackText}>我的背包</Text>
            <View style={styles.backpackBadge}>
              <Ionicons name="leaf" size={12} color={theme.colors.white} />
              <Text style={styles.backpackCount}>{userData.backpack.items}</Text>
              {userData.backpack.hasNew && (
                <View style={styles.newBadge} />
              )}
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* 功能菜单 */}
      <ScrollView style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.menuItem, index === menuItems.length - 1 && styles.lastMenuItem]}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <Ionicons name={item.icon} size={24} color={theme.colors.textPrimary} />
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                {item.subtitle && (
                  <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                )}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 快捷功能 */}
      <View style={styles.quickSection}>
        <View style={styles.quickGrid}>
          {quickItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={styles.quickItem}
              onPress={item.onPress}
            >
              <View style={styles.quickItemIcon}>
                <Ionicons name={item.icon} size={24} color={theme.colors.primary} />
              </View>
              <Text style={styles.quickItemText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 底部认证信息 */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.licenseButton}>
          <Ionicons name="shield-checkmark" size={16} color={theme.colors.primary} />
          <Text style={styles.licenseText}>豆瓣 证照信息</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 300,
    backgroundColor: theme.colors.white,
  },
  // 顶部用户信息
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    backgroundColor: theme.colors.primaryLight,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
  },
  userInfo: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  backpackButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backpackText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginRight: 8,
  },
  backpackBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  backpackCount: {
    fontSize: 12,
    color: theme.colors.white,
    marginLeft: 4,
  },
  newBadge: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.error,
    marginLeft: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 4,
  },
  // 功能菜单
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    marginLeft: 16,
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  // 快捷功能
  quickSection: {
    padding: 20,
    borderTopWidth: 8,
    borderTopColor: theme.colors.borderLight,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickItem: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 20,
  },
  quickItemIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickItemText: {
    fontSize: 12,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  // 底部
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  licenseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  licenseText: {
    fontSize: 12,
    color: theme.colors.primary,
    marginLeft: 4,
  },
});

export default DoubanSidebar;