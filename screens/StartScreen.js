import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import theme from '../utils/style';
import Svg, { Polygon } from 'react-native-svg';
import { Dimensions } from 'react-native';
import LogoText from '../components/LogoText';


const StartScreen = () => {
  const navigation = useNavigation();

  const handleNext = () => {
    navigation.navigate('Login'); // замените на нужный экран
  };

  const { width: screenWidth } = Dimensions.get('window');

  const trianglePoints = () => {
    const scale = screenWidth / 375;

    const p1 = { x: 0, y: 0 * scale };
    const p2 = { x: 211 * scale, y: 76 * scale };
    const p3 = { x: 375 * scale, y: 0 * scale };

    return `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;
  };

  const DESIGN_WIDTH = 375;
  const DESIGN_HEIGHT = 812;

  const scaleX = Dimensions.get('window').width / DESIGN_WIDTH;
  const scaleY = Dimensions.get('window').height / DESIGN_HEIGHT;

  const scaleStyle = (style) => {
    const scaled = {};
    for (const key in style) {
      if (['top', 'left', 'right', 'bottom', 'width', 'height'].includes(key)) {
        scaled[key] = style[key] * (key === 'left' || key === 'right' || key === 'width' ? scaleX : scaleY);
      } else {
        scaled[key] = style[key];
      }
    }
    return scaled;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <View style={[styles.background, {height: screenWidth -90}]}>
          <View style={styles.orangeBackground} />
          <Svg height={90} width={screenWidth} style = {styles.triangle}>
            <Polygon
              points={trianglePoints()}
              fill={theme.mainColors.orange} 
            />
          </Svg>
          <View style={[styles.ellipsesWrapper, {height: screenWidth}]} pointerEvents="none">
            <Image
              source={require('../assets/pic/Ellipse_231.png')}
              style={[styles.ellipseImage, scaleStyle({ top: 0, left: 0, width: 187, height: 145 })]}
            />
            <Image
              source={require('../assets/pic/Ellipse_230.png')}
              style={[styles.ellipseImage, scaleStyle({ top: 67, left: 280, width: 155, height: 375 })]}
            />
            <Image
              source={require('../assets/pic/Ellipse_233.png')}
              style={[styles.ellipseImage, scaleStyle({ top: 200, right: 74, width: 312, height: 304 })]}
            />
            <Image
              source={require('../assets/pic/Ellipse_229.png')}
              style={[styles.ellipseImage, scaleStyle({ top: 218, left: 0, width: 205, height: 304 })]}
            />
            <Image
              source={require('../assets/pic/Ellipse_232.png')}
              style={[styles.ellipseImage, scaleStyle({ top: 25, right: 22, width: 274, height: 269 })]}
            />
          </View>
        </View>
        <Image
          source={require('../assets/pic/box.png')}
          style={[styles.image, {width: screenWidth, height: screenWidth }]}
          resizeMode="cover"
        />
      </View>

      <View style={styles.bottomSection}>
        <Svg
          height={300}
          width={screenWidth}
          style={styles.bottomCutout}>
          <Polygon
            fill={theme.mainColors.background || '#fff'} 
            fillRule="evenodd"
            points={`0,0 ${screenWidth},0 ${screenWidth},300 ${0},300 0,0 
                     ${211 * scaleX},76 ${375 * scaleX},0 0,0`}
          />
        </Svg>
        <LogoText style={styles.title} textStyle={{fontSize: 46, fontFamily: theme.fonts.main.bold}}/>
        <Text style={[styles.subtitle, {fontFamily: theme.fonts.secondary.italic}]}>
          Ваши любимые <Text style={{color: theme.mainColors.lightBlue}}>игры</Text> в <Text style={{color: theme.mainColors.orange}}>одном</Text> месте
        </Text>

        <TouchableOpacity onPress={handleNext} style={[theme.grayButton.button, styles.button]}>
          <Text style={styles.buttonText}>➜</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

export default StartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topSection: {
    position: 'relative',
    overflow: 'visible',
    zIndex: 1,
  },
  orangeBackground: {
    overflow: 'visible',
  },
  orangeBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.mainColors.orange,
    zIndex: 1,
  },
  ellipsesWrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
  },
  triangle: {
    position: 'absolute',
    bottom: -90,
    left: 0,
    zIndex: 1, 
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 3,
  },
  bottomSection: {
    flex: 1,
    zIndex: 4, 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    marginBottom: 85,
    zIndex: 5,
  },
  subtitle: {
    fontSize: 24,
    color: '#444',
    textAlign: 'center',
    marginBottom: 43,
    zIndex: 5,
  },
  button: {
    width: 66,
    height: 66,
    padding: 22,
    marginBottom: 60,
    borderRadius: 15,
    zIndex: 5,
  },
  buttonText: {
    fontSize: 18,
  },
  ellipseImage: {
    position: 'absolute',
    opacity: 1,
    resizeMode: 'contain',
  },
  bottomCutout: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 5,
  },
});