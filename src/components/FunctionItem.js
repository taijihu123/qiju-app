import React from 'react'; 
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'; 

export default function FunctionItem({ icon, title, badge, onPress, loading }) {
  return ( 
    <TouchableOpacity style={styles.itemContainer} onPress={onPress} disabled={loading}> 
      <Image source={{ uri: icon }} style={styles.icon} /> 
      <Text style={styles.title}>{title}</Text> 
      {loading ? ( 
        <Text style={styles.loadingText}>加载中...</Text> 
      ) : badge > 0 && ( 
        <View style={styles.badge}> 
          <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text> 
        </View> 
      )} 
    </TouchableOpacity> 
  ); 
} 

const styles = StyleSheet.create({ 
  itemContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12, 
    paddingHorizontal: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F5F5F5' 
  }, 
  icon: { 
    width: 24, 
    height: 24, 
    marginRight: 12 
  }, 
  title: { 
    fontSize: 14, 
    color: '#333', 
    flex: 1 
  }, 
  badge: { 
    width: 20, 
    height: 20, 
    borderRadius: 10, 
    backgroundColor: '#FF4444', 
    justifyContent: 'center', 
    alignItems: 'center' 
  }, 
  badgeText: { 
    fontSize: 12, 
    color: '#fff' 
  }, 
  loadingText: { 
    fontSize: 12, 
    color: '#999', 
    marginLeft: 8 
  } 
});