import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { theme } from '../../../common/styles/theme';

const HousingCard = ({ house, onFavoritePress, onPress }) => {
  // 格式化价格显示
  const formatPrice = (price) => {
    if (price >= 10000) {
      return `${(price / 10000).toFixed(1)}万/月`;
    }
    return `${price}元/月`;
  };

  // 获取房源类型标签
  const getPropertyTypeLabel = () => {
    if (house.bedrooms === 1) return '一室';
    if (house.bedrooms === 2) return '两室';
    if (house.bedrooms === 3) return '三室';
    return `${house.bedrooms}室`;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      {/* 图片区域 */}
      <View style={styles.imageContainer}>
        {/* 图片 */}
        <Image 
          source={{ uri: house.images[0] }} 
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* 房源类型标签 */}
        <View style={styles.propertyTypeTag}>
          <Text style={styles.propertyTypeText}>{getPropertyTypeLabel()}</Text>
        </View>
        
        {/* 收藏按钮 */}
        <TouchableOpacity 
          style={[styles.favoriteButton, house.isFavorite && styles.favoriteButtonActive]}
          onPress={(e) => {
            e.stopPropagation();
            onFavoritePress(house.id);
          }}
          activeOpacity={0.7}
        >
          <Text style={[styles.favoriteIcon, house.isFavorite && styles.favoriteIconActive]}>
            {house.isFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* 信息区域 */}
      <View style={styles.content}>
        {/* 价格标签 */}
        <Text style={styles.priceContainer}>
          <Text style={styles.priceSymbol}>¥</Text>
          <Text style={styles.price}>{formatPrice(house.price)}</Text>
        </Text>
        
        {/* 标题和评分 */}
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {house.title}
          </Text>
          {house.rating && (
            <View style={styles.rating}>
              <Text style={styles.ratingText}>★ {house.rating}</Text>
            </View>
          )}
        </View>
        
        {/* 地址 */}
        <Text style={styles.address} numberOfLines={1}>
          {house.address}
        </Text>
        
        {/* 基本信息 */}
        <View style={styles.info}>
          <Text style={styles.infoItem}>{house.area}㎡</Text>
          <Text style={styles.infoDivider}>·</Text>
          <Text style={styles.infoItem}>{house.bedrooms}室{house.bathrooms}卫</Text>
          {house.floor && house.totalFloors && (
            <>
              <Text style={styles.infoDivider}>·</Text>
              <Text style={styles.infoItem}>{house.floor}/{house.totalFloors}层</Text>
            </>
          )}
        </View>
        
        {/* 设施标签 */}
        <View style={styles.amenities}>
          {house.amenities.slice(0, 3).map((amenity, index) => (
            <View key={index} style={styles.amenityTag}>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
          {house.amenities.length > 3 && (
            <View style={styles.amenityTag}>
              <Text style={styles.amenityText}>+{house.amenities.length - 3}</Text>
            </View>
          )}
        </View>
        
        {/* 特色标签 */}
        {house.tags && house.tags.length > 0 && (
          <View style={styles.tags}>
            {house.tags.slice(0, 2).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing[6],
    ...theme.shadow.md,
    overflow: 'hidden',
    flexDirection: 'row', // 横向布局
    padding: theme.spacing[3],
    gap: theme.spacing[3],
  },
  imageContainer: {
    position: 'relative',
    width: 80, // 图片宽度80px
    height: 80, // 图片高度80px
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 8, // 圆角8px
    overflow: 'hidden'
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8, // 圆角8px
  },
  imageCount: {
    position: 'absolute',
    top: theme.spacing[4],
    left: theme.spacing[4],
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.full
  },
  imageCountText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.white,
    fontWeight: theme.fontWeight.medium
  },
  propertyTypeTag: {
    position: 'absolute',
    top: theme.spacing[4],
    left: theme.spacing[4],
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.full
  },
  propertyTypeText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.white,
    fontWeight: theme.fontWeight.medium
  },
  favoriteButton: {
    position: 'absolute',
    top: theme.spacing[4],
    right: theme.spacing[4],
    width: 24,
    height: 24,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.sm
  },
  favoriteButtonActive: {
    backgroundColor: theme.colors.background
  },
  favoriteIcon: {
    fontSize: 20
  },
  favoriteIconActive: {
    color: '#FF4444'
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing[2],
  },
  priceSymbol: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.bold,
    color: '#FF4444',
    marginRight: 2
  },
  price: {
    fontSize: 18, // 18px粗体
    fontWeight: theme.fontWeight.bold,
    color: '#FF4444' // 颜色#FF4444
  },
  content: {
    padding: theme.spacing[5]
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[2]
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.textPrimary,
    flex: 1,
    marginRight: theme.spacing[3]
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.full
  },
  ratingText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.warning,
    fontWeight: theme.fontWeight.medium
  },
  address: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing[3]
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[4]
  },
  infoItem: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textPrimary,
    fontWeight: theme.fontWeight.medium
  },
  infoDivider: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.textTertiary,
    marginHorizontal: theme.spacing[2]
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing[3],
    gap: theme.spacing[2]
  },
  amenityTag: {
    backgroundColor: theme.colors.backgroundSecondary,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.sm
  },
  amenityText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2]
  },
  tag: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.sm
  },
  tagText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium
  }
});

export default HousingCard;