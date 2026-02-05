import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../styles/theme';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle
}) => {
  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    disabled && styles.button_disabled,
    style
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    disabled && styles.text_disabled,
    textStyle
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? theme.colors.white : theme.colors.primary} 
          size="small"
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[textStyles, icon && styles.textWithIcon]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.base,
    paddingHorizontal: theme.spacing[4],
  },
  
  // Variants
  button_primary: {
    backgroundColor: theme.colors.primary,
  },
  button_secondary: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  button_outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  button_link: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },
  button_disabled: {
    backgroundColor: theme.colors.disabled,
    borderColor: theme.colors.disabled,
  },
  
  // Sizes
  button_small: {
    paddingVertical: theme.spacing[2],
  },
  button_medium: {
    paddingVertical: theme.spacing[3],
  },
  button_large: {
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[6],
  },
  
  // Text styles
  text: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
  },
  text_primary: {
    color: theme.colors.white,
  },
  text_secondary: {
    color: theme.colors.textPrimary,
  },
  text_outline: {
    color: theme.colors.primary,
  },
  text_link: {
    color: theme.colors.primary,
  },
  text_disabled: {
    color: theme.colors.textDisabled,
  },
  text_small: {
    fontSize: theme.fontSize.sm,
  },
  text_medium: {
    fontSize: theme.fontSize.md,
  },
  text_large: {
    fontSize: theme.fontSize.lg,
  },
  textWithIcon: {
    marginLeft: theme.spacing[2],
  },
});

export default Button;