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
      id: 'contracts',
      title: '租房合同',
      icon: 'document-text-outline',
      onPress: () => {
        navigation.navigate('My');
        onClose();
      }
    },
    {
      id: 'orders',
      title: '我的订单',
      icon: 'receipt-outline',
      onPress: () => {
        navigation.navigate('My');
        onClose();
      }
    },
    {
      id: 'collections',
      title: '我的收藏',
      icon: 'bookmark-outline',
      onPress: () => {
        navigation.navigate('Favorites');
        onClose();
      }
    },
    {
      id: 'lifeCoin',
      title: '生活币',
      icon: 'cash-outline',
      onPress: () => {
        navigation.navigate('LifeCoin');
        onClose();
      }
    },
    {
      id: 'services',
      title: '生活服务',
      icon: 'cube-outline',
      onPress: () => {
        navigation.navigate('Service');
        onClose();
      }
    },
    {
      id: 'personal',
      title: '我的个人',
      icon: 'person-outline',
      onPress: () => {
        navigation.navigate('My');
        onClose();
      }
    },
    {
      id: 'info',
      title: '个人信息',
      icon: 'information-circle-outline',
      onPress: () => {
        navigation.navigate('My');
        onClose();
      }
    },
    {
      id: 'knowledge',
      title: '知识管理',
      icon: 'book-outline',
      onPress: () => {
        navigation.navigate('Knowledge');
        onClose();
      }
    },
    {
      id: 'assistant',
      title: '智能助手',
      icon: 'chatbubbles-outline',
      onPress: () => {
        navigation.navigate('Assistant');
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

});

export default DoubanSidebar;