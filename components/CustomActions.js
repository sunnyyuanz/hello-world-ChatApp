import PropTypes from 'prop-types';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { connectActionSheet } from '@expo/react-native-action-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import firebase from 'firebase';
import 'firebase/firestore';

export default function CustomActions(props) {
  const onActionPress = () => {
    const options = [
      'Choose From Library',
      'Take Picture',
      'Send Location',
      'Cancel',
    ];
    const cancelButtonIndex = options.length - 1;
    props.showActionSheetWithOptions(
      { options, cancelButtonIndex },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log('user want to pick an image');
            return pickImage();
          case 1:
            console.log('user want to take a photo');
            return takePhoto();
          case 2:
            console.log('user wants to get their location');
            return getLocation();
        }
      }
    );
  };
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status == 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        mediaType: 'Images',
      }).catch((error) => console.log(error));

      if (!result.canceled) {
        const imageUrl = await uploadImageFetch(result.uri); //getting the stored uri from firebase
        props.onSend({ image: imageUrl });
      }
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status == 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaType: 'Images',
      }).catch((error) => console.log(error));

      if (!result.canceled) {
        const imageUrl = await uploadImageFetch(result.uri); //getting the stored uri from firebase
        props.onSend({ image: imageUrl });
      }
    }
  };

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status == 'granted') {
      let result = await Location.getCurrentPositionAsync({}).catch((error) =>
        console.log(error)
      );

      if (result) {
        props.onSend({
          location: {
            longitude: result.coords.longitude,
            latitude: result.coords.latitude,
          },
        });
      }
    }
  };
  //storage images to firebase storage
  const uploadImageFetch = async (uri) => {
    //blob: binary large object (BLOB or blob), usually means images, audio or other multimedia objects in binary format
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      // Setting the response type as blob
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    //split the image uri to an array by /
    const imageNameBefore = uri.split('/');
    // only getting the last element of the array which the image file name
    const imageName = imageNameBefore[imageNameBefore.length - 1];
    //give a ref to the images before adding the actual object(blob)
    const ref = firebase.storage().ref().child(`images/${imageName}`);
    //adding the blob into the storage
    const snapshot = await ref.put(blob);
    blob.close();
    return await snapshot.ref.getDownloadURL(); //get the object url from firebase storage
  };
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        onActionPress();
      }}
    >
      <View style={styles.wrapper}>
        <Text style={styles.iconText}>+</Text>
      </View>
    </TouchableOpacity>
  );
}
CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
};

//Connect Action Sheet to CustomActions Component
CustomActions = connectActionSheet(CustomActions);
const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
});
