import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { theme } from '../../../common/styles/theme';
import Button from '../../../common/components/Button';

// 会员资料组件（预留扩展）
const MemberProfile = ({ memberInfo }) => {
  const { level, points, lifeCoins, benefits } = memberInfo;

  const getLevelBadge = () => {
    switch (level) {
      case 'platinum':
        return '🔷 铂金会员';
      case 'gold':
        return '🔶 黄金会员';
      case 'silver':
        return '⚪ 白银会员';
      default:
        return '🟤 青铜会员';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800' }}
          style={styles.avatar}
        />
        <Text style={styles.level}>{getLevelBadge()}</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{points}</Text>
          <Text style={styles.statLabel}>积分</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{lifeCoins}</Text>
          <Text style={styles.statLabel}>生活币</Text>
        </View>
      </View>

      <View style={styles.benefits}>
        <Text style={styles.sectionTitle}>会员权益</Text>
        {benefits?.map((benefit, index) => (
          <View key={index} style={styles.benefitItem}>
            <Text style={styles.benefitText}>• {benefit}</Text>
          </View>
        ))}
      </View>

      <Button
        title="升级会员"
        onPress={() => {}}
        variant="primary"
        size="large"
        style={styles.upgradeButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing[6],
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: theme.spacing[4],
  },
  level: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.primary,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.backgroundSecondary,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.base,
    marginBottom: theme.spacing[6],
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing[1],
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
  benefits: {
    marginBottom: theme.spacing[6],
  },
  sectionTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing[4],
  },
  benefitItem: {
    marginBottom: theme.spacing[2],
    paddingLeft: theme.spacing[2],
  },
  benefitText: {
    fontSize: theme.fontSize.base,
    color: theme.colors.textSecondary,
  },
  upgradeButton: {
    marginTop: theme.spacing[2],
  },
});

export default MemberProfile;