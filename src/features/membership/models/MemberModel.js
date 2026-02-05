// 会员系统数据模型
// 版本: 1.0.0
// 日期: 2026-01-07

// 会员等级枚举
export const MEMBER_LEVEL = {
  BRONZE: 'bronze',   // 青铜会员
  SILVER: 'silver',   // 白银会员
  GOLD: 'gold',       // 黄金会员
  PLATINUM: 'platinum'// 铂金会员
};

// 积分获取类型枚举
export const POINTS_TYPE = {
  SIGN_IN: 'sign_in',         // 签到
  RENTAL: 'rental',           // 租房
  SERVICE: 'service',         // 使用服务
  SHARE: 'share',             // 分享
  REVIEW: 'review',           // 评价
  REFERRAL: 'referral',       // 推荐
  SYSTEM_REWARD: 'system_reward' // 系统奖励
};

// 会员等级配置
export const MEMBER_LEVEL_CONFIG = {
  [MEMBER_LEVEL.BRONZE]: {
    name: '青铜会员',
    minPoints: 0,
    maxPoints: 999,
    joinFee: 0,
    validity: 365, // 有效期（天）
    benefits: [
      { id: 'basic_service', name: '基础服务', description: '享受平台基础服务' },
      { id: 'online_support', name: '在线客服', description: '7x24小时在线客服支持' }
    ]
  },
  [MEMBER_LEVEL.SILVER]: {
    name: '白银会员',
    minPoints: 1000,
    maxPoints: 4999,
    joinFee: 99,
    validity: 365,
    benefits: [
      { id: 'basic_service', name: '基础服务', description: '享受平台基础服务' },
      { id: 'online_support', name: '在线客服', description: '7x24小时在线客服支持' },
      { id: 'priority_viewing', name: '优先看房', description: '新上架房源优先预约看房' },
      { id: 'life_coin_reward', name: '生活币奖励', description: '消费额外获得10%生活币' },
      { id: 'discount_5', name: '5%折扣', description: '部分服务享受5%折扣' }
    ]
  },
  [MEMBER_LEVEL.GOLD]: {
    name: '黄金会员',
    minPoints: 5000,
    maxPoints: 9999,
    joinFee: 199,
    validity: 365,
    benefits: [
      { id: 'basic_service', name: '基础服务', description: '享受平台基础服务' },
      { id: 'online_support', name: '在线客服', description: '7x24小时在线客服支持' },
      { id: 'priority_viewing', name: '优先看房', description: '新上架房源优先预约看房' },
      { id: 'life_coin_reward', name: '生活币奖励', description: '消费额外获得20%生活币' },
      { id: 'discount_10', name: '10%折扣', description: '部分服务享受10%折扣' },
      { id: 'exclusive_butler', name: '专属管家', description: '提供专属管家服务' },
      { id: 'contract_discount', name: '合同折扣', description: '合同签署享受折扣' }
    ]
  },
  [MEMBER_LEVEL.PLATINUM]: {
    name: '铂金会员',
    minPoints: 10000,
    maxPoints: Infinity,
    joinFee: 399,
    validity: 365,
    benefits: [
      { id: 'basic_service', name: '基础服务', description: '享受平台基础服务' },
      { id: 'online_support', name: '在线客服', description: '7x24小时在线客服支持' },
      { id: 'priority_viewing', name: '优先看房', description: '新上架房源优先预约看房' },
      { id: 'life_coin_reward', name: '生活币奖励', description: '消费额外获得30%生活币' },
      { id: 'discount_15', name: '15%折扣', description: '部分服务享受15%折扣' },
      { id: 'exclusive_butler', name: '专属管家', description: '提供专属管家服务' },
      { id: 'contract_discount', name: '合同折扣', description: '合同签署享受折扣' },
      { id: 'premium_properties', name: '高端房源', description: '高端房源优先推荐' },
      { id: 'custom_service', name: '定制服务', description: '提供个性化定制服务' },
      { id: 'birthday_gift', name: '生日礼品', description: '会员生日赠送礼品' }
    ]
  }
};

