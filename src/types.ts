import {SharedValue} from 'react-native-reanimated';

export type TItem = {
  id: number;
  title: string;
  singer: string;
  imageSrc: string;
};

export type TListItem = {
  item: TItem;
  currDragItemId: SharedValue<NullableNumber>;
  currentSongPositions: SharedValue<TSongPositions>;
  currentTopValues: SharedValue<TTopValues>;
  sharedCurrDragIndex: SharedValue<NullableNumber>;
  sharedNewDragIndex: SharedValue<NullableNumber>;
  isDragging: SharedValue<number>;
};

export type TSongPositions = {
  [key: number]: {
    updatedIndex: number;
    updatedTop: number;
  };
};

export type TTopValues = {
  [key: number]: number;
};

export type NullableNumber = null | number;
