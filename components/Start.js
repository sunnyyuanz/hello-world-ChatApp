import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  ImageBackground,
} from 'react-native';

export default function Start(props) {
  let [text, setText] = useState('');
  const placeholder = 'Your Name';

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/BackgroundImage.png')}
        resizeMode="cover"
        style={styles.image}
      >
        <Text style={styles.appTitle}>Hello World</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setText(text)}
            value={text}
            placeholder={placeholder}
          />
          <Text style={styles.text}>Choose Background Color:</Text>
          <View style={styles.circleContainer}>
            <View style={styles.bkCircle}></View>
            <View style={styles.gyCircle}></View>
            <View style={styles.lgCircle}></View>
            <View style={styles.grCircle}></View>
          </View>

          <Text
            onPress={() => {
              props.navigation.navigate('Chat', { name: text });
            }}
            style={styles.button}
          >
            Start Chatting
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: '#fff',
    alignSelf: 'center',
    marginTop: 100,
  },
  inputContainer: {
    height: '44%',
    backgroundColor: '#fff',
    margin: 25,
    padding: 20,
    color: '#757083',
    fontSize: 16,
  },
  image: {
    flex: 1,
    justifyContent: 'space-between',
  },
  text: {
    color: '#757083',
    fontSize: 16,
    fontWeight: '300',
  },
  input: {
    backgroundColor: '#fff',
    height: 60,
    borderColor: '#8A95A5',
    borderWidth: 2,
    width: '100%',
    alignSelf: 'center',
    marginBottom: 40,
    padding: 10,
    fontWeight: '300',
  },
  bkCircle: {
    width: 40,
    height: 40,
    backgroundColor: '#090C08',
    borderRadius: 50,
  },
  gyCircle: {
    width: 40,
    height: 40,
    backgroundColor: '#474056',
    borderRadius: 50,
  },
  lgCircle: {
    width: 40,
    height: 40,
    backgroundColor: '#8A95A5',
    borderRadius: 50,
  },
  grCircle: {
    width: 40,
    height: 40,
    backgroundColor: '#B9C6AE',
    borderRadius: 50,
  },
  circleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingRight: 60,
  },
  button: {
    backgroundColor: '#757083',
    width: 200,
    height: 70,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    padding: 25,
    alignSelf: 'center',
  },
});