// 积分规则配置
export const POINTS_RULES = {
  [POINTS_TYPE.SIGN_IN]: {
    minPoints: 5,
    maxPoints: 20,
    description: '每日签到获取积分',
    dailyLimit: 1,
    monthlyLimit: 30
  },
  [POINTS_TYPE.RENTAL]: {
    rate: 0.1, // 消费金额的10%
    minPoints: 100,
    maxPoints: 5000,
    description: '租房消费获取积分',
    dailyLimit: Infinity,
    monthlyLimit: Infinity
  },
  [POINTS_TYPE.SERVICE]: {
    rate: 0.05, // 服务金额的5%
    minPoints: 50,
    maxPoints: 2000,
    description: '使用服务获取积分',
    dailyLimit: Infinity,
    monthlyLimit: Infinity
  },
  [POINTS_TYPE.SHARE]: {
    points: 10,
    description: '分享房源或服务获取积分',
    dailyLimit: 5,
    monthlyLimit: 150
  },
  [POINTS_TYPE.REVIEW]: {
    minPoints: 20,
    maxPoints: 100,
    description: '评价获取积分',
    dailyLimit: 3,
    monthlyLimit: 90
  },
  [POINTS_TYPE.REFERRAL]: {
    points: 500,
    description: '推荐新用户获取积分',
    dailyLimit: Infinity,
    monthlyLimit: Infinity
  },
  [POINTS_TYPE.SYSTEM_REWARD]: {
    minPoints: 100,
    maxPoints: 1000,
    description: '系统奖励积分',
    dailyLimit: Infinity,
    monthlyLimit: Infinity
  }
};

// 会员模型
export class Member {
  constructor({
    userId,
    memberNumber,
    level = MEMBER_LEVEL.BRONZE,
    points = 0,
    lifeCoins = 0,
    joinDate,
    expirationDate,
    isActive = true,
    metadata = {}
  }) {
    this.userId = userId;
    this.memberNumber = memberNumber;
    this.level = level;
    this.points = points;
    this.lifeCoins = lifeCoins;
    this.joinDate = joinDate || new Date().toISOString();
    this.expirationDate = expirationDate || this.calculateExpirationDate();
    this.isActive = isActive;
    this.metadata = metadata;
  }

  // 计算会员有效期
  calculateExpirationDate() {
    const config = MEMBER_LEVEL_CONFIG[this.level];
    const expirationDate = new Date(this.joinDate);
    expirationDate.setDate(expirationDate.getDate() + config.validity);
    return expirationDate.toISOString();
  }

  // 更新会员等级
  updateLevel() {
    const oldLevel = this.level;
    
    // 根据积分计算新等级
    for (const level in MEMBER_LEVEL_CONFIG) {
      const config = MEMBER_LEVEL_CONFIG[level];
      if (this.points >= config.minPoints) {
        this.level = level;
      }
    }

    // 如果等级变化，更新有效期
    if (oldLevel !== this.level) {
      this.expirationDate = this.calculateExpirationDate();
    }

    return this.level;
  }

  // 增加积分
  addPoints(amount, type, sourceId = null) {
    this.points += amount;
    this.updateLevel();
    
    // 创建积分记录
    return new PointsRecord({
      userId: this.userId,
      memberId: this.memberNumber,
      amount,
      type,
      sourceId,
      balance: this.points
    });
  }

  // 减少积分
  deductPoints(amount, type = POINTS_TYPE.SYSTEM_REWARD, sourceId = null) {
    if (this.points >= amount) {
      this.points -= amount;
      this.updateLevel();
      
      // 创建积分记录
      return new PointsRecord({
        userId: this.userId,
        memberId: this.memberNumber,
        amount: -amount,
        type,
        sourceId,
        balance: this.points
      });
    }
    return null;
  }

