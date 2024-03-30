import React from 'react';
import {Image, Text, View} from 'react-native';

export const SONG_HEIGHT = 50;
export const AnimatedList = () => {
  const data = [
    {
      title: 'Hymn for the Weekend',
      singer: 'Coldplay',
      imageSrc: require('../asstes/images/hymnForWeekend.jpeg'),
    },
    {
      title: 'Paradise',
      singer: 'Coldplay',
      imageSrc: require('../asstes/images/paradise.jpeg'),
    },
    {
      title: 'Viva La Vida',
      singer: 'Coldplay',
      imageSrc: require('../asstes/images/vivaLaVida.jpeg'),
    },
  ];

  return (
    <View style={{flex: 1, backgroundColor: 'red'}}>
      <Text>Hi</Text>
      {data.map(eachSong => (
        <View style={{flex: 1, height: SONG_HEIGHT}}>
          {/* <View
        style={{
          width: '20%',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        <Image source={eachSong.imageSrc} resizeMode="contain" />
      </View> */}
          <View style={{width: '60%'}}>
            <Text>{eachSong.title}</Text>
            <Text>{eachSong.singer}</Text>
          </View>
          <View style={{width: '20%'}}></View>
        </View>
      ))}
    </View>
  );
};
