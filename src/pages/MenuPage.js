import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../common/styles/theme';

const MenuPage = () => {
  const navigation = useNavigation();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // 模拟菜单数据
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        // 模拟API请求延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 模拟菜单数据
        const mockMenuItems = [
          {
            id: 1,
            name: '美式咖啡',
            price: 25,
            description: '经典美式咖啡，口感醇厚',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=americano%20coffee%20in%20a%20glass%20cup%2C%20dark%20brown%20color%2C%20steam%20rising&image_size=square',
            category: 'coffee'
          },
          {
            id: 2,
            name: '拿铁咖啡',
            price: 30,
            description: '浓缩咖啡与牛奶的完美融合',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=latte%20coffee%20with%20heart%20shape%20latte%20art%2C%20cream%20color&image_size=square',
            category: 'coffee'
          },
          {
            id: 3,
            name: '卡布奇诺',
            price: 32,
            description: '浓郁的奶泡与咖啡',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cappuccino%20with%20thick%20milk%20foam%2C%20cinnamon%20sprinkles&image_size=square',
            category: 'coffee'
          },
          {
            id: 4,
            name: '巧克力蛋糕',
            price: 28,
            description: '浓郁的巧克力风味',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chocolate%20cake%20slice%20with%20chocolate%20icing%2C%20rich%20dark%20color&image_size=square',
            category: 'dessert'
          },
          {
            id: 5,
            name: '草莓芝士蛋糕',
            price: 32,
            description: '新鲜草莓与芝士的结合',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=strawberry%20cheesecake%20with%20fresh%20strawberries%20on%20top&image_size=square',
            category: 'dessert'
          },
          {
            id: 6,
            name: '牛角面包',
            price: 18,
            description: '酥脆可口的法式牛角面包',
            image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=croissant%20with%20golden%20brown%20color%2C%20flaky%20texture&image_size=square',
            category: 'bread'
          }
        ];
        
        setMenuItems(mockMenuItems);
      } catch (err) {
        console.error('获取菜单数据失败:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenuItems();
  }, []);

  // 分类筛选
  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  // 分类列表
  const categories = [
    { id: 'all', name: '全部', icon: 'grid' },
    { id: 'coffee', name: '咖啡', icon: 'cafe' },
    { id: 'dessert', name: '甜品', icon: 'cake' },
    { id: 'bread', name: '面包', icon: 'fast-food' }
  ];

  // 渲染菜单项
  const renderMenuItem = ({ item }) => (
    <TouchableOpacity style={styles.menuItem}>
      <Image source={{ uri: item.image }} style={styles.menuImage} resizeMode="cover" />
      <View style={styles.menuInfo}>
        <Text style={styles.menuName}>{item.name}</Text>
        <Text style={styles.menuDescription}>{item.description}</Text>
        <View style={styles.menuBottom}>
          <Text style={styles.menuPrice}>¥{item.price}</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>加载菜单中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>自主菜单</Text>
        <View style={styles.cartButton}>
          <Ionicons name="cart-outline" size={24} color="#000" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>2</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 分类选择 */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryItem,
                selectedCategory === category.id && styles.categoryItemActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons 
                name={category.icon} 
                size={20} 
                color={selectedCategory === category.id ? theme.colors.primary : theme.colors.textSecondary} 
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 菜单列表 */}
      <FlatList
        data={filteredItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.menuList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={styles.emptyText}>暂无相关菜品</Text>
          </View>
        }
      />

      {/* 底部订单栏 */}
      <View style={styles.orderBar}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderTotal}>合计：¥68</Text>
          <Text style={styles.orderCount}>2件商品</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>去结算</Text>
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
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  cartButton: {
    padding: 8,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    backgroundColor: theme.colors.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  categoryItemActive: {
    backgroundColor: theme.colors.primary,
  },
  categoryText: {
    marginLeft: 4,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  categoryTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  menuList: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    ...theme.shadow.sm,
  },
  menuImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  menuInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  menuName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
    marginBottom: 8,
  },
  menuBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5722',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  orderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  orderInfo: {
    flex: 1,
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5722',
  },
  orderCount: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  checkoutButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  checkoutButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});

export default MenuPage;