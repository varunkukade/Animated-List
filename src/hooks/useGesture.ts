import {Gesture} from 'react-native-gesture-handler';

import {
  SharedValue,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import {Color_Pallete, SONG_HEIGHT} from '../constants';
import {TItem} from '../types';

export const useGesture = (
  setCurrentDragIndex: React.Dispatch<React.SetStateAction<number>>,
  currentDragIndex: number | null,
  currentPositions: SharedValue<{
    [key: number]: number;
  }>,
  item: TItem,
) => {
  const currentPositionsDerived = useDerivedValue(() => {
    //this function will be run whenever currentPositions change
    return currentPositions.value;
  });
  const originalTop = currentPositionsDerived.value[item.id] * SONG_HEIGHT;
  const topShared = useSharedValue(originalTop);
  const newIndexShared = useSharedValue<number | null>(null);
  const updateCurrentDragIndex = (id: number) => {
    setCurrentDragIndex(id);
  };
  const getKeyOfValue = (
    value: number,
    obj: {[key: string]: number},
  ): string | undefined => {
    'worklet';
    for (const [key, val] of Object.entries(obj)) {
      if (val === value) {
        return key;
      }
    }
    return undefined; // Return undefined if the value is not found
  };
  const gesture = Gesture.Pan()
    .onBegin(() => {
      console.log('item.id', item.id);
      runOnJS(updateCurrentDragIndex)(currentPositionsDerived.value[item.id]);
    })
    .onUpdate(e => {
      if (currentDragIndex === null) return;
      // console.log('topShared', topShared.value);
      // console.log('e.translationY', e.translationY);
      //currenTdragIndex= 0
      topShared.value = originalTop + e.translationY;
      newIndexShared.value = Math.floor(topShared.value / SONG_HEIGHT);
      //newIndexShared.value = 1
      //now from {"0": 1, "1": 0, "2": 2, "3": 3, "4": 4, "5": 5}
      //check which key has value of newIndexShared.value.
      const keyOfValue1 = getKeyOfValue(
        newIndexShared.value,
        currentPositions.value,
      );
      const keyOfValue2 = getKeyOfValue(
        currentDragIndex,
        currentPositions.value,
      );
      console.log('currentPositions.value', currentPositions.value);
      console.log('keyOfValue1', keyOfValue1); // 0
      console.log('keyOfValue2', keyOfValue2); // 1
      console.log('new Index', newIndexShared.value);
      if (keyOfValue1 !== undefined && keyOfValue2 !== undefined) {
        currentPositions.value = {
          ...currentPositions.value,
          [keyOfValue1]: currentDragIndex,
          [keyOfValue2]: newIndexShared.value,
        };
      }
      runOnJS(updateCurrentDragIndex)(newIndexShared.value);
      // offset.value = {
      //   x: e.translationX + start.value.x,
      //   y: e.translationY + start.value.y,
      // };
    })
    .onEnd(() => {
      if (currentDragIndex === null || newIndexShared.value === null) return;
      console.log('in on end');
      const keyOfValue1 = getKeyOfValue(
        newIndexShared.value,
        currentPositions.value,
      );
      const keyOfValue2 = getKeyOfValue(
        currentDragIndex,
        currentPositions.value,
      );
      if (
        currentDragIndex !== null &&
        newIndexShared.value !== null &&
        keyOfValue1 !== undefined &&
        keyOfValue2 !== undefined
      ) {
        currentPositions.value = {
          ...currentPositions.value,
          [keyOfValue1]: currentDragIndex,
          [keyOfValue2]: newIndexShared.value,
        };
      }

      // start.value = {
      //   x: offset.value.x,
      //   y: offset.value.y,
      // };
    })
    .onFinalize(() => {
      // isPressed.value = false;
    });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      top: topShared.value,
      backgroundColor:
        currentDragIndex === currentPositionsDerived.value[item.id]
          ? Color_Pallete.night_shadow
          : Color_Pallete.metal_black,
    };
  });

  return {
    gesture,
    animatedStyles,
  };
};
