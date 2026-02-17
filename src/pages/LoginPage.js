import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../common/services/api';
import { theme } from '../common/styles/theme';

const LoginPage = () => {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleWechatLogin = async () => {
    if (!agreed) {
      // 提示用户同意协议
      alert('请阅读并同意用户服务协议和隐私政策');
      return;
    }

    setLoading(true);
    try {
      // 这里应该调用微信登录SDK
      // 模拟微信登录成功
      setTimeout(async () => {
        // 模拟登录成功后获取token
        const mockToken = 'mock_jwt_token_' + Date.now();
        
        // 保存token到AsyncStorage
        await AsyncStorage.setItem('token', mockToken);
        
        // 导航到主页
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      }, 1500);
    } catch (error) {
      console.error('微信登录失败:', error);
      alert('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = () => {
    navigation.navigate('PhoneLogin');
  };

  const handleEmailLogin = () => {
    navigation.navigate('EmailLogin');
  };

  const handleWalletLogin = () => {
    navigation.navigate('WalletLogin');
  };

  const handleAppleLogin = () => {
    // 实现Apple登录
    alert('Apple登录功能开发中');
  };

  const handleGithubLogin = () => {
    // 实现Github登录
    alert('Github登录功能开发中');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 登录标题 */}
        <Text style={styles.title}>微信登录</Text>
        
        {/* 微信图标和按钮 */}
        <View style={styles.wechatSection}>
          <View style={styles.wechatIcon}>
            <View style={styles.wechatLogo} />
          </View>
          <TouchableOpacity
            style={[styles.wechatButton, !agreed && styles.disabledButton]}
            onPress={handleWechatLogin}
            disabled={!agreed || loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.wechatButtonText}>微信授权</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* 用户协议 */}
        <View style={styles.agreementSection}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAgreed(!agreed)}
          >
            <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
              {agreed && <Ionicons name="checkmark" size={16} color="white" />}
            </View>
            <Text style={styles.agreementText}>
              我已阅读并同意
              <Text style={styles.linkText}>《用户服务协议》</Text>
              和
              <Text style={styles.linkText}>《隐私政策》</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* 其他登录方式 */}
        <View style={styles.otherLoginSection}>
          <Text style={styles.otherLoginTitle}>其他登录方式</Text>
          <View style={styles.loginOptions}>
            <TouchableOpacity style={styles.loginOption} onPress={handlePhoneLogin}>
              <View style={[styles.optionIcon, styles.phoneIcon]}>
                <Ionicons name="call" size={24} color="white" />
              </View>
              <Text style={styles.optionText}>手机号</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.loginOption} onPress={handleEmailLogin}>
              <View style={[styles.optionIcon, styles.emailIcon]}>
                <Ionicons name="mail" size={24} color="white" />
              </View>
              <Text style={styles.optionText}>邮箱</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.loginOption} onPress={handleWalletLogin}>
              <View style={[styles.optionIcon, styles.walletIcon]}>
                <Ionicons name="wallet" size={24} color="white" />
              </View>
              <Text style={styles.optionText}>钱包</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.loginOption} onPress={handleAppleLogin}>
              <View style={[styles.optionIcon, styles.appleIcon]}>
                <Ionicons name="logo-apple" size={24} color="white" />
              </View>
              <Text style={styles.optionText}>Apple</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.loginOption} onPress={handleGithubLogin}>
              <View style={[styles.optionIcon, styles.githubIcon]}>
                <Ionicons name="logo-github" size={24} color="white" />
              </View>
              <Text style={styles.optionText}>Github</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 48,
    color: theme.colors.text,
  },
  wechatSection: {
    alignItems: 'center',
    marginBottom: 48,
  },
  wechatIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#07C160',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  wechatLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'white',
  },
  wechatButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC',
  },
  wechatButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  agreementSection: {
    width: '100%',
    marginBottom: 48,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginRight: 8,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  agreementText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.textSecondary,
  },
  linkText: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  otherLoginSection: {
    width: '100%',
  },
  otherLoginTitle: {
    textAlign: 'center',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  loginOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loginOption: {
    alignItems: 'center',
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  phoneIcon: {
    backgroundColor: '#4A90E2',
  },
  emailIcon: {
    backgroundColor: '#50E3C2',
  },
  walletIcon: {
    backgroundColor: '#F5A623',
  },
  appleIcon: {
    backgroundColor: '#000000',
  },
  githubIcon: {
    backgroundColor: '#333333',
  },
  optionText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});

export default LoginPage;