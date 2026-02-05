import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../../contexts/UserContext';
import Button from '../../../common/components/Button';
import Input from '../../../common/components/Input';
import { theme } from '../../../common/styles/theme';
import { put } from '../../../common/services/request';

const EditUserInfoScreen = () => {
  const navigation = useNavigation();
  const { user, updateUserProfile, loading } = useUser();
  
  const [formData, setFormData] = useState({
    username: '',
    nickname: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState('');
  
  // 初始化表单数据
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        nickname: user.nickname || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);
  
  // 表单验证
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = '请输入用户名';
    } else if (formData.username.length < 3) {
      newErrors.username = '用户名至少需要3个字符';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    
    if (formData.phone && !/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '请输入有效的手机号';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // 保存用户信息
  const handleSave = async () => {
    if (!validateForm()) return;
    
    setSaveError('');
    
    try {
      // 调用更新用户信息的API
      await updateUserProfile(formData);
      
      // 保存成功后返回MyPage
      navigation.goBack();
      alert('用户信息更新成功');
    } catch (error) {
      console.error('Save user info failed:', error);
      const errorMsg = error.response?.data?.message || error.message || '保存失败，请稍后重试';
      setSaveError(errorMsg);
    }
  };
  
  // 处理输入变化
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* 头部 */}
          <View style={styles.header}>
            <Pressable
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              accessibilityLabel="返回"
              accessibilityRole="button"
            >
              <Text style={styles.backButtonText}>← 返回</Text>
            </Pressable>
            <Text style={styles.title}>编辑个人信息</Text>
            <View style={styles.headerRight} />
          </View>
          
          {/* 编辑表单 */}
          <View style={styles.formContainer}>
            {saveError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorMessage}>{saveError}</Text>
              </View>
            )}
            
            {/* 用户名 */}
            <Input
              label="用户名"
              value={formData.username}
              onChangeText={(value) => handleInputChange('username', value)}
              placeholder="请输入用户名"
              error={errors.username}
              icon="person-outline"
              accessibilityLabel="用户名输入框"
              accessibilityRole="textbox"
            />
            
            {/* 昵称 */}
            <Input
              label="昵称"
              value={formData.nickname}
              onChangeText={(value) => handleInputChange('nickname', value)}
              placeholder="请输入昵称"
              icon="at-outline"
              accessibilityLabel="昵称输入框"
              accessibilityRole="textbox"
            />
            
            {/* 邮箱 */}
            <Input
              label="邮箱"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="请输入邮箱"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              icon="mail-outline"
              accessibilityLabel="邮箱输入框"
              accessibilityRole="textbox"
            />
            
            {/* 手机号 */}
            <Input
              label="手机号"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              placeholder="请输入手机号"
              keyboardType="phone-pad"
              error={errors.phone}
              icon="call-outline"
              accessibilityLabel="手机号输入框"
              accessibilityRole="textbox"
            />
            
            {/* 地址 */}
            <Input
              label="地址"
              value={formData.address}
              onChangeText={(value) => handleInputChange('address', value)}
              placeholder="请输入地址"
              icon="location-outline"
              accessibilityLabel="地址输入框"
              accessibilityRole="textbox"
            />
            
            {/* 保存按钮 */}
            <Button
              title="保存"
              onPress={handleSave}
              variant="primary"
              size="large"
              loading={loading}
              disabled={loading}
              style={styles.saveButton}
              accessibilityLabel="保存按钮"
              accessibilityRole="button"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingBottom: theme.spacing[6],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[4],
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    padding: theme.spacing[2],
  },
  backButtonText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
  },
  headerRight: {
    width: 40,
  },
  formContainer: {
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[4],
  },
  errorContainer: {
    backgroundColor: theme.colors.errorLight,
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.base,
    marginBottom: theme.spacing[4],
  },
  errorMessage: {
    color: theme.colors.error,
    fontSize: theme.fontSize.sm,
  },
  saveButton: {
    marginTop: theme.spacing[6],
  },
});

export default EditUserInfoScreen;