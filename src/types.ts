import {SharedValue} from 'react-native-reanimated';

export type TItem = {
  id: number;
  title: string;
  singer: string;
  imageSrc: string;
};

export type TListItem = {
  item: TItem;
  setCurrentDragIndex: React.Dispatch<React.SetStateAction<number>>;
  currentDragIndex: number | null;
  currentPositions: SharedValue<{
    [key: number]: number;
  }>;
};
