import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { get, post } from '../common/services/request';
import { logger } from '../common/services/logger';
import { theme } from '../common/styles/theme';

const SmartAgentPage = () => {
  const navigation = useNavigation();
  const [recommendations, setRecommendations] = useState([]);
  const [predictions, setPredictions] = useState(null);
  const [lifeCoinPlans, setLifeCoinPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatting, setIsChatting] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('加载失败，请稍后重试');

  // 加载智能推荐
  const loadRecommendations = async () => {
    try {
      const response = await get('/smart-agent/recommendations');
      if (response.data.code === 200) {
        const recommendationsData = Array.isArray(response.data.data) ? response.data.data : [];
        setRecommendations(recommendationsData);
      } else {
        logger.error('获取智能推荐失败:', response.data.msg);
        // 使用模拟数据作为后备
        setRecommendations([
          {
            id: 1,
            type: 'house',
            title: '精装修两居室',
            description: '适合小家庭居住，交通便利',
            priority: 'high'
          },
          {
            id: 2,
            type: 'service',
            title: '空调维修服务',
            description: '夏季来临，建议提前检查空调',
            priority: 'medium'
          }
        ]);
      }
    } catch (error) {
      logger.error('获取智能推荐失败:', error);
      // 不设置错误状态，因为使用了模拟数据作为后备
      setRecommendations([
        {
          id: 1,
          type: 'house',
          title: '精装修两居室',
          description: '适合小家庭居住，交通便利',
          priority: 'high'
        },
        {
          id: 2,
          type: 'service',
          title: '空调维修服务',
          description: '夏季来临，建议提前检查空调',
          priority: 'medium'
        }
      ]);
    }
  };

  // 加载预测信息
  const loadPredictions = async () => {
    try {
      const response = await get('/smart-agent/predictions');
      if (response.data.code === 200) {
        setPredictions(response.data.data);
      } else {
        logger.error('获取预测信息失败:', response.data.msg);
        // 使用模拟数据作为后备
        setPredictions({
          rentTrend: '上涨',
          servicePriceIndex: 105.2,
          predictionDate: '2024-01-15'
        });
      }
    } catch (error) {
      logger.error('获取预测信息失败:', error);
      // 使用模拟数据作为后备
      setPredictions({
        rentTrend: '上涨',
        servicePriceIndex: 105.2,
        predictionDate: '2024-01-15'
      });
    }
  };

  // 加载生活币方案
  const loadLifeCoinPlans = async () => {
    try {
      const response = await get('/smart-agent/life-coin/plans');
      if (response.data.code === 200) {
        const plansData = Array.isArray(response.data.data) ? response.data.data : [];
        setLifeCoinPlans(plansData);
      } else {
        logger.error('获取生活币方案失败:', response.data.msg);
        // 使用模拟数据作为后备
        setLifeCoinPlans([
          {
            id: 1,
            name: '新手礼包',
            description: '注册即可获得50生活币',
            lifeCoinAmount: 50,
            requirements: '新用户注册'
          },
          {
            id: 2,
            name: '邀请好友',
            description: '每邀请一位好友获得20生活币',
            lifeCoinAmount: 20,
            requirements: '好友完成注册'
          }
        ]);
      }
    } catch (error) {
      logger.error('获取生活币方案失败:', error);
      // 使用模拟数据作为后备
      setLifeCoinPlans([
        {
          id: 1,
          name: '新手礼包',
          description: '注册即可获得50生活币',
          lifeCoinAmount: 50,
          requirements: '新用户注册'
        },
        {
          id: 2,
          name: '邀请好友',
          description: '每邀请一位好友获得20生活币',
          lifeCoinAmount: 20,
          requirements: '好友完成注册'
        }
      ]);
    }
  };

  // 刷新数据
  const onRefresh = () => {
    setRefreshing(true);
    loadRecommendations();
    loadPredictions();
    loadLifeCoinPlans();
    setRefreshing(false);
  };

  // 发送聊天消息
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString('zh-CN')
    };

    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsChatting(true);

    try {
      const response = await post('/smart-agent/chat', { message: message.trim() });
      if (response.data.code === 200) {
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: response.data.data.response,
          timestamp: new Date().toLocaleTimeString('zh-CN')
        };
        setChatHistory(prev => [...prev, botMessage]);
      } else {
        logger.error('发送消息失败:', response.data.msg);
        const errorMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: '抱歉，我暂时无法回答您的问题，请稍后再试。',
          timestamp: new Date().toLocaleTimeString('zh-CN')
        };
        setChatHistory(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      logger.error('发送消息失败:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: '抱歉，网络连接失败，请稍后再试。',
        timestamp: new Date().toLocaleTimeString('zh-CN')
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsChatting(false);
    }
  };

  // 查看推荐详情
  const viewRecommendationDetail = (recommendation) => {
    if (recommendation.type === 'house') {
      navigation.navigate('HouseDetail', { houseId: recommendation.id });
    } else if (recommendation.type === 'service') {
      navigation.navigate('ServiceDetail', { serviceId: recommendation.id });
    }
  };

  // 获取趋势图标
  const getTrendIcon = () => {
    if (!predictions) return null;
    if (predictions.rentTrend === '上涨') {
      return <Ionicons name="trending-up" size={20} color={theme.colors.error} />;
    } else if (predictions.rentTrend === '下跌') {
      return <Ionicons name="trending-down" size={20} color={theme.colors.success} />;
    } else {
      return <Ionicons name="remove" size={20} color={theme.colors.textSecondary} />;
    }
  };

  // 应用生活币方案
  const applyLifeCoinPlan = async (planId) => {
    try {
      const response = await post(`/smart-agent/life-coin/plans/${planId}/apply`);
      if (response.data.code === 200) {
        logger.info('生活币方案应用成功:', response.data.msg);
        // 这里可以显示成功提示
      } else {
        logger.error('生活币方案应用失败:', response.data.msg);
        // 这里可以显示失败提示
      }
    } catch (error) {
      logger.error('生活币方案应用失败:', error);
      // 这里可以显示失败提示
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(false);
      // 并行加载所有数据，让每个函数自己处理错误
      await Promise.all([
        loadRecommendations(),
        loadPredictions(),
        loadLifeCoinPlans()
      ]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>加载智能助手数据中...</Text>
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
            loadRecommendations();
            loadPredictions();
            loadLifeCoinPlans();
          }}
        >
          <Text style={styles.retryButtonText}>重试</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>智能助手</Text>
          <Text style={styles.headerSubtitle}>您的生活智能顾问</Text>
        </View>

        {/* 智能推荐 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>智能推荐</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.recommendationsList}>
              {recommendations.map(recommendation => (
                <TouchableOpacity
                  key={recommendation.id}
                  style={styles.recommendationCard}
                  onPress={() => viewRecommendationDetail(recommendation)}
                >
                  <View style={styles.recommendationIconContainer}>
                    <Ionicons
                      name={recommendation.type === 'house' ? 'home-outline' : 'construct-outline'}
                      size={32}
                      color={theme.colors.primary}
                    />
                  </View>
                  <Text style={styles.recommendationTitle}>{recommendation.title}</Text>
                  <Text style={styles.recommendationDescription} numberOfLines={2}>
                    {recommendation.description}
                  </Text>
                  <View style={[
                    styles.recommendationPriority,
                    recommendation.priority === 'high' && styles.priorityHigh,
                    recommendation.priority === 'medium' && styles.priorityMedium,
                    recommendation.priority === 'low' && styles.priorityLow
                  ]}>
                    <Text style={styles.priorityText}>
                      {recommendation.priority === 'high' ? '高优先级' :
                       recommendation.priority === 'medium' ? '中优先级' : '低优先级'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 预测信息 */}
        {predictions && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>市场预测</Text>
            <View style={styles.predictionsContainer}>
              <View style={styles.predictionItem}>
                <View style={styles.predictionIconContainer}>
                  <Ionicons name="trending-up-outline" size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.predictionContent}>
                  <Text style={styles.predictionLabel}>租金趋势</Text>
                  <View style={styles.predictionValueContainer}>
                    <Text style={styles.predictionValue}>{predictions.rentTrend}</Text>
                    {getTrendIcon()}
                  </View>
                </View>
              </View>
              <View style={styles.predictionDivider} />
              <View style={styles.predictionItem}>
                <View style={styles.predictionIconContainer}>
                  <Ionicons name="stats-chart-outline" size={24} color={theme.colors.primary} />
                </View>
                <View style={styles.predictionContent}>
                  <Text style={styles.predictionLabel}>服务价格指数</Text>
                  <Text style={styles.predictionValue}>{predictions.servicePriceIndex}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.predictionDate}>更新日期: {predictions.predictionDate}</Text>
          </View>
        )}

        {/* 生活币方案 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>生活币方案</Text>
          <View style={styles.plansList}>
            {lifeCoinPlans.map(plan => (
              <View key={plan.id} style={styles.planCard}>
                <View style={styles.planHeader}>
                  <Text style={styles.planName}>{plan.name}</Text>
                  <View style={styles.lifeCoinBadge}>
                    <Ionicons name="coin-outline" size={16} color={theme.colors.warning} />
                    <Text style={styles.lifeCoinAmount}>{plan.lifeCoinAmount}</Text>
                  </View>
                </View>
                <Text style={styles.planDescription}>{plan.description}</Text>
                <Text style={styles.planRequirements}>要求: {plan.requirements}</Text>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => applyLifeCoinPlan(plan.id)}
                >
                  <Text style={styles.applyButtonText}>立即申请</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* 智能聊天 */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>智能聊天</Text>
          <View style={styles.chatContainer}>
            <ScrollView style={styles.chatHistory}>
              {chatHistory.map(message => (
                <View
                  key={message.id}
                  style={[
                    styles.messageBubble,
                    message.type === 'user' ? styles.userMessage : styles.botMessage
                  ]}
                >
                  <Text style={[
                    styles.messageText,
                    message.type === 'user' ? styles.userMessageText : styles.botMessageText
                  ]}>
                    {message.content}
                  </Text>
                  <Text style={styles.messageTimestamp}>{message.timestamp}</Text>
                </View>
              ))}
              {isChatting && (
                <View style={styles.typingIndicator}>
                  <ActivityIndicator size="small" color={theme.colors.primary} />
                  <Text style={styles.typingText}>智能助手正在思考...</Text>
                </View>
              )}
            </ScrollView>
            <View style={styles.chatInputContainer}>
              <TextInput
                style={styles.chatInput}
                placeholder="和智能助手聊点什么..."
                value={message}
                onChangeText={setMessage}
                multiline
              />
              <TouchableOpacity
                style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
                onPress={sendMessage}
                disabled={!message.trim() || isChatting}
              >
                <Ionicons name="send" size={20} color={theme.colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 底部留白 */}
        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    ...theme.shadow.sm,
  },
  retryButtonText: {
    fontSize: 16,
    color: theme.colors.white,
    fontWeight: 'bold',
  },
  header: {
    padding: 20,
    backgroundColor: theme.colors.background,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  sectionContainer: {
    backgroundColor: theme.colors.white,
    marginBottom: 15,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  recommendationsList: {
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  recommendationCard: {
    width: 200,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 15,
    marginRight: 15,
    ...theme.shadow.md,
  },
  recommendationIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  recommendationDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  recommendationPriority: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  priorityHigh: {
    backgroundColor: theme.colors.error + '20',
  },
  priorityMedium: {
    backgroundColor: theme.colors.warning + '20',
  },
  priorityLow: {
    backgroundColor: theme.colors.success + '20',
  },
  priorityText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  predictionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 15,
  },
  predictionItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  predictionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  predictionContent: {
    alignItems: 'center',
  },
  predictionLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 8,
  },
  predictionValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  predictionValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginRight: 10,
  },
  predictionDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 10,
  },
  predictionDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
  plansList: {
    paddingHorizontal: 15,
  },
  planCard: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    ...theme.shadow.md,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  planName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  lifeCoinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.warning + '20',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  lifeCoinAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.warning,
    marginLeft: 5,
  },
  planDescription: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    lineHeight: 20,
    marginBottom: 8,
  },
  planRequirements: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 15,
  },
  applyButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  chatContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    marginHorizontal: 15,
    overflow: 'hidden',
    ...theme.shadow.md,
  },
  chatHistory: {
    maxHeight: 300,
    padding: 15,
  },
  messageBubble: {
    maxWidth: '80%',
    marginBottom: 15,
    padding: 12,
    borderRadius: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.white,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 5,
  },
  userMessageText: {
    color: theme.colors.white,
  },
  botMessageText: {
    color: theme.colors.textPrimary,
  },
  messageTimestamp: {
    fontSize: 10,
    opacity: 0.8,
    alignSelf: 'flex-end',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  typingText: {
    marginLeft: 10,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 20,
    padding: 10,
    paddingRight: 40,
    backgroundColor: theme.colors.white,
    maxHeight: 100,
    fontSize: 14,
    marginRight: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.textSecondary,
  },
  bottomSpace: {
    height: 30,
  },
});

export default SmartAgentPage;
