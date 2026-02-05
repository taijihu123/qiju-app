// src/components/ServiceCard.js 
import React from 'react'; 
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'; 

// 接收服务数据+预约回调 
export default function ServiceCard({ service, onBook }) { 
  return ( 
    <View style={styles.cardContainer}> 
      <Image 
        source={{ uri: service.imgUrl }} 
        style={styles.serviceImg} 
      /> 
      <View style={styles.serviceInfo}> 
        <Text style={styles.title}>{service.title}</Text> 
        <Text style={styles.desc}>{service.desc}</Text> 
        <Text style={styles.price}>{service.price}</Text> 
      </View> 
      <TouchableOpacity 
        style={styles.bookBtn} 
        onPress={onBook} 
      > 
        <Text style={styles.btnText}>预约</Text> 
      </TouchableOpacity> 
    </View> 
  ); 
} 

const styles = StyleSheet.create({ 
  cardContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#F5F5F5', 
    borderRadius: 8, 
    padding: 12, 
    marginBottom: 12 
  }, 
  serviceImg: { 
    width: 60, 
    height: 60, 
    borderRadius: 4, 
    marginRight: 12 
  }, 
  serviceInfo: { 
    flex: 1 
  }, 
  title: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#333333', 
    marginBottom: 4 
  }, 
  desc: { 
    fontSize: 12, 
    color: '#666666', 
    marginBottom: 4 
  }, 
  price: { 
    fontSize: 12, 
    color: '#FF4444' 
  }, 
  bookBtn: { 
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