import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../common/styles/theme';

const EnhancedLoading = ({ message = '加载中...', duration = 3000 }) => {
  const [progress, setProgress] = useState(0);
  const spinValue = new Animated.Value(0);
  const pulseValue = new Animated.Value(1);

  useEffect(() => {
    // 启动旋转动画
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // 启动脉冲动画
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // 模拟加载进度
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 10;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      {/* 应用Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [
              { rotate: spin },
              { scale: pulseValue },
            ],
          },
        ]}
      >
        <View style={styles.logoCircle}>
          <Ionicons name="home" size={48} color={theme.colors.white} />
        </View>
        <View style={styles.logoRing} />
      </Animated.View>

      {/* 应用名称 */}
      <Text style={styles.appName}>栖居</Text>
      <Text style={styles.slogan}>品质生活，从栖居开始</Text>

      {/* 加载信息 */}
      <Text style={styles.message}>{message}</Text>

      {/* 加载进度条 */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{Math.round(progress)}%</Text>
      </View>

      {/* 加载状态提示 */}
      <Text style={styles.statusText}>正在为您准备精彩内容...</Text>

      {/* 版本信息 */}
      <Text style={styles.version}>版本 1.0.0</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: 40,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 32,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  logoRing: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: theme.colors.primaryLight,
    borderStyle: 'dashed',
    zIndex: 1,
  },
  appName: {
    fontSize: 48,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  slogan: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 40,
  },
  message: {
    fontSize: 18,
    color: theme.colors.textPrimary,
    marginBottom: 32,
    textAlign: 'center',
  },
  progressContainer: {
    width: '100%',
    marginBottom: 32,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'right',
  },
  statusText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 40,
  },
  version: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});

export default EnhancedLoading;