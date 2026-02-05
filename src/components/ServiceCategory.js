// src/components/ServiceCategory.js 
import React from 'react'; 
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'; 
import { Ionicons } from '@expo/vector-icons'; 

export default function ServiceCategory({ category, isSelected, onPress }) { 
  return ( 
    <TouchableOpacity 
      style={[ 
        styles.categoryItem, 
        isSelected && styles.activeCategory 
      ]} 
      onPress={onPress} 
    > 
      <Ionicons 
        name={category.icon} 
        size={24} 
        color={isSelected ? '#fff' : category.color} 
        style={styles.categoryIcon} 
      /> 
      <Text style={[ 
        styles.categoryText, 
        isSelected && styles.activeText 
      ]}> 
        {category.name} 
      </Text> 
    </TouchableOpacity> 
  ); 
} 

const styles = StyleSheet.create({ 
  categoryItem: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    borderRadius: 8, 
    marginHorizontal: 8, 
    backgroundColor: '#F5F5F5' 
  }, 
  activeCategory: { 
    backgroundColor: '#4A90E2' 
  }, 
  categoryIcon: { 
    marginBottom: 8 
  }, 
  categoryText: { 
    fontSize: 12, 
    color: '#333333' 
  }, 
  activeText: { 
    color: '#fff' 
  } 
});