// src/mock/serviceData.js 
// 服务分类 
export const serviceCategories = [ 
  { id: 'c1', name: '家政保洁' }, 
  { id: 'c2', name: '家电维修' }, 
  { id: 'c3', name: '搬家服务' }, 
  { id: 'c4', name: '管道疏通' } 
]; 

// 服务列表 
export const mockServices = [ 
  { 
    id: 's1', 
    categoryId: 'c1', 
    title: '日常保洁', 
    desc: '3小时全屋清洁，含玻璃/地面/家具', 
    price: '¥129', 
    imgUrl: require('../assets/images/clean1.jpg') 
  }, 
  { 
    id: 's2', 
    categoryId: 'c2', 
    title: '空调维修', 
    desc: '挂机/柜机检测+维修，含基础配件', 
    price: '¥80起', 
    imgUrl: 'https://example.com/acfix.jpg' 
  } 
];