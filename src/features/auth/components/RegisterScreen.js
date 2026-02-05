import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../../../common/components/Button';
import Input from '../../../common/components/Input';
import { theme } from '../../../common/styles/theme';
import { post } from '../../../common/services/request';

const RegisterScreen = () => {
  const navigation = useNavigation();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    email: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ level: 0, label: '', color: '' });

  // 计算密码强度
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    let requirements = [];

    if (password.length >= 8) {
      strength++;
      requirements.push('长度达标');
    }
    if (/[a-z]/.test(password)) {
      strength++;
      requirements.push('包含小写字母');
    }
    if (/[A-Z]/.test(password)) {
      strength++;
      requirements.push('包含大写字母');
    }
    if (/\d/.test(password)) {
      strength++;
      requirements.push('包含数字');
    }
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      strength++;
      requirements.push('包含特殊字符');
    }

    const strengthConfig = [
      { level: 0, label: '弱', color: theme.colors.error },
      { level: 1, label: '弱', color: theme.colors.error },
      { level: 2, label: '中', color: theme.colors.warning },
      { level: 3, label: '中', color: theme.colors.warning },
      { level: 4, label: '强', color: theme.colors.success },
      { level: 5, label: '很强', color: theme.colors.success }
    ];

    return {
      ...strengthConfig[strength],
      requirements
    };
  };

  // 实时检测密码强度
  const handlePasswordChange = (value) => {
    handleInputChange('password', value);
    if (value) {
      setPasswordStrength(calculatePasswordStrength(value));
    } else {
      setPasswordStrength({ level: 0, label: '', color: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = '请输入用户名';
    } else if (formData.username.length < 3) {
      newErrors.username = '用户名至少需要3个字符';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 8) {
      newErrors.password = '密码至少需要8个字符';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(formData.password)) {
      newErrors.password = '密码必须包含大小写字母、数字和特殊字符';
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = '请确认密码';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = '请输入手机号';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '请输入有效的手机号';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setRegisterError('');
    
    try {
      await post('/auth/register', {
        username: formData.username.trim(),
        password: formData.password.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        role: 'USER' // 默认注册为普通用户
      });
      
      // 注册成功后导航到登录页面
      navigation.navigate('Login');
      alert('注册成功，请登录');
    } catch (error) {
      console.error('Register failed:', error);
      // 尝试获取更详细的错误信息
      const errorMsg = error.response?.data?.msg || error.message || '注册失败，请检查信息后重试';
      setRegisterError(errorMsg);
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

        {/* 注册表单 */}
        <View style={styles.formContainer}>
          {registerError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorMessage}>{registerError}</Text>
            </View>
          )}
          
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
          
          <Input
            label="密码"
            value={formData.password}
            onChangeText={handlePasswordChange}
            placeholder="请输入密码（8-20位，包含大小写字母、数字和特殊字符）"
            secureTextEntry={true}
            error={errors.password}
            icon="lock-closed-outline"
            accessibilityLabel="密码输入框"
            accessibilityRole="textbox"
          />
          
          {/* 密码强度指示器 */}
          {formData.password.length > 0 && (
            <View style={styles.passwordStrengthContainer}>
              <View style={styles.strengthBar}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <View
                    key={level}
                    style={[
                      styles.strengthSegment,
                      {
                        backgroundColor: level <= passwordStrength.level
                          ? passwordStrength.color
                          : theme.colors.border,
                      },
                    ]}
                  />
                ))}
              </View>
              <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>
                密码强度：{passwordStrength.label}
              </Text>
              <View style={styles.requirementsContainer}>
                {passwordStrength.requirements?.map((req, index) => (
                  <Text key={index} style={styles.requirementText}>
                    ✓ {req}
                  </Text>
                ))}
              </View>
            </View>
          )}
          
          <Input
            label="确认密码"
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            placeholder="请再次输入密码"
            secureTextEntry={true}
            error={errors.confirmPassword}
            icon="lock-closed-outline"
            accessibilityLabel="确认密码输入框"
            accessibilityRole="textbox"
          />
          
          {/* 注册按钮 */}
          <Button
            title="注册"
            onPress={handleRegister}
            variant="primary"
            size="large"
            loading={loading}
            disabled={loading}
            style={styles.registerButton}
            accessibilityLabel="注册按钮"
            accessibilityRole="button"
          />
          
          {/* 登录链接 */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>已有账号？</Text>
            <Pressable
              onPress={() => navigation.navigate('Login')}
              style={styles.loginLink}
              accessibilityLabel="去登录"
              accessibilityRole="link"
            >
              <Text style={styles.loginLinkText}>立即登录</Text>
            </Pressable>
          </View>
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
  // 密码强度指示器样式
  passwordStrengthContainer: {
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[4],
    padding: theme.spacing[2],
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
  },
  strengthBar: {
    flexDirection: 'row',
    height: 4,
    marginBottom: theme.spacing[2],
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthSegment: {
    flex: 1,
    marginRight: 2,
    borderRadius: 1,
  },
  strengthLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    marginBottom: theme.spacing[2],
  },
  requirementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
  },
  requirementText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.xs,
  },
  registerButton: {
    marginTop: theme.spacing[2],
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing[6],
  },
  loginText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.md,
  },
  loginLink: {
    marginLeft: theme.spacing[1],
    padding: theme.spacing[1],
  },
  loginLinkText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
  },
});

export default RegisterScreen;