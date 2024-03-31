import {SharedValue} from 'react-native-reanimated';
import {TInitialPositions} from './constants';

export type TItem = {
  id: number;
  title: string;
  singer: string;
  imageSrc: string;
};

export type TListItem = {
  item: TItem;
  currentDragIndex: number;
  setCurrentDragIndex: (id: number) => void;
  currentPositions: SharedValue<TInitialPositions>;
  sharedCurrDragIndex: SharedValue<number>;
  sharedNewDragIndex: SharedValue<number>;
  isDragging: SharedValue<boolean>;
};
