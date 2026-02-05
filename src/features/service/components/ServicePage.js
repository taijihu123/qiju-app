import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../../common/styles/theme';
import { Ionicons } from '@expo/vector-icons';

// Mock数据 - 服务分类
const serviceCategories = [
  { id: 'cleaning', name: '清洁服务', icon: 'brush' },
  { id: 'repair', name: '维修服务', icon: 'construct' },
  { id: 'moving', name: '搬家服务', icon: 'car' },
  { id: 'appliance', name: '家电服务', icon: 'tv' },
  { id: 'pest', name: '除虫服务', icon: 'bug' },
  { id: 'laundry', name: '洗衣服务', icon: 'water' },
  { id: 'garden', name: '园艺服务', icon: 'leaf' },
  { id: 'pet', name: '宠物服务', icon: 'paw' },
];

// Mock数据 - 服务列表
const services = [
  {
    id: '1',
    category: 'cleaning',
    title: '深度清洁服务',
    description: '专业团队上门，提供全屋深度清洁服务',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    price: 198,
    rating: 4.8,
    reviews: 126
  },
  {
    id: '2',
    category: 'repair',
    title: '水电维修服务',
    description: '24小时紧急维修，专业水电工上门服务',
    image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    price: 80,
    rating: 4.6,
    reviews: 89
  },
  {
    id: '3',
    category: 'moving',
    title: '专业搬家服务',
    description: '提供打包、搬运、拆装一站式搬家服务',
    image: 'https://images.unsplash.com/photo-1565077154878-703770981fdb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    price: 299,
    rating: 4.5,
    reviews: 67
  },
  {
    id: '4',
    category: 'appliance',
    title: '空调维修清洗',
    description: '专业空调维修、加氟、清洗服务',
    image: 'https://images.unsplash.com/photo-1587045381305-775c250e215b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    price: 120,
    rating: 4.7,
    reviews: 103
  },
];

const ServicePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredServices, setFilteredServices] = useState(services);

  // 筛选服务
  const filterServices = (category) => {
    setActiveCategory(category);
    if (category === 'all') {
      setFilteredServices(services);
    } else {
      setFilteredServices(services.filter(service => service.category === category));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部搜索栏 */}
      <View style={styles.searchBar}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666666" />
          <Text style={styles.searchPlaceholder}>搜索服务</Text>
        </View>
        <TouchableOpacity style={styles.messageButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#333333" />
        </TouchableOpacity>
      </View>

      {/* 服务分类标签 */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        <TouchableOpacity 
          style={[styles.categoryButton, activeCategory === 'all' && styles.activeCategoryButton]} 
          onPress={() => filterServices('all')}
        >
          <Text style={[styles.categoryText, activeCategory === 'all' && styles.activeCategoryText]}>全部</Text>
        </TouchableOpacity>
        {serviceCategories.map(category => (
          <TouchableOpacity 
            key={category.id} 
            style={[styles.categoryButton, activeCategory === category.id && styles.activeCategoryButton]} 
            onPress={() => filterServices(category.id)}
          >
            <Ionicons 
              name={category.icon} 
              size={20} 
              color={activeCategory === category.id ? theme.colors.background : '#666666'} 
            />
            <Text style={[styles.categoryText, activeCategory === category.id && styles.activeCategoryText]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 服务列表 */}
      <ScrollView style={styles.servicesContainer} showsVerticalScrollIndicator={false}>
        {filteredServices.map(service => (
          <View key={service.id} style={styles.serviceCard}>
            <Image source={{ uri: service.image }} style={styles.serviceImage} />
            <View style={styles.serviceContent}>
              <View style={styles.serviceHeader}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#F59E0B" />
                  <Text style={styles.ratingText}>{service.rating} ({service.reviews})</Text>
                </View>
              </View>
              <Text style={styles.serviceDescription}>{service.description}</Text>
              <View style={styles.serviceFooter}>
                <Text style={styles.servicePrice}>
                  <Text style={styles.priceNumber}>¥{service.price}</Text>
                  <Text style={styles.priceUnit}>/次</Text>
                </Text>
                <TouchableOpacity style={styles.bookButton}>
                  <Text style={styles.bookButtonText}>立即预约</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    backgroundColor: theme.colors.background,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    marginRight: theme.spacing[3],
  },
  searchPlaceholder: {
    marginLeft: theme.spacing[2],
    fontSize: 14,
    color: '#666666',
  },
  messageButton: {
    padding: theme.spacing[2],
  },
  categoriesContainer: {
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  categoriesContent: {
    paddingHorizontal: theme.spacing[4],
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[3],
    borderRadius: 20,
    marginRight: theme.spacing[2],
  },
  activeCategoryButton: {
    backgroundColor: theme.colors.primary,
  },
  categoryText: {
    marginLeft: theme.spacing[1],
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  activeCategoryText: {
    color: theme.colors.background,
  },
  servicesContainer: {
    flex: 1,
    padding: theme.spacing[4],
  },
  serviceCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    marginBottom: theme.spacing[4],
    overflow: 'hidden',
    ...theme.shadow.sm,
  },
  serviceImage: {
    width: '100%',
    height: 180,
  },
  serviceContent: {
    padding: theme.spacing[4],
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing[2],
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: theme.spacing[1],
    fontSize: 14,
    color: '#666666',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: theme.spacing[3],
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  servicePrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF4444',
  },
  priceUnit: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 2,
  },
  bookButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
    borderRadius: 20,
  },
  bookButtonText: {
    color: theme.colors.background,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ServicePage;