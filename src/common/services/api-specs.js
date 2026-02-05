// API接口规范文档
// 版本: 1.0.1
// 日期: 2026-01-11

// API基础配置
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8888/api',
  TIMEOUT: 10000,
};

// 用户相关接口规范
export const USER_API = {
  // 获取当前用户信息
  GET_CURRENT_USER: {
    url: '/users/me',
    method: 'GET',
    requiresAuth: true,
    params: {},
    responseFormat: {
      id: 'number',               // 用户ID
      username: 'string',         // 用户名
      email: 'string',            // 邮箱
      role: 'string',             // 用户角色: USER/ADMIN
      phone: 'string',            // 手机号码
      address: 'string',          // 地址
      nickname: 'string',         // 昵称
      memberLevel: 'string',      // 会员等级: BRONZE/SILVER/GOLD/PLATINUM
      memberPoints: 'number',     // 会员积分
      lifeCoinBalance: 'number',  // 生活币余额
      totalConsumption: 'number', // 总消费金额
      lastLoginTime: 'string',    // 最后登录时间
    }
  },

  // 用户登录
  LOGIN: {
    url: '/auth/login',
    method: 'POST',
    requiresAuth: false,
    params: {
      username: 'string',         // 用户名
      password: 'string'          // 密码
    },
    responseFormat: {
      accessToken: 'string',      // JWT访问令牌
      refreshToken: 'string'      // JWT刷新令牌
    }
  },

  // 用户注册
  REGISTER: {
    url: '/auth/register',
    method: 'POST',
    requiresAuth: false,
    params: {
      username: 'string',         // 用户名
      password: 'string',         // 密码
      email: 'string',            // 邮箱
      phone: 'string',            // 手机号码
      role: 'string'              // 用户角色: USER/ADMIN
    },
    responseFormat: {
      id: 'number',               // 用户ID
      username: 'string',         // 用户名
      email: 'string',            // 邮箱
      role: 'string'              // 用户角色
    }
  },

  // 更新用户信息
  UPDATE_USER_INFO: {
    url: '/users/me',
    method: 'PUT',
    requiresAuth: true,
    params: {
      username: 'string',         // 用户名
      nickname: 'string',         // 昵称
      email: 'string',            // 邮箱
      phone: 'string',            // 手机号码
      address: 'string'           // 地址
    },
    responseFormat: {
      id: 'number',               // 用户ID
      username: 'string',         // 用户名
      nickname: 'string',         // 昵称
      email: 'string',            // 邮箱
      phone: 'string',            // 手机号码
      address: 'string',          // 地址
      role: 'string',             // 用户角色
      memberLevel: 'string',      // 会员等级
      memberPoints: 'number',     // 会员积分
      lifeCoinBalance: 'number'   // 生活币余额
    }
  },

  // 刷新令牌
  REFRESH_TOKEN: {
    url: '/auth/refresh-token',
    method: 'POST',
    requiresAuth: false,
    params: {
      refreshToken: 'string'      // 刷新令牌
    },
    responseFormat: {
      accessToken: 'string'       // 新的访问令牌
    }
  }
};

// 电子合同接口规范
export const CONTRACT_API = {
  // 获取合同列表
  GET_CONTRACTS: {
    url: '/contracts',
    method: 'GET',
    requiresAuth: true,
    params: {
      status: 'string',       // 合同状态筛选
      type: 'string'          // 合同类型筛选
    },
    responseFormat: {
      code: 'number',         // 状态码
      msg: 'string',          // 消息
      data: 'array'           // 合同列表
    }
  },

  // 获取合同详情
  GET_CONTRACT_DETAIL: {
    url: '/contracts/:id',
    method: 'GET',
    requiresAuth: true,
    params: {},
    responseFormat: {
      code: 'number',         // 状态码
      msg: 'string',          // 消息
      data: 'object'          // 合同详情
    }
  },

  // 签署合同
  SIGN_CONTRACT: {
    url: '/contracts/:id/sign',
    method: 'POST',
    requiresAuth: true,
    params: {
      signature: 'string'     // 电子签名信息
    },
    responseFormat: {
      code: 'number',         // 状态码
      msg: 'string',          // 消息
      data: 'object'          // 签署结果
    }
  }
};

// 生活服务接口规范
export const LIFE_SERVICE_API = {
  // 获取服务分类
  GET_CATEGORIES: {
    url: '/life-service/categories',
    method: 'GET',
    requiresAuth: false,
    params: {},
    responseFormat: {
      code: 'number',         // 状态码
      msg: 'string',          // 消息
      data: 'array'           // 分类列表
    }
  },

  // 获取服务项目列表
  GET_ITEMS: {
    url: '/life-service/items',
    method: 'GET',
    requiresAuth: false,
    params: {
      categoryId: 'number',   // 分类ID
      page: 'number',         // 页码
      pageSize: 'number'      // 每页数量
    },
    responseFormat: {
      code: 'number',         // 状态码
      msg: 'string',          // 消息
      data: 'object'          // 项目列表及分页信息
    }
  },

  // 获取服务项目详情
  GET_ITEM_DETAIL: {
    url: '/life-service/items/:id',
    method: 'GET',
    requiresAuth: false,
    params: {},
    responseFormat: {
      code: 'number',         // 状态码
      msg: 'string',          // 消息
      data: 'object'          // 项目详情
    }
  },

  // 创建服务订单
  CREATE_ORDER: {
    url: '/life-service/orders',
    method: 'POST',
    requiresAuth: true,
    params: {
      serviceItemId: 'number', // 服务项目ID
      stewardId: 'number',     // 管家ID
      scheduledTime: 'string', // 预约时间
      notes: 'string'          // 备注信息
    },
    responseFormat: {
      code: 'number',         // 状态码
      msg: 'string',          // 消息
      data: 'object'          // 订单信息
    }
  },

  // 获取订单列表
  GET_ORDERS: {
    url: '/life-service/orders',
    method: 'GET',
    requiresAuth: true,
    params: {
      status: 'string',       // 订单状态筛选
      page: 'number',         // 页码
      pageSize: 'number'      // 每页数量
    },
    responseFormat: {
      code: 'number',         // 状态码
      msg: 'string',          // 消息
      data: 'object'          // 订单列表及分页信息
    }
  },

  // 获取订单详情
  GET_ORDER_DETAIL: {
    url: '/life-service/orders/:id',
    method: 'GET',
    requiresAuth: true,
    params: {},
    responseFormat: {
      code: 'number',         // 状态码
      msg: 'string',          // 消息
      data: 'object'          // 订单详情
    }
  }
};

// 会员系统接口规范
export const MEMBER_API = {
  // 会员信息已经包含在用户信息中，通过 /users/me 获取
  // 积分和生活币管理功能通过用户信息接口实现
};
