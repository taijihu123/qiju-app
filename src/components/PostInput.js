import React, { useState } from 'react'; 
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native'; 

export default function PostInput({ onPublish }) { 
  const [content, setContent] = useState(''); 
  const maxLength = 500; 

  return ( 
    <View style={styles.container}> 
      <TextInput 
        style={styles.input} 
        placeholder="分享你的生活，认识更多邻居..." 
        placeholderTextColor="#666666" 
        value={content} 
        onChangeText={setContent} 
        multiline 
        maxLength={maxLength} 
      /> 
      <View style={styles.footer}> 
        <Text style={styles.wordCount}>{content.length}/{maxLength}</Text> 
        <TouchableOpacity 
          style={styles.publishBtn} 
          onPress={() => onPublish(content)} 
          disabled={content.length === 0} 
        > 
          <Text style={styles.btnText}>发布</Text> 
        </TouchableOpacity> 
      </View> 
    </View> 
  ); 
} 

const styles = StyleSheet.create({ 
  container: { 
    marginBottom: 20 
  }, 
  input: { 
    borderWidth: 1, 
    borderColor: '#F5F5F5', 
    borderRadius: 8, 
    padding: 12, 
    minHeight: 80, 
    fontSize: 14, 
    color: '#333333' 
  }, 
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 8 
  }, 
  wordCount: { 
    fontSize: 12, 
    color: '#666666' 
  }, 
  publishBtn: { 
    backgroundColor: '#4A90E2', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 4 
  }, 
  btnText: { 
    color: '#fff', 
    fontSize: 12 
  } 
});