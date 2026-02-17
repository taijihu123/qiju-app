import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../common/styles/theme';

export default function HomePage() {
  const navigation = useNavigation();
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  // 模拟从后端获取房源数据
  useEffect(() => {
    const fetchHouses = async () => {
      try {
        setLoading(true);
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟房源数据
        const mockHouses = [
          {
            id: 1,
            title: '精装修三居室',
            price: 3500,
            address: '高新区创业园附近',
            area: '120㎡',
            type: '3室2厅',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20apartment%20interior%20with%20bright%20living%20room%2C%203%20bedrooms%2C%20clean%20design&image_size=landscape_4_3'
          },
          {
            id: 2,
            title: '温馨两居室',
            price: 2800,
            address: '核心商圈',
            area: '90㎡',
            type: '2室1厅',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cozy%20apartment%20with%202%20bedrooms%2C%20warm%20lighting%2C%20comfortable%20furniture&image_size=landscape_4_3'
          },
          {
            id: 3,
            title: '创业咖啡社区房源',
            price: 2500,
            address: '创业园区内',
            area: '85㎡',
            type: '2室1厅',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20apartment%20near%20co-working%20space%2C%20startup%20community%2C%20stylish%20design&image_size=landscape_4_3'
          },
          {
            id: 4,
            title: '拎包入住精装房',
            price: 3200,
            address: '地铁口附近',
            area: '100㎡',
            type: '3室1厅',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=furnished%20apartment%20ready%20to%20move%20in%2C%20modern%20furniture%2C%20complete%20appliances&image_size=landscape_4_3'
          }
        ];
        
        setHouses(mockHouses);
      } catch (err) {
        console.error('获取房源数据失败:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchHouses();
  }, []);

  // 渲染单个房源项
  const renderHouseItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.houseCard}
      onPress={() => navigation.navigate('HouseDetail', { houseId: item.id })}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.houseImage}
        resizeMode="cover"
      />
      <View style={styles.houseInfo}>
        <Text style={styles.houseTitle}>{item.title}</Text>
        <Text style={styles.housePrice}>¥{item.price}/月</Text>
        <View style={styles.houseDetails}>
          <Text style={styles.houseDetailText}>{item.area}</Text>
          <Text style={styles.houseDetailDivider}>|</Text>
          <Text style={styles.houseDetailText}>{item.type}</Text>
          <Text style={styles.houseDetailDivider}>|</Text>
          <Text style={styles.houseDetailText}>{item.address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>加载中...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 顶部搜索栏 */}
      <View style={styles.searchBar}>
        <View style={styles.searchInput}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
          <Text style={styles.searchPlaceholder}>搜索房源、小区、商圈...</Text>
        </View>
      </View>

      {/* 快捷入口 */}
      <View style={styles.quickAccess}>
        <TouchableOpacity style={styles.quickAccessItem}>
          <View style={[styles.quickAccessIcon, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="home" size={24} color="#2196F3" />
          </View>
          <Text style={styles.quickAccessText}>房源列表</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAccessItem}>
          <View style={[styles.quickAccessIcon, { backgroundColor: '#E8F5E8' }]}>
            <Ionicons name="heart" size={24} color="#4CAF50" />
          </View>
          <Text style={styles.quickAccessText}>我的收藏</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAccessItem}>
          <View style={[styles.quickAccessIcon, { backgroundColor: '#FFF3E0' }]}>
            <Ionicons name="location" size={24} color="#FF9800" />
          </View>
          <Text style={styles.quickAccessText}>附近房源</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickAccessItem}>
          <View style={[styles.quickAccessIcon, { backgroundColor: '#F3E5F5' }]}>
            <Ionicons name="chat" size={24} color="#9C27B0" />
          </View>
          <Text style={styles.quickAccessText}>在线咨询</Text>
        </TouchableOpacity>
      </View>

      {/* 推荐房源 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>推荐房源</Text>
          <TouchableOpacity>
            <Text style={styles.sectionMore}>查看更多 <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} /></Text>
          </TouchableOpacity>
        </View>
        <FlatList 
          data={houses}
          renderItem={renderHouseItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          contentContainerStyle={styles.houseList}
        />
      </View>

      {/* 热门小区 */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>热门小区</Text>
          <TouchableOpacity>
            <Text style={styles.sectionMore}>查看更多 <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} /></Text>
          </TouchableOpacity>
        </View>
        <View style={styles.communityList}>
          <TouchableOpacity style={styles.communityItem}>
            <Image 
              source={{ uri: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20residential%20community%20exterior%2C%20high-rise%20buildings%2C%20green%20areas&image_size=landscape_4_3' }} 
              style={styles.communityImage}
              resizeMode="cover"
            />
            <Text style={styles.communityName}>创业园小区</Text>
            <Text style={styles.communityPrice}>均价 ¥3200/月</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.communityItem}>
            <Image 
              source={{ uri: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20apartment%20complex%2C%20modern%20design%2C%20swimming%20pool%2C%20fitness%20center&image_size=landscape_4_3' }} 
              style={styles.communityImage}
              resizeMode="cover"
            />
            <Text style={styles.communityName}>中央公园</Text>
            <Text style={styles.communityPrice}>均价 ¥4500/月</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

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
  searchBar: {
    backgroundColor: theme.colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchPlaceholder: {
    marginLeft: 8,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  quickAccess: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    justifyContent: 'space-between',
  },
  quickAccessItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickAccessIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickAccessText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  section: {
    marginTop: 10,
    backgroundColor: theme.colors.white,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  sectionMore: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  houseList: {
    gap: 12,
  },
  houseCard: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 8,
    overflow: 'hidden',
  },
  houseImage: {
    width: '100%',
    height: 200,
  },
  houseInfo: {
    padding: 16,
  },
  houseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  housePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5722',
    marginBottom: 8,
  },
  houseDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  houseDetailText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  houseDetailDivider: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginHorizontal: 8,
  },
  communityList: {
    flexDirection: 'row',
    gap: 12,
  },
  communityItem: {
    flex: 1,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 8,
    overflow: 'hidden',
  },
  communityImage: {
    width: '100%',
    height: 120,
  },
  communityName: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    padding: 8,
  },
  communityPrice: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
});
