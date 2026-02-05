import React from 'react'; 
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'; 

// 接收活动数据+报名回调 
export default function ActivityItem({ activity, onSignup }) { 
  return ( 
    <View style={styles.itemContainer}> 
      <View style={styles.infoWrapper}> 
        <Text style={styles.title}>{activity.title}</Text> 
        <Text style={styles.detail}>{activity.location}</Text> 
        <Text style={styles.detail}>{activity.people}</Text> 
        <Text style={styles.time}>{activity.time}</Text> 
      </View> 
      <TouchableOpacity style={styles.signupBtn} onPress={onSignup}> 
        <Text style={styles.btnText}>报名</Text> 
      </TouchableOpacity> 
    </View> 
  ); 
} 

const styles = StyleSheet.create({ 
  itemContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#F5F5F5', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 12 
  }, 
  infoWrapper: { 
    flex: 1 
  }, 
  title: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#333333', 
    marginBottom: 4 
  }, 
  detail: { 
    fontSize: 12, 
    color: '#666666', 
    marginBottom: 2 
  }, 
  time: { 
    fontSize: 12, 
    color: '#4A90E2' 
  }, 
  signupBtn: { 
    backgroundColor: '#4A90E2', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 4 
  }, 
  btnText: { 
    color: '#fff', 
    fontSize: 12 
  } 
});