  // 增加生活币
  addLifeCoins(amount, source = 'system') {
    this.lifeCoins += amount;
    
    // 创建生活币记录
    return new LifeCoinRecord({
      userId: this.userId,
      memberId: this.memberNumber,
      amount,
      source,
      balance: this.lifeCoins
    });
  }

  // 减少生活币
  deductLifeCoins(amount, source = 'system') {
    if (this.lifeCoins >= amount) {
      this.lifeCoins -= amount;
      
      // 创建生活币记录
      return new LifeCoinRecord({
        userId: this.userId,
        memberId: this.memberNumber,
        amount: -amount,
        source,
        balance: this.lifeCoins
      });
    }
    return null;
  }

  // 获取会员权益
  getBenefits() {
    return MEMBER_LEVEL_CONFIG[this.level].benefits;
  }

  // 检查会员是否过期
  isExpired() {
    return new Date(this.expirationDate) < new Date();
  }

  // 检查会员是否可以升级
  canUpgrade() {
    const currentConfig = MEMBER_LEVEL_CONFIG[this.level];
    const nextLevels = Object.keys(MEMBER_LEVEL_CONFIG)
      .filter(level => MEMBER_LEVEL_CONFIG[level].minPoints > currentConfig.minPoints)
      .sort((a, b) => MEMBER_LEVEL_CONFIG[a].minPoints - MEMBER_LEVEL_CONFIG[b].minPoints);
    
    return nextLevels.length > 0 && this.points >= MEMBER_LEVEL_CONFIG[nextLevels[0]].minPoints;
  }

  toJSON() {
    return {
      userId: this.userId,
      memberNumber: this.memberNumber,
      level: this.level,
      points: this.points,
      lifeCoins: this.lifeCoins,
      joinDate: this.joinDate,
      expirationDate: this.expirationDate,
      isActive: this.isActive,
      metadata: this.metadata
    };
  }

  static fromJSON(json) {
    return new Member(json);
  }
}

// 积分记录模型
export class PointsRecord {
  constructor({
    id,
    userId,
    memberId,
    amount,
    type,
    sourceId = null,
    balance,
    description = null,
    createdAt
  }) {
    this.id = id;
    this.userId = userId;
    this.memberId = memberId;
    this.amount = amount;
    this.type = type;
    this.sourceId = sourceId;
    this.balance = balance;
    this.description = description || POINTS_RULES[type]?.description || '未知类型';
    this.createdAt = createdAt || new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      memberId: this.memberId,
      amount: this.amount,
      type: this.type,
      sourceId: this.sourceId,
      balance: this.balance,
      description: this.description,
      createdAt: this.createdAt
    };
  }

  static fromJSON(json) {
    return new PointsRecord(json);
  }
}

// 生活币记录模型
export class LifeCoinRecord {
  constructor({
    id,
    userId,
    memberId,
    amount,
    source,
    balance,
    description = null,
    createdAt
  }) {
    this.id = id;
    this.userId = userId;
    this.memberId = memberId;
    this.amount = amount;
    this.source = source;
    this.balance = balance;
    this.description = description || `来自${source}的生活币`;
    this.createdAt = createdAt || new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      memberId: this.memberId,
      amount: this.amount,
      source: this.source,
      balance: this.balance,
      description: this.description,
      createdAt: this.createdAt
    };
  }

  static fromJSON(json) {
    return new LifeCoinRecord(json);
  }
}

// 会员权益模型
export class MemberBenefit {
  constructor({
    id,
    name,
    description,
    icon,
    applicableLevels = Object.keys(MEMBER_LEVEL),
    isActive = true
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.icon = icon;
    this.applicableLevels = applicableLevels;
    this.isActive = isActive;
  }

  // 检查会员等级是否可以享受此权益
  isApplicable(level) {
    return this.isActive && this.applicableLevels.includes(level);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      icon: this.icon,
      applicableLevels: this.applicableLevels,
      isActive: this.isActive
    };
  }

  static fromJSON(json) {
    return new MemberBenefit(json);
  }
}
