import {SharedValue} from 'react-native-reanimated';

export type TItem = {
  id: number;
  title: string;
  singer: string;
  imageSrc: string;
};

export type TListItem = {
  item: TItem;
  currentDragIndex: NullableNumber;
  setCurrentDragIndex: (id: NullableNumber) => void;
  currentPositions: SharedValue<TInitialPositions>;
  sharedCurrDragIndex: SharedValue<NullableNumber>;
  sharedNewDragIndex: SharedValue<NullableNumber>;
  isDragging: SharedValue<boolean>;
};

export type TInitialPositions = {
  [key: number]: {
    updatedIndex: number;
    originalTop: number;
    updatedTopWhileDragging: number;
  };
};

export type NullableNumber = null | number;
