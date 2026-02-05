import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHousing } from '../contexts/HousingContext';

const HouseCard = ({ house, houseInfo, onPress }) => {
  // 支持两种属性名，优先使用house属性
  const houseData = house || houseInfo;
  // 输出传入的房源数据，验证数据是否正确
  console.log('HouseCard接收到的房源数据:', houseData);
  const { toggleFavorite } = useHousing();
  
  // 从houseData中获取收藏状态（使用isCollected字段，兼容isFavorite）
  const isCollected = houseData.isCollected || houseData.isFavorite || false;

  const handleCollectPress = () => {
    // 使用Context的toggleFavorite函数更新状态
    toggleFavorite(houseData.id);
  };

  return (
    <Pressable 
      style={styles.container} 
      onPress={onPress}
      accessibilityLabel={`${houseData.title}，${houseData.price}元/月`}
      accessibilityRole="button"
    >
      <View style={styles.card}>
        {/* 房源图片 */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: houseData.imgUrl || houseData.images?.[0] }}
            style={styles.image}
            resizeMode="cover"
            accessibilityLabel={`${houseData.title}的图片`}
          />
        </View>

        {/* 房源信息 */}
        <View style={styles.content}>
          {/* 价格和收藏按钮 */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              ¥{houseData.price}{houseData.priceUnit || '元/月'}
            </Text>
            <Pressable
              style={[styles.favoriteButton, isCollected && styles.favoriteButtonActive]}
              onPress={handleCollectPress}
              accessibilityLabel={isCollected ? "取消收藏" : "收藏"}
              accessibilityRole="button"
            >
              <Ionicons
                name={isCollected ? 'heart' : 'heart-outline'}
                size={20}
                color={isCollected ? '#FF4444' : '#666666'}
              />
            </Pressable>
          </View>

          {/* 标题 */}
          <Text style={styles.title} numberOfLines={1}>
            {houseData.title}
          </Text>

          {/* 位置 */}
          <Text style={styles.address} numberOfLines={1}>
            {houseData.location || houseData.address}
          </Text>

          {/* 房屋信息 */}
          <View style={styles.infoContainer}>
            <Text style={styles.info}>{houseData.area || '0㎡'}</Text>
            <Text style={styles.info}>{houseData.layout || '0室0厅'}</Text>
          </View>

          {/* 房源标签 */}
          <View style={styles.amenitiesContainer}>
            {(houseData.tags || houseData.amenities || []).slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.amenityTag}>
                <Text style={styles.amenityText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  card: {
    flexDirection: 'row',
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    marginRight: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF4444',
  },
  favoriteButton: {
    width: 24,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  favoriteButtonActive: {
    backgroundColor: 'rgba(255, 68, 68, 0.1)',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  info: {
    fontSize: 14,
    color: '#666666',
    marginRight: 12,
  },
  amenitiesContainer: {
    flexDirection: 'row',
  },
  amenityTag: {
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
  },
  amenityText: {
    fontSize: 12,
    color: '#666666',
  },
});

export default React.memo(HouseCard);