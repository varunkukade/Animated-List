import {
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import {Color_Pallete, SONG_HEIGHT} from '../constants';
import {NullableNumber, TSongPositions, TItem, TTopValues} from '../types';
import {Gesture} from 'react-native-gesture-handler';

export const useGesture = (
  item: TItem,
  currDragItemId: SharedValue<NullableNumber>,
  currentSongPositions: SharedValue<TSongPositions>,
  currentTopValues: SharedValue<TTopValues>,
  sharedCurrDragIndex: SharedValue<NullableNumber>,
  sharedNewDragIndex: SharedValue<NullableNumber>,
  isDragging: SharedValue<number>,
) => {
  const currentPositionsDerived = useDerivedValue(() => {
    //this function will be run whenever currentSongPositions change
    return currentSongPositions.value;
  });

  const currentTopValuesDerived = useDerivedValue(() => {
    //this function will be run whenever currentTopValues change
    return currentTopValues.value;
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

  const currentDragItemIdDerived = useDerivedValue(() => {
    //this function will be run whenever currDragItemId change
    return currDragItemId.value;
  });

  const MIN_BOUNDRY = 0;
  const MAX_BOUNDRY =
    (Object.keys(currentPositionsDerived.value).length - 1) * SONG_HEIGHT;

  const getKeyOfValue = (
    value: number,
    obj: TSongPositions,
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
    .onStart(() => {
      isDragging.value = withSpring(1);
      currDragItemId.value = item.id;
      sharedCurrDragIndex.value =
        currentPositionsDerived.value[item.id].updatedIndex;
    })
    .onUpdate(e => {
      if (currentDragItemIdDerived.value === null) {
        return;
      }
      const updatedTopWhileDragging =
        currentPositionsDerived.value[currentDragItemIdDerived.value]
          .updatedTop + e.translationY;
      if (
        derivedSharedCurrDragIndex.value === null ||
        updatedTopWhileDragging < MIN_BOUNDRY ||
        updatedTopWhileDragging > MAX_BOUNDRY
      ) {
        return;
      }

      //update the top of lifted song so that we can see dragging animation for it
      //because we supply currentTopValues value to the styles for "top" property
      currentTopValues.value = {
        ...currentTopValuesDerived.value,
        [currentDragItemIdDerived.value]: updatedTopWhileDragging,
      };

      //calculate the new index where drag is headed to
      sharedNewDragIndex.value = Math.floor(
        (updatedTopWhileDragging + SONG_HEIGHT / 2) / SONG_HEIGHT,
      );

      if (
        derivedSharedNewDragIndex.value !== null &&
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

        //swap the items values present at new index and current index
        if (
          newIndexItemKey !== undefined &&
          currentDragIndexItemKey !== undefined
        ) {
          //we should update updatedTop and updatedIndex for items as next time we want to start and do calculations from new top value and new index
          const newPositions: TSongPositions = {
            ...currentPositionsDerived.value,
            [newIndexItemKey]: {
              ...currentPositionsDerived.value[newIndexItemKey],
              updatedIndex: derivedSharedCurrDragIndex.value,
              updatedTop: derivedSharedCurrDragIndex.value * SONG_HEIGHT,
            },
            [currentDragIndexItemKey]: {
              ...currentPositionsDerived.value[currentDragIndexItemKey],
              updatedIndex: derivedSharedNewDragIndex.value,
            },
          };
          currentSongPositions.value = newPositions;
          //at newIndexItemKey index, we should update top to see visual movement of item
          currentTopValues.value = {
            ...currentTopValuesDerived.value,
            [newIndexItemKey]: derivedSharedCurrDragIndex.value * SONG_HEIGHT,
          };

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
        const newPositions: TSongPositions = {
          ...currentPositionsDerived.value,
          //now also update the values for item whose drag we just stopped
          [currentDragIndexItemKey]: {
            ...currentPositionsDerived.value[currentDragIndexItemKey],
            updatedIndex: derivedSharedNewDragIndex.value,
            updatedTop: derivedSharedNewDragIndex.value * SONG_HEIGHT,
          },
        };
        currentSongPositions.value = newPositions;

        currentTopValues.value = withSpring({
          ...currentTopValuesDerived.value,
          [currentDragIndexItemKey]:
            derivedSharedNewDragIndex.value * SONG_HEIGHT,
        });

        //update new index as current index
        sharedCurrDragIndex.value = derivedSharedNewDragIndex.value;
      }
      isDragging.value = withDelay(200, withSpring(0));
    });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      top: currentTopValues.value[item.id],
      transform: [
        {
          scale:
            currentDragItemIdDerived.value === item.id
              ? interpolate(derivedIsDragging.value, [0, 1], [1, 1.025])
              : interpolate(derivedIsDragging.value, [0, 1], [1, 0.98]),
        },
      ],
      backgroundColor:
        currentDragItemIdDerived.value === item.id && derivedIsDragging.value
          ? interpolateColor(
              derivedIsDragging.value,
              [0, 1],
              [Color_Pallete.metal_black, Color_Pallete.night_shadow],
            )
          : Color_Pallete.metal_black,

      shadowColor:
        currentDragItemIdDerived.value === item.id && derivedIsDragging.value
          ? interpolateColor(
              derivedIsDragging.value,
              [0, 1],
              [Color_Pallete.metal_black, 'white'],
            )
          : undefined,
      shadowOffset: {
        width: 0,
        height:
          currentDragItemIdDerived.value === item.id && derivedIsDragging.value
            ? interpolate(derivedIsDragging.value, [0, 1], [0, 7])
            : 0,
      },
      shadowOpacity:
        currentDragItemIdDerived.value === item.id && derivedIsDragging.value
          ? interpolate(derivedIsDragging.value, [0, 1], [0, 0.2])
          : 0,
      shadowRadius:
        currentDragItemIdDerived.value === item.id && derivedIsDragging.value
          ? interpolate(derivedIsDragging.value, [0, 1], [0, 10])
          : 0,
      elevation:
        currentDragItemIdDerived.value === item.id && derivedIsDragging.value
          ? interpolate(derivedIsDragging.value, [0, 1], [0, 5])
          : 0, // For Android,
      zIndex: currentDragItemIdDerived.value === item.id ? 1 : 0,
    };
  });

  return {
    animatedStyles,
    gesture,
  };
};
