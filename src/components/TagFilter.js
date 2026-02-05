import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

const TagFilter = ({ tags, activeTag: propActiveTag, onTagChange, onTagPress }) => {
  const getDefaultTag = () => {
    if (propActiveTag) return propActiveTag;
    if (tags && tags.length > 0) {
      return typeof tags[0] === 'object' ? tags[0].id : tags[0];
    }
    return null;
  };
  
  const [activeTag, setActiveTag] = useState(getDefaultTag());

  const handleTagPress = (tag) => {
    setActiveTag(tag);
    if (onTagPress) {
      onTagPress(tag);
    } else if (onTagChange) {
      onTagChange(tag);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {(tags || []).map((tagItem) => {
        // 处理对象和字符串两种格式的标签
        const tagId = typeof tagItem === 'object' ? tagItem.id : tagItem;
        const tagName = typeof tagItem === 'object' ? tagItem.name : tagItem;
        
        return (
          <TouchableOpacity
            key={tagId}
            style={[
              styles.tagButton,
              activeTag === tagId && styles.activeTagButton
            ]}
            onPress={() => handleTagPress(tagId)}
          >
            <Text
              style={[
                styles.tagText,
                activeTag === tagId && styles.activeTagText
              ]}
            >
              {tagName}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  contentContainer: {
    paddingVertical: 8,
  },
  tagButton: {
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  activeTagButton: {
    backgroundColor: '#4A90E2',
  },
  tagText: {
    fontSize: 14,
    color: '#333333',
  },
  activeTagText: {
    color: '#FFFFFF',
  },
});

export default TagFilter;