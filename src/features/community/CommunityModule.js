import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { theme } from '../styles/theme';

// 定义数据接口
const mockPosts = [
  {
    id: 1,
    author: '张小明',
    avatar: '',
    timestamp: '2小时前',
    content: '周末组织了一次社区烧烤活动，认识了好多新邻居，大家都很友好！感谢物业的支持 🎉',
    images: ['https://images.unsplash.com/photo-1763629433062-0f0e43d55d03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBwZW9wbGUlMjBnYXRoZXJpbmd8ZW58MXx8fHwxNjc1NDk0Njg0fDA&ixlib=rb-4.1.0&q=80&w=1080'],
    likes: 24,
    comments: 8,
    liked: false,
    tag: '活动',
  },
  {
    id: 2,
    author: '李华',
    avatar: '',
    timestamp: '5小时前',
    content: '请问有人知道附近哪里有好吃的火锅吗？新搬来的，想找点好吃的 😋',
    likes: 12,
    comments: 15,
    liked: true,
    tag: '生活',
  },
];

const CommunityModule = () => {
  const [posts, setPosts] = useState(mockPosts);
  const [newPost, setNewPost] = useState('');

  // 处理点赞
  const handleLike = (id) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 } : post
      )
    );
  };

  // 处理评论
  const handleComment = (id) => {
    // TODO: 实现评论功能
    console.log('评论帖子:', id);
  };

  // 处理发布帖子
  const handlePost = () => {
    if (newPost.trim()) {
      const post = {
        id: posts.length + 1,
        author: '我',
        avatar: '',
        timestamp: '刚刚',
        content: newPost,
        likes: 0,
        comments: 0,
        liked: false,
        tag: '生活',
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  return (
    <View style={styles.container}>
      {/* 发帖区域 */}
      <View style={styles.postInputContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>我</Text>
        </View>
        <TextInput
          style={styles.postInput}
          placeholder="分享你的生活..."
          value={newPost}
          onChangeText={setNewPost}
          multiline
        />
        <TouchableOpacity style={styles.postButton} onPress={handlePost}>
          <Text style={styles.postButtonText}>发布</Text>
        </TouchableOpacity>
      </View>

      {/* 帖子列表 */}
      <ScrollView style={styles.postsList}>
        {posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            {/* 帖子头部 */}
            <View style={styles.postHeader}>
              <View style={styles.authorInfo}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{post.author[0]}</Text>
                </View>
                <View>
                  <Text style={styles.authorName}>{post.author}</Text>
                  <Text style={styles.postTime}>{post.timestamp}</Text>
                </View>
              </View>
              {post.tag && <View style={styles.tag}><Text style={styles.tagText}>{post.tag}</Text></View>}
            </View>

            {/* 帖子内容 */}
            <Text style={styles.postContent}>{post.content}</Text>

            {/* 帖子图片 */}
            {post.images && post.images.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {post.images.map((image, index) => (
                  <Image key={index} source={{ uri: image }} style={styles.postImage} />
                ))}
              </ScrollView>
            )}

            {/* 帖子操作 */}
            <View style={styles.postActions}>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(post.id)}>
                <Text style={[styles.actionText, post.liked && styles.likedText]}>
                  {post.liked ? '❤️' : '🤍'} {post.likes}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => handleComment(post.id)}>
                <Text style={styles.actionText}>💬 {post.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionText}>🔗 分享</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  postInputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  postInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#F5F5F5',
  },
  postButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  postButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  postsList: {
    flex: 1,
  },
  postCard: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorName: {
    fontWeight: 'bold',
  },
  postTime: {
    fontSize: 12,
    color: '#999',
  },
  tag: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    color: '#fff',
    fontSize: 12,
  },
  postContent: {
    marginBottom: 8,
    lineHeight: 20,
  },
  postImage: {
    width: 200,
    height: 200,
    marginRight: 8,
    borderRadius: 8,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionText: {
    color: '#666',
  },
  likedText: {
    color: '#FF4444',
  },
});

export default CommunityModule;
