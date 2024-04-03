import {FileObject} from '@supabase/storage-js';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {supabase} from '../../../lib/supabase';
import Colors from '../../utils/Colors';
import TrackPlayer, {
  AppKilledPlaybackBehavior,
} from 'react-native-track-player';

// Image item component that displays the image from Supabase Storage and a delete button
const AudioItem = ({
  item,
  userId,
  onRemoveImage,
}: {
  item: FileObject;
  userId: string;
  onRemoveImage: () => void;
}) => {
  const [image, setImage] = useState<string>('');
  const [audioUrl, setAudioUrl] = useState<string>('');

  supabase.storage
    .from('files')
    .download(`${userId}/${item.name}`)
    .then(({data}) => {
      // console.log('Returned data: ', data);
      const fr = new FileReader();
      fr.readAsDataURL(data!);
      fr.onload = () => {
        setImage(fr.result as string);
      };
    });

  async function getFileUrl(file_name) {
    try {
      // Get public url
      // const {data} = supabase.storage
      //   .from('bucket')
      //   .getPublicUrl('filePath.jpg');

      // console.log(data.publicUrl);

      // Get signed private url with a time limit
      const {data, error} = await supabase.storage
        .from('files')
        .createSignedUrl(`${userId}/${file_name}`, 3600);

      const url = data.signedUrl;

      if (data) {
        console.log('File url is:', data.signedUrl);
      }
      if (error) {
        console.log('Error getting url:', error);
      }
      setAudioUrl(url);
      console.log('File set url is:', url);
      console.log('Set file to audio set url is:', url);
    } catch (error) {
      console.log('Error getting url', error);
    }
  }

  const playAudio = async (file_name: string) => {
    try {
      // Get track url from storage server
      await getFileUrl(file_name);

      // Set up the player
      await TrackPlayer.setupPlayer();

      // Add a track to the queue
      await TrackPlayer.add({
        id: 'trackId',
        url: 'https://otqbhefsekdjnoflulhv.supabase.co/storage/v1/object/sign/files/1cb20f38-cce5-4110-8f2c-67f687429ff5/1711203995770.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJmaWxlcy8xY2IyMGYzOC1jY2U1LTQxMTAtOGYyYy02N2Y2ODc0MjlmZjUvMTcxMTIwMzk5NTc3MC5tcDMiLCJpYXQiOjE3MTEyNzMyMTgsImV4cCI6MTcxMTg3ODAxOH0.67vPpNiONeUXs_9_JH7Vpo_H_CGzO_cvC03jWUhObC8&t=2024-03-24T09%3A40%3A17.493Z',
        title: 'Track Title',
        artist: 'Track Artist',
        artwork: require('../../assets/img/pic1.jpg'),
      });
    } catch (error) {
    } finally {
      // Start playing it
      await TrackPlayer.play();
    }
  };

  return (
    <View
      style={{
        width: (Dimensions.get('screen').width * 45) / 100,
        padding: 15,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        alignSelf: 'center',
        flexDirection: 'row',
        margin: 1,
        height: 100,
      }}>
      <TouchableOpacity
        onPress={onRemoveImage}
        style={{
          height: 80,
          width: 80,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon name="trash-outline" size={20} color={'black'} />
      </TouchableOpacity>

      <Text style={{flex: 1, color: 'black'}}>{item.name}</Text>
      {/* Delete image button */}
      {image ? (
        // <Image style={{width: 80, height: 80}} source={{uri: image}} />
        <TouchableOpacity
          onPress={() => {
            playAudio(item.name);
            console.log('Pressed player');
          }}
          style={{
            height: 80,
            width: 80,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name="play" size={20} color={'black'} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => playAudio(item.name)}
          style={{
            height: 80,
            width: 80,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name="play" size={20} color={'black'} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AudioItem;
