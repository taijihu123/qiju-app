import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../common/services/api';
import { theme } from '../common/styles/theme';

const AilakeLoginPage = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async (e) => {
    e.preventDefault();
    // 登录逻辑
    setLoading(true);
    try {
      console.log('Login with:', phone, password);
      // 模拟登录延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 保存token到AsyncStorage
      const mockToken = 'mock_jwt_token_' + Date.now();
      await AsyncStorage.setItem('token', mockToken);
      
      // 导航到主页
      navigation.reset({
        index: 0,
        routes: [{ name: 'TenantTabs' }],
      });
    } catch (error) {
      console.error('Login failed:', error);
      alert('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo 区域 */}
        <View style={styles.logo}>
          <View style={styles.logoImage} />
        </View>

        {/* 标题 */}
        <View style={styles.title}>
          <Text style={styles.titleText}>Ailake</Text>
          <Text style={styles.subtitleText}>欢迎回来，请登录您的账户</Text>
        </View>

        {/* 登录表单白框 */}
        <View style={styles.formContainer}>
          <View style={styles.form}>
            {/* 手机或用户名输入框 */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>手机/用户名</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="请输入您的手机/用户名"
                style={styles.input}
                placeholderTextColor="#999"
              />
            </View>

            {/* 密码输入框 */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>密码</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="请输入您的密码"
                style={styles.input}
                placeholderTextColor="#999"
                secureTextEntry
              />
            </View>

            {/* 登录按钮 */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              style={[styles.loginButton, loading && styles.loginButtonLoading]}
            >
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="white" />
                  <Text style={styles.loginButtonText}>登录中...</Text>
                </View>
              ) : (
                <Text style={styles.loginButtonText}>登录</Text>
              )}
            </TouchableOpacity>

            {/* 辅助链接 */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>还没有账户？</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}>立即注册</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 版权信息 */}
        <View style={styles.copyright}>
          <Text style={styles.copyrightText}>© 2025 Ailake.保留所有权利。</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 64,
  },
  logo: {
    marginBottom: 20,
  },
  logoImage: {
    width: 60,
    height: 60,
    backgroundColor: '#09bb07',
    borderRadius: 30,
  },
  title: {
    alignItems: 'center',
    marginBottom: 30,
  },
  titleText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#09bb07',
    marginBottom: 8,
    fontFamily: 'System', // 使用系统默认无衬线字体
    letterSpacing: 1,
  },
  subtitleText: {
    fontSize: 14,
    color: '#666666',
  },
  formContainer: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
    padding: 32,
    marginBottom: 30,
  },
  form: {
    width: '100%',
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 50,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#fafafa',
  },
  loginButton: {
    height: 50,
    backgroundColor: '#09bb07',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    shadowColor: '#09bb07',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonLoading: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
    marginRight: 4,
  },
  registerLink: {
    fontSize: 14,
    color: '#09bb07',
    fontWeight: '500',
  },
  copyright: {
    marginTop: 10,
  },
  copyrightText: {
    fontSize: 12,
    color: '#999999',
  },
});

export default AilakeLoginPage;