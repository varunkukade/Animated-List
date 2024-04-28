import {
  SharedValue,
  interpolate,
  interpolateColor,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  Color_Pallete,
  MAX_BOUNDRY,
  MIN_BOUNDRY,
  SONG_HEIGHT,
} from '../constants';
import {NullableNumber, TSongPositions, TItem} from '../types';
import {Gesture} from 'react-native-gesture-handler';

export const useGesture = (
  item: TItem,
  isDragging: SharedValue<number>,
  draggedItemId: SharedValue<NullableNumber>,
  currentSongPositions: SharedValue<TSongPositions>,
) => {
  //used for swapping with currentIndex
  const newIndex = useSharedValue<NullableNumber>(null);

  //used for swapping with newIndex
  const currentIndex = useSharedValue<NullableNumber>(null);

  const currentSongPositionsDerived = useDerivedValue(() => {
    return currentSongPositions.value;
  });

  const top = useSharedValue(item.id * SONG_HEIGHT);

  const isDraggingDerived = useDerivedValue(() => {
    return isDragging.value;
  });

  const draggedItemIdDerived = useDerivedValue(() => {
    return draggedItemId.value;
  });

  useAnimatedReaction(
    () => {
      return currentSongPositionsDerived.value[item.id].updatedIndex;
    },
    (currentValue, previousValue) => {
      if (currentValue !== previousValue) {
        if (
          draggedItemIdDerived.value !== null &&
          item.id === draggedItemIdDerived.value
        ) {
          top.value = withSpring(
            currentSongPositionsDerived.value[item.id].updatedIndex *
              SONG_HEIGHT,
          );
        } else {
          top.value = withTiming(
            currentSongPositionsDerived.value[item.id].updatedIndex *
              SONG_HEIGHT,
            {duration: 500},
          );
        }
      }
    },
  );

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
      currentIndex.value =
        currentSongPositionsDerived.value[item.id].updatedIndex;
    })
    .onUpdate(e => {
      if (draggedItemIdDerived.value === null) {
        return;
      }

      const newTop =
        currentSongPositionsDerived.value[draggedItemIdDerived.value]
          .updatedTop + e.translationY;

      if (
        currentIndex.value === null ||
        newTop < MIN_BOUNDRY ||
        newTop > MAX_BOUNDRY
      ) {
        //dragging out of bound
        return;
      }
      top.value = newTop;

      //calculate the new index where drag is headed to
      newIndex.value = Math.floor((newTop + SONG_HEIGHT / 2) / SONG_HEIGHT);

      //swap the items present at newIndex and currentIndex
      if (newIndex.value !== currentIndex.value) {
        //find id of the item that currently resides at newIndex
        const newIndexItemKey = getKeyOfValue(
          newIndex.value,
          currentSongPositionsDerived.value,
        );

        //find id of the item that currently resides at currentIndex
        const currentDragIndexItemKey = getKeyOfValue(
          currentIndex.value,
          currentSongPositionsDerived.value,
        );

        if (
          newIndexItemKey !== undefined &&
          currentDragIndexItemKey !== undefined
        ) {
          //we update updatedTop and updatedIndex as next time we want to do calculations from new top value and new index
          currentSongPositions.value = {
            ...currentSongPositionsDerived.value,
            [newIndexItemKey]: {
              ...currentSongPositionsDerived.value[newIndexItemKey],
              updatedIndex: currentIndex.value,
              updatedTop: currentIndex.value * SONG_HEIGHT,
            },
            [currentDragIndexItemKey]: {
              ...currentSongPositionsDerived.value[currentDragIndexItemKey],
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
      top.value = withSpring(newIndex.value * SONG_HEIGHT);
      //find original id of the item that currently resides at currentIndex
      const currentDragIndexItemKey = getKeyOfValue(
        currentIndex.value,
        currentSongPositionsDerived.value,
      );

      if (currentDragIndexItemKey !== undefined) {
        //update the values for item whose drag we just stopped
        currentSongPositions.value = {
          ...currentSongPositionsDerived.value,
          [currentDragIndexItemKey]: {
            ...currentSongPositionsDerived.value[currentDragIndexItemKey],
            updatedTop: newIndex.value * SONG_HEIGHT,
          },
        };
      }
      //stop dragging
      isDragging.value = withDelay(200, withSpring(0));
    });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      top: top.value,
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
  }, [draggedItemIdDerived.value, isDraggingDerived.value]);

  return {
    animatedStyles,
    gesture,
  };
};
