import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Animated,
  TextInput,
} from 'react-native';
import theme from '../utils/style';
import Modal from 'react-native-modal';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/config'; 

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CARD_WIDTH = SCREEN_WIDTH * 0.9;
const CARD_PADDING = 20; 


const SHELF_IMAGE = require('../assets/pic/shelf.jpeg');

const CollectionCard = ({ collection, onPinToggle, onEdit, onDelete }) => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(collection.title);

  const navigation = useNavigation();


  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const handlePinToggle = async () => {
    const token = await AsyncStorage.getItem('jwt_token');
    try {
      await axios.put(
        `${BASE_URL}/collections/${collection.id}`,
        { pinned: !collection.pinned },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onPinToggle(collection.id, !collection.pinned);
    } catch (error) {
      console.error('Ошибка при обновлении пин-статуса:', error);
    }
    setMenuVisible(false);
  };

  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt_token');
      await axios.delete(`${BASE_URL}/collections/${collection.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDelete(collection.id);
    } catch (error) {
      console.error('Ошибка при удалении коллекции:', error);
    }
    setMenuVisible(false);
  };

  const handleEdit = () => {
    setEditedTitle(collection.title);
    setIsEditing(true);
    setMenuVisible(false);
  };

  const handleSaveTitle = async () => {
    if (editedTitle.trim() === '') return;

    const token = await AsyncStorage.getItem('jwt_token');
    try {
      await axios.put(
        `${BASE_URL}/collections/${collection.id}`,
        { title: editedTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      collection.title = editedTitle; 
      setIsEditing(false);
    } catch (error) {
      console.error('Ошибка при обновлении названия:', error);
    }
  };

  const onMomentumScrollEnd = (ev) => {
    const offsetX = ev.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / BOX_ITEM_WIDTH);
    setActiveIndex(newIndex);
  };

  const [gameDetails, setGameDetails] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      if (!collection.game_ids || collection.game_ids.length === 0) return;

      const token = await AsyncStorage.getItem('jwt_token');
      try {
        const response = await axios.post(
          `${BASE_URL}/games/by-ids`,
          { ids: collection.game_ids },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error('Ошибка при загрузке игр:', error);
      }
    };

    // const fetchGames = async () => {
    //   return  [{ id: 'g1', title: 'Каркассон', boxImageUri: '', genre: "Семейные", age: "6+" },
    //     { id: 'g2', title: 'Каркассон', boxImageUri: '', genre: "Семейные", age: "6+" },
    //     { id: 'g3', title: 'Каркассон', boxImageUri: '', genre: "Семейные", age: "6+" },]
    // };

    fetchGames().then(setGameDetails);
  }, [collection.game_ids]);

  const BASE_BOX_WIDTH = 80;
  const BASE_BOX_HEIGHT = 100;
  const FOCUSED_BOX_WIDTH = 100;
  const FOCUSED_BOX_HEIGHT = 120;
  const BOX_ITEM_WIDTH = FOCUSED_BOX_WIDTH + 20; 

  const renderBoxItem = ({ item, index }) => {
    const isFocused = index === activeIndex;
    const imageSource = item.boxImageUri
      ? { uri: item.boxImageUri }
      : require('../assets/pic/placeholder_image.png'); 

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('GameDetail', { gameId: item.id })}
        activeOpacity={0.8}
        style={styles.boxItem}
      >
        <View style={{ width: BOX_ITEM_WIDTH, justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={imageSource}
            style={{
              width: isFocused ? FOCUSED_BOX_WIDTH : BASE_BOX_WIDTH,
              height: isFocused ? FOCUSED_BOX_HEIGHT : BASE_BOX_HEIGHT,
              resizeMode: 'contain',
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
  <>
    <View style={styles.cardWrapper}>
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          {collection.pinned && (
            <View style={styles.pinnedBadge}>
              <Image
                source={require('../assets/pic/pin.png')}
                style={styles.centralIcon}
                resizeMode="contain"
              />
            </View>
          )}
          {isEditing ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', flexShrink: 1 }}>
              <TextInput
                style={[styles.collectionTitle, { borderBottomWidth: 1, marginRight: 10 }]}
                value={editedTitle}
                onChangeText={setEditedTitle}
                autoFocus
              />
              <TouchableOpacity onPress={handleSaveTitle}>
                <Text style={{ color: '#007AFF', fontSize: 16 }}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.collectionTitle}>{collection.title}</Text>
          )}

        </View>

        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Image
            source={require('../assets/pic/dots.png')}
            style={styles.centralIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.shelfContainer}>
        <Image source={SHELF_IMAGE} style={styles.shelfImage} resizeMode="stretch" />

        <Animated.FlatList
          ref={flatListRef}
          data={gameDetails}
          keyExtractor={(item) => item.id}
          renderItem={renderBoxItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={BOX_ITEM_WIDTH}
          decelerationRate="fast"
          onMomentumScrollEnd={onMomentumScrollEnd}
          contentContainerStyle={{
            paddingHorizontal: (CARD_WIDTH - BOX_ITEM_WIDTH) / 2 - CARD_PADDING,
          }}
          style={styles.boxList}
        />
      </View>
    </View>
    <Modal
      isVisible={isMenuVisible}
      onBackdropPress={toggleMenu}
      backdropOpacity={0.3}
      style={{ justifyContent: 'flex-end', margin: 0 }}>
      <View style={styles.modalMenu}>
        <TouchableOpacity onPress={handlePinToggle} style={styles.menuItem}>
          <Text style={styles.menuText}>
            {collection.pinned ? 'Открепить' : 'Закрепить'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleEdit} style={styles.menuItem}>
          <Text style={styles.menuText}>Редактировать</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDelete} style={styles.menuItem}>
          <Text style={[styles.menuText, { color: 'red' }]}>Удалить</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuItem}>
          <Text style={styles.menuText}>Отмена</Text>
        </TouchableOpacity>
      </View>
    </Modal>
    </>
  );
};

export default CollectionCard;

const styles = StyleSheet.create({
  cardWrapper: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    alignSelf: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,

    paddingVertical: 15,
    paddingHorizontal: CARD_PADDING,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1, 
  },
  pinnedText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#007AFF',
  },
  collectionTitle: {
    fontFamily: theme.fonts.secondary.regular,
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    flexShrink: 1,
  },
  menuButton: {
    padding: 4,
  },

  shelfContainer: {
    width: '100%',
    height: 140,
    marginTop: 5,
  },
  shelfImage: {
    position: 'absolute',
    width: '100%',
    height: 140,
    bottom: 0, 
  },
  boxList: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 140,
  },
  modalMenu: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: 30,
    paddingTop: 10,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuText: {
    fontSize: 18,
    color: '#1A1A1A',
    fontFamily: theme.fonts.secondary.regular,
  },
});
