// 电子合同数据模型
// 版本: 1.0.0
// 日期: 2026-01-07

// 合同状态枚举
export const CONTRACT_STATUS = {
  PENDING: 'pending',     // 待签署
  ACTIVE: 'active',       // 已生效
  EXPIRED: 'expired',     // 已过期
  CANCELED: 'canceled',   // 已取消
  TERMINATED: 'terminated'// 已终止
};

// 合同类型枚举
export const CONTRACT_TYPE = {
  RENTAL: 'rental',       // 租赁合同
  SERVICE: 'service',     // 服务合同
  EMPLOYMENT: 'employment'// 雇佣合同（管家、厨师等）
};

// 电子合同数据模型
export class Contract {
  constructor({
    id,
    contractNumber,
    title,
    content,
    status = CONTRACT_STATUS.PENDING,
    type = CONTRACT_TYPE.RENTAL,
    startTime,
    endTime,
    parties = [],
    signatureInfo = {},
    files = [],
    metadata = {},
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.contractNumber = contractNumber;
    this.title = title;
    this.content = content;
    this.status = status;
    this.type = type;
    this.startTime = startTime;
    this.endTime = endTime;
    this.parties = parties;
    this.signatureInfo = signatureInfo;
    this.files = files;
    this.metadata = metadata;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }

  // 更新合同状态
  updateStatus(newStatus) {
    if (Object.values(CONTRACT_STATUS).includes(newStatus)) {
      this.status = newStatus;
      this.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  // 添加签署方
  addParty(party) {
    this.parties.push(party);
    this.updatedAt = new Date().toISOString();
  }

  // 添加签名信息
  addSignature(partyId, signatureData) {
    this.signatureInfo[partyId] = {
      ...signatureData,
      signedAt: new Date().toISOString()
    };
    this.updatedAt = new Date().toISOString();
  }

  // 添加合同文件
  addFile(file) {
    this.files.push(file);
    this.updatedAt = new Date().toISOString();
  }

  // 检查合同是否已全部签署
  isFullySigned() {
    return this.parties.every(party => this.signatureInfo[party.id]);
  }

  // 检查合同是否已过期
  isExpired() {
    return this.status === CONTRACT_STATUS.EXPIRED || 
           (this.endTime && new Date(this.endTime) < new Date());
  }

  // 转换为JSON对象
  toJSON() {
    return {
      id: this.id,
      contractNumber: this.contractNumber,
      title: this.title,
      content: this.content,
      status: this.status,
      type: this.type,
      startTime: this.startTime,
      endTime: this.endTime,
      parties: this.parties,
      signatureInfo: this.signatureInfo,
      files: this.files,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // 从JSON对象创建合同实例
  static fromJSON(json) {
    return new Contract(json);
  }
}

// 合同签署方模型
export class ContractParty {
  constructor({
    id,
    userId,
    name,
    role,
    phone,
    email,
    address,
    idCard,
    isSignatory = true,
    isPrimary = false
  }) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.role = role;
    this.phone = phone;
    this.email = email;
    this.address = address;
    this.idCard = idCard;
    this.isSignatory = isSignatory;
    this.isPrimary = isPrimary;
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      role: this.role,
      phone: this.phone,
      email: this.email,
      address: this.address,
      idCard: this.idCard,
      isSignatory: this.isSignatory,
      isPrimary: this.isPrimary
    };
  }

  static fromJSON(json) {
    return new ContractParty(json);
  }
}

// 合同文件模型
export class ContractFile {
  constructor({
    id,
    fileName,
    fileType,
    fileSize,
    fileUrl,
    isPrimary = false,
    uploadedAt
  }) {
    this.id = id;
    this.fileName = fileName;
    this.fileType = fileType;
    this.fileSize = fileSize;
    this.fileUrl = fileUrl;
    this.isPrimary = isPrimary;
    this.uploadedAt = uploadedAt || new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      fileName: this.fileName,
      fileType: this.fileType,
      fileSize: this.fileSize,
      fileUrl: this.fileUrl,
      isPrimary: this.isPrimary,
      uploadedAt: this.uploadedAt
    };
  }

  static fromJSON(json) {
    return new ContractFile(json);
  }
}

// 合同签名信息模型
export class SignatureInfo {
  constructor({
    partyId,
    signatureImage,
    signatureData,
    signedAt,
    ipAddress,
    deviceInfo
  }) {
    this.partyId = partyId;
    this.signatureImage = signatureImage;
    this.signatureData = signatureData;
    this.signedAt = signedAt;
    this.ipAddress = ipAddress;
    this.deviceInfo = deviceInfo;
  }

  toJSON() {
    return {
      partyId: this.partyId,
      signatureImage: this.signatureImage,
      signatureData: this.signatureData,
      signedAt: this.signedAt,
      ipAddress: this.ipAddress,
      deviceInfo: this.deviceInfo
    };
  }

  static fromJSON(json) {
    return new SignatureInfo(json);
  }
}
