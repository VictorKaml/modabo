import React from 'react';
import {View, Button} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

const UploadMusic = () => {
  const uploadFileOnPressHandler = async () => {
    try {
      const pickedFile = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      });
      console.log('pickedFile', pickedFile);

      await RNFS.readFile(pickedFile.uri, 'base64').then(data => {
        console.log('base64', data);
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log(err);
      } else {
        console.log(err);
        throw err;
      }
    }
  };

  return (
    <View style={{flex: 1}}>
      <Button
        title="Gallary"
        onPress={async () => {
          uploadFileOnPressHandler();
        }}
      />
    </View>
  );
};

export default UploadMusic;
