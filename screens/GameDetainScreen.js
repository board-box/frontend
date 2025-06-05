import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Linking,
  Platform
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { BASE_URL } from '../config/config';
import theme from '../utils/style';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const GameDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { gameId } = route.params || {};

  const [game, setGame] = useState(null);      
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const COLLAPSED_NUMBER_OF_LINES = 3;

  const descriptionTextRef = useRef(null);

  useEffect(() => {
    fetchGameDetails();
  }, []);

  const fetchGameDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const resp = await axios.get(`${BASE_URL}/games/${gameId}`);
      setGame(resp.data);
      setTimeout(() => {
        measureDescriptionLines();
      }, 100);
    } catch (e) {
      console.warn('Ошибка при загрузке игры:', e);
      setError('Не удалось загрузить информацию об игре.');
    } finally {
      setLoading(false);
    }
  };

  const measureDescriptionLines = () => {
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleOpenRules = () => {
    if (game?.rulesPdfUrl) {
      Linking.openURL(game.rulesPdfUrl).catch(err =>
        console.warn('Не удалось открыть PDF:', err)
      );
    } else {
      console.warn('Ссылка на правила отсутствует.');
    }
  };

  const toggleDescription = () => {
    setDescriptionExpanded(prev => !prev);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.mainColors.blue} />
      </View>
    );
  }

  if (error || !game) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Данные не найдены.'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchGameDetails}>
          <Text style={styles.retryButtonText}>Попробовать ещё раз</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleOpenRules} style={styles.rulesButton}>
          <Text style={styles.rulesButtonText}>Правила</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{ uri: game.imageUrl }}
          style={styles.gameImage}
          resizeMode="contain"
        />


        <Text style={styles.title}>{game.title}</Text>

        <View style={styles.descriptionContainer}>
          <Text
            style={styles.descriptionText}
            numberOfLines={isDescriptionExpanded ? undefined : COLLAPSED_NUMBER_OF_LINES}
            onTextLayout={e => {
              const { lines } = e.nativeEvent;
              if (lines.length > COLLAPSED_NUMBER_OF_LINES && !showToggle) {
                setShowToggle(true);
              }
            }}
          >
            {game.description}
          </Text>

          {showToggle && (
            <TouchableOpacity onPress={toggleDescription} style={styles.toggleButton}>
              <Text style={styles.toggleButtonText}>
                {isDescriptionExpanded ? 'Свернуть' : '...'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Параметры игры */}
        <View style={styles.paramsContainer}>
          {/* Ниже приведён минимальный пример: 
              вы можете подставить сюда иконки через <Image source={...} /> или VectorIcons */}
          <View style={styles.paramRow}>
            <Text style={styles.paramLabel}>Игроки:</Text>
            <Text style={styles.paramValue}>{game.players}</Text>
          </View>
          <View style={styles.paramRow}>
            <Text style={styles.paramLabel}>Время:</Text>
            <Text style={styles.paramValue}>{game.time}</Text>
          </View>
          <View style={styles.paramRow}>
            <Text style={styles.paramLabel}>Возраст:</Text>
            <Text style={styles.paramValue}>{game.age}</Text>
          </View>
          <View style={styles.paramRow}>
            <Text style={styles.paramLabel}>Сложность:</Text>
            <Text style={styles.paramValue}>{game.difficulty}</Text>
          </View>
          <View style={styles.paramRow}>
            <Text style={styles.paramLabel}>Жанр:</Text>
            <Text style={styles.paramValue}>{game.genre}</Text>
          </View>
        </View>

        {/* Поскольку у вас внизу уже есть своё меню, 
            лишнего скролла и пустого места не создаём. */}
      </ScrollView>
    </View>
  );
};

export default GameDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.mainColors.lightBackground, 
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: theme.mainColors.red,
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: theme.mainColors.blue,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20, 
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  backButton: {
    padding: 8,
  },
  backArrow: {
    fontSize: 24,
    color: theme.mainColors.textDark,
  },
  rulesButton: {
    backgroundColor: theme.mainColors.blue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  rulesButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: theme.fonts.secondary.bold,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  gameImage: {
    width: SCREEN_WIDTH - 32,
    height: (SCREEN_WIDTH - 32) * 0.6, 
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 16,
  },

  title: {
    fontSize: 28,
    fontFamily: theme.fonts.main.bold,
    color: theme.mainColors.textDark,
    marginBottom: 12,
  },

  descriptionContainer: {
    backgroundColor: theme.mainColors.lightBlue,
    borderRadius: 12,
    padding: 12,
    position: 'relative',
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 22,
    color: theme.mainColors.textDark,
    fontFamily: theme.fonts.secondary.regular,
  },
  toggleButton: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  toggleButtonText: {
    fontSize: 14,
    color: theme.mainColors.blue,
    fontFamily: theme.fonts.secondary.bold,
  },

  paramsContainer: {
    marginBottom: 30,
  },
  paramRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  paramLabel: {
    fontSize: 16,
    fontFamily: theme.fonts.secondary.bold,
    color: theme.mainColors.textDark,
    width: 100, 
  },
  paramValue: {
    fontSize: 16,
    fontFamily: theme.fonts.secondary.regular,
    color: theme.mainColors.textDark,
    flexShrink: 1,
  },
});
