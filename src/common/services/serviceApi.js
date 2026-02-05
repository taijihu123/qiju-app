import { get } from './request';
import { logger } from './logger';

/**
 * 获取服务分类列表
 * @returns {Promise} 分类数据
 */
// 分类模拟数据
const mockCategoriesData = {
  code: 200,
  data: [
    { id: 1, name: '家电维修', icon: 'construct-outline', color: '#ff6b6b' },
    { id: 2, name: '家居清洁', icon: 'water-outline', color: '#4ecdc4' },
    { id: 3, name: '搬家服务', icon: 'car-outline', color: '#45b7d1' },
    { id: 4, name: '管道疏通', icon: 'water-outline', color: '#96ceb4' },
    { id: 5, name: '上门洗衣', icon: 'shirt-outline', color: '#ffeaa7' },
    { id: 6, name: '家政服务', icon: 'people-outline', color: '#dda0dd' }
  ],
  msg: "模拟数据"
};

export const getServiceCategories = async () => {
  try {
    const response = await get('/life-service/categories');
    // 如果后端返回成功但数据为空，使用模拟数据
    if (response.code === 200 && (!response.data || !Array.isArray(response.data) || response.data.length === 0)) {
      console.log('后端返回空分类数据，使用模拟分类数据:', mockCategoriesData);
      return mockCategoriesData;
    }
    return response;
  } catch (error) {
    logger.error("获取服务分类失败：", error);
    // 请求失败时使用模拟数据作为后备
    console.log('获取分类失败，使用模拟分类数据:', mockCategoriesData);
    return mockCategoriesData;
  }
};

/**
 * 获取服务项目列表
 * @returns {Promise} 服务数据
 */
// 服务模拟数据
const mockServicesData = {
  code: 200,
  data: [
    {
      id: 1,
      title: '空调维修',
      categoryId: 1,
      categoryName: '家电维修',
      price: '¥80',
      duration: '60分钟',
      desc: '专业空调维修，快速上门服务',
      provider: '家电维修服务中心',
      rating: 4.8,
      reviewCount: 128,
      imgUrl: 'https://example.com/air-conditioner-repair.jpg'
    },
    {
      id: 2,
      title: '冰箱维修',
      categoryId: 1,
      categoryName: '家电维修',
      price: '¥100',
      duration: '90分钟',
      desc: '冰箱不制冷、漏水等故障维修',
      provider: '家电维修服务中心',
      rating: 4.7,
      reviewCount: 98,
      imgUrl: 'https://example.com/refrigerator-repair.jpg'
    },
    {
      id: 3,
      title: '洗衣机维修',
      categoryId: 1,
      categoryName: '家电维修',
      price: '¥90',
      duration: '80分钟',
      desc: '洗衣机不排水、噪音大等问题维修',
      provider: '家电维修服务中心',
      rating: 4.6,
      reviewCount: 112,
      imgUrl: 'https://example.com/washing-machine-repair.jpg'
    },
    {
      id: 4,
      title: '深度清洁',
      categoryId: 2,
      categoryName: '家居清洁',
      price: '¥150',
      duration: '120分钟',
      desc: '全屋深度清洁，让您的家焕然一新',
      provider: '洁净家政服务',
      rating: 4.9,
      reviewCount: 256,
      imgUrl: 'https://example.com/deep-cleaning.jpg'
    },
    {
      id: 5,
      title: '日常保洁',
      categoryId: 2,
      categoryName: '家居清洁',
      price: '¥80',
      duration: '60分钟',
      desc: '每周定期保洁，保持家居整洁',
      provider: '洁净家政服务',
      rating: 4.8,
      reviewCount: 189,
      imgUrl: 'https://example.com/regular-cleaning.jpg'
    },
    {
      id: 6,
      title: '专业搬家',
      categoryId: 3,
      categoryName: '搬家服务',
      price: '¥300',
      duration: '180分钟',
      desc: '专业搬家团队，安全高效',
      provider: '快捷搬家服务',
      rating: 4.7,
      reviewCount: 89,
      imgUrl: 'https://example.com/professional-moving.jpg'
    },
    {
      id: 7,
      title: '学生搬家',
      categoryId: 3,
      categoryName: '搬家服务',
      price: '¥150',
      duration: '90分钟',
      desc: '学生行李搬运，经济实惠',
      provider: '快捷搬家服务',
      rating: 4.9,
      reviewCount: 156,
      imgUrl: 'https://example.com/student-moving.jpg'
    },
    {
      id: 8,
      title: '管道疏通',
      categoryId: 4,
      categoryName: '管道疏通',
      price: '¥120',
      duration: '60分钟',
      desc: '厕所、厨房管道疏通服务',
      provider: '管道维修服务',
      rating: 4.6,
      reviewCount: 78,
      imgUrl: 'https://example.com/pipe-cleaning.jpg'
    },
    {
      id: 9,
      title: '上门洗衣',
      categoryId: 5,
      categoryName: '上门洗衣',
      price: '¥50',
      duration: '24小时',
      desc: '上门取送，专业洗衣服务',
      provider: '洁净洗衣服务',
      rating: 4.8,
      reviewCount: 213,
      imgUrl: 'https://example.com/laundry-service.jpg'
    },
    {
      id: 10,
      title: '月嫂服务',
      categoryId: 6,
      categoryName: '家政服务',
      price: '¥5000/月',
      duration: '30天',
      desc: '专业月嫂，精心护理母婴',
      provider: '贴心家政服务',
      rating: 4.9,
      reviewCount: 45,
      imgUrl: 'https://example.com/yuesao-service.jpg'
    }
  ],
  msg: "模拟数据"
};

export const getServices = async () => {
  try {
    const response = await get('/life-service/services');
    // 如果后端返回成功但数据为空，使用模拟数据
    if (response.code === 200 && (!response.data || !Array.isArray(response.data) || response.data.length === 0)) {
      console.log('后端返回空数据，使用模拟服务数据:', mockServicesData);
      return mockServicesData;
    }
    return response;
  } catch (error) {
    logger.error("获取服务项目失败：", error);
    // 请求失败时使用模拟数据作为后备
    console.log('获取服务失败，使用模拟服务数据:', mockServicesData);
    return mockServicesData;
  }
};
