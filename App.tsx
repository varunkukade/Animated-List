import 'react-native-gesture-handler';
import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const data = [
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
  ];

  const SONG_HEIGHT = 80;

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView style={{backgroundColor: '#0E0C0A'}}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <View style={{backgroundColor: '#0E0C0A', height: '100%'}}>
          {data.map(eachSong => (
            <View
              style={{
                height: SONG_HEIGHT,
                flexDirection: 'row',
                position: 'absolute',
                top: eachSong.id * SONG_HEIGHT,
              }}>
              <View
                style={{
                  height: SONG_HEIGHT,
                  width: '20%',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  padding: '3%',
                }}>
                <Image
                  source={{
                    uri: eachSong.imageSrc,
                  }}
                  height={SONG_HEIGHT - 20}
                  width={`${100 - 3}%`}
                  borderRadius={8}
                />
              </View>
              <View
                style={{
                  width: '60%',
                  justifyContent: 'space-evenly',
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: 'white',
                  }}>
                  {eachSong.title}
                </Text>
                <Text style={{color: 'grey'}}>{eachSong.singer}</Text>
              </View>
              <View
                style={{
                  width: '20%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <View
                  style={{
                    width: '30%',
                    height: 2,
                    backgroundColor: 'white',
                    marginBottom: 5,
                  }}
                />
                <View
                  style={{
                    width: '30%',
                    height: 2,
                    backgroundColor: 'white',
                    marginBottom: 5,
                  }}
                />
                <View
                  style={{width: '30%', height: 2, backgroundColor: 'white'}}
                />
              </View>
            </View>
          ))}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
