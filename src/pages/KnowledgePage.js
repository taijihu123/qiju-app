import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput, RefreshControl, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { get, post, put, del } from '../common/services/request';
import { logger } from '../common/services/logger';
import { theme } from '../common/styles/theme';

const KnowledgePage = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('加载失败，请稍后重试');

  // 加载知识分类
  const loadCategories = async () => {
    try {
      setError(false);
      const response = await get('/knowledge/categories');
      if (response.data.code === 200) {
        setCategories(response.data.data || []);
      } else {
        logger.error('获取知识分类失败:', response.data.msg);
        // 使用模拟数据作为后备
        setCategories([
          { id: 1, name: '租房指南', parentId: null },
          { id: 2, name: '生活常识', parentId: null },
          { id: 3, name: '维修技巧', parentId: null }
        ]);
      }
    } catch (error) {
      logger.error('获取知识分类失败:', error);
      // 使用模拟数据作为后备
      setCategories([
        { id: 1, name: '租房指南', parentId: null },
        { id: 2, name: '生活常识', parentId: null },
        { id: 3, name: '维修技巧', parentId: null }
      ]);
    }
  };

  // 加载知识条目
  const loadEntries = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await get('/knowledge/entries');
      if (response.data.code === 200) {
        const entriesData = Array.isArray(response.data.data) ? response.data.data : [];
        setEntries(entriesData);
        setFilteredEntries(entriesData);
      } else {
        logger.error('获取知识条目失败:', response.data.msg);
        // 使用模拟数据作为后备
        const mockEntries = [
          {
            id: 1,
            title: '租房合同注意事项',
            content: '1. 仔细阅读合同条款\n2. 注意租金支付方式\n3. 检查房屋设施清单',
            categoryId: 1,
            categoryName: '租房指南',
            scenario: '租房签约',
            createdAt: '2024-01-10',
            updatedAt: '2024-01-10',
            views: 156
          },
          {
            id: 2,
            title: '家电清洁小妙招',
            content: '空调清洁：使用专业清洁剂\n冰箱除味：放置活性炭',
            categoryId: 2,
            categoryName: '生活常识',
            scenario: '日常清洁',
            createdAt: '2024-01-08',
            updatedAt: '2024-01-08',
            views: 234
          }
        ];
        setEntries(mockEntries);
        setFilteredEntries(mockEntries);
      }
    } catch (error) {
      logger.error('获取知识条目失败:', error);
      // 使用模拟数据作为后备
      const mockEntries = [
        {
          id: 1,
          title: '租房合同注意事项',
          content: '1. 仔细阅读合同条款\n2. 注意租金支付方式\n3. 检查房屋设施清单',
          categoryId: 1,
          categoryName: '租房指南',
          scenario: '租房签约',
          createdAt: '2024-01-10',
          updatedAt: '2024-01-10',
          views: 156
        },
        {
          id: 2,
          title: '家电清洁小妙招',
          content: '空调清洁：使用专业清洁剂\n冰箱除味：放置活性炭',
          categoryId: 2,
          categoryName: '生活常识',
          scenario: '日常清洁',
          createdAt: '2024-01-08',
          updatedAt: '2024-01-08',
          views: 234
        }
      ];
      setEntries(mockEntries);
      setFilteredEntries(mockEntries);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 刷新数据
  const onRefresh = () => {
    setRefreshing(true);
    loadCategories();
    loadEntries();
    setRefreshing(false);
  };

  // 筛选知识条目
  const filterEntries = () => {
    let result = entries;

    // 按分类筛选
    if (selectedCategory !== 'all') {
      result = result.filter(entry => entry.categoryId === selectedCategory);
    }

    // 按搜索词筛选
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(entry => 
        entry.title.toLowerCase().includes(query) ||
        entry.content.toLowerCase().includes(query) ||
        entry.scenario.toLowerCase().includes(query)
      );
    }

    setFilteredEntries(result);
  };

  // 处理分类选择
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // 处理搜索查询变化
  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  // 处理搜索提交
  const handleSearchSubmit = () => {
    filterEntries();
  };

  // 查看知识条目详情
  const viewEntryDetail = (entry) => {
    setCurrentEntry(entry);
    setIsModalVisible(true);
  };

  // 按场景查找知识
  const findByScenario = async (scenario) => {
    try {
      const response = await get(`/knowledge/entries/scenario/${scenario}`);
      if (response.data.code === 200) {
        const entriesData = Array.isArray(response.data.data) ? response.data.data : [];
        setFilteredEntries(entriesData);
      } else {
        logger.error('按场景查找知识失败:', response.data.msg);
      }
    } catch (error) {
      logger.error('按场景查找知识失败:', error);
    }
  };

  useEffect(() => {
    loadCategories();
    loadEntries();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [selectedCategory, entries]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>加载知识库数据中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={theme.colors.error} />
        <Text style={styles.errorText}>{errorMessage}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => {
            setLoading(true);
            loadCategories();
            loadEntries();
          }}
        >
          <Text style={styles.retryButtonText}>重试</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>知识库</Text>
        <Text style={styles.headerSubtitle}>生活知识，触手可及</Text>
      </View>

      {/* 搜索栏 */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索知识..."
            value={searchQuery}
            onChangeText={handleSearchChange}
            onSubmitEditing={handleSearchSubmit}
          />
          {searchQuery.trim() && (
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              filterEntries();
            }}>
              <Ionicons name="close-circle-outline" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 分类筛选 */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={[
            { id: 'all', name: '全部' }
          ].concat(categories)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryItem,
                selectedCategory === item.id && styles.categoryItemActive
              ]}
              onPress={() => handleCategorySelect(item.id)}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === item.id && styles.categoryTextActive
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* 常用场景 */}
      <View style={styles.scenariosContainer}>
        <Text style={styles.sectionTitle}>常用场景</Text>
        <View style={styles.scenariosGrid}>
          {[
            { id: '租房签约', name: '租房签约' },
            { id: '日常清洁', name: '日常清洁' },
            { id: '家电维修', name: '家电维修' },
            { id: '搬家服务', name: '搬家服务' }
          ].map(scenario => (
            <TouchableOpacity
              key={scenario.id}
              style={styles.scenarioItem}
              onPress={() => findByScenario(scenario.id)}
            >
              <Text style={styles.scenarioText}>{scenario.name}</Text>
              <Ionicons name="chevron-forward-outline" size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 知识条目列表 */}
      <View style={styles.entriesContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>知识条目</Text>
          <Text style={styles.entryCount}>{filteredEntries.length}条</Text>
        </View>

        <FlatList
          data={filteredEntries}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.entryItem}
              onPress={() => viewEntryDetail(item)}
            >
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>{item.title}</Text>
                <Text style={styles.entryCategory}>{item.categoryName}</Text>
              </View>
              <Text style={styles.entryContent} numberOfLines={2}>
                {item.content.replace(/\n/g, ' ')}
              </Text>
              <View style={styles.entryFooter}>
                <View style={styles.entryMeta}>
                  <Ionicons name="time-outline" size={12} color={theme.colors.textSecondary} />
                  <Text style={styles.entryMetaText}>{item.updatedAt}</Text>
                </View>
                <View style={styles.entryMeta}>
                  <Ionicons name="eye-outline" size={12} color={theme.colors.textSecondary} />
                  <Text style={styles.entryMetaText}>{item.views}</Text>
                </View>
                <View style={styles.entryMeta}>
                  <Ionicons name="location-outline" size={12} color={theme.colors.textSecondary} />
                  <Text style={styles.entryMetaText}>{item.scenario}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.entriesList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="book-outline" size={64} color={theme.colors.textSecondary} />
              <Text style={styles.emptyText}>暂无相关知识条目</Text>
            </View>
          }
        />
      </View>

      {/* 知识条目详情模态框 */}
      {isModalVisible && currentEntry && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{currentEntry.title}</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close-outline" size={24} color={theme.colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalInfo}>
              <Text style={styles.modalCategory}>{currentEntry.categoryName}</Text>
              <Text style={styles.modalScenario}>场景：{currentEntry.scenario}</Text>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalContentText}>{currentEntry.content}</Text>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Text style={styles.modalDate}>更新于：{currentEntry.updatedAt}</Text>
              <Text style={styles.modalViews}>阅读：{currentEntry.views}次</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  header: {
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  searchContainer: {
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    ...theme.shadow.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  categoriesContainer: {
    paddingVertical: 10,
    backgroundColor: theme.colors.background,
  },
  categoriesList: {
    paddingHorizontal: 15,
  },
  categoryItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.white,
    marginRight: 10,
    ...theme.shadow.sm,
  },
  categoryItemActive: {
    backgroundColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  categoryTextActive: {
    color: theme.colors.white,
  },
  scenariosContainer: {
    paddingVertical: 15,
    backgroundColor: theme.colors.white,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  scenariosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
  },
  scenarioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    margin: 5,
    minWidth: '45%',
  },
  scenarioText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  entriesContainer: {
    flex: 1,
    backgroundColor: theme.colors.white,
    marginBottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  entryCount: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  entriesList: {
    padding: 15,
  },
  entryItem: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  entryTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginRight: 10,
  },
  entryCategory: {
    fontSize: 12,
    color: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  entryContent: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    lineHeight: 20,
    marginBottom: 10,
  },
  entryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryMetaText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 20,
    fontSize: 16,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 25,
    ...theme.shadow.sm,
  },
  retryButtonText: {
    fontSize: 16,
    color: theme.colors.white,
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    ...theme.shadow.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginRight: 20,
  },
  modalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalCategory: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  modalScenario: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  modalBody: {
    padding: 15,
    maxHeight: 300,
  },
  modalContentText: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    lineHeight: 24,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  modalDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  modalViews: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});

export default KnowledgePage;
