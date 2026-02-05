// 用户信息 
export const userInfo = { 
  id: 'U123456', 
  name: '林小夏', 
  avatarUrl: require('../assets/images/avatar.jpg'), 
  joinTime: '2023-01-15', 
  level: 'LV.5' 
}; 

// 订单数量 - 用于调试小红点
export const orderCount = 5; // 改成5，看界面小红点会不会变

// 功能入口列表 
export const functionList = [ 
  {
    id: 'f1',
    icon: 'https://example.com/icon/order.png',
    title: '我的订单',
    badge: orderCount // 使用导出的订单数量变量
  }, 
  { 
    id: 'f2', 
    icon: 'https://example.com/icon/collect.png', 
    title: '我的收藏', 
    badge: 0 
  }, 
  { 
    id: 'f3', 
    icon: 'https://example.com/icon/coupon.png', 
    title: '优惠券', 
    badge: 5 
  }, 
  { 
    id: 'f4', 
    icon: 'https://example.com/icon/coin.png', 
    title: '生活币', 
    badge: 0 
  }, 
  { 
    id: 'f5', 
    icon: 'https://example.com/icon/assistant.png', 
    title: '智能助手', 
    badge: 0 
  }, 
  { 
    id: 'f6', 
    icon: 'https://example.com/icon/setting.png', 
    title: '设置', 
    badge: 0 
  } 
];