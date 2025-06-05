import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'react-native-image-picker'; // Нужно установить react-native-image-picker

const SettingsScreen = ({ visible, onClose, userData, onLogout, onUpdateUser }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(userData?.name || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [avatarUri, setAvatarUri] = useState(userData?.avatarUri || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // При открытии модалки обновляем локальный стейт из пропсов
    if (visible) {
      setName(userData.name);
      setEmail(userData.email);
      setAvatarUri(userData.avatarUri);
      setEditing(false);
    }
  }, [visible, userData]);

  const pickImage = () => {
    ImagePicker.launchImageLibrary(
      { mediaType: 'photo', quality: 0.7 },
      (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert('Ошибка', 'Не удалось выбрать изображение');
          return;
        }
        // В зависимости от версии picker, uri лежит в response.assets[0].uri
        if (response.assets && response.assets.length > 0) {
          setAvatarUri(response.assets[0].uri);
        }
      }
    );
  };

  const saveChanges = async () => {
    Alert.alert(
      'Подтвердите изменения',
      'Вы уверены, что хотите сохранить изменения?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Сохранить',
          onPress: async () => {
            setLoading(true);
            try {
              // Пример запроса — замени на свой API
              const token = await AsyncStorage.getItem('jwt_token');
              if (!token) {
                Alert.alert('Ошибка', 'Пользователь не авторизован');
                setLoading(false);
                return;
              }

              // Формируем данные для отправки
              const formData = new FormData();
              formData.append('name', name);
              formData.append('email', email);

              if (avatarUri && avatarUri.startsWith('file://')) {
                // Прикрепляем файл (зависит от платформы, возможно нужно убрать file://)
                const filename = avatarUri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image/jpeg';

                formData.append('avatar', {
                  uri: avatarUri,
                  name: filename,
                  type,
                });
              }

              const response = await axios.put(
                'https://your-api.com/user/profile', // твой эндпоинт
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                  },
                }
              );

              if (response.status === 201) {
                // В случае 201 делаем logout
                await AsyncStorage.removeItem('jwt_token');
                onLogout();
                return;
              }

              if (response.status === 200) {
                Alert.alert('Успех', 'Данные успешно сохранены');
                setEditing(false);
                // Обновляем данные пользователя в родителе
                onUpdateUser({
                  name,
                  email,
                  avatarUri,
                });
              } else {
                Alert.alert('Ошибка', 'Не удалось сохранить данные');
              }
            } catch (e) {
              console.error(e);
              Alert.alert('Ошибка', 'Произошла ошибка при сохранении');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const logout = async () => {
    await AsyncStorage.removeItem('jwt_token');
    onLogout();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Настройки профиля</Text>

          <View style={styles.avatarWrapper}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text>Нет фото</Text>
              </View>
            )}
            {editing && (
              <TouchableOpacity onPress={pickImage} style={styles.uploadBtn}>
                <Text style={styles.uploadBtnText}>Загрузить картинку</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Имя</Text>
            {editing ? (
              <TextInput
                value={name}
                onChangeText={setName}
                style={styles.input}
                autoCapitalize="words"
              />
            ) : (
              <Text style={styles.value}>{name}</Text>
            )}
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            {editing ? (
              <TextInput
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            ) : (
              <Text style={styles.value}>{email}</Text>
            )}
          </View>

          <View style={styles.buttonsRow}>
            {editing ? (
              <TouchableOpacity onPress={saveChanges} style={[styles.button, styles.saveBtn]}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Сохранить</Text>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setEditing(true)} style={[styles.button, styles.editBtn]}>
                <Text style={styles.buttonText}>Изменить</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={logout} style={[styles.button, styles.logoutBtn]}>
              <Text style={styles.buttonText}>Выйти</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onClose} style={[styles.button, styles.closeBtn]}>
              <Text style={styles.buttonText}>Закрыть</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  uploadBtn: {
    marginTop: 10,
    paddingHorizontal: 15,
    paddingVertical: 6,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  uploadBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  field: {
    marginBottom: 15,
  },
  label: {
    color: '#555',
    fontWeight: '600',
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  editBtn: {
    backgroundColor: '#007AFF',
  },
  saveBtn: {
    backgroundColor: '#28a745',
  },
  logoutBtn: {
    backgroundColor: '#dc3545',
  },
  closeBtn: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
