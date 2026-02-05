import React, { createContext, useState, useContext, useEffect } from 'react';
import { get, post, put, instance } from '../common/services/request';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MEMBER_LEVEL_CONFIG } from '../features/membership/models/MemberModel';

const UserContext = createContext(null);

// 权限配置
const PERMISSIONS = {
  tenant: ['view_houses', 'favorite_houses', 'book_appointment', 'sign_contract', 'view_member_info'],
  landlord: ['manage_houses', 'view_appointments', 'manage_contracts', 'withdraw_funds', 'view_statistics'],
  admin: ['all']
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState('tenant'); // 'tenant' or 'landlord'
  const [memberLevel, setMemberLevel] = useState('bronze');
  const [points, setPoints] = useState(0);
  const [lifeCoins, setLifeCoins] = useState(0);

  // 权限检查方法
  const hasPermission = (permission) => {
    if (!user) return false;
    if (userType === 'admin') return true;
    return PERMISSIONS[userType]?.includes(permission) || false;
  };

  // 计算会员等级
  const calculateMemberLevel = (currentPoints) => {
    // 根据积分计算会员等级
    for (const level in MEMBER_LEVEL_CONFIG) {
      const config = MEMBER_LEVEL_CONFIG[level];
      if (currentPoints >= config.minPoints) {
        return level;
      }
    }
    return Object.keys(MEMBER_LEVEL_CONFIG)[0]; // 默认返回最低等级
  };

  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const userResponse = await get('/users/me');
      
      console.log('获取用户信息响应:', JSON.stringify(userResponse.data, null, 2));
      
      // 检查响应状态
      if (!userResponse || !userResponse.data) {
        throw new Error('无效的响应数据');
      }
      
      // 处理不同的数据结构
      let userData;
      if (userResponse.data.code === 200) {
        // 正常响应情况
        if (userResponse.data.data?.data?.data) {
          userData = userResponse.data.data.data;
          console.log('通过路径 data.data.data 获取到用户数据');
        } else if (userResponse.data.data?.data) {
          userData = userResponse.data.data;
          console.log('通过路径 data.data 获取到用户数据');
        } else if (userResponse.data.data) {
          userData = userResponse.data.data;
          console.log('通过路径 data 获取到用户数据');
        } else {
          throw new Error('响应数据结构不符合预期');
        }
      } else {
        // 错误响应情况
        throw new Error(userResponse.data.msg || '获取用户信息失败');
      }
      
      // 验证用户数据
      if (!userData) {
        throw new Error('用户数据为空');
      }
      
      console.log('解析后的用户数据:', JSON.stringify(userData, null, 2));
      
      setUser(userData);
      setUserType(userData.role || 'tenant');
      setPoints(userData.memberPoints || 0);
      setLifeCoins(userData.lifeCoinBalance || 0);
      setMemberLevel(calculateMemberLevel(userData.memberPoints || 0));
    } catch (err) {
      const errorMessage = err.response?.data?.msg || err.message || '获取用户信息失败';
      setError(errorMessage);
      console.error('获取用户信息失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      // 调用后端登录接口获取token
      const loginResponse = await post('/auth/login', credentials);
      
      console.log('登录响应完整结构:', JSON.stringify(loginResponse, null, 2));
      console.log('登录响应data结构:', JSON.stringify(loginResponse.data, null, 2));
      
      // 检查后端响应的code是否为200
      if (loginResponse.data.code === 200) {
        // 尝试从不同可能的嵌套层级获取accessToken
        let accessToken;
        
        // 根据真实响应结构，正确的Token提取路径是 loginResponse.data.data.data.accessToken
        const resultData = loginResponse.data;
        const level2 = resultData.data;
        const level3 = level2?.data;
        const level4 = level3?.data;
        
        // 尝试从不同可能的嵌套层级获取accessToken
        accessToken = (
          level3?.accessToken || // 根据真实响应结构，这是正确的路径：loginResponse.data.data.data.accessToken
          level4?.accessToken || // 保留这个路径作为备选
          level2?.accessToken ||  // 保留这个路径作为备选
          resultData?.accessToken || // 保留这个路径作为备选
          loginResponse?.accessToken  // 保留这个路径作为备选
        );
        
        // 打印Token获取结果
        console.log('Token提取结果:', {
          accessToken: accessToken ? '存在' : '不存在',
          resultDataStructure: JSON.stringify(resultData, null, 2),
          level2Structure: JSON.stringify(level2, null, 2),
          level3Structure: JSON.stringify(level3, null, 2),
          level4Structure: JSON.stringify(level4, null, 2)
        });
        
        if (accessToken) {
          // 存储token
          await AsyncStorage.setItem('token', accessToken);
          console.log('Token已存储到AsyncStorage:', accessToken);
          
          // 显式地将Token添加到请求头中，确保/me请求能正确携带Token
          // 避免可能的异步问题，确保Token被正确添加
          console.log('即将发起/me请求，显式携带Token');
          const userResponse = await instance.get('/users/me', {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          console.log('用户信息响应:', JSON.stringify(userResponse.data, null, 2));
          
          // 检查获取用户信息的响应
          if (userResponse.data.code === 200) {
            let userData;
            
            // 同样尝试多种可能的用户数据路径
            const userDataResponse = userResponse.data.data;
            if (userDataResponse?.data) {
              userData = userDataResponse.data;
            } else if (userDataResponse) {
              userData = userDataResponse;
            }
            
            if (userData) {
              // 更新用户状态
              setUser(userData);
              setUserType(userData.role || 'tenant');
              setPoints(userData.memberPoints || 0);
              setLifeCoins(userData.lifeCoinBalance || 0);
              setMemberLevel(calculateMemberLevel(userData.memberPoints || 0));
              
              return { user: userData, token: accessToken };
            } else {
              throw new Error('获取用户信息失败：用户数据为空');
            }
          } else {
            throw new Error(userResponse.data.msg || '获取用户信息失败');
          }
        } else {
          // 打印响应结构以便调试
          console.error('无法从响应中提取accessToken，响应结构：', JSON.stringify(loginResponse.data, null, 2));
          throw new Error('登录失败：未获取到accessToken');
        }
      } else {
        // 登录失败，抛出错误
        throw new Error(loginResponse.data.msg || '登录失败，请检查用户名和密码');
      }
    } catch (err) {
      // 打印详细错误信息以便调试
      console.error('登录错误详情:', err);
      const errorMessage = err.response?.data?.msg || err.message || '登录失败，请检查用户名和密码';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setUserType('tenant');
    setMemberLevel('bronze');
    setPoints(0);
    setLifeCoins(0);
    await AsyncStorage.removeItem('token');
  };

  const switchUserType = (type) => {
    setUserType(type);
    // 切换用户类型时重新计算权限相关信息
    if (user) {
      fetchUserProfile();
    }
  };

  // 更新积分
  const updatePoints = (amount) => {
    setPoints(prevPoints => {
      const newPoints = Math.max(0, prevPoints + amount);
      setMemberLevel(calculateMemberLevel(newPoints));
      return newPoints;
    });
  };

  // 更新生活币
  const updateLifeCoins = (amount) => {
    setLifeCoins(prevCoins => Math.max(0, prevCoins + amount));
  };

  // 更新用户信息
  const updateUserProfile = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await put('/users/me', userData);
      
      // 处理不同的数据结构
      let updatedUser;
      if (response.data.data?.data) {
        updatedUser = response.data.data.data;
      } else if (response.data.data) {
        updatedUser = response.data.data;
      } else if (response.data) {
        updatedUser = response.data;
      } else {
        throw new Error('无法解析更新后的用户数据');
      }
      
      // 更新用户状态
      setUser(updatedUser);
      setPoints(updatedUser.memberPoints || 0);
      setLifeCoins(updatedUser.lifeCoinBalance || 0);
      setMemberLevel(calculateMemberLevel(updatedUser.memberPoints || 0));
      
      return updatedUser;
    } catch (err) {
      const errorMessage = err.response?.data?.msg || '更新用户信息失败';
      setError(errorMessage);
      console.error('Failed to update user profile:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 合同相关接口（预留扩展）
  const getContracts = async () => {
    try {
      return await get('/contracts');
    } catch (err) {
      console.error('Failed to get contracts:', err);
      throw err;
    }
  };

  // 会员相关接口（预留扩展）
  const getMemberBenefits = () => {
    return MEMBER_LEVEL_CONFIG[memberLevel].benefits;
  };

  // 报名相关接口（预留扩展：厨师、管家等）
  const applyForRole = async (role, data) => {
    try {
      return await post(`/apply/${role}`, data);
    } catch (err) {
      console.error(`Failed to apply for ${role}:`, err);
      throw err;
    }
  };

  // 不要在组件挂载时立即获取用户信息，而是在登录成功后再获取
  // 这样可以避免未登录时就调用需要认证的接口


  return (
    <UserContext.Provider
      value={{
        // 用户基础信息
        user,
        loading,
        error,
        userType,
        
        // 会员信息
        memberLevel,
        points,
        lifeCoins,
        memberBenefits: MEMBER_LEVEL_CONFIG[memberLevel],
        
        // 权限管理
        hasPermission,
        permissions: PERMISSIONS[userType] || [],
        
        // 核心方法
        login,
        logout,
        fetchUserProfile,
        switchUserType,
        
        // 积分和生活币管理
        updatePoints,
        updateLifeCoins,
        
        // 扩展接口预留
        getContracts,
        getMemberBenefits,
        applyForRole,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};