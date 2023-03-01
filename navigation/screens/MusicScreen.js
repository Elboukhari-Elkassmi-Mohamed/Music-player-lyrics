import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
import RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';

const MusicListScreen = () => {
  const [musicFiles, setMusicFiles] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const requestStoragePermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Music Player App Storage Permission',
            message:
              'Music Player App needs access to your storage ' +
              'so you can play music files.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Storage permission granted.');

          // Use ExternalDirectoryPath for Android 10 and higher
          const songs = [];
          const path = `${RNFS.ExternalStorageDirectoryPath}/Music/`;
          const files = await RNFS.readDir(path);

          files.forEach((file, index) => {
            songs.push({
              id: index,
              title: file.name.split('-')[1] || file.name.split('.')[0],
              url: file.path,
              artist: file.name.split('-')[0] || file.name.split('.')[0],
              artwork: 'kkkd',
            });
          });

          setMusicFiles(songs);
        } else {
          console.log('Storage permission denied.');
        }
      } catch (error) {
        console.log('Error requesting storage permission:', error);
      }
    };
    requestStoragePermission();
  }, []);

  const playSound = (fileid) => {
    // Navigate to MusicPlayerScreen with selected song info
    navigation.navigate('MusicPlayer', { fileid, musicFiles });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {musicFiles.map((file) => (
          <TouchableOpacity
            key={file.id}
            onPress={() => playSound(file.id)}
            style={styles.songContainer}
          >
            <Text style={styles.songTitle}>{file.title}</Text>
            <Text style={styles.songArtist}>{file.artist}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  songContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
  },
  songTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  songArtist: {
    fontSize: 14,
    color: '#FFD369',
  },
});

export default MusicListScreen;
