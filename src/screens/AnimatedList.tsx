import React, {useCallback, useState} from 'react';
import {FlatList, View} from 'react-native';

import {useSharedValue} from 'react-native-reanimated';
import {ListItem} from '../components/ListItem';
import {InitialPositions, SONGS} from '../constants';
import {styles} from './AnimatedList.styles';
import {NullableNumber, TInitialPositions} from '../types';

export const AnimatedList = () => {
  const [currentDragIndex, setCurrentDragIndex] =
    useState<NullableNumber>(null);
  /*
  Issues to solve
  1. Solve zindex issue after 1st drag ends
  2. Drag only when you click on side three bars to make it compatible with scrollview
  3. Add long list and drag item most down. Item should be draggable beyond height of device
  */

  const currentPositions = useSharedValue<TInitialPositions>(InitialPositions);
  const sharedCurrDragIndex = useSharedValue<NullableNumber>(null);
  const sharedNewDragIndex = useSharedValue<NullableNumber>(null);
  const isDragging = useSharedValue<boolean>(false);

  const renderCell = useCallback(
    ({index, style, ...props}: any) => {
      const zIndex = {
        zIndex:
          currentPositions.value[index].updatedIndex === currentDragIndex
            ? 2
            : 0,
      };

      return <View style={[style, zIndex]} {...props} />;
    },
    [currentDragIndex, currentPositions.value],
  );

  const updateCurrentDragIndex = (id: number) => {
    setCurrentDragIndex(id);
  };

  return (
    <View style={styles.listContainer}>
      <FlatList
        data={SONGS}
        removeClippedSubviews={false}
        renderItem={({item}) => (
          <ListItem
            item={item}
            currentDragIndex={currentDragIndex}
            setCurrentDragIndex={updateCurrentDragIndex}
            currentPositions={currentPositions}
            sharedCurrDragIndex={sharedCurrDragIndex}
            sharedNewDragIndex={sharedNewDragIndex}
            isDragging={isDragging}
          />
        )}
        keyExtractor={item => item.id.toString()}
        CellRendererComponent={renderCell}
      />
    </View>
  );
};
