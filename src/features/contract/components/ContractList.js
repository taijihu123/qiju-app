import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { theme } from '../../../common/styles/theme';

// 电子合同列表组件（预留扩展）
const ContractList = ({ contracts }) => {
  const renderContract = ({ item }) => (
    <View style={styles.contractItem}>
      <Text style={styles.contractTitle}>{item.title}</Text>
      <Text style={styles.contractStatus}>{item.status}</Text>
      <Text style={styles.contractDate}>{item.createdAt}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>我的合同</Text>
      <FlatList
        data={contracts || []}
        renderItem={renderContract}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    marginBottom: theme.spacing[4],
    color: theme.colors.textPrimary,
    paddingHorizontal: theme.spacing[6],
    paddingTop: theme.spacing[6],
  },
  list: {
    padding: theme.spacing[6],
  },
  contractItem: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.base,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing[4],
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1.5,
    elevation: 2,
  },
  contractTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing[1],
  },
  contractStatus: {
    fontSize: theme.fontSize.base,
    color: theme.colors.primary,
    marginBottom: theme.spacing[1],
  },
  contractDate: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
});

export default ContractList;