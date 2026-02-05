import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../../../common/components/Button';
import Input from '../../../common/components/Input';
import { theme } from '../../../common/styles/theme';
import { post } from '../../../common/services/request';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  
  const [formData, setFormData] = useState({
    phone: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: 验证手机号, 2: 设置新密码
  const [countdown, setCountdown] = useState(0);
  const [forgotError, setForgotError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.phone.trim()) {
        newErrors.phone = '请输入手机号';
      } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
        newErrors.phone = '请输入有效的手机号';
      }
    } else {
      if (!formData.verificationCode.trim()) {
        newErrors.verificationCode = '请输入验证码';
      }
      
      if (!formData.newPassword.trim()) {
        newErrors.newPassword = '请输入新密码';
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = '密码至少需要6个字符';
      }
      
      if (!formData.confirmPassword.trim()) {
        newErrors.confirmPassword = '请确认密码';
      } else if (formData.confirmPassword !== formData.newPassword) {
        newErrors.confirmPassword = '两次输入的密码不一致';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendVerificationCode = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setForgotError('');
    
    try {
      // 发送验证码请求（预留接口）
      await post('/auth/send-code', { phone: formData.phone.trim() });
      
      // 开始倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      alert('验证码已发送');
    } catch (error) {
      console.error('Send verification code failed:', error);
      setForgotError(error.message || '发送验证码失败');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setForgotError('');
    
    try {
      // 重置密码请求（预留接口）
      await post('/auth/reset-password', {
        phone: formData.phone.trim(),
        verificationCode: formData.verificationCode.trim(),
        newPassword: formData.newPassword.trim()
      });
      
      // 重置成功后返回登录页面
      alert('密码重置成功，请使用新密码登录');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Reset password failed:', error);
      setForgotError(error.message || '密码重置失败');
    } finally {
      setLoading(false);
    }
  };

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
      <View style={styles.content}>
        {/* 品牌Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=200&fit=crop' }}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>栖居</Text>
          <Text style={styles.slogan}>品质生活，从栖居开始</Text>
        </View>

        {/* 密码重置表单 */}
        <View style={styles.formContainer}>
          {forgotError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorMessage}>{forgotError}</Text>
            </View>
          )}
          
          {step === 1 ? (
            <>
              <Text style={styles.title}>重置密码</Text>
              <Input
                label="手机号"
                value={formData.phone}
                onChangeText={(value) => handleInputChange('phone', value)}
                placeholder="请输入注册手机号"
                keyboardType="phone-pad"
                error={errors.phone}
                icon="call-outline"
                accessibilityLabel="手机号输入框"
                accessibilityRole="textbox"
              />
              
              <Button
                title="发送验证码"
                onPress={handleSendVerificationCode}
                variant="primary"
                size="large"
                loading={loading}
                disabled={loading || countdown > 0}
                style={styles.button}
                accessibilityLabel="发送验证码按钮"
                accessibilityRole="button"
              />
              
              {countdown > 0 && (
                <Text style={styles.countdownText}>
                  验证码已发送，{countdown}秒后可重新发送
                </Text>
              )}
              
              <View style={styles.stepButtons}>
                <Button
                  title="返回登录"
                  onPress={() => navigation.navigate('Login')}
                  variant="outline"
                  size="medium"
                  style={styles.stepButton}
                  accessibilityLabel="返回登录按钮"
                  accessibilityRole="button"
                />
              </View>
            </>
          ) : (
            <>
              <Text style={styles.title}>设置新密码</Text>
              <Input
                label="验证码"
                value={formData.verificationCode}
                onChangeText={(value) => handleInputChange('verificationCode', value)}
                placeholder="请输入收到的验证码"
                keyboardType="number-pad"
                error={errors.verificationCode}
                icon="code-outline"
                accessibilityLabel="验证码输入框"
                accessibilityRole="textbox"
              />
              
              <Input
                label="新密码"
                value={formData.newPassword}
                onChangeText={(value) => handleInputChange('newPassword', value)}
                placeholder="请输入新密码"
                secureTextEntry={true}
                error={errors.newPassword}
                icon="lock-closed-outline"
                accessibilityLabel="新密码输入框"
                accessibilityRole="textbox"
              />
              
              <Input
                label="确认密码"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                placeholder="请再次输入新密码"
                secureTextEntry={true}
                error={errors.confirmPassword}
                icon="lock-closed-outline"
                accessibilityLabel="确认密码输入框"
                accessibilityRole="textbox"
              />
              
              <View style={styles.stepButtons}>
                <Button
                  title="上一步"
                  onPress={() => setStep(1)}
                  variant="outline"
                  size="medium"
                  style={styles.stepButton}
                  accessibilityLabel="上一步按钮"
                  accessibilityRole="button"
                />
                <Button
                  title="确认重置"
                  onPress={handleResetPassword}
                  variant="primary"
                  size="medium"
                  loading={loading}
                  disabled={loading}
                  style={styles.stepButton}
                  accessibilityLabel="确认重置按钮"
                  accessibilityRole="button"
                />
              </View>
            </>
          )}
        </View>
      </View>
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
    paddingHorizontal: theme.spacing[6],
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing[8],
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
  },
  appName: {
    fontSize: theme.fontSize.xl2,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing[1],
  },
  slogan: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing[6],
    textAlign: 'center',
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
  button: {
    marginTop: theme.spacing[2],
  },
  countdownText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.sm,
    textAlign: 'center',
    marginTop: theme.spacing[3],
  },
  stepButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing[4],
  },
  stepButton: {
    flex: 1,
    marginHorizontal: theme.spacing[2],
  },
});

export default ForgotPasswordScreen;