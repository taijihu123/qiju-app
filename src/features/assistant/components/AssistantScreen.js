import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../../common/styles/theme';

const AssistantScreen = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: '您好！我是您的智能生活助手，有什么可以帮您的吗？',
      sender: 'assistant',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  // 模拟智能助手响应
  const handleSend = () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // 模拟智能助手回复
    setTimeout(() => {
      const assistantReply = {
        id: (Date.now() + 1).toString(),
        text: getAssistantReply(inputText.trim()),
        sender: 'assistant',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantReply]);
    }, 1000);
  };

  // 根据用户输入生成回复
  const getAssistantReply = (input) => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('租房') || lowerInput.includes('房子')) {
      return '您可以点击底部的"租房"标签查看可用房源，或者告诉我您的具体需求，我来帮您筛选。';
    } else if (lowerInput.includes('服务') || lowerInput.includes('维修')) {
      return '您可以点击底部的"服务"标签查看我们提供的生活服务，包括维修、保洁等。';
    } else if (lowerInput.includes('社区') || lowerInput.includes('活动')) {
      return '您可以点击底部的"社区"标签查看小区动态和邻居们的分享。';
    } else if (lowerInput.includes('我的') || lowerInput.includes('个人信息')) {
      return '您可以点击底部的"我的"标签查看个人信息、订单和收藏。';
    } else if (lowerInput.includes('生活币') || lowerInput.includes('积分')) {
      return '生活币是我们的积分系统，您可以通过参与社区活动、完成任务等方式获得，可用于兑换服务或抵扣房租。';
    } else if (lowerInput.includes('帮助') || lowerInput.includes('使用')) {
      return '欢迎使用栖居智能助手！您可以通过底部的标签栏访问各个功能模块，也可以直接向我提问，我会尽力为您解答。';
    } else {
      return '很抱歉，我不太理解您的意思。您可以尝试问我关于租房、生活服务、社区活动或生活币的问题。';
    }
  };

  // 滚动到底部
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // 渲染消息项
  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'user';
    return (
      <View style={[styles.messageContainer, isUser ? styles.userMessageContainer : styles.assistantMessageContainer]}>
        {!isUser && (
          <View style={styles.avatarContainer}>
            <Ionicons name="chatbubbles-outline" size={30} color={theme.colors.primary} />
          </View>
        )}
        <View style={[styles.messageBubble, isUser ? styles.userMessageBubble : styles.assistantMessageBubble]}>
          <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.assistantMessageText]}>
            {item.text}
          </Text>
          <Text style={styles.messageTime}>{item.time}</Text>
        </View>
        {isUser && (
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle-outline" size={30} color={theme.colors.textSecondary} />
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>智能助手</Text>
        <Text style={styles.headerSubtitle}>随时为您服务</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="输入您的问题..."
          placeholderTextColor={theme.colors.textSecondary}
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={24} color={theme.colors.background} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 20,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  messagesList: {
    padding: 15,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  assistantMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginHorizontal: 10,
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 15,
    borderRadius: 18,
    marginVertical: 5,
  },
  userMessageBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
  },
  assistantMessageBubble: {
    backgroundColor: theme.colors.card,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: theme.colors.background,
  },
  assistantMessageText: {
    color: theme.colors.textPrimary,
  },
  messageTime: {
    fontSize: 11,
    marginTop: 5,
    textAlign: 'right',
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: theme.colors.textPrimary,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default AssistantScreen;
