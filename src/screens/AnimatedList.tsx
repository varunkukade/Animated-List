import React, {useEffect, useMemo, useState} from 'react';
import {ScrollView, View} from 'react-native';

import {useSharedValue} from 'react-native-reanimated';
import {ListItem} from '../components/ListItem';
import {
  getInitialPositions,
  SONGS,
  getInitialHeights,
  getSum,
} from '../constants';
import {styles} from './AnimatedList.styles';
import {NullableNumber, TSongPositions, TSongsHeight} from '../types';

export const AnimatedList = () => {
  /*
  TODO: Feature to add - Dragging item to bottom and up should scroll the list automatically
  Item reaches bottommost section - scroll down the list max upto SONGS.length * SONG_HEIGHT
  Item reaches uppermost section - scroll up to the way to 0
  */

  //will hold the songs position in list at every moment
  const currentSongPositions = useSharedValue<TSongPositions>(
    getInitialPositions(),
  );

  //used to know if drag is happening or not
  const isDragging = useSharedValue<0 | 1>(0);

  //this will hold id for item which user started dragging
  const draggedItemId = useSharedValue<NullableNumber>(null);

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

  const [songsHeight, setSongsHeight] = useState<TSongsHeight>(
    getInitialHeights(),
  );

  const totalHeight = useMemo(() => {
    return getSum(songsHeight);
  }, [songsHeight]);

  useEffect(() => {
    'worklet';
    let newSongPositions = {...currentSongPositions.value};
    for (let i = 0; i < SONGS.length; i++) {
      newSongPositions[i] = {
        ...newSongPositions[i],
        updatedTop: getSum(songsHeight, i),
        updatedTopWhileDragging: getSum(songsHeight, i),
      };
    }
    currentSongPositions.value = newSongPositions;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songsHeight]);

  const updateTotalHeight = (id: number, height: number) => {
    setSongsHeight(prevHeights => ({
      ...prevHeights,
      [id]: height,
    }));
  };

  return (
    <View style={styles.listContainer}>
      <ScrollView
        contentContainerStyle={{
          height: totalHeight,
        }}>
        {SONGS.map(eachSong => (
          <ListItem
            item={eachSong}
            key={eachSong.id}
            isDragging={isDragging}
            draggedItemId={draggedItemId}
            currentSongPositions={currentSongPositions}
            songsHeight={songsHeight}
            updateTotalHeight={updateTotalHeight}
          />
        ))}
      </ScrollView>
    </View>
  );
};
