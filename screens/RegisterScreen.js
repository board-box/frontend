import React, { useEffect, useState } from 'react';
import {
  SafeAreaView, View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Platform, Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Dimensions } from 'react-native';
import theme from '../utils/style';
import { BASE_URL } from '../config/config';

const RegistrationScreen = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Ошибка', 'Пароли не совпадают.');
      return;
    }

    try {
      const response = await axios.post('${BASE_URL}/user/register', {
        username,
        email,
        password,
      });

      Alert.alert('Успех', 'Регистрация прошла успешно!', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      console.error('Ошибка регистрации:', error.response?.data || error.message);
      Alert.alert('Ошибка', error.response?.data?.message || 'Не удалось зарегистрироваться.');
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
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
      <View style={styles.background} />

      <Image
        source={require('../assets/pic/Ellipse_234.png')}
        style={[styles.ellipseImage, scaleStyle({ top: 100, left: -10, width: 170, height: 348 })]}
      />
      <Image
        source={require('../assets/pic/Ellipse_235.png')}
        style={[styles.ellipseImage, scaleStyle({ bottom: 0, right: -10, width: 213, height: 192 })]}
      />
      <Image
        source={require('../assets/pic/Ellipse_236.png')}
        style={[styles.ellipseImage, scaleStyle({ top: 0, left: -10, width: 214, height: 258 })]}
      />
      <Image
        source={require('../assets/pic/Ellipse_237.png')}
        style={[styles.ellipseImage, scaleStyle({ top: 50, right: 40, width: 293, height: 348 })]}
      />
      <Image
        source={require('../assets/pic/Ellipse_238.png')}
        style={[styles.ellipseImage, scaleStyle({ bottom: 32, left: 50, width: 305, height: 342 })]}
      />
      <Image
        source={require('../assets/pic/Ellipse_239.png')}
        style={[styles.ellipseImage, scaleStyle({ bottom: 0, left: -10, width: 179, height: 242 })]}
      />
      <Image
        source={require('../assets/pic/Ellipse_240.png')}
        style={[styles.ellipseImage, scaleStyle({ top: 0, right: -10, width: 205, height: 272 })]}
      />
      <Image
        source={require('../assets/pic/dice.png')}
        style={[styles.dice, styles.dice1]}
      />
      <Image
        source={require('../assets/pic/pawn.png')}
        style={[styles.pawn, styles.pawn1]}
      />
      <Image
        source={require('../assets/pic/dice.png')}
        style={[styles.dice, styles.dice2]}
      />
      <Image
        source={require('../assets/pic/pawn.png')}
        style={[styles.pawn, styles.pawn2]}
      />
      <Image
        source={require('../assets/pic/dice.png')}
        style={[styles.dice, styles.dice3]}
      />
      <Image
        source={require('../assets/pic/pawn.png')}
        style={[styles.pawn, styles.pawn3]}
      />

      <View style={styles.card}>
        <Text style={[styles.title, { fontFamily: theme.fonts.main.bold }]}>Регистрация</Text>

        <View style={styles.inputContainer}>
          <Image source={require('../assets/pic/user.png')} style={styles.inputIcon} resizeMode="contain" />
          <TextInput
            style={[styles.textInput, { fontFamily: theme.fonts.secondary.regular }]}
            placeholder="Логин"
            placeholderTextColor="#888"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputContainer}>
          <Image source={require('../assets/pic/email.png')} style={styles.inputIcon} resizeMode="contain" />
          <TextInput
            style={[styles.textInput, { fontFamily: theme.fonts.secondary.regular }]}
            placeholder="Эл. почта"
            placeholderTextColor="#888"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Image source={require('../assets/pic/lock.png')} style={styles.inputIcon} resizeMode="contain" />
          <TextInput
            style={[styles.textInput, { fontFamily: theme.fonts.secondary.regular }]}
            placeholder="Пароль"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.inputContainer}>
          <Image source={require('../assets/pic/lock.png')} style={styles.inputIcon} resizeMode="contain" />
          <TextInput
            style={[styles.textInput, { fontFamily: theme.fonts.secondary.regular }]}
            placeholder="Повторите пароль"
            placeholderTextColor="#888"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <TouchableOpacity style={[styles.button, theme.grayButton.button]} onPress={handleRegister}>
          <Text style={[styles.buttonText, { fontFamily: theme.fonts.secondary.regular }]}>Зарегистрироваться</Text>
        </TouchableOpacity>

        <View style={styles.separator} />

        <View style={styles.registerContainer}>
          <Text style={[styles.registerText, { fontFamily: theme.fonts.secondary.regular }]}>Уже зарегистрированы? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.registerLink, { fontFamily: theme.fonts.secondary.bold }]}>Войти</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.mainColors.lightBlue,
  },
  dice: {
    position: 'absolute',
    height: 138,
    width: 138,
  },
  pawn: {
    position: 'absolute',
    height: 133,
    width: 133,
  },
  dice1: {
    transform: [{ rotate: '27deg' }],
    top: 20,
    left: 20,
  },
  pawn1: {
    transform: [{ rotate: '-126deg' }],
    top: 70,
    right: 20,
  },
  dice2: {
    transform: [{ rotate: '154deg' }],
    top: Dimensions.get('window').height/2 + 100,
    right: -70,
  },
  pawn2: {
    transform: [{ rotate: '30deg' }],
    top: Dimensions.get('window').height/2 - 100,
    left: -70,
  },
  dice3: {
    transform: [{ rotate: '-40deg' }],
    bottom: -60,
    left: -30,
  },
  pawn3: {
    transform: [{ rotate: '-40deg' }],
    bottom: 20,
    right: 70,
  },

  card: {
    position: 'absolute',
    top: '20%',
    left: 20,
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 30,
    paddingTop: 43,
    paddingBottom: 20,
    paddingHorizontal: 20,

  },

  title: {
    fontSize: 40,
    marginBottom: 25,
    alignSelf: 'left',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 30,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 39,

    ...Platform.select({
      ios: {
        shadowColor: '#064151',
        shadowOpacity: 0.28,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 30,
      },
      android: {
        elevation: 10,
      },
    }),
  },

  inputIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    tintColor: '#555',
  },

  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    padding: 0, 
  },

  button: {
    backgroundColor: '#E0E0E0',
    borderRadius: 30,
    height: 39,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 13,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },

  separator: {
    height: 3,
    backgroundColor: '#DDD',
    marginVertical: 15,
  },

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerText: {
    fontSize: 18,
    color: '#555',
  },
  registerLink: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  ellipseImage: {
    position: 'absolute',
    opacity: 1,
    resizeMode: 'contain',
  },
});
