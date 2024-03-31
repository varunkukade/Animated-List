import React from 'react';
import {Image, Text, View} from 'react-native';

import {GestureDetector} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {TListItem} from '../types';
import {SONG_HEIGHT} from '../constants';
import {styles} from './ListItem.styles';
import {useGesture} from '../hooks/useGesture';

export const ListItem = ({
  item,
  currentDragIndex,
  setCurrentDragIndex,
  currentPositions,
  sharedCurrDragIndex,
  sharedNewDragIndex,
  isDragging,
}: TListItem) => {
  const {animatedStyles, gesture} = useGesture(
    item,
    currentDragIndex,
    setCurrentDragIndex,
    currentPositions,
    sharedCurrDragIndex,
    sharedNewDragIndex,
    isDragging,
  );

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        key={item.id}
        style={[styles.itemContainer, animatedStyles]}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: item.imageSrc,
            }}
            height={SONG_HEIGHT - 20}
            width={`${100 - 3}%`}
            borderRadius={8}
          />
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description1}>{item.title}</Text>
          <Text style={styles.description2}>{item.singer}</Text>
        </View>
        <View style={styles.draggerContainer}>
          <View style={[styles.dragger, styles.marginBottom]} />
          <View style={[styles.dragger, styles.marginBottom]} />
          <View style={styles.dragger} />
        </View>
      </Animated.View>
    </GestureDetector>
  );
};
