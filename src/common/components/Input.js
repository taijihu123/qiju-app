import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  icon,
  variant = 'default',
  style,
  inputStyle,
  accessibilityLabel,
  accessibilityRole
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.inputWrapper,
        styles[`inputWrapper_${variant}`],
        error && styles.inputWrapper_error
      ]}>
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={error ? theme.colors.error : theme.colors.textSecondary}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            icon && styles.input_withIcon,
            secureTextEntry && styles.input_secure,
            inputStyle
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textDisabled}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole={accessibilityRole}
        />
        {secureTextEntry && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.passwordToggle}
            accessibilityLabel={showPassword ? '隐藏密码' : '显示密码'}
            accessibilityRole="button"
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={theme.colors.textSecondary}
            />
          </Pressable>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing[4],
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing[2],
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.base,
    backgroundColor: theme.colors.background,
  },
  inputWrapper_default: {
    borderColor: theme.colors.border,
  },
  inputWrapper_focused: {
    borderColor: theme.colors.primary,
  },
  inputWrapper_error: {
    borderColor: theme.colors.error,
  },
  input: {
    flex: 1,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[3],
    fontSize: theme.fontSize.md,
    color: theme.colors.textPrimary,
  },
  input_withIcon: {
    paddingLeft: theme.spacing[2],
  },
  input_secure: {
    paddingRight: theme.spacing[1],
  },
  icon: {
    marginLeft: theme.spacing[3],
  },
  passwordToggle: {
    padding: theme.spacing[3],
  },
  errorText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.error,
    marginTop: theme.spacing[2],
  },
});

export default Input;