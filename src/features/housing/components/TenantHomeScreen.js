import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useHousing } from '../../../contexts/HousingContext';
import { theme } from '../../../common/styles/theme';
import SearchBar from '../../../components/SearchBar';
import TagFilter from '../../../components/TagFilter';
import HouseCard from '../../../components/HouseCard';

const TenantHomeScreen = () => {
  const navigation = useNavigation();
  const { 
    filteredHouses, 
    searchQuery, 
    activeTag, 
    loading, 
    error, 
    refreshing, 
    updateSearchQuery, 
    setActiveFilterTag, 
    setFilterTagsList,
    refreshData 
  } = useHousing();

  // 筛选标签选项
  const filterOptions = [
    '全部',
    '整租',
    '合租',
    '一室',
    '两室',
    '三室',
    '四室及以上'
  ];

  // 初始化筛选标签
  useEffect(() => {
    setFilterTagsList(filterOptions);
  }, []);

  const handleRefresh = async () => {
    await refreshData();
  };

  const handleHousePress = (house) => {
    // 这里可以导航到房源详情页，目前只是打印
    console.log('House pressed:', house.id);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {loading ? '加载中...' : error || '暂无房源数据'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 搜索栏 */}
      <SearchBar 
        value={searchQuery} 
        onChangeText={updateSearchQuery} 
        placeholder="搜索房源或地址"
      />

      {/* 筛选标签 */}
      <TagFilter 
        tags={filterOptions} 
        activeTag={activeTag || '全部'} 
        onTagPress={setActiveFilterTag}
      />

      {/* 房源列表 */}
      <FlatList
        data={filteredHouses || []}
        renderItem={({ item }) => (
          <HouseCard 
            house={item} 
            onPress={() => handleHousePress(item)} 
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={Boolean(refreshing)}
            onRefresh={handleRefresh}
            colors={['#4A90E2']}
            tintColor={'#4A90E2'}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});

export default TenantHomeScreen;
