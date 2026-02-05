import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../../common/styles/theme';
import { Ionicons } from '@expo/vector-icons';

// Mock数据 - 社区动态
const communityPosts = [
  {
    id: '1',
    user: {
      name: '张小明',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      community: '阳光小区'
    },
    content: '小区门口新开了一家便利店，东西很齐全，以后买东西更方便了！',
    image: 'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    likes: 12,
    comments: 5,
    time: '2小时前'
  },
  {
    id: '2',
    user: {
      name: '李小花',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      community: '幸福家园'
    },
    content: '请问大家知道哪里有靠谱的宠物医院吗？我家猫咪最近不太舒服...',
    image: '',
    likes: 8,
    comments: 12,
    time: '5小时前'
  },
  {
    id: '3',
    user: {
      name: '王大山',
      avatar: 'https://randomuser.me/api/portraits/men/56.jpg',
      community: '和谐社区'
    },
    content: '小区健身器材修好了，大家可以来锻炼了！',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    likes: 24,
    comments: 8,
    time: '1天前'
  }
];

// Mock数据 - 社区活动
const communityEvents = [
  {
    id: '1',
    title: '端午节包粽子活动',
    date: '6月22日 14:00',
    location: '小区活动中心',
    image: 'https://images.unsplash.com/photo-1597935582151-3d5094617530?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    participants: 45
  },
  {
    id: '2',
    title: '儿童绘画比赛',
    date: '7月1日 10:00',
    location: '社区文化站',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    participants: 32
  },
  {
    id: '3',
    title: '老年人健康讲座',
    date: '7月8日 9:30',
    location: '社区医院',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    participants: 28
  }
];

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('dynamic'); // dynamic 或 events

  return (
    <SafeAreaView style={styles.container}>
      {/* 顶部搜索栏 */}
      <View style={styles.searchBar}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666666" />
          <Text style={styles.searchPlaceholder}>搜索社区内容</Text>
        </View>
        <TouchableOpacity style={styles.messageButton}>
          <Ionicons name="chatbubble-outline" size={24} color="#333333" />
        </TouchableOpacity>
      </View>

      {/* 社区动态/活动标签切换 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'dynamic' && styles.activeTabButton]} 
          onPress={() => setActiveTab('dynamic')}
        >
          <Text style={[styles.tabText, activeTab === 'dynamic' && styles.activeTabText]}>社区动态</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'events' && styles.activeTabButton]} 
          onPress={() => setActiveTab('events')}
        >
          <Text style={[styles.tabText, activeTab === 'events' && styles.activeTabText]}>社区活动</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'dynamic' ? (
          /* 社区动态列表 */
          <View style={styles.postsContainer}>
            {communityPosts.map(post => (
              <View key={post.id} style={styles.postCard}>
                {/* 用户信息 */}
                <View style={styles.postHeader}>
                  <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{post.user.name}</Text>
                    <Text style={styles.communityName}>{post.user.community}</Text>
                  </View>
                  <Text style={styles.postTime}>{post.time}</Text>
                </View>

                {/* 帖子内容 */}
                <Text style={styles.postContent}>{post.content}</Text>

                {/* 帖子图片 */}
                {post.image ? (
                  <Image source={{ uri: post.image }} style={styles.postImage} />
                ) : null}

                {/* 互动按钮 */}
                <View style={styles.postActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="heart-outline" size={20} color="#666666" />
                    <Text style={styles.actionText}>{post.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="chatbubble-outline" size={20} color="#666666" />
                    <Text style={styles.actionText}>{post.comments}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Ionicons name="share-outline" size={20} color="#666666" />
                    <Text style={styles.actionText}>分享</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          /* 社区活动列表 */
          <View style={styles.eventsContainer}>
            {communityEvents.map(event => (
              <View key={event.id} style={styles.eventCard}>
                <Image source={{ uri: event.image }} style={styles.eventImage} />
                <View style={styles.eventContent}>
                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <View style={styles.eventInfo}>
                    <Ionicons name="calendar-outline" size={16} color="#666666" />
                    <Text style={styles.eventDetail}>{event.date}</Text>
                  </View>
                  <View style={styles.eventInfo}>
                    <Ionicons name="location-outline" size={16} color="#666666" />
                    <Text style={styles.eventDetail}>{event.location}</Text>
                  </View>
                  <View style={styles.eventFooter}>
                    <Text style={styles.participants}>{event.participants}人已报名</Text>
                    <TouchableOpacity style={styles.joinButton}>
                      <Text style={styles.joinButtonText}>立即报名</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    backgroundColor: theme.colors.background,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    marginRight: theme.spacing[3],
  },
  searchPlaceholder: {
    marginLeft: theme.spacing[2],
    fontSize: 14,
    color: '#666666',
  },
  messageButton: {
    padding: theme.spacing[2],
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tabButton: {
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
    borderRadius: 20,
    marginRight: theme.spacing[3],
  },
  activeTabButton: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 15,
    color: '#666666',
    fontWeight: '500',
  },
  activeTabText: {
    color: theme.colors.background,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing[4],
  },
  postsContainer: {
    paddingTop: theme.spacing[4],
  },
  postCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: theme.spacing[4],
    marginBottom: theme.spacing[4],
    ...theme.shadow.sm,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: theme.spacing[2],
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333333',
  },
  communityName: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  postTime: {
    fontSize: 12,
    color: '#999999',
  },
  postContent: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginBottom: theme.spacing[3],
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: theme.spacing[3],
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: theme.spacing[3],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing[1],
  },
  actionText: {
    marginLeft: theme.spacing[1],
    fontSize: 14,
    color: '#666666',
  },
  eventsContainer: {
    paddingTop: theme.spacing[4],
  },
  eventCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    marginBottom: theme.spacing[4],
    overflow: 'hidden',
    ...theme.shadow.sm,
  },
  eventImage: {
    width: '100%',
    height: 160,
  },
  eventContent: {
    padding: theme.spacing[4],
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: theme.spacing[2],
  },
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  eventDetail: {
    marginLeft: theme.spacing[2],
    fontSize: 13,
    color: '#666666',
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing[3],
    paddingTop: theme.spacing[3],
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  participants: {
    fontSize: 13,
    color: '#999999',
  },
  joinButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
    borderRadius: 20,
  },
  joinButtonText: {
    color: theme.colors.background,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CommunityPage;
