import {TInitialPositions} from './types';

export const SONG_HEIGHT = 80;
export const SONGS = [
  {
    id: 0,
    title: 'Hymn for the Weekend',
    singer: 'Coldplay',
    imageSrc:
      'https://i.scdn.co/image/ab67616d0000b2738ff7c3580d429c8212b9a3b6',
  },
  {
    id: 1,
    title: 'Paradise',
    singer: 'Coldplay',
    imageSrc:
      'https://i.scdn.co/image/ab67616d0000b273de0cd11d7b31c3bd1fd5983d',
  },
  {
    id: 2,
    title: 'Viva La Vida',
    singer: 'Coldplay',
    imageSrc: 'https://i.ytimg.com/vi/dvgZkm1xWPE/maxresdefault.jpg',
  },
  {
    id: 3,
    title: 'A Sky Full of Stars',
    singer: 'Coldplay',
    imageSrc:
      'https://i.scdn.co/image/ab67616d0000b273e5a95573f1b91234630fd2cf',
  },
  {
    id: 4,
    title: 'Clocks',
    singer: 'Coldplay',
    imageSrc:
      'https://i.scdn.co/image/ab67616d0000b273de09e02aa7febf30b7c02d82',
  },
  {
    id: 5,
    title: 'The Scientist',
    singer: 'Coldplay',
    imageSrc:
      'https://i.scdn.co/image/ab67616d0000b273de09e02aa7febf30b7c02d82',
  },
];

export const InitialPositions: TInitialPositions = {
  0: {
    updatedIndex: 0,
    originalTop: 0 * SONG_HEIGHT,
    updatedTopWhileDragging: 0 * SONG_HEIGHT,
  },
  1: {
    updatedIndex: 1,
    originalTop: 1 * SONG_HEIGHT,
    updatedTopWhileDragging: 1 * SONG_HEIGHT,
  },
  2: {
    updatedIndex: 2,
    originalTop: 2 * SONG_HEIGHT,
    updatedTopWhileDragging: 2 * SONG_HEIGHT,
  },
  3: {
    updatedIndex: 3,
    originalTop: 3 * SONG_HEIGHT,
    updatedTopWhileDragging: 3 * SONG_HEIGHT,
  },
  4: {
    updatedIndex: 4,
    originalTop: 4 * SONG_HEIGHT,
    updatedTopWhileDragging: 4 * SONG_HEIGHT,
  },
  5: {
    updatedIndex: 5,
    originalTop: 5 * SONG_HEIGHT,
    updatedTopWhileDragging: 5 * SONG_HEIGHT,
  },
};

export const Color_Pallete = {
  metal_black: '#0E0C0A',
  night_shadow: '#1C1C1C',
};

export const ANIMATION_DURATION = 600;
