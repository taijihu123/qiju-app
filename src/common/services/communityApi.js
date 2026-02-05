import { get, post, put } from './request';
import { logger } from './logger';

/**
 * 获取社区帖子列表
 * @returns {Promise} 帖子数据
 */
export const getCommunityPosts = async () => {
  try {
    const response = await get('/community/posts');
    return response;
  } catch (error) {
    logger.error("获取社区帖子失败：", error);
    // 使用模拟数据作为后备
    return {
      code: 200,
      data: [
        {
          id: 1,
          userId: 1,
          userName: '陈明亮',
          userAvatar: 'https://example.com/avatar1.jpg',
          content: '大家好，我是新来的住户，很高兴认识大家！',
          createdAt: '2024-01-15 14:30',
          likes: 12,
          comments: [
            {
              id: 1,
              userId: 2,
              userName: '林小雨',
              userAvatar: 'https://example.com/avatar2.jpg',
              content: '欢迎欢迎！',
              createdAt: '2024-01-15 14:35'
            },
            {
              id: 2,
              userId: 3,
              userName: '王浩然',
              userAvatar: 'https://example.com/avatar3.jpg',
              content: '欢迎加入我们的社区！',
              createdAt: '2024-01-15 14:40'
            }
          ],
          isLiked: false
        },
        {
          id: 2,
          userId: 4,
          userName: '张思琪',
          userAvatar: 'https://example.com/avatar4.jpg',
          content: '小区附近新开了一家超市，东西很齐全！',
          createdAt: '2024-01-14 10:20',
          likes: 28,
          comments: [
            {
              id: 3,
              userId: 5,
              userName: '孙七',
              userAvatar: 'https://example.com/avatar5.jpg',
              content: '真的吗？有空去看看！',
              createdAt: '2024-01-14 10:25'
            }
          ],
          isLiked: true
        }
      ],
      msg: "模拟数据"
    };
  }
};

/**
 * 发布社区帖子
 * @param {Object} postData - 帖子数据
 * @returns {Promise} 发布结果
 */
export const publishCommunityPost = async (postData) => {
  try {
    const response = await post('/community/posts', postData);
    return response;
  } catch (error) {
    logger.error("发布帖子失败：", error);
    // 返回模拟成功结果
    return {
      code: 200,
      data: {
        id: Date.now(),
        ...postData,
        createdAt: new Date().toLocaleString('zh-CN'),
        likes: 0,
        comments: [],
        isLiked: false
      },
      msg: "模拟发布成功"
    };
  }
};

/**
 * 点赞/取消点赞社区帖子
 * @param {number} postId - 帖子ID
 * @returns {Promise} 点赞结果
 */
export const togglePostLike = async (postId) => {
  try {
    const response = await put(`/community/posts/${postId}/like`);
    return response;
  } catch (error) {
    logger.error("点赞操作失败：", error);
    // 返回模拟成功结果
    return {
      code: 200,
      msg: "模拟点赞成功"
    };
  }
};

/**
 * 评论社区帖子
 * @param {number} postId - 帖子ID
 * @param {Object} commentData - 评论数据
 * @returns {Promise} 评论结果
 */
export const commentOnPost = async (postId, commentData) => {
  try {
    const response = await post(`/community/posts/${postId}/comments`, commentData);
    return response;
  } catch (error) {
    logger.error("提交评论失败：", error);
    // 返回模拟成功结果
    return {
      code: 200,
      data: {
        id: Date.now(),
        ...commentData,
        createdAt: new Date().toLocaleString('zh-CN')
      },
      msg: "模拟评论成功"
    };
  }
};
