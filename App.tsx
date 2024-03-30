import 'react-native-gesture-handler';
import React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {AnimatedList} from './src/screens/AnimatedList';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaView style={{backgroundColor: '#0E0C0A'}}>
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <AnimatedList />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

export default App;
