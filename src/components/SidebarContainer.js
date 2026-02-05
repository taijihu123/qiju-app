import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../common/styles/theme';
import DoubanSidebar from './DoubanSidebar';

const { width: screenWidth } = Dimensions.get('window');
const SIDEBAR_WIDTH = 300;

const SidebarContainer = ({ children, navigation }) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(0));

  // 打开侧边栏
  const openSidebar = () => {
    setSidebarVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // 关闭侧边栏
  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSidebarVisible(false);
    });
  };

  // 计算侧边栏位置
  const sidebarTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-SIDEBAR_WIDTH, 0],
  });

  // 计算主内容区域位置
  const contentTranslateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SIDEBAR_WIDTH - 50],
  });

  // 计算背景透明度
  const overlayOpacity = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.5],
  });

  return (
    <View style={styles.container}>
      {/* 主内容区域 */}
      <Animated.View style={[styles.content, { transform: [{ translateX: contentTranslateX }] }]}>
        {/* 侧边栏开关按钮 */}
        <View style={styles.sidebarToggle}>
          <TouchableOpacity onPress={openSidebar} style={styles.menuButton}>
            <Ionicons name="menu" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>
        
        {/* 子组件内容 */}
        <View style={styles.childrenContainer}>
          {children}
        </View>
      </Animated.View>

      {/* 侧边栏 */}
      {sidebarVisible && (
        <>
          {/* 背景遮罩 */}
          <Animated.View
            style={[
              styles.overlay,
              { opacity: overlayOpacity },
            ]}
          >
            <TouchableOpacity style={styles.overlayTouchable} onPress={closeSidebar} />
          </Animated.View>

          {/* 侧边栏内容 */}
          <Animated.View
            style={[
              styles.sidebar,
              { transform: [{ translateX: sidebarTranslateX }] },
            ]}
          >
            <DoubanSidebar navigation={navigation} onClose={closeSidebar} />
          </Animated.View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  childrenContainer: {
    flex: 1,
  },
  sidebarToggle: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
  },
  menuButton: {
    padding: 8,
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    ...theme.shadow.sm,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.black,
    zIndex: 100,
  },
  overlayTouchable: {
    flex: 1,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    zIndex: 101,
  },
});

export default SidebarContainer;