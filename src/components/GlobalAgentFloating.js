import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, Animated, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../common/styles/theme';
import avatar from '../assets/images/avatar.jpg';

const GlobalAgentFloating = () => {
  // 功能列表（可无限扩展）
  const functions = [
    { id: 'text', label: '文字聊天', icon: '💬' },
    { id: 'voice', label: '语音通话', icon: '🎙️' },
    { id: 'video', label: '视频通话', icon: '📹' },
    { id: 'teach', label: '教学辅导', icon: '📚' },
    { id: 'code', label: '代码生成', icon: '💻' },
    { id: 'project', label: '项目孵化', icon: '🚀' },
  ];

  // 当前功能索引
  const [currentIndex, setCurrentIndex] = useState(0);
  // 对话框显示状态
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  // 输入框内容
  const [inputText, setInputText] = useState('');
  // 聊天消息
  const [messages, setMessages] = useState([
    { id: 1, text: '你好，有什么可以帮你的吗？', sender: 'ai' }
  ]);

  // 语音和视频通话状态
  const [isRecording, setIsRecording] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [subtitles, setSubtitles] = useState('你好，有什么可以帮你的吗？');

  // 动画值
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // 初始化浮动动画
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -12,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // 语音动画
  useEffect(() => {
    if (isSpeaking) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isSpeaking]);

  // 模拟WebSocket连接初始化
  const initWebSocket = () => {
    try {
      setIsSpeaking(true);
      console.log('正在建立WebSocket连接...');
      
      // 模拟连接建立
      setTimeout(() => {
        console.log('WebSocket连接已建立');
        setIsWebSocketConnected(true);
        setIsSpeaking(false);
      }, 1000);
    } catch (error) {
      console.error('初始化WebSocket失败:', error);
    }
  };

  // 发送消息
  const sendMessage = () => {
    if (inputText.trim()) {
      const newUserMsg = { id: messages.length + 1, text: inputText, sender: 'user' };
      setMessages(prev => [...prev, newUserMsg]);
      setInputText('');

      // 模拟AI回复
      setTimeout(() => {
        const aiReply = {
          id: messages.length + 2,
          text: `在「${functions[currentIndex].label}」模式下：${inputText}`,
          sender: 'ai'
        };
        setMessages(prev => [...prev, aiReply]);
      }, 1000);
    }
  };

  // 开始录音
  const startRecording = () => {
    try {
      setIsSpeaking(true);
      setIsRecording(true);
      console.log('开始录音');
      
      // 模拟录音
      setTimeout(() => {
        setIsRecording(false);
        setIsSpeaking(false);
        console.log('停止录音');
        
        // 模拟AI回复
        const aiReply = {
          id: messages.length + 1,
          text: '我收到了你的语音消息，这是我的回复。',
          sender: 'ai'
        };
        setMessages(prev => [...prev, aiReply]);
        setSubtitles('我收到了你的语音消息，这是我的回复。');
      }, 3000);
    } catch (error) {
      console.error('开始录音失败:', error);
    }
  };

  // 停止录音
  const stopRecording = () => {
    setIsRecording(false);
    setIsSpeaking(false);
    console.log('停止录音');
  };

  // 开始视频通话
  const startVideoCall = () => {
    try {
      setIsInCall(true);
      setIsVideoEnabled(true);
      console.log('开始视频通话');
    } catch (error) {
      console.error('开始视频通话失败:', error);
    }
  };

  // 停止视频通话
  const stopVideoCall = () => {
    setIsInCall(false);
    setIsVideoEnabled(false);
    console.log('停止视频通话');
  };

  // 切换功能
  const toggleFunction = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % functions.length);
  };

  // 初始化WebSocket连接
  useEffect(() => {
    initWebSocket();
  }, []);

  return (
    <View style={styles.container}>
      {/* 悬浮头像（自动上下浮动） */}
      <Animated.View
        style={[
          styles.avatarContainer,
          {
            transform: [
              { translateY: isSpeaking ? 0 : floatAnim },
              { scale: isSpeaking ? pulseAnim : 1 }
            ]
          }
        ]}
      >
        <TouchableOpacity
          style={styles.avatar}
          onPress={() => setIsDialogVisible(!isDialogVisible)}
        >
          <Image
            source={avatar}
            style={styles.avatarImage}
            resizeMode="cover"
          />
          <View style={styles.statusIndicator} />
        </TouchableOpacity>
      </Animated.View>

      {/* 浮动对话框 */}
      {isDialogVisible && (
        <View style={styles.dialog}>
          {/* 顶部功能显示栏（功能名+灰色文字说明） */}
          <View style={styles.dialogHeader}>
            <View style={styles.functionInfo}>
              <Text style={styles.functionLabel}>
                {functions[currentIndex].icon} {functions[currentIndex].label}
              </Text>
              <Text style={styles.functionHint}>点击头像切换功能</Text>
            </View>
            <TouchableOpacity onPress={toggleFunction} style={styles.functionToggle}>
              <Ionicons name="refresh" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          {/* 字幕显示区域 */}
          {(functions[currentIndex].id === 'voice' || functions[currentIndex].id === 'video') && (
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitleLabel}>实时字幕</Text>
              <Text style={styles.subtitleText}>{subtitles}</Text>
            </View>
          )}
          
          {/* 聊天内容区域（可滚动） */}
          <View style={styles.messagesContainer}>
            {messages.map(msg => (
              <View
                key={msg.id}
                style={[
                  styles.messageRow,
                  msg.sender === 'user' ? styles.userMessageRow : styles.aiMessageRow
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    msg.sender === 'user' ? styles.userMessageBubble : styles.aiMessageBubble
                  ]}
                >
                  <Text style={[
                    styles.messageText,
                    msg.sender === 'user' ? styles.userMessageText : styles.aiMessageText
                  ]}>
                    {msg.text}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* 音视频通话控制区 */}
          {functions[currentIndex].id === 'voice' && (
            <View style={styles.callControlContainer}>
              <TouchableOpacity
                style={[styles.recordButton, isRecording && styles.stopRecordButton]}
                onPress={isRecording ? stopRecording : startRecording}
              >
                <Text style={styles.recordButtonText}>
                  {isRecording ? '停止录音' : '开始录音'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.statusText}>
                WebSocket状态: {isWebSocketConnected ? '已连接' : '未连接'}
              </Text>
            </View>
          )}
          
          {/* 视频通话控制区 */}
          {functions[currentIndex].id === 'video' && (
            <View>
              {isInCall ? (
                <View>
                  {/* 视频显示区域 */}
                  <View style={styles.videoContainer}>
                    <View style={styles.videoWindow}>
                      <Text style={styles.videoPlaceholder}>本地视频</Text>
                    </View>
                    <View style={styles.videoWindow}>
                      <Text style={styles.videoPlaceholder}>远程视频</Text>
                    </View>
                  </View>
                  
                  {/* 视频控制按钮 */}
                  <View style={styles.videoControls}>
                    <TouchableOpacity
                      style={[styles.videoControlButton, isVideoEnabled && styles.videoControlButtonActive]}
                      onPress={() => setIsVideoEnabled(!isVideoEnabled)}
                    >
                      <Text style={[
                        styles.videoControlButtonText,
                        isVideoEnabled && styles.videoControlButtonTextActive
                      ]}>
                        {isVideoEnabled ? '关闭视频' : '开启视频'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.endCallButton}
                      onPress={stopVideoCall}
                    >
                      <Text style={styles.endCallButtonText}>结束通话</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.videoStartContainer}>
                  <Text style={styles.videoStartIcon}>📹</Text>
                  <Text style={styles.videoStartText}>点击开始按钮发起视频通话</Text>
                  <TouchableOpacity
                    style={styles.startCallButton}
                    onPress={startVideoCall}
                  >
                    <Text style={styles.startCallButtonText}>开始视频通话</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          
          {/* 文本输入区 */}
          {(functions[currentIndex].id === 'text' || functions[currentIndex].id === 'teach' || functions[currentIndex].id === 'code' || functions[currentIndex].id === 'project') && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="输入消息..."
                placeholderTextColor={theme.colors.textSecondary}
                onSubmitEditing={sendMessage}
                returnKeyType="send"
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={sendMessage}
                disabled={!inputText.trim()}
              >
                <Text style={styles.sendButtonText}>发送</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    top: '50%',
    zIndex: 9999,
    transform: [{ translateY: -50 }],
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.white,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarIcon: {
    fontSize: 32,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  dialog: {
    position: 'absolute',
    left: 80,
    top: '50%',
    width: width * 0.7,
    maxWidth: 360,
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    padding: 20,
    transform: [{ translateY: -50 }],
  },
  dialogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    marginBottom: 16,
  },
  functionInfo: {
    flex: 1,
  },
  functionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  functionHint: {
    fontSize: 12,
    color: theme.colors.textTertiary,
  },
  functionToggle: {
    padding: 8,
  },
  subtitleContainer: {
    padding: 12,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 8,
    marginBottom: 16,
  },
  subtitleLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    minHeight: 40,
    lineHeight: 20,
  },
  messagesContainer: {
    minHeight: 160,
    maxHeight: 240,
    marginBottom: 16,
  },
  messageRow: {
    marginBottom: 12,
  },
  userMessageRow: {
    alignItems: 'flex-end',
  },
  aiMessageRow: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    maxWidth: '80%',
  },
  userMessageBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  aiMessageBubble: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userMessageText: {
    color: theme.colors.white,
  },
  aiMessageText: {
    color: theme.colors.textPrimary,
  },
  callControlContainer: {
    padding: 12,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 8,
    marginBottom: 16,
  },
  recordButton: {
    paddingVertical: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  stopRecordButton: {
    backgroundColor: theme.colors.error,
  },
  recordButtonText: {
    color: theme.colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  statusText: {
    textAlign: 'center',
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  videoContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  videoWindow: {
    flex: 1,
    aspectRatio: 16/9,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlaceholder: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  videoControls: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  videoControlButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 8,
    alignItems: 'center',
  },
  videoControlButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  videoControlButtonText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  videoControlButtonTextActive: {
    color: theme.colors.white,
  },
  endCallButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: theme.colors.error,
    borderRadius: 8,
    alignItems: 'center',
  },
  endCallButtonText: {
    fontSize: 14,
    color: theme.colors.white,
  },
  videoStartContainer: {
    padding: 24,
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  videoStartIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  videoStartText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  startCallButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
  },
  startCallButtonText: {
    fontSize: 14,
    color: theme.colors.white,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    borderRadius: 8,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  sendButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    justifyContent: 'center',
  },
  sendButtonText: {
    fontSize: 14,
    color: theme.colors.white,
    fontWeight: '500',
  },
});

export default GlobalAgentFloating;