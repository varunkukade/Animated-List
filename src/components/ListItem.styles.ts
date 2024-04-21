import {StyleSheet} from 'react-native';
import {Color_Pallete, SONG_HEIGHT} from '../constants';

export const styles = StyleSheet.create({
  itemContainer: {
    height: SONG_HEIGHT,
    flexDirection: 'row',
    position: 'absolute',
  },
  imageContainer: {
    height: SONG_HEIGHT,
    width: '20%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: '3%',
  },
  descriptionContainer: {
    width: '60%',
    justifyContent: 'space-evenly',
  },
  description1: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color_Pallete.crystal_white,
  },
  description2: {color: Color_Pallete.silver_storm},
  draggerContainer: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  marginBottom: {
    marginBottom: 5,
  },
  dragger: {
    width: '30%',
    height: 2,
    backgroundColor: Color_Pallete.crystal_white,
  },
  image: {
    height: SONG_HEIGHT - 20,
    width: '97%',
  },
});
