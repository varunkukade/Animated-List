import {
  SharedValue,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import {Color_Pallete, SONG_HEIGHT} from '../constants';
import {NullableNumber, TInitialPositions, TItem} from '../types';
import {Gesture} from 'react-native-gesture-handler';

export const useGesture = (
  item: TItem,
  currentDragIndex: NullableNumber,
  setCurrentDragIndex: (id: NullableNumber) => void,
  currentPositions: SharedValue<TInitialPositions>,
  sharedCurrDragIndex: SharedValue<NullableNumber>,
  sharedNewDragIndex: SharedValue<NullableNumber>,
  isDragging: SharedValue<boolean>,
) => {
  const currentPositionsDerived = useDerivedValue(() => {
    //this function will be run whenever currentPositions change
    return currentPositions.value;
  });

  const derivedSharedCurrDragIndex = useDerivedValue(() => {
    //this function will be run whenever sharedCurrDragIndex change
    return sharedCurrDragIndex.value;
  });

  const derivedSharedNewDragIndex = useDerivedValue(() => {
    //this function will be run whenever sharedNewDragIndex change
    return sharedNewDragIndex.value;
  });

  const derivedIsDragging = useDerivedValue(() => {
    //this function will be run whenever isDragging change
    return isDragging.value;
  });

  const MIN_BOUNDRY = 0;
  const MAX_BOUNDRY =
    (Object.keys(currentPositionsDerived.value).length - 1) * SONG_HEIGHT;

  const getKeyOfValue = (
    value: number,
    obj: TInitialPositions,
  ): number | undefined => {
    'worklet';
    for (const [key, val] of Object.entries(obj)) {
      if (val.updatedIndex === value) {
        return Number(key);
      }
    }
    return undefined; // Return undefined if the value is not found
  };

  const gesture = Gesture.Pan()
    .onBegin(() => {
      isDragging.value = true;
      runOnJS(setCurrentDragIndex)(item.id);
      sharedCurrDragIndex.value =
        currentPositionsDerived.value[item.id].updatedIndex;
    })
    .onUpdate(e => {
      const updatedTopWhileDragging =
        currentPositionsDerived.value[currentDragIndex].originalTop +
        e.translationY;
      if (
        derivedSharedCurrDragIndex.value === null ||
        updatedTopWhileDragging < MIN_BOUNDRY ||
        updatedTopWhileDragging > MAX_BOUNDRY
      ) {
        return;
      }

      //update the top of lifted song so that we can see dragging animation for it
      //because we supply updatedTopWhileDragging value to the styles for "top" property
      currentPositions.value = {
        ...currentPositionsDerived.value,
        [currentDragIndex]: {
          ...currentPositionsDerived.value[currentDragIndex],
          updatedTopWhileDragging,
        },
      };

      //calculate the new index where drag is headed to
      sharedNewDragIndex.value = Math.floor(
        (updatedTopWhileDragging + SONG_HEIGHT / 2) / SONG_HEIGHT,
      );

      if (
        derivedSharedNewDragIndex.value !== derivedSharedCurrDragIndex.value
      ) {
        //find original id of the item that currently resides at derivedSharedNewDragIndex index
        const newIndexItemKey = getKeyOfValue(
          derivedSharedNewDragIndex.value,
          currentPositionsDerived.value,
        );

        //find original id of the item that currently resides at derivedSharedCurrDragIndex index
        const currentDragIndexItemKey = getKeyOfValue(
          derivedSharedCurrDragIndex.value,
          currentPositionsDerived.value,
        );

        if (
          newIndexItemKey !== undefined &&
          currentDragIndexItemKey !== undefined
        ) {
          //swap the items values present at new index and current index
          //at newIndexItemKey index, we should update updatedTopWhileDragging to see visual movement of item
          //also we should update originalTop for that item as next time we want to start and do calculations from new top value
          const newPositions = {
            ...currentPositionsDerived.value,
            [newIndexItemKey]: {
              ...currentPositionsDerived.value[newIndexItemKey],
              updatedIndex: derivedSharedCurrDragIndex.value,
              updatedTopWhileDragging:
                derivedSharedCurrDragIndex.value * SONG_HEIGHT,
              originalTop: derivedSharedCurrDragIndex.value * SONG_HEIGHT,
            },
            [currentDragIndexItemKey]: {
              ...currentPositionsDerived.value[currentDragIndexItemKey],
              updatedIndex: derivedSharedNewDragIndex.value,
            },
          };
          currentPositions.value = newPositions;

          //update new index as current index
          sharedCurrDragIndex.value = derivedSharedNewDragIndex.value;
        }
      }
    })
    .onEnd(() => {
      if (
        derivedSharedCurrDragIndex.value === null ||
        derivedSharedNewDragIndex.value === null
      ) {
        return;
      }

      //find original id of the item that currently resides at derivedSharedCurrDragIndex index
      const currentDragIndexItemKey = getKeyOfValue(
        derivedSharedCurrDragIndex.value,
        currentPositionsDerived.value,
      );

      if (currentDragIndexItemKey !== undefined) {
        const newPositions = {
          ...currentPositionsDerived.value,
          //now also update the values for item whose drag we just stopped
          [currentDragIndexItemKey]: {
            ...currentPositionsDerived.value[currentDragIndexItemKey],
            updatedIndex: derivedSharedNewDragIndex.value,
            updatedTopWhileDragging:
              derivedSharedNewDragIndex.value * SONG_HEIGHT,
            originalTop: derivedSharedNewDragIndex.value * SONG_HEIGHT,
          },
        };
        currentPositions.value = newPositions;

        //update new index as current index
        sharedCurrDragIndex.value = derivedSharedNewDragIndex.value;
      }
      isDragging.value = false;
    });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      top: currentPositionsDerived.value[item.id].updatedTopWhileDragging,
      backgroundColor:
        currentDragIndex === item.id && derivedIsDragging.value
          ? Color_Pallete.night_shadow
          : Color_Pallete.metal_black,
      shadowColor:
        currentDragIndex === item.id && derivedIsDragging.value
          ? 'white'
          : undefined,
      shadowOffset: {
        width: 0,
        height: currentDragIndex === item.id && derivedIsDragging.value ? 7 : 0,
      },
      shadowOpacity:
        currentDragIndex === item.id && derivedIsDragging.value ? 0.2 : 0,
      shadowRadius:
        currentDragIndex === item.id && derivedIsDragging.value ? 10 : 0,
      elevation:
        currentDragIndex === item.id && derivedIsDragging.value ? 5 : 0, // For Android,
    };
  });

  return {
    animatedStyles,
    gesture,
  };
};
