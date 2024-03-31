import {
  SharedValue,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import {Color_Pallete, SONG_HEIGHT, TInitialPositions} from '../constants';
import {TItem} from '../types';
import {Gesture} from 'react-native-gesture-handler';

export const useGesture = (
  item: TItem,
  currentDragIndex: number,
  setCurrentDragIndex: (id: number) => void,
  currentPositions: SharedValue<TInitialPositions>,
  sharedCurrDragIndex: SharedValue<number>,
  sharedNewDragIndex: SharedValue<number>,
  isDragging: SharedValue<boolean>,
) => {
  const updatedPositions = useDerivedValue(() => {
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
    //this function will be run whenever derviedIsDraggingStarted change
    return isDragging.value;
  });

  const MIN_BOUNDRY = 0;
  const MAX_BOUNDRY =
    (Object.keys(updatedPositions.value).length - 1) * SONG_HEIGHT;

  const getKeyOfValue = (
    value: number,
    obj: TInitialPositions,
  ): string | undefined => {
    'worklet';
    for (const [key, val] of Object.entries(obj)) {
      if (val.updatedIndex === value) {
        return key;
      }
    }
    return undefined; // Return undefined if the value is not found
  };

  const gesture = Gesture.Pan()
    .onBegin(() => {
      isDragging.value = true;
      runOnJS(setCurrentDragIndex)(item.id);
      sharedCurrDragIndex.value = updatedPositions.value[item.id].updatedIndex;
    })
    .onUpdate(e => {
      const updatedTop =
        updatedPositions.value[currentDragIndex].originalTop + e.translationY;
      if (
        derivedSharedCurrDragIndex.value === null ||
        updatedTop < MIN_BOUNDRY ||
        updatedTop > MAX_BOUNDRY
      ) {
        return;
      }

      //update the top of lifted song so that we can see dragging animation for it
      //because we supply updatedTop value to the styles for "top" property
      currentPositions.value = {
        ...updatedPositions.value,
        [currentDragIndex]: {
          ...updatedPositions.value[currentDragIndex],
          updatedTop,
        },
      };

      //calculate the new index where drag is headed to
      sharedNewDragIndex.value = Math.floor(
        (updatedTop + SONG_HEIGHT / 2) / SONG_HEIGHT,
      );

      if (
        derivedSharedNewDragIndex.value !== derivedSharedCurrDragIndex.value
      ) {
        //find original id of the item that currently resides at derivedSharedNewDragIndex index
        const newIndexItemKey = getKeyOfValue(
          derivedSharedNewDragIndex.value,
          updatedPositions.value,
        );

        //find original id of the item that currently resides at derivedSharedCurrDragIndex index
        const currentDragIndexItemKey = getKeyOfValue(
          derivedSharedCurrDragIndex.value,
          updatedPositions.value,
        );

        if (
          newIndexItemKey !== undefined &&
          currentDragIndexItemKey !== undefined
        ) {
          //swap the items values present at new index and current index
          const newPositions = {
            ...updatedPositions.value,
            [newIndexItemKey]: {
              ...updatedPositions.value[newIndexItemKey],
              updatedIndex: derivedSharedCurrDragIndex.value,
              updatedTop: derivedSharedCurrDragIndex.value * SONG_HEIGHT,
            },
            [currentDragIndexItemKey]: {
              ...updatedPositions.value[currentDragIndexItemKey],
              updatedIndex: derivedSharedNewDragIndex.value,
            },
          };
          currentPositions.value = newPositions;

          //update new index as current index
          sharedCurrDragIndex.value = derivedSharedNewDragIndex.value;
        }
      }
    })
    .onEnd(e => {
      if (
        derivedSharedCurrDragIndex.value === null ||
        derivedSharedNewDragIndex.value === null
      ) {
        return;
      }

      //find original id of the item that currently resides at derivedSharedCurrDragIndex index
      const currentDragIndexItemKey = getKeyOfValue(
        derivedSharedCurrDragIndex.value,
        updatedPositions.value,
      );

      if (currentDragIndexItemKey !== undefined) {
        /*
        Here need to find out the items whose position has been changed because of drag, because after
        drag end, we should update originalTop & updatedTop of those items as next time 
        we want to start and do calculation from new top value
        Also as we already changed updatedIndex hence we can use that find out those items
        */
        const clonedUpdatedPositions = {...updatedPositions.value};
        Object.entries(updatedPositions.value).forEach(([key, value]) => {
          const {updatedIndex} = value;
          if (key !== updatedIndex.toString()) {
            //if position has been changed, update originalTop value based on updatedIndex
            clonedUpdatedPositions[key].originalTop =
              updatedIndex * SONG_HEIGHT;
            //if position has been changed, update updatedTop value based on updatedIndex
            clonedUpdatedPositions[key].updatedTop = updatedIndex * SONG_HEIGHT;
          }
        });

        const newPositions = {
          ...clonedUpdatedPositions,
          //now also update the values for item whose drag we just stopped
          [currentDragIndexItemKey]: {
            ...updatedPositions.value[currentDragIndexItemKey],
            updatedIndex: derivedSharedNewDragIndex.value,
            updatedTop: derivedSharedNewDragIndex.value * SONG_HEIGHT,
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
      top: updatedPositions.value[item.id].updatedTop,
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
