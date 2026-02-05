import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../styles/theme';

const Header = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>栖居</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>搜索</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>消息</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[6],
    paddingVertical: theme.spacing[4],
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...theme.shadow.sm
  },
  title: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing[4]
  },
  actionButton: {
    padding: theme.spacing[3],
    borderRadius: theme.borderRadius.base,
    backgroundColor: theme.colors.backgroundSecondary
  },
  actionText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textPrimary
  }
});

export default Header;