import {SharedValue} from 'react-native-reanimated';

export type TItem = {
  id: number;
  title: string;
  singer: string;
  imageSrc: string;
};

export type TListItem = {
  item: TItem;
  isDragging: SharedValue<number>;
  draggedItemId: SharedValue<NullableNumber>;
  currentSongPositions: SharedValue<TSongPositions>;
  currentTopValues: SharedValue<TTopValues>;
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
