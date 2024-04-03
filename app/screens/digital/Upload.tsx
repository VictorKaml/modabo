import React, {useEffect, useState} from 'react';
import {
  View,
  Button,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Pressable,
  Image,
  TextInput,
  Dimensions,
  FlatList,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/Colors';
import AudioItem from './AudioItem';
import {supabase} from '../../../lib/supabase';
import {FileObject} from '@supabase/storage-js';
import {Session, User} from '@supabase/supabase-js';
import App from './SongApp';

interface UploadScreenProps {
  navigation: any; // You might want to replace 'any' with the proper navigation type
}

const UploadMusic: React.FC<UploadScreenProps> = ({navigation}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState<FileObject[]>([]);
  const [screenIndex, setScreenIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [user, setUser] = useState<User | null>();
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState<boolean>(false);

  const loadImages = async () => {
    const {data} = await supabase.storage.from('files').list(user!.id);
    console.log('My loaded images', data);
    if (data) {
      setFiles(data);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.replace('Main');
          }}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
      ),
    });
    // Listen for changes to authentication state
    const {data} = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session ? session.user : null);
      setInitialized(true);
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, [loadImages()]);

  useEffect(() => {
    if (user) {
      // Load user images
      loadImages();
    } else {
      return;
    }
  }, []);

  const pickDocument = async () => {
    try {
      const pickedFile = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.audio],
      });

      //   await RNFS.readFile(pickedFile.uri, 'base64').then(data => {
      //     console.log('base64', data);
      //   });
      console.log('pickedFile', pickedFile);
      // Check if the selected file is within the 5 MB limit
      const fileSize = await RNFS.stat(pickedFile.uri);
      const maxSize = 20 * 1024 * 1024; // 20 MB in bytes
      if (fileSize.size > maxSize) {
        Alert.alert(
          'File Size Limit Exceeded',
          'Please select a file up to 5 MB.',
        );
      } else {
        setSelectedFile(pickedFile);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the document picker
      } else {
        throw err;
      }
    }
  };

  const uploadAudioFile = async file => {
    try {
      // const audio = selectedFile;
      // const file = audio.uri;
      const base64 = await RNFS.readFile(file.uri, 'base64');
      const filePath = `${user!.id}/${new Date().getTime()}.${
        file.type == 'audio' ? 'mpeg' : 'mp3'
      }`;
      const contentType = file.type === 'audio/mpeg' ? 'audio/mp3' : 'mp3';
      // const filePath = `${user!.id}/${file.name}.${
      //   file.type == 'audio' ? 'mpeg' : 'mp3'
      // }`;
      const {data, error} = await supabase.storage
        .from('files')
        .upload(filePath, {base64}, {contentType});

      if (error) {
        console.log('Error uploading file:', error.message);
        return;
      } else {
        console.log('File uploaded successfully:', data);
        Alert.alert(
          'File Uploaded',
          `File ${file.name} has been uploaded successfully.`,
        );
      }
    } catch (error) {
      console.log('Error uploading file:', error);
    } finally {
      loadImages();
    }
  };

  const handleUpload = async () => {
    // Implement your file upload logic here
    if (selectedFile) {
      await uploadAudioFile(selectedFile);
    } else {
      Alert.alert('No File Selected', 'Please select a file to upload.');
    }
  };

  const onRemoveImage = async (item: FileObject, listIndex: number) => {
    supabase.storage.from('files').remove([`${user!.id}/${item.name}`]);
    const newFiles = [...files];
    newFiles.splice(listIndex, 1);
    setFiles(newFiles);
  };

  const SPACING = 20;
  const CC_SIZE = Dimensions.get('window').width - 20;

  return (
    <View key={screenIndex} style={{flex: 1}}>
      <View style={[styles.notify]}>
        {screenIndex === 0 && (
          <View
            style={{
              alignSelf: 'center',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderRadius: 14,
              width: CC_SIZE,
              marginBottom: SPACING,
            }}>
            <View
              style={{
                height: 50,
                width: 50,
                borderTopStartRadius: 14,
                borderBottomStartRadius: 14,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {}}
                style={{
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'white',
                  borderRadius: 14,
                }}>
                <Image
                  source={require('../../assets/img/interface/search.png')}
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: 'black',
                  }}
                />
              </TouchableOpacity>
            </View>
            <TextInput
              style={{
                height: 50,
                flex: 1,
                fontFamily: 'UberMoveBold',
                color: 'black',
                backgroundColor: 'white',
                borderColor: 'white',
                borderWidth: 2,
                borderBottomRightRadius: 14,
                borderTopRightRadius: 14,
                paddingHorizontal: 16,
                fontSize: 14,
                letterSpacing: 2,
              }}
              editable
              autoCapitalize="none"
              placeholder="Search"
              placeholderTextColor="black"
              caretHidden={false}
              cursorColor="black"
              onChangeText={text => setSearchQuery(text)}
              value={searchQuery}
            />
            <View
              style={{
                height: 50,
                width: 50,
                marginStart: 10,
                borderRadius: 14,
                backgroundColor: 'white',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Pressable
                onPress={() => {
                  if (screenIndex === 1) {
                    setScreenIndex(0);
                  } else if (screenIndex === 0) {
                    setScreenIndex(2);
                  }
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: Colors.white,
                  backgroundColor: 'black',
                  borderRadius: 14,
                }}>
                <Image
                  source={require('../../assets/img/interface/airdrop.png')}
                  style={{
                    width: 24,
                    height: 24,
                    // borderRadius: 10,
                    tintColor: Colors.grin,
                  }}
                />
              </Pressable>
            </View>
          </View>
        )}
        {screenIndex === 1 && (
          <View style={{alignSelf: 'flex-start', padding: 10, flex: 1}}>
            <Button title="Pick Document" onPress={pickDocument} />
            {selectedFile && (
              <Text style={{fontSize: 14, color: Colors.grin}}>
                Selected File: {selectedFile.name}
              </Text>
            )}
            <Button title="Upload File" onPress={handleUpload} />
            <TouchableOpacity onPress={loadImages} style={styles.fab}>
              <Icon name="camera-outline" size={30} color={Colors.black} />
            </TouchableOpacity>
          </View>
        )}
        {screenIndex === 0 && (
          // <ScrollView>
          //   {files.map((item, index) => (
          //     <AudioItem
          //       key={item.id}
          //       item={item}
          //       userId={user!.id}
          //       onRemoveImage={() => onRemoveImage(item, index)}
          //     />
          //   ))}
          // </ScrollView>
          <FlatList
            columnWrapperStyle={{
              width: CC_SIZE,
              justifyContent: 'space-between',
              alignSelf: 'center',
              marginBottom: SPACING,
            }}
            numColumns={2}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={loadImages}
                progressBackgroundColor={Colors.grin}
                colors={[Colors.black, Colors.black]}
                // Progress background color on iOS
              />
            }
            onRefresh={loadImages}
            refreshing
            horizontal={false}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            data={files}
            keyExtractor={item => item.id.toString()}
            renderItem={({item, index}) => {
              return (
                <AudioItem
                  key={item.id}
                  item={item}
                  userId={user!.id}
                  onRemoveImage={() => onRemoveImage(item, index)}
                />
              );
            }}
          />
        )}
        {screenIndex === 2 && <App />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: 'black',
  },
  fab: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    position: 'absolute',
    bottom: '5%',
    right: '10%',
    height: 70,
    backgroundColor: Colors.grin,
    borderRadius: 100,
  },
  notify: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: 'black',
  },
});

export default UploadMusic;
