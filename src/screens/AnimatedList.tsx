import React, {useCallback, useState} from 'react';
import {FlatList, View} from 'react-native';

import {useSharedValue} from 'react-native-reanimated';
import {ListItem} from '../components/ListItem';
import {InitialPositions, SONGS} from '../constants';
import {styles} from './AnimatedList.styles';

export const AnimatedList = () => {
  const currentPositions = useSharedValue(InitialPositions);
  const [currentDragIndex, setCurrentDragIndex] = useState<number>(0);
  const renderCell = useCallback(
    ({index, style, ...props}) => {
      const zIndex = {
        zIndex: index === currentPositions.value[currentDragIndex] ? 2 : 0,
      };

      return <View style={[style, zIndex]} {...props} />;
    },
    [currentDragIndex, currentPositions.value],
  );
  return (
    <View style={styles.listContainer}>
      <FlatList
        data={SONGS}
        removeClippedSubviews={false}
        renderItem={({item}) => (
          <ListItem
            item={item}
            currentDragIndex={currentDragIndex}
            setCurrentDragIndex={setCurrentDragIndex}
            currentPositions={currentPositions}
          />
        )}
        keyExtractor={item => item.id.toString()}
        CellRendererComponent={renderCell}
      />
    </View>
  );
};
