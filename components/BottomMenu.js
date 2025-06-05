import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import theme from '../utils/style';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ACTIVE_COLOR = '#FF8C55';  
const INACTIVE_COLOR = '#333333'; 
const BLUE_BUTTON_COLOR = theme.secondaryColors.blue; 

const BottomMenu = ({ current }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.wrapper}>
      <View style={styles.bottomBar} />

      <TouchableOpacity
        style={[styles.iconButton, { left: SCREEN_WIDTH * 0.15 - ICON_SIZE / 2 }]}
        onPress={() => navigation.navigate('Profile')}
        activeOpacity={0.7}
      >
        <Image
          source={require('../assets/pic/heart.png')}
          style={[
            styles.iconImage,
            { tintColor: current === 'Profile' ? ACTIVE_COLOR : INACTIVE_COLOR },
          ]}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {current === 'Chat'?
        ( <View/>
        ) : (
        <TouchableOpacity
          style={styles.centralButton}
          onPress={() => navigation.navigate('Chat')}
          activeOpacity={0.8}
        >
          <Image
            source={require('../assets/pic/chat.png')}
            style={styles.centralIcon}
            resizeMode="contain"
          />
        </TouchableOpacity> )
      }

      <TouchableOpacity
        style={[styles.iconButton, { right: SCREEN_WIDTH * 0.15 - ICON_SIZE / 2 }]}
        //onPress={() => navigation.navigate('Search')}
        activeOpacity={0.7}
      >
        <Image
          source={require('../assets/pic/search.png')}
          style={[
            styles.iconImage,
            //{ tintColor: current === 'Search' ? ACTIVE_COLOR : INACTIVE_COLOR },
          ]}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

export default BottomMenu;


const ICON_SIZE = 35;
const CENTRAL_BUTTON_SIZE = 100;
const BOTTOM_BAR_HEIGHT = 80;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: BOTTOM_BAR_HEIGHT + 20 + CENTRAL_BUTTON_SIZE / 2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: BOTTOM_BAR_HEIGHT,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 15,
  },
  iconButton: {
    position: 'absolute',
    bottom: 35, 
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  iconImage: {
    width: '100%',
    height: '100%',
  },
  centralButton: {
    position: 'absolute',
    bottom: BOTTOM_BAR_HEIGHT - CENTRAL_BUTTON_SIZE / 2 + 10,
    left: (SCREEN_WIDTH - CENTRAL_BUTTON_SIZE) / 2,
    width: CENTRAL_BUTTON_SIZE,
    height: CENTRAL_BUTTON_SIZE,
    borderRadius: CENTRAL_BUTTON_SIZE / 2,
    backgroundColor: BLUE_BUTTON_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  centralIcon: {
    width: 50,
    height: 50,
    tintColor: '#FFF',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFF', 
    alignSelf: 'center',
    marginBottom: 8, 
  },
});
