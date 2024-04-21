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
  songsHeight: TSongsHeight;
  updateTotalHeight: (id: number, height: number) => void;
};

export type TSongPositions = {
  [key: number]: {
    updatedIndex: number;
    updatedTop: number;
    updatedTopWhileDragging: number;
  };
};

export type TSongsHeight = {
  [key: number]: number;
};

export type NullableNumber = null | number;
