import React from 'react';
import {ScrollView, View} from 'react-native';

import {useSharedValue} from 'react-native-reanimated';
import {ListItem} from '../components/ListItem';
import {getInitialPositions, SONGS, SONG_HEIGHT} from '../constants';
import {styles} from './AnimatedList.styles';
import {NullableNumber, TSongPositions} from '../types';

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

  return (
    <View style={styles.listContainer}>
      <ScrollView contentContainerStyle={{height: SONGS.length * SONG_HEIGHT}}>
        {SONGS.map(eachSong => (
          <ListItem
            item={eachSong}
            key={eachSong.id}
            isDragging={isDragging}
            draggedItemId={draggedItemId}
            currentSongPositions={currentSongPositions}
          />
        ))}
      </ScrollView>
    </View>
  );
};
