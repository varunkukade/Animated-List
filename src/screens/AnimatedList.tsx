import React from 'react';
import {ScrollView, View} from 'react-native';

import {useSharedValue} from 'react-native-reanimated';
import {ListItem} from '../components/ListItem';
import {
  getInitialPositions,
  SONGS,
  SONG_HEIGHT,
  getInitialTopValues,
} from '../constants';
import {styles} from './AnimatedList.styles';
import {NullableNumber, TSongPositions, TTopValues} from '../types';

export const AnimatedList = () => {
  const currDragItemId = useSharedValue<NullableNumber>(null);

  /*
  Issues to solve
  Add long list and drag item most down. Item should be draggable beyond height of device
  */

  const currentSongPositions = useSharedValue<TSongPositions>(
    getInitialPositions(),
  );
  const currentTopValues = useSharedValue<TTopValues>(getInitialTopValues());
  const sharedCurrDragIndex = useSharedValue<NullableNumber>(null);
  const sharedNewDragIndex = useSharedValue<NullableNumber>(null);
  const isDragging = useSharedValue<number>(0);

  // const renderCell = useCallback(
  //   ({index, style, ...props}: any) => {
  //     console.log('In renderCell', index);
  //     const zIndex = {
  //       zIndex: index === currentDragIndex ? 2 : 0,
  //     };

  //     return <View style={[style, zIndex]} {...props} />;
  //   },
  //   [currentDragIndex],
  // );

  return (
    <View style={styles.listContainer}>
      <ScrollView contentContainerStyle={{height: SONGS.length * SONG_HEIGHT}}>
        {SONGS.map(eachSong => (
          <ListItem
            item={eachSong}
            key={eachSong.id}
            currDragItemId={currDragItemId}
            currentSongPositions={currentSongPositions}
            currentTopValues={currentTopValues}
            sharedCurrDragIndex={sharedCurrDragIndex}
            sharedNewDragIndex={sharedNewDragIndex}
            isDragging={isDragging}
          />
        ))}
      </ScrollView>
    </View>
  );
};
