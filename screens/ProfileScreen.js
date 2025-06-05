import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Svg, { Polygon } from 'react-native-svg';

import { useNavigation } from '@react-navigation/native';
import CollectionCard from '../components/CollectionCard'; 
import BottomMenu from '../components/BottomMenu'; 
import SettingsScreen from '../components/SettingsScreen'; 
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config/config'; 
import theme from '../utils/style';
import LinearGradient from 'react-native-linear-gradient';


const fetchUserData = async () => {
  return {
    name: 'Иван Петрович Иванов',  
    avatarUri: '',                  
  };
};

// const fetchUserCollections = async () => {
//   const token = await AsyncStorage.getItem('jwt_token');
//   if (!token) throw new Error('Пользователь не авторизован');

//   const collectionsResp = await axios.get(`${BASE_URL}/collections`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   const collections = collectionsResp.data;

//   const allGameIds = Array.from(
//     new Set(collections.flatMap((col) => col.game_ids))
//   );

//   let gamesMap = {};
//   if (allGameIds.length > 0) {
//     const gamesResp = await axios.post(
//       `${BASE_URL}/games/by-ids`,
//       { ids: allGameIds },
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     gamesMap = Object.fromEntries(
//       gamesResp.data.map((game) => [game.id, game])
//     );
//   }

//   return collections.map((col) => ({
//     id: col.id.toString(),
//     title: col.name,
//     pinned: col.pinned,
//     games: col.game_ids.map((id) => ({
//       id: id.toString(),
//       title: gamesMap[id]?.title || '???',
//       boxImageUri: gamesMap[id]?.image || '',
//     })),
//   }));
// };

const fetchUserCollections = async () => {
  return [
    {
      id: 'col1',
      title: 'Для компании',
      pinned: true,
      games: [
        { id: 'g1', title: 'Каркассон', boxImageUri: '' },
        { id: 'g2', title: 'Колонизаторы', boxImageUri: '' },
        { id: 'g3', title: '7 чудес', boxImageUri: '' },
      ],
    },
    {
      id: 'col2',
      title: 'Для двоих',
      pinned: false,
      games: [
        { id: 'g4', title: 'Дуэль', boxImageUri: '' },
        { id: 'g5', title: 'Пэчворк', boxImageUri: '' },
      ],
    },
  ];
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ProfileScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = () => {
    navigation.replace('Login');
  };

  const handleUpdateUser = (newData) => {
    setUser(newData);
  };

  const navigation = useNavigation(); 

  const [user, setUser] = useState(null);            
  const [collections, setCollections] = useState([]);   
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const userData = await fetchUserData();
        const cols = await fetchUserCollections();
        setUser(userData);
        setCollections(cols);
      } catch (e) {
        console.error('Ошибка при загрузке данных профиля:', e);
        Alert.alert('Ошибка', 'Не удалось загрузить данные. Попробуйте позже.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  return (  
    <SafeAreaView style={styles.container}>
      <LinearGradient
          colors={['#AEE9FF', '#0089BD']} 
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.header}
        >
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setModalVisible(true)}
        >
          <Image
            source={require('../assets/pic/settings.png')}
            style={styles.settingsIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <SettingsScreen
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        userData={user}
        onLogout={handleLogout}
        onUpdateUser={handleUpdateUser}
        />

        <View style={styles.avatarWrapper}>
          {user.avatarUri ? (
            <Image
              source={{ uri: user.avatarUri }}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          ) : (
            <Image
              source={require('../assets/pic/placeholder.png')}
              style={styles.avatarImage}
              resizeMode="cover"
            />
          )}
        </View>

        <Text style={[styles.greetingText, {fontFamily: theme.fonts.main.italic}]} numberOfLines={2} ellipsizeMode="tail">
          {`Привет, ${user.name}!`}
        </Text>
      </LinearGradient>

      <View style={styles.collectionsContainer}>
        <View style={styles.collectionsHeader}>
          <Text style={[styles.collectionsTitle, {fontFamily: theme.fonts.main.bold}]}>Мои коллекции</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              // navigation.navigate('CreateCollectionScreen');
            }}
          >
            <Image
              source={require('../assets/pic/add.png')}
              style={styles.addIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {collections.length === 0 ? (
          <View style={styles.noCollectionsWrapper}>
            <Text style={styles.noCollectionsText}>У вас пока нет ни одной коллекции.</Text>
          </View>
        ) : (
          <FlatList
            data={collections}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <CollectionCard
                collection={item}
                onPinToggle={(colId, newPinned) => {
                  // setCollections((prev) =>
                  //   prev.map((c) =>
                  //     c.id === colId ? { ...c, pinned: newPinned } : c
                  //   )
                  // );
                }}
                onEdit={(colId) => {
                  // navigation.navigate('EditCollectionScreen', { collectionId: colId });
                }}
                // onDelete={(colId) => {
                //   Alert.alert(
                //     'Удалить коллекцию?',
                //     'Вы уверены, что хотите удалить эту коллекцию навсегда?',
                //     [
                //       { text: 'Отмена', style: 'cancel' },
                //       {
                //         text: 'Удалить',
                //         style: 'destructive',
                //         onPress: async () => {
                //           try {
                //             const token = await AsyncStorage.getItem('jwt_token');
                //             await axios.delete(`${BASE_URL}/collections/${colId}`, {
                //               headers: { Authorization: `Bearer ${token}` },
                //             });
                //             setCollections((prev) => prev.filter((c) => c.id !== colId));
                //           } catch (error) {
                //             Alert.alert('Ошибка', 'Не удалось удалить коллекцию');
                //           }
                //         },
                //       },
                //     ]
                //   );
                // }}

                onDelete={(colId) => {
                  Alert.alert(
                    'Удалить коллекцию?',
                    'Вы уверены, что хотите удалить эту коллекцию навсегда?',
                    [
                      { text: 'Отмена', style: 'cancel' },
                      {
                        text: 'Удалить',
                        style: 'destructive',
                        onPress: () => {
                          // Просто удалим из стейта
                          setCollections((prev) => prev.filter((c) => c.id !== colId));
                        },
                      },
                    ]
                  );
                }}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.collectionsListContent}
          />
        )}
      </View>

      <BottomMenu current="Profile" onNavigate={navigation} />
    </SafeAreaView>
  );
};

export default ProfileScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.mainColors.lightBlue, 
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: '#4CB3FF', 
    alignItems: 'center',
    height: 275,
  },
  settingsButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    width: 30,
    height: 30,
  },
  settingsIcon: {
    width: '100%',
    height: '100%',
    tintColor: theme.mainColors.blue, 
  },
  avatarWrapper: {
    marginTop: 65,
    width: 83,
    height: 83,
    borderRadius: 50,
    backgroundColor: '#FFF',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 4, 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  greetingText: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
  },
  collectionsContainer: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 80,
    backgroundColor: '#fff',
  },
  collectionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  collectionsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.mainColors.blue,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: theme.secondaryColors.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
  },

  noCollectionsWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noCollectionsText: {
    fontSize: 16,
    color: '#777',
  },
  collectionsListContent: {
    paddingBottom: 30,
  },
});
