import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, TextInput, RefreshControl, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getCommunityPosts, publishCommunityPost, togglePostLike, commentOnPost } from '../common/services/communityApi';
import { logger } from '../common/services/logger';
import { theme } from '../common/styles/theme';
import KnowledgePage from './KnowledgePage';
import SidebarContainer from '../components/SidebarContainer';

const CommunityPage = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('community'); // community 或 knowledge
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('加载失败，请稍后重试');

  // 模拟我的小组数据
  const myGroups = [
    { id: '1', name: '好戏花生', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=movie%20group%20avatar%20colorful&image_size=square' },
    { id: '2', name: '朵拉瑞生活美学', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=lifestyle%20group%20avatar%20green&image_size=square' },
    { id: '3', name: '迷恋植物的人', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=plant%20group%20avatar%20nature&image_size=square' },
    { id: '4', name: '无用美学', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=aesthetic%20group%20avatar%20artistic&image_size=square' },
    { id: '5', name: '我发现个规律', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=thinking%20group%20avatar%20creative&image_size=square' },
    { id: '6', name: '豆瓣读书会', avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=book%20club%20group%20avatar%20intellectual&image_size=square' },
  ];

  // 加载社区帖子
  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await getCommunityPosts();
      if (response.code === 200) {
        const postsData = Array.isArray(response.data) ? response.data : [];
        // 为帖子添加小组信息，模拟豆瓣风格
        const enhancedPosts = postsData.map(post => ({
          ...post,
          groupName: myGroups[Math.floor(Math.random() * myGroups.length)].name,
          groupId: myGroups[Math.floor(Math.random() * myGroups.length)].id,
          comments: Array.isArray(post.comments) ? post.comments : [],
          likes: post.likes || 0,
          isLiked: post.isLiked || false,
          shares: post.shares || 0,
        }));
        setPosts(enhancedPosts);
      } else {
        logger.error('获取社区帖子失败:', response.msg);
        setPosts([]);
      }
    } catch (error) {
      logger.error('获取社区帖子失败:', error);
      
      // 检查是否是认证错误
      if (error.isAuthError || error.name === 'AuthError' || error.status === 401) {
        console.log('🔐 认证错误，跳转到登录页面');
        // 跳转到登录页面
        navigation.navigate('Login');
        // 重置状态
        setLoading(false);
        setRefreshing(false);
        return;
      }
      
      // 其他错误，使用模拟数据
      setError(false);
      const mockPosts = [
        {
          id: '1',
          userName: 'BLACKMAMBA',
          content: 'Why she giving Ningning down here omg',
          createdAt: '2小时前',
          likes: 5379,
          isLiked: false,
          comments: [],
          shares: 284,
          groupName: '稿子不是这么写的小组',
          groupId: '1'
        },
        {
          id: '2',
          userName: '礼拜天',
          content: '衣服虽然穿反了，但是科室挂对了',
          createdAt: '4小时前',
          likes: 128,
          isLiked: false,
          comments: [],
          shares: 4,
          groupName: '医疗行业交流',
          groupId: '2'
        },
        {
          id: '3',
          userName: '友友们',
          content: '为了过年置办了哪些居家好物呢？',
          createdAt: '6小时前',
          likes: 89,
          isLiked: false,
          comments: [],
          shares: 12,
          groupName: '居家好物分享会',
          groupId: '3'
        }
      ];
      setPosts(mockPosts);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 刷新数据
  const onRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  // 发布新帖子
  const publishPost = async (content) => {
    try {
      const response = await publishCommunityPost({ content });
      if (response.code === 200) {
        // 重新加载帖子列表
        loadPosts();
        return true;
      } else {
        logger.error('发布帖子失败:', response.msg);
        return false;
      }
    } catch (error) {
      logger.error('发布帖子失败:', error);
      
      // 检查是否是认证错误
      if (error.isAuthError || error.name === 'AuthError' || error.status === 401) {
        console.log('🔐 认证错误，跳转到登录页面');
        // 跳转到登录页面
        navigation.navigate('Login');
        return false;
      }
      
      return false;
    }
  };

  // 点赞/取消点赞
  const toggleLike = async (postId) => {
    try {
      const post = Array.isArray(posts) && posts.find(p => p.id === postId);
      if (post) {
        const response = await togglePostLike(postId);
        if (response.code === 200) {
          // 更新本地状态
          setPosts(prev => {
            const prevPosts = Array.isArray(prev) ? prev : [];
            return prevPosts.map(p => 
              p.id === postId ? {
                ...p,
                likes: post.isLiked ? (p.likes || 0) - 1 : (p.likes || 0) + 1,
                isLiked: !post.isLiked
              } : p
            );
          });
        } else {
          logger.error('点赞操作失败:', response.msg);
        }
      }
    } catch (error) {
      logger.error('点赞操作失败:', error);
      
      // 检查是否是认证错误
      if (error.isAuthError || error.name === 'AuthError' || error.status === 401) {
        console.log('🔐 认证错误，跳转到登录页面');
        // 跳转到登录页面
        navigation.navigate('Login');
      }
    }
  };

  // 提交评论
  const submitComment = async (postId, content) => {
    try {
      const response = await commentOnPost(postId, { content });
      if (response.code === 200) {
        // 重新加载帖子列表
        loadPosts();
        setCommentInput('');
        setReplyingTo(null);
        return true;
      } else {
        logger.error('提交评论失败:', response.msg);
        return false;
      }
    } catch (error) {
      logger.error('提交评论失败:', error);
      
      // 检查是否是认证错误
      if (error.isAuthError || error.name === 'AuthError' || error.status === 401) {
        console.log('🔐 认证错误，跳转到登录页面');
        // 跳转到登录页面
        navigation.navigate('Login');
        return false;
      }
      
      return false;
    }
  };

  // 渲染我的小组卡片
  const renderMyGroup = ({ item }) => (
    <TouchableOpacity style={styles.groupCard}>
      <Image source={{ uri: item.avatar }} style={styles.groupAvatar} />
      <Text style={styles.groupName}>{item.name}</Text>
    </TouchableOpacity>
  );

  // 渲染帖子项（豆瓣风格）
  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      {/* 小组信息 */}
      <View style={styles.groupInfo}>
        <TouchableOpacity style={styles.groupLink}>
          <Text style={styles.groupName}>{item.groupName}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.joinButton}>
          <Text style={styles.joinButtonText}>加入</Text>
        </TouchableOpacity>
      </View>
      
      {/* 帖子内容 */}
      <Text style={styles.postTitle}>{item.content}</Text>
      
      {/* 帖子元信息 */}
      <View style={styles.postMeta}>
        <Text style={styles.postAuthor}>{item.userName}</Text>
        <Text style={styles.postTime}>{item.createdAt}</Text>
      </View>
      
      {/* 帖子互动 */}
      <View style={styles.postActions}>
        <TouchableOpacity 
          style={[styles.actionButton, item.isLiked && styles.actionButtonActive]}
          onPress={() => toggleLike(item.id)}
        >
          <Ionicons 
            name={item.isLiked ? 'heart' : 'heart-outline'} 
            size={18} 
            color={item.isLiked ? theme.colors.primary : theme.colors.textSecondary} 
          />
          <Text style={[styles.actionText, item.isLiked && styles.actionTextActive]}>{item.likes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setReplyingTo(replyingTo === item.id ? null : item.id)}
        >
          <Ionicons name="chatbubble-outline" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.actionText}>{item.comments.length || 0}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.actionText}>{item.shares || 0}</Text>
        </TouchableOpacity>
      </View>
      
      {/* 评论输入框 */}
      {replyingTo === item.id && (
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="写下你的评论..."
            value={commentInput}
            onChangeText={setCommentInput}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, !commentInput.trim() && styles.sendButtonDisabled]}
            onPress={() => commentInput.trim() && submitComment(item.id, commentInput)}
            disabled={!commentInput.trim()}
          >
            <Text style={styles.sendButtonText}>发送</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  useEffect(() => {
    loadPosts();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>加载社区数据中...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={theme.colors.error} />
        <Text style={styles.errorText}>{errorMessage}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => {
            setLoading(true);
            loadPosts();
          }}
        >
          <Text style={styles.retryButtonText}>重试</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SidebarContainer navigation={navigation}>
      <View style={styles.container}>
        {/* 顶部搜索栏 */}
        <View style={styles.header}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.searchPlaceholder}>今日立春</Text>
          </View>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="headset-outline" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="mail-outline" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* 社区/知识标签切换 */}
        <View style={styles.mainTabContainer}>
          <TouchableOpacity
            style={[styles.mainTab, activeTab === 'community' && styles.mainTabActive]}
            onPress={() => setActiveTab('community')}
          >
            <Text style={[styles.mainTabText, activeTab === 'community' && styles.mainTabTextActive]}>
              社区
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.mainTab, activeTab === 'knowledge' && styles.mainTabActive]}
            onPress={() => setActiveTab('knowledge')}
          >
            <Text style={[styles.mainTabText, activeTab === 'knowledge' && styles.mainTabTextActive]}>
              知识
            </Text>
          </TouchableOpacity>
        </View>

        {/* 条件渲染：社区或知识内容 */}
        {activeTab === 'community' ? (
          <>
            {/* 我的小组横向滚动 */}
            <View style={styles.myGroupsSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>我的小组</Text>
                <TouchableOpacity>
                  <Text style={styles.sectionMore}>全部</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={myGroups}
                renderItem={renderMyGroup}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.myGroupsList}
              />
            </View>

            {/* 正在讨论标签栏 */}
            <View style={styles.tabContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <TouchableOpacity style={[styles.tab, styles.tabActive]}>
                  <Text style={[styles.tabText, styles.tabTextActive]}>全部</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                  <Text style={styles.tabText}>生活</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                  <Text style={styles.tabText}>书影音</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                  <Text style={styles.tabText}>兴趣</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                  <Text style={styles.tabText}>校园</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                  <Text style={styles.tabText}>家居</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* 帖子列表 */}
            <FlatList
              data={posts}
              renderItem={renderPost}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.postsList}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[theme.colors.primary]}
                  tintColor={theme.colors.primary}
                />
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="chatbubble-outline" size={64} color={theme.colors.textSecondary} />
                  <Text style={styles.emptyText}>暂无讨论，快来发布第一条吧！</Text>
                </View>
              }
            />

            {/* 发布按钮 */}
            <TouchableOpacity style={styles.fab}>
              <Ionicons name="create" size={24} color={theme.colors.white} />
            </TouchableOpacity>
          </>
        ) : (
          <KnowledgePage />
        )}
      </View>
    </SidebarContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  // 顶部搜索栏
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  // 社区/知识标签切换
  mainTabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  mainTab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  mainTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  mainTabText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  mainTabTextActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundSecondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  searchPlaceholder: {
    marginLeft: 8,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  headerIcon: {
    marginLeft: 12,
  },
  // 我的小组部分
  myGroupsSection: {
    backgroundColor: theme.colors.white,
    paddingVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  sectionMore: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  myGroupsList: {
    paddingHorizontal: 12,
  },
  groupCard: {
    alignItems: 'center',
    marginHorizontal: 4,
    width: 80,
  },
  groupAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  groupName: {
    fontSize: 12,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  // 标签栏
  tabContainer: {
    backgroundColor: theme.colors.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginHorizontal: 4,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  tabTextActive: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  // 帖子列表
  postsList: {
    paddingVertical: 8,
  },
  postContainer: {
    backgroundColor: theme.colors.white,
    padding: 16,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  groupInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  groupLink: {
    flex: 1,
  },
  joinButton: {
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  joinButtonText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  postTitle: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    lineHeight: 24,
    marginBottom: 12,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAuthor: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginRight: 12,
  },
  postTime: {
    fontSize: 14,
    color: theme.colors.textTertiary,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionButtonActive: {
    backgroundColor: 'transparent',
  },
  actionText: {
    marginLeft: 6,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  actionTextActive: {
    color: theme.colors.primary,
  },
  // 评论输入
  commentInputContainer: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: theme.colors.backgroundSecondary,
  },
  sendButton: {
    marginLeft: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.textSecondary,
  },
  sendButtonText: {
    fontSize: 14,
    color: theme.colors.white,
    fontWeight: '500',
  },
  // 加载和错误状态
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 20,
    fontSize: 16,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 25,
  },
  retryButtonText: {
    fontSize: 16,
    color: theme.colors.white,
    fontWeight: 'bold',
  },
  // 空白状态
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 120,
  },
  emptyText: {
    marginTop: 24,
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  // 发布按钮
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadow.md,
  },
});

export default CommunityPage;
