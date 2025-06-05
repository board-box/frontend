import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  SafeAreaView,
  FlatList,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/config';
import BottomMenu from '../components/BottomMenu'; 
import LogoText from '../components/LogoText';


const MessageBubble = ({ text, isOwn }) => (
  <View style={[styles.bubbleContainer, isOwn ? styles.ownBubble : styles.otherBubble]}>
    <Text style={styles.bubbleText}>{text}</Text>
  </View>
);

const ChatInput = ({ value, onChangeText, onSubmit }) => (
  <View style={styles.inputWrapper}>
    <TextInput
      style={styles.textInput}
      value={value}
      placeholder="Спросите что-нибудь..."
      placeholderTextColor="#999"
      onChangeText={onChangeText}
      onSubmitEditing={onSubmit}
      returnKeyType="send"
      blurOnSubmit={false}
    />
  </View>
);

export default function ChatScreen() {
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([]);
  const flatListRef = useRef(null);

  const sendMessage = useCallback(async () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const userMessage = {
      id: Date.now().toString(),
      text: trimmed,
      isOwn: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('Token not found');
      }

      const response = await fetch(`${BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }

      const data = await response.json();

      // Если backend вернул массив сообщений (история), отобразим их
      const botMessage = data.history?.at(-1);
      if (botMessage) {
        const botMsg = {
          id: Date.now().toString() + '_bot',
          text: botMessage,
          isOwn: false,
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
    }

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [inputText]);

  const renderItem = ({ item }) => (
    <MessageBubble text={item.text} isOwn={item.isOwn} />
  );

  return (
  <>
    <LinearGradient
      colors={['#003F57', '#0089BD']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <LogoText textStyle ={{fontSize: 30}}/>
        </View>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.select({ ios: 'padding', android: undefined })}
        >
          <View style={styles.borderWrapper}>
            <View style={styles.innerContainer}>
              <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                style={{ flex: 1 }}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => {
                  flatListRef.current?.scrollToEnd({ animated: false });
                }}
              />
              <ChatInput
                value={inputText}
                onChangeText={setInputText}
                onSubmit={sendMessage}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
    <BottomMenu current="Chat"/>
    </>
  );
}

const INPUT_HEIGHT = 58;
const BOTTOM_OFFSET = 10;

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    paddingBottom: 80,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  borderWrapper: {
    flex: 1,
    paddingHorizontal: 8,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderColor: '#FFF',
  },
  innerContainer: {
    flex: 1,
    position: 'relative',
  },
  messagesList: {
    padding: 12,
    paddingBottom: INPUT_HEIGHT + BOTTOM_OFFSET + 8,
  },
  bubbleContainer: {
    maxWidth: '80%',
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  ownBubble: {
    backgroundColor: '#FFF',
    alignSelf: 'flex-end',
  },
  otherBubble: {
    backgroundColor: '#AEE9FF',
    alignSelf: 'flex-start',
  },
  bubbleText: {
    fontSize: 16,
    color: '#000',
  },
  inputWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: BOTTOM_OFFSET,
    height: INPUT_HEIGHT,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'transparent',
    zIndex: 1,
    elevation: 1,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 25,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#000',
  },
  header: {
    height: 100,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
  },
});