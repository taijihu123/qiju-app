// src/models/ServiceModel.js 
export const ServiceCategoryModel = { 
  id: '',   // 分类ID 
  name: ''  // 分类名称 
}; 

export const ServiceItemModel = { 
  id: '',        // 服务ID 
  categoryId: '', // 所属分类ID 
  title: '',     // 服务名称 
  desc: '',      // 服务描述 
  price: '',     // 服务价格 
  imgUrl: ''     // 服务图片 
};