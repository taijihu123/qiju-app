import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../common/styles/theme';
import RentHousePage from './RentHousePage';
import ServicePage from './ServicePage';
import SidebarContainer from '../components/SidebarContainer';

const SupermarketPage = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('rent'); // rent 或 service

  return (
    <SidebarContainer navigation={navigation}>
      <View style={styles.container}>
        {/* 页面头部 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>超市</Text>
          <Text style={styles.headerSubtitle}>理想居所、生活服务一站式体验</Text>
        </View>

        {/* 标签切换 */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'rent' && styles.activeTab]}
            onPress={() => setActiveTab('rent')}
          >
            <Ionicons 
              name="home" 
              size={20} 
              color={activeTab === 'rent' ? theme.colors.primary : theme.colors.textSecondary} 
            />
            <Text style={[styles.tabText, activeTab === 'rent' && styles.activeTabText]}>
              理想居所
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'service' && styles.activeTab]}
            onPress={() => setActiveTab('service')}
          >
            <Ionicons 
              name="cube" 
              size={20} 
              color={activeTab === 'service' ? theme.colors.primary : theme.colors.textSecondary} 
            />
            <Text style={[styles.tabText, activeTab === 'service' && styles.activeTabText]}>
              生活服务
            </Text>
          </TouchableOpacity>
        </View>

        {/* 内容区域 */}
        <View style={styles.content}>
          {activeTab === 'rent' ? (
            <RentHousePage />
          ) : (
            <ServicePage />
          )}
        </View>
      </View>
    </SidebarContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 24,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  activeTabText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
});

export default SupermarketPage;