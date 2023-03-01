import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import TrackPlayer, {
  Event,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import  { getLyrics } from '../../helpers/Lyrics'

const togglePlayBack = async (playBackState, setIsPlaying) => {
  const currentTrack = await TrackPlayer.getCurrentTrack();
  console.log(currentTrack, playBackState, State.Playing);
  if (currentTrack != null) {
    if (playBackState === State.Paused) {
      await TrackPlayer.play();
      setIsPlaying(true);
    } else if (playBackState === State.Playing) {
      await TrackPlayer.pause();
      setIsPlaying(false);
    } else if (playBackState === State.None) {
      await TrackPlayer.play();
      setIsPlaying(true);
    }
  }
};

const MusicPlayer = ({route}) => {
  const {fileid,musicFiles} = route.params;

  const [isPlaying, setIsPlaying] = useState(false); // add isPlaying state variable
  const playBackState = usePlaybackState();
  const progress = useProgress();
  const [trackTitle, setTrackTitle] = useState();
  const [trackArtist, setTrackArtist] = useState();
  const [sliderValue, setSliderValue] = useState(0);
  const [SongLyrics, setSongLyrics] = useState();



  useEffect(() => {
    setSliderValue(progress.position);
  }, [progress.position]);

  const handleSliderValueChange = (value) => {
    setSliderValue(value);
    TrackPlayer.seekTo(value);
  };

  useEffect(() => {
    const getMusic = async () => {
      musicFiles.forEach(audio => {
        if (audio.id === fileid) {
          PlayMusic(audio);
          console.log(audio.title.split('.')[0]);
          console.log(audio.artist);

          getLyrics(audio.title.split('.')[0], audio.artist).then(lyrics => {
            console.log(lyrics); // logs the lyrics to the console
             setSongLyrics(lyrics); // updates state with the lyrics
          }).catch(error => {
            console.error(error); // logs any errors to the console
          });
        }
      });
    };

    const PlayMusic = async music => {
      // await TrackPlayer.reset()  
      await TrackPlayer.setupPlayer();
      await TrackPlayer.add([music, ...musicFiles]);
      await TrackPlayer.play();
      setIsPlaying(true);
    };
    
    getMusic();
  }, [fileid, musicFiles]);

  const skipToNext = async () => {
    await TrackPlayer.skipToNext();
    await TrackPlayer.play();

  };

  const skipToPrevious = async () => {
    await TrackPlayer.skipToPrevious();
    await TrackPlayer.play();

  };

  useTrackPlayerEvents([Event.PlaybackTrackChanged, Event.PlaybackState], async event => {
    if (event.type === Event.PlaybackTrackChanged) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      setTrackTitle(track.title);
      setTrackArtist(track.artist);
    } else if (event.type === Event.PlaybackState) {
      if (event.state === State.Playing) {
        setIsPlaying(true);
      } else if (event.state === State.Paused || event.state === State.Stopped) {
        setIsPlaying(false);
      }
    }
  });

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.round(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };


  return (
    
    <SafeAreaView style={styles.container}>

<ScrollView style={styles.modalLyrics}>
          <Text style={styles.modalLyricsText}>
            {SongLyrics ? SongLyrics : 'No lyrics found'}
          </Text>
 </ScrollView>

      <View style={styles.mainContainer}>
        <View>
          <Text style={[styles.songContent, styles.songTitle]}>
            {trackTitle}
          </Text>
          <Text style={[styles.songContent, styles.songArtist]}>
            {trackArtist}
          </Text>
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabelText}>
            {formatTime(progress.position)}
          </Text>
          <Slider
            style={styles.progressBar}
            minimumValue={0}
            maximumValue={progress.duration}
            value={sliderValue}
            onValueChange={handleSliderValueChange}
            minimumTrackTintColor="#FFD369"
            maximumTrackTintColor="#444"
            thumbTintColor="#FFD369"
          />
          
          <Text style={styles.progressLabelText}>
            {formatTime(progress.duration)}
          </Text>
        </View>
        <View style={styles.musicControlsContainer}>
          <TouchableOpacity onPress={skipToPrevious}>
            <Ionicons name="play-skip-back-outline" size={35} color="#FFD369" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => togglePlayBack(playBackState, setIsPlaying)}>
            <Ionicons
              name={
                playBackState === 'playing'
                  ? 'pause-circle-outline'
                  : 'play-circle-outline'
              }
              size={70}
              color="#FFD369"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={skipToNext}>
            <Ionicons name="play-skip-forward-outline" size={35} color="#FFD369" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
  export default MusicPlayer ;
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#121212',
    },
    mainContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    songContent: {
      color: '#fff',
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    songTitle: {
      fontSize: 18,
      fontWeight: '600',
    },
  
    songArtist: {
      fontSize: 16,
      fontWeight: '300',
    },
  
    progressContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '90%',
      marginTop: 20,
    },
    progressBar: {
      height: 10,
      borderRadius: 5,
      // backgroundColor: '#444',
      flex: 1,
      marginHorizontal: 10,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: '#FFD369',
    },
   
    progressLabelText: {
      color: '#fff',
    },
    musicControlsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      width: '90%',
      marginTop: 20,
    },
    musicControlButton: {
      marginHorizontal: 20,
    },
    modalLyrics: {
      height: 80,
      marginTop: 10,
      marginBottom: 20,
    },
    modalLyricsText: {
      color: '#fff',
      fontSize: 14,
      textAlign: 'center',
    },
  });
  