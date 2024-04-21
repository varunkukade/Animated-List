import React, {useState} from 'react';
import {Image, Text, View} from 'react-native';

import {GestureDetector} from 'react-native-gesture-handler';
import Animated, {useDerivedValue} from 'react-native-reanimated';
import {TListItem} from '../types';
import {styles} from './ListItem.styles';
import {useGesture} from '../hooks/useGesture';

export const ListItem = ({
  item,
  isDragging,
  draggedItemId,
  currentSongPositions,
  songsHeight,
  updateTotalHeight,
}: TListItem) => {
  const {animatedStyles, gesture} = useGesture(
    item,
    isDragging,
    draggedItemId,
    currentSongPositions,
    songsHeight,
  );

  const isDraggingDerived = useDerivedValue(() => {
    return isDragging.value;
  });

  const [cellHeight, setCellHeight] = useState(0);
  console.log('cellHeight', item.id, cellHeight);

  return (
    <Animated.View
      onLayout={event => {
        const {height} = event.nativeEvent.layout;
        if (!isDraggingDerived.value) {
          updateTotalHeight(item.id, height);
          console.log('height', height);
          setCellHeight(height);
        }
      }}
      key={item.id}
      style={[styles.itemContainer, animatedStyles, {height: cellHeight}]}>
      <View style={[styles.imageContainer, {height: cellHeight}]}>
        <Image
          source={{
            uri: item.imageSrc,
          }}
          style={[styles.image, {height: cellHeight - 20}]}
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
