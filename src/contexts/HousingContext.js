import React, { createContext, useContext, useState, useEffect } from 'react';
import { get, post } from '../common/services/request';
import { BASE_API } from '../config/env';

// 创建上下文
const HousingContext = createContext();

// 模拟房源数据
const mockHouses = [
  {
    id: '1',
    title: '阳光公寓',
    price: 8500,
    priceUnit: '元/月',
    location: '上海市浦东新区张江高科技园区',
    layout: '2室1厅',
    area: '90㎡',
    tags: ['近地铁', '精装修', '拎包入住'],
    imgUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    isCollected: false
  },
  {
    id: '2',
    title: '精品住宅',
    price: 12000,
    priceUnit: '元/月',
    location: '上海市静安区南京西路',
    layout: '3室2厅',
    area: '110㎡',
    tags: ['豪华装修', '地铁房', '带电梯'],
    imgUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
    isCollected: false
  },
  {
    id: '3',
    title: '温馨小屋',
    price: 7800,
    priceUnit: '元/月',
    location: '上海市徐汇区衡山路',
    layout: '1室1厅',
    area: '75㎡',
    tags: ['花园洋房', '近商圈', '安静舒适'],
    imgUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
    isCollected: false
  }
];

// 上下文提供者组件
export const HousingProvider = ({ children }) => {
  const [houses, setHouses] = useState([]);
  const [filteredHouses, setFilteredHouses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTags, setFilterTags] = useState([]);
  const [activeTag, setActiveTag] = useState(null);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 20000,
    layout: 'all',
    area: 'all'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 请求房源数据
  const fetchHouses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // 简单使用模拟数据，避免API请求
      setHouses(mockHouses);
      setFilteredHouses(mockHouses);
    } catch (err) {
      setError('获取房源数据失败');
      console.error('获取房源数据失败：', err);
      setHouses(mockHouses);
      setFilteredHouses(mockHouses);
    } finally {
      setLoading(false);
    }
  };

  // 初始加载数据
  useEffect(() => {
    fetchHouses();
  }, []);

  // 过滤房源
  useEffect(() => {
    let result = [...houses];

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(house => 
        house.title.toLowerCase().includes(query) ||
        house.location.toLowerCase().includes(query)
      );
    }

    // 价格过滤
    result = result.filter(house => 
      house.price >= filters.minPrice && house.price <= filters.maxPrice
    );

    // 标签过滤
    if (activeTag && activeTag !== 'all') {
      result = result.filter(house => house.tags.includes(activeTag));
    }

    setFilteredHouses(result);
  }, [houses, searchQuery, filters, activeTag]);

  // 切换收藏状态
  const toggleFavorite = (houseId) => {
    try {
      // 更新内存状态
      const updatedHouses = houses.map(house => 
        house.id === houseId ? { ...house, isCollected: !house.isCollected } : house
      );
      
      setHouses(updatedHouses);
      setFilteredHouses(updatedHouses);
      
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  // 更新搜索查询
  const updateSearchQuery = (query) => {
    setSearchQuery(query);
  };

  // 更新过滤条件
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // 设置过滤标签
  const setFilterTagsList = (tags) => {
    setFilterTags(tags);
  };

  // 设置活跃标签
  const setActiveFilterTag = (tag) => {
    setActiveTag(tag);
  };

  return (
    <HousingContext.Provider
      value={{
        houses,
        filteredHouses,
        searchQuery,
        filters,
        filterTags,
        activeTag,
        loading,
        error,
        toggleFavorite,
        updateSearchQuery,
        updateFilters,
        setFilterTagsList,
        setActiveFilterTag
      }}
    >
      {children}
    </HousingContext.Provider>
  );
};

// 自定义钩子，方便组件使用上下文
export const useHousing = () => {
  const context = useContext(HousingContext);
  if (!context) {
    throw new Error('useHousing must be used within a HousingProvider');
  }
  return context;
};