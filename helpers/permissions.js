import RNFS from 'react-native-fs';

export default requestStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Music Player App Storage Permission',
          message: 'Music Player App needs access to your storage ' +
            'so you can play music files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission granted.');

        // Use ExternalDirectoryPath for Android 10 and higher
        const path = RNFS.ExternalStorageDirectoryPath + '/Music';

        // Check if the Music directory exists
        const musicDirExists = await RNFS.exists(path);
        if (!musicDirExists) {
          // Create the Music directory if it doesn't exist
          await RNFS.mkdir(path);
        }

        // Read the files in the Music directory
        const files = await RNFS.readDir(path);

        // Filter the files to only include audio files
        const audioFiles = files.filter(file => file.isFile() && file.name.endsWith('.mp3'));
        setMusicFiles(audioFiles);
      } else {
        console.log('Storage permission denied.');
      }
    } catch (error) {
      console.log('Error requesting storage permission:', error);
    }
  };