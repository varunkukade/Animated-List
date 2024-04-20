import {
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import {
  Color_Pallete,
  MAX_BOUNDRY,
  MIN_BOUNDRY,
  SONG_HEIGHT,
} from '../constants';
import {NullableNumber, TSongPositions, TItem, TTopValues} from '../types';
import {Gesture} from 'react-native-gesture-handler';

export const useGesture = (
  item: TItem,
  isDragging: SharedValue<number>,
  draggedItemId: SharedValue<NullableNumber>,
  currentSongPositions: SharedValue<TSongPositions>,
  currentTopValues: SharedValue<TTopValues>,
) => {
  //used for swapping with currentIndex
  const newIndex = useSharedValue<NullableNumber>(null);

  //used for swapping with newIndex
  const currentIndex = useSharedValue<NullableNumber>(null);

  const currentPositionsDerived = useDerivedValue(() => {
    return currentSongPositions.value;
  });

  const currentTopValuesDerived = useDerivedValue(() => {
    return currentTopValues.value;
  });

  const isDraggingDerived = useDerivedValue(() => {
    return isDragging.value;
  });

  const draggedItemIdDerived = useDerivedValue(() => {
    return draggedItemId.value;
  });

  const isCurrentDraggingItem = useDerivedValue(() => {
    return isDraggingDerived.value && draggedItemIdDerived.value === item.id;
  });

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
      //start dragging
      isDragging.value = withSpring(1);

      //keep track of dragged item
      draggedItemId.value = item.id;

      //store dragged item id for future swap
      currentIndex.value = currentPositionsDerived.value[item.id].updatedIndex;
    })
    .onUpdate(e => {
      if (draggedItemIdDerived.value === null) {
        return;
      }

      const updatedTopWhileDragging =
        currentPositionsDerived.value[draggedItemIdDerived.value].updatedTop +
        e.translationY;

      if (
        currentIndex.value === null ||
        updatedTopWhileDragging < MIN_BOUNDRY ||
        updatedTopWhileDragging > MAX_BOUNDRY
      ) {
        //dragging out of bound
        return;
      }

      /*
      Update the currentTopValues of lifted song so that we can see dragging animation for it
      because we supply currentTopValues value to the styles for "top" property
      */
      currentTopValues.value = {
        ...currentTopValuesDerived.value,
        [draggedItemIdDerived.value]: updatedTopWhileDragging,
      };

      //calculate the new index where drag is headed to
      newIndex.value = Math.floor(
        (updatedTopWhileDragging + SONG_HEIGHT / 2) / SONG_HEIGHT,
      );

      //swap the items present at newIndex and currentIndex
      if (newIndex.value !== currentIndex.value) {
        //find id of the item that currently resides at newIndex
        const newIndexItemKey = getKeyOfValue(
          newIndex.value,
          currentPositionsDerived.value,
        );

        //find id of the item that currently resides at currentIndex
        const currentDragIndexItemKey = getKeyOfValue(
          currentIndex.value,
          currentPositionsDerived.value,
        );

        if (
          newIndexItemKey !== undefined &&
          currentDragIndexItemKey !== undefined
        ) {
          //we update "top" to see visual movement of item exist at newIndex
          currentTopValues.value = {
            ...currentTopValuesDerived.value,
            [newIndexItemKey]: currentIndex.value * SONG_HEIGHT,
          };

          //we update updatedTop and updatedIndex as next time we want to do calculations from new top value and new index
          currentSongPositions.value = {
            ...currentPositionsDerived.value,
            [newIndexItemKey]: {
              ...currentPositionsDerived.value[newIndexItemKey],
              updatedIndex: currentIndex.value,
              updatedTop: currentIndex.value * SONG_HEIGHT,
            },
            [currentDragIndexItemKey]: {
              ...currentPositionsDerived.value[currentDragIndexItemKey],
              updatedIndex: newIndex.value,
            },
          };

          //update new index as current index
          currentIndex.value = newIndex.value;
        }
      }
    })
    .onEnd(() => {
      if (currentIndex.value === null || newIndex.value === null) {
        return;
      }

      //find original id of the item that currently resides at currentIndex
      const currentDragIndexItemKey = getKeyOfValue(
        currentIndex.value,
        currentPositionsDerived.value,
      );

      if (currentDragIndexItemKey !== undefined) {
        //update the values for item whose drag we just stopped
        currentSongPositions.value = {
          ...currentPositionsDerived.value,
          [currentDragIndexItemKey]: {
            ...currentPositionsDerived.value[currentDragIndexItemKey],
            updatedIndex: newIndex.value,
            updatedTop: newIndex.value * SONG_HEIGHT,
          },
        };

        /* 
        Update the "top" of dragged item at last.
        This will realign item to specific flatlist cell.
        */
        currentTopValues.value = withSpring({
          ...currentTopValuesDerived.value,
          [currentDragIndexItemKey]: newIndex.value * SONG_HEIGHT,
        });
      }
      //stop dragging
      isDragging.value = withDelay(200, withSpring(0));
    });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      top: currentTopValues.value[item.id],
      transform: [
        {
          scale: isCurrentDraggingItem.value
            ? interpolate(isDraggingDerived.value, [0, 1], [1, 1.025])
            : interpolate(isDraggingDerived.value, [0, 1], [1, 0.98]),
        },
      ],
      backgroundColor: isCurrentDraggingItem.value
        ? interpolateColor(
            isDraggingDerived.value,
            [0, 1],
            [Color_Pallete.metal_black, Color_Pallete.night_shadow],
          )
        : Color_Pallete.metal_black,

      shadowColor: isCurrentDraggingItem.value
        ? interpolateColor(
            isDraggingDerived.value,
            [0, 1],
            [Color_Pallete.metal_black, Color_Pallete.crystal_white],
          )
        : undefined,
      shadowOffset: {
        width: 0,
        height: isCurrentDraggingItem.value
          ? interpolate(isDraggingDerived.value, [0, 1], [0, 7])
          : 0,
      },
      shadowOpacity: isCurrentDraggingItem.value
        ? interpolate(isDraggingDerived.value, [0, 1], [0, 0.2])
        : 0,
      shadowRadius: isCurrentDraggingItem.value
        ? interpolate(isDraggingDerived.value, [0, 1], [0, 10])
        : 0,
      elevation: isCurrentDraggingItem.value
        ? interpolate(isDraggingDerived.value, [0, 1], [0, 5])
        : 0, // For Android,
      zIndex: isCurrentDraggingItem.value ? 1 : 0,
    };
  }, [
    draggedItemIdDerived.value,
    isDraggingDerived.value,
    currentTopValues.value,
  ]);

  return {
    animatedStyles,
    gesture,
  };
};
