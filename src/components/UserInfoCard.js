import React, { useEffect, useRef } from 'react'; 
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';

export default function UserInfoCard({ user, onEdit }) { 
  // 动画值引用 
  const fadeAnim = useRef(new Animated.Value(0)); 
  const translateYAnim = useRef(new Animated.Value(30)); 
  
  // 初始化动画值并启动动画 
  useEffect(() => { 
    Animated.parallel([ 
      Animated.timing(fadeAnim.current, { 
        toValue: 1, 
        duration: 1000, 
        useNativeDriver: true 
      }), 
      Animated.timing(translateYAnim.current, { 
        toValue: 0, 
        duration: 1000, 
        useNativeDriver: true 
      }) 
    ]).start(); 
  }, []); 
  
  return ( 
    <Animated.View 
      style={{ 
        opacity: fadeAnim.current, 
        transform: [{ translateY: translateYAnim.current }] 
      }} 
    > 
      <View style={styles.cardContainer}> 
        {/* 头像和会员徽章 */} 
        <View style={styles.avatarContainer}> 
          <Image 
            source={{ uri: user.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces' }} 
            style={styles.avatar} 
          /> 
          {/* 会员徽章 */} 
          <View style={[styles.memberBadge, styles[`badge${user.memberLevel ? user.memberLevel.charAt(0).toUpperCase() + user.memberLevel.slice(1) : 'Bronze'}`]]}> 
            <Text style={styles.badgeText}> 
              {user.memberLevel ? user.memberLevel.charAt(0).toUpperCase() + user.memberLevel.slice(1) : 'Bronze'} 
            </Text> 
          </View> 
        </View> 
        
        {/* 用户基本信息 */} 
        <View style={styles.infoWrapper}> 
          <View style={styles.nameRow}> 
            <Text style={styles.username}>{user.name}</Text> 
            <Text style={styles.userId}>ID: {user.id}</Text> 
          </View> 
          
          {/* 会员信息行 */} 
          <View style={styles.memberInfoRow}> 
            <View style={styles.pointsContainer}> 
              <Text style={styles.pointsLabel}>积分</Text> 
              <Text style={styles.pointsValue}>{user.points || 0}</Text> 
            </View> 
            <View style={styles.coinsContainer}> 
              <Text style={styles.coinsLabel}>生活币</Text> 
              <Text style={styles.coinsValue}>{user.lifeCoins || 0}</Text> 
            </View> 
          </View> 
          
          {/* 会员等级进度 */} 
          {user.memberLevel && user.nextLevelPoints && ( 
            <View style={styles.progressContainer}> 
              <View style={styles.progressBar}> 
                <View 
                  style={[ 
                    styles.progressFill, 
                    { width: `${Math.min((user.points || 0) / user.nextLevelPoints * 100, 100)}%` } 
                  ]} 
                /> 
              </View> 
              <Text style={styles.progressText}> 
                还差{user.nextLevelPoints - (user.points || 0)}积分升级{user.nextLevelName} 
              </Text> 
            </View> 
          )} 
        </View> 
        
        {/* 编辑按钮 */} 
        <TouchableOpacity style={styles.editBtn} onPress={onEdit} activeOpacity={0.7}> 
          <Text style={styles.btnText}>编辑</Text> 
        </TouchableOpacity> 
      </View> 
    </Animated.View> 
  ); 
} 

const styles = StyleSheet.create({ 
  cardContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 24, 
    backgroundColor: '#FFFFFF', 
    borderRadius: 16, 
    marginHorizontal: 16, 
    marginTop: 16, 
    marginBottom: 24, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 8, 
    overflow: 'hidden' 
  }, 
  
  // 头像容器 
  avatarContainer: { 
    position: 'relative', 
    marginRight: 20 
  }, 
  
  // 头像样式 
  avatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    borderWidth: 3, 
    borderColor: '#E5E7EB', 
    backgroundColor: '#F3F4F6' 
  }, 
  
  // 会员徽章 
  memberBadge: { 
    position: 'absolute', 
    bottom: -2, 
    right: -2, 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 12, 
    borderWidth: 2, 
    borderColor: '#FFFFFF', 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4, 
    elevation: 4 
  }, 
  
  // 不同等级的徽章颜色 
  badgeBronze: { backgroundColor: '#CD7F32' }, 
  badgeSilver: { backgroundColor: '#C0C0C0' }, 
  badgeGold: { backgroundColor: '#FFD700' }, 
  badgePlatinum: { backgroundColor: '#E5E4E2' }, 
  badgeDiamond: { backgroundColor: '#B9F2FF' }, 
  
  // 徽章文字 
  badgeText: { 
    color: '#FFFFFF', 
    fontSize: 11, 
    fontWeight: 'bold', 
    textTransform: 'uppercase' 
  }, 
  
  // 信息包装容器 
  infoWrapper: { 
    flex: 1 
  }, 
  
  // 名称行 
  nameRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 8 
  }, 
  
  // 用户名 
  username: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#111827' 
  }, 
  
  // 用户ID 
  userId: { 
    fontSize: 14, 
    color: '#6B7280' 
  }, 
  
  // 会员信息行 
  memberInfoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 24, 
    marginBottom: 12 
  }, 
  
  // 积分容器 
  pointsContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6 
  }, 
  
  // 积分标签 
  pointsLabel: { 
    fontSize: 14, 
    color: '#6B7280' 
  }, 
  
  // 积分值 
  pointsValue: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#3B82F6' 
  }, 
  
  // 生活币容器 
  coinsContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6 
  }, 
  
  // 生活币标签 
  coinsLabel: { 
    fontSize: 14, 
    color: '#6B7280' 
  }, 
  
  // 生活币值 
  coinsValue: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#8B5CF6' 
  }, 
  
  // 进度容器 
  progressContainer: { 
    width: '100%' 
  }, 
  
  // 进度条 
  progressBar: { 
    height: 8, 
    backgroundColor: '#E5E7EB', 
    borderRadius: 4, 
    marginBottom: 4, 
    overflow: 'hidden' 
  }, 
  
  // 进度填充 
  progressFill: { 
    height: '100%', 
    backgroundColor: '#3B82F6', 
    borderRadius: 4 
  }, 
  
  // 进度文本 
  progressText: { 
    fontSize: 12, 
    color: '#6B7280' 
  }, 
  
  // 编辑按钮 
  editBtn: { 
    paddingHorizontal: 20, 
    paddingVertical: 12, 
    backgroundColor: '#3B82F6', 
    borderRadius: 12, 
    minWidth: 80, 
    alignItems: 'center', 
    justifyContent: 'center', 
    shadowColor: '#3B82F6', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 4, 
    elevation: 4 
  }, 
  
  // 按钮文字 
  btnText: { 
    color: '#FFFFFF', 
    fontSize: 14, 
    fontWeight: '600' 
  } 
});