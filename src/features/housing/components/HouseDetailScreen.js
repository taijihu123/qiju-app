import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { get, post } from '../../../common/services/request';
import { logger } from '../../../common/services/logger';
import { theme } from '../../../common/styles/theme';

const { width } = Dimensions.get('window');

const HouseDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { houseId } = route.params;
  
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 加载房源详情
  const loadHouseDetail = async () => {
    try {
      setLoading(true);
      const response = await get(`/rent/houses/${houseId}`);
      if (response.data.code === 200 && response.data.data) {
        const houseData = response.data.data;
        // 将后端返回的数据转换为HouseDetailScreen组件期望的格式
        const formattedHouse = {
          ...houseData,
          title: houseData.name, // 后端是name，前端期望title
          price: houseData.rent, // 后端是rent，前端期望price
          images: [houseData.imageUrl], // 后端是单个imageUrl，前端期望images数组
          // 从layout字段中提取卧室和卫生间数量
          bedroomCount: parseInt(houseData.layout?.match(/(\d+)室/)?.[1] || '0'),
          bathroomCount: parseInt(houseData.layout?.match(/(\d+)卫/)?.[1] || '0'),
          // 设置默认值
          totalFloors: 20,
          orientation: '南北',
          renovationType: '精装修',
          propertyType: '住宅',
          rentalType: '整租',
          availableDate: new Date().toISOString().split('T')[0],
          landlord: {
            name: '房东',
            phone: '138****1234'
          }
        };
        setHouse(formattedHouse);
      } else {
        logger.error('获取房源详情失败:', response.data.msg);
        // 使用模拟数据作为后备
        setHouse({
          id: houseId,
          title: '精装修两居室',
          area: '85㎡',
          price: 3500,
          address: '北京市朝阳区建国路88号',
          description: '南北通透，采光好，家具齐全，交通便利。小区环境优雅，周边配套完善，有商场、超市、医院等。地铁1号线和10号线交汇，出行非常方便。',
          tags: ['地铁附近', '拎包入住', '近商场', '南北通透', '精装修'],
          images: [
            '/static/images/house1.jpg',
            '/static/images/house2.jpg',
            '/static/images/house3.jpg'
          ],
          bedroomCount: 2,
          bathroomCount: 1,
          floor: 12,
          totalFloors: 20,
          orientation: '南北',
          renovationType: '精装修',
          propertyType: '住宅',
          rentalType: '整租',
          availableDate: '2024-01-15',
          landlord: {
            name: '张先生',
            phone: '138****1234'
          }
        });
      }
    } catch (error) {
      logger.error('获取房源详情失败:', error);
      // 使用模拟数据作为后备
      setHouse({
        id: houseId,
        title: '精装修两居室',
        area: '85㎡',
        price: 3500,
        address: '北京市朝阳区建国路88号',
        description: '南北通透，采光好，家具齐全，交通便利。小区环境优雅，周边配套完善，有商场、超市、医院等。地铁1号线和10号线交汇，出行非常方便。',
        tags: ['地铁附近', '拎包入住', '近商场', '南北通透', '精装修'],
        images: [
          '/static/images/house1.jpg',
          '/static/images/house2.jpg',
          '/static/images/house3.jpg'
        ],
        bedroomCount: 2,
        bathroomCount: 1,
        floor: 12,
        totalFloors: 20,
        orientation: '南北',
        renovationType: '精装修',
        propertyType: '住宅',
        rentalType: '整租',
        availableDate: '2024-01-15',
        landlord: {
          name: '张先生',
          phone: '138****1234'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // 切换收藏状态
  const toggleFavorite = () => {
    setIsFavorite(prev => !prev);
    // 这里可以调用收藏接口
  };

  // 提交租赁申请
  const submitApplication = () => {
    navigation.navigate('RentApplication', { houseId: house.id });
  };

  // 查看租赁合同模板
  const viewContractTemplate = () => {
    // 这里可以导航到合同模板页面
    logger.info('查看合同模板');
  };

  // 渲染图片指示器
  const renderImageIndicator = () => {
    if (!house || !house.images) return null;
    
    return (
      <View style={styles.imageIndicator}>
        {house.images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicatorDot,
              currentImageIndex === index && styles.indicatorDotActive
            ]}
          />
        ))}
      </View>
    );
  };

  useEffect(() => {
    loadHouseDetail();
  }, [houseId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>加载房源详情中...</Text>
      </View>
    );
  }

  if (!house) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={theme.colors.textSecondary} />
        <Text style={styles.errorText}>未找到该房源信息</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>返回房源列表</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 图片轮播 */}
        <View style={styles.imageContainer}>
          {/* 返回按钮 */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(newIndex);
            }}
          >
            {house.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.houseImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          {renderImageIndicator()}
          
          {/* 操作按钮 */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={toggleFavorite}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite ? '#ff4d4f' : theme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* 房源基本信息 */}
        <View style={styles.infoContainer}>
          <Text style={styles.houseTitle}>{house.title}</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>¥{house.price}</Text>
            <Text style={styles.priceUnit}>/月</Text>
          </View>
          
          <View style={styles.tagsContainer}>
            {house.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          {/* 房源详情 */}
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>房源详情</Text>
            
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>面积</Text>
                <Text style={styles.detailValue}>{house.area}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>户型</Text>
                <Text style={styles.detailValue}>{house.bedroomCount}室{house.bathroomCount}厅</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>楼层</Text>
                <Text style={styles.detailValue}>{house.floor}/{house.totalFloors}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>朝向</Text>
                <Text style={styles.detailValue}>{house.orientation}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>装修</Text>
                <Text style={styles.detailValue}>{house.renovationType}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>类型</Text>
                <Text style={styles.detailValue}>{house.propertyType}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>租赁方式</Text>
                <Text style={styles.detailValue}>{house.rentalType}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>可入住时间</Text>
                <Text style={styles.detailValue}>{house.availableDate}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* 房源描述 */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>房源描述</Text>
            <Text style={styles.descriptionText}>{house.description}</Text>
          </View>

          <View style={styles.divider} />

          {/* 位置信息 */}
          <View style={styles.locationSection}>
            <Text style={styles.sectionTitle}>位置信息</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.locationText}>{house.address}</Text>
            </View>
            {/* 地图占位 */}
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderText}>地图加载中...</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* 房东信息 */}
          <View style={styles.landlordSection}>
            <Text style={styles.sectionTitle}>房东信息</Text>
            <View style={styles.landlordInfo}>
              <View style={styles.landlordAvatar}>
                <Text style={styles.landlordInitial}>{house.landlord.name.charAt(0)}</Text>
              </View>
              <View style={styles.landlordDetails}>
                <Text style={styles.landlordName}>{house.landlord.name}</Text>
                <Text style={styles.landlordPhone}>{house.landlord.phone}</Text>
              </View>
              <TouchableOpacity style={styles.contactButton}>
                <Ionicons name="call-outline" size={20} color={theme.colors.primary} />
                <Text style={styles.contactButtonText}>联系房东</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 底部留白 */}
          <View style={styles.bottomSpace} />
        </View>
      </ScrollView>

      {/* 底部操作栏 */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.contractButton}
          onPress={viewContractTemplate}
        >
          <Text style={styles.contractButtonText}>查看合同模板</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={submitApplication}
        >
          <Text style={styles.applyButtonText}>提交租赁申请</Text>
        </TouchableOpacity>
      </View>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  errorText: {
    marginTop: 20,
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 30,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  backButton: {
    position: 'absolute',
    top: 15,
    left: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  houseImage: {
    width,
    height: 300,
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  indicatorDotActive: {
    backgroundColor: '#fff',
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  actionButtons: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    padding: 15,
  },
  houseTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 15,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff4d4f',
  },
  priceUnit: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginLeft: 5,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tag: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    color: theme.colors.primary,
    fontSize: 12,
  },
  divider: {
    height: 10,
    backgroundColor: theme.colors.border,
    marginVertical: 10,
  },
  detailSection: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  descriptionSection: {
    marginVertical: 10,
  },
  descriptionText: {
    fontSize: 15,
    color: theme.colors.textPrimary,
    lineHeight: 22,
  },
  locationSection: {
    marginVertical: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    fontSize: 15,
    color: theme.colors.textPrimary,
    marginLeft: 10,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  mapPlaceholderText: {
    color: theme.colors.textSecondary,
  },
  landlordSection: {
    marginVertical: 10,
  },
  landlordInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  landlordAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  landlordInitial: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  landlordDetails: {
    flex: 1,
  },
  landlordName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.textPrimary,
    marginBottom: 5,
  },
  landlordPhone: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  contactButtonText: {
    color: theme.colors.primary,
    fontSize: 14,
    marginLeft: 5,
  },
  bottomSpace: {
    height: 100,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  contractButton: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    marginRight: 10,
  },
  contractButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  applyButton: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default HouseDetailScreen;
