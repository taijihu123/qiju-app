import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, Modal, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../common/styles/theme';

const WishWallPage = () => {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newWish, setNewWish] = useState('');
  const navigation = useNavigation();

  // 模拟许愿墙数据
  const mockWishes = [
    {
      id: '1',
      userName: '小明',
      content: '希望今年能找到一份理想的工作',
      createdAt: '2小时前',
      likes: 15,
      isLiked: false,
      comments: [
        { id: '1-1', userName: '小红', content: '加油，一定会找到的！', createdAt: '1小时前' },
        { id: '1-2', userName: '小李', content: '相信自己，你是最棒的！', createdAt: '30分钟前' },
      ],
    },
    {
      id: '2',
      userName: '小花',
      content: '希望家人身体健康，平安快乐',
      createdAt: '4小时前',
      likes: 23,
      isLiked: true,
      comments: [
        { id: '2-1', userName: '小张', content: '一定会的，祝福你们！', createdAt: '3小时前' },
      ],
    },
    {
      id: '3',
      userName: '小李',
      content: '希望能在今年完成一次长途旅行',
      createdAt: '6小时前',
      likes: 8,
      isLiked: false,
      comments: [],
    },
  ];

  // 加载许愿数据
  const loadWishes = async () => {
    try {
      setLoading(true);
      // 模拟API请求延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWishes(mockWishes);
    } catch (error) {
      console.error('加载许愿失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 刷新数据
  const onRefresh = () => {
    setRefreshing(true);
    loadWishes();
  };

  // 发布新许愿
  const publishWish = () => {
    if (!newWish.trim()) return;

    const newWishObj = {
      id: Date.now().toString(),
      userName: '我',
      content: newWish,
      createdAt: '刚刚',
      likes: 0,
      isLiked: false,
      comments: [],
    };

    setWishes([newWishObj, ...wishes]);
    setNewWish('');
    setShowModal(false);
  };

  // 点赞/取消点赞
  const toggleLike = (wishId) => {
    setWishes(prevWishes => 
      prevWishes.map(wish => 
        wish.id === wishId ? {
          ...wish,
          likes: wish.isLiked ? wish.likes - 1 : wish.likes + 1,
          isLiked: !wish.isLiked,
        } : wish
      )
    );
  };

  // 渲染许愿卡片
  const renderWish = ({ item }) => (
    <View style={styles.wishCard}>
      {/* 许愿内容 */}
      <View style={styles.wishContent}>
        <Text style={styles.wishText}>{item.content}</Text>
      </View>
      
      {/* 许愿元信息 */}
      <View style={styles.wishMeta}>
        <Text style={styles.wishAuthor}>{item.userName}</Text>
        <Text style={styles.wishTime}>{item.createdAt}</Text>
      </View>
      
      {/* 许愿互动 */}
      <View style={styles.wishActions}>
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
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.actionText}>{item.comments.length}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="share-outline" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.actionText}>分享</Text>
        </TouchableOpacity>
      </View>
      
      {/* 评论列表 */}
      {item.comments.length > 0 && (
        <View style={styles.commentsContainer}>
          {item.comments.map(comment => (
            <View key={comment.id} style={styles.commentItem}>
              <Text style={styles.commentAuthor}>{comment.userName}:</Text>
              <Text style={styles.commentContent}>{comment.content}</Text>
              <Text style={styles.commentTime}>{comment.createdAt}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  useEffect(() => {
    loadWishes();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>加载许愿墙中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 页面标题 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>许愿墙</Text>
        <Text style={styles.headerSubtitle}>写下你的心愿，让大家一起为你祝福</Text>
      </View>

      {/* 许愿列表 */}
      <FlatList
        data={wishes}
        renderItem={renderWish}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.wishesList}
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
            <Ionicons name="star-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={styles.emptyText}>暂无许愿，快来发布第一个吧！</Text>
          </View>
        }
      />

      {/* 发布许愿按钮 */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <Ionicons name="add" size={24} color={theme.colors.white} />
      </TouchableOpacity>

      {/* 发布许愿模态框 */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>发布新许愿</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="写下你的心愿..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline={true}
              numberOfLines={4}
              value={newWish}
              onChangeText={setNewWish}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setNewWish('');
                  setShowModal(false);
                }}
              >
                <Text style={styles.cancelButtonText}>取消</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={publishWish}
                disabled={!newWish.trim()}
              >
                <Text style={styles.confirmButtonText}>发布</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  wishesList: {
    paddingVertical: 16,
  },
  wishCard: {
    backgroundColor: theme.colors.white,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  wishContent: {
    marginBottom: 12,
  },
  wishText: {
    fontSize: 16,
    color: theme.colors.textPrimary,
    lineHeight: 24,
  },
  wishMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  wishAuthor: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginRight: 12,
  },
  wishTime: {
    fontSize: 14,
    color: theme.colors.textTertiary,
  },
  wishActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  commentsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  commentItem: {
    marginBottom: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  commentContent: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  commentTime: {
    fontSize: 12,
    color: theme.colors.textTertiary,
    marginTop: 4,
  },
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: theme.colors.white,
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.colors.textPrimary,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: theme.colors.backgroundSecondary,
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
    marginLeft: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  confirmButtonText: {
    fontSize: 16,
    color: theme.colors.white,
    fontWeight: '500',
  },
});

export default WishWallPage;