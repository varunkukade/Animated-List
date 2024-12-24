import React from 'react';
import {Image, Text, View} from 'react-native';

import {GestureDetector} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {TListItem} from '../types';
import {styles} from './ListItem.styles';
import {useGesture} from '../hooks/useGesture';

export const ListItem = ({
  item,
  isDragging,
  draggedItemId,
  currentSongPositions,
  scrollUp,
  scrollDown,
  scrollY,
  isDragInProgress,
}: TListItem) => {
  const {animatedStyles, gesture} = useGesture(
    item,
    isDragging,
    draggedItemId,
    currentSongPositions,
    scrollUp,
    scrollDown,
    scrollY,
    isDragInProgress,
  );

  return (
    <Animated.View key={item.id} style={[styles.itemContainer, animatedStyles]}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: item.imageSrc,
          }}
          style={styles.image}
          borderRadius={8}
        />
      </View>
      <View style={styles.descriptionContainer}>
        <Text style={styles.description1}>{item.title}</Text>
        <Text style={styles.description2}>{item.singer}</Text>
      </View>
      <GestureDetector gesture={gesture}>
        <Animated.View style={styles.draggerContainer}>
          <View style={[styles.dragger, styles.marginBottom]} />
          <View style={[styles.dragger, styles.marginBottom]} />
          <View style={styles.dragger} />
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};
