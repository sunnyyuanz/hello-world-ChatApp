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
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';

export default function Start(props) {
  let [text, setText] = useState('');
  let [color, setColor] = useState('');
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
            accessible={true}
            accessibilityLabel="Input for your name"
          />
          <Text style={styles.text}>Choose Background Color:</Text>
          <View style={styles.circleContainer}>
            <TouchableOpacity
              style={styles.bkCircle}
              onPress={() => {
                setColor('#090C08');
              }}
              accessible={true}
              accessibilityLabel="Black"
              accessibilityRole="button"
            ></TouchableOpacity>
            <TouchableOpacity
              style={styles.gyCircle}
              onPress={() => {
                setColor('#474056');
              }}
              accessible={true}
              accessibilityLabel="gray"
              accessibilityRole="button"
            ></TouchableOpacity>
            <TouchableOpacity
              style={styles.lgCircle}
              onPress={() => {
                setColor('#8A95A5');
              }}
              accessible={true}
              accessibilityLabel="light gray"
              accessibilityRole="button"
            ></TouchableOpacity>
            <TouchableOpacity
              style={styles.grCircle}
              onPress={() => {
                setColor('#B9C6AE');
              }}
              accessible={true}
              accessibilityLabel="green"
              accessibilityRole="button"
            ></TouchableOpacity>
          </View>

          <Text
            onPress={() => {
              props.navigation.navigate('Chat', { name: text, color: color });
            }}
            style={styles.button}
            accessible={true}
            accessibilityLabel="Start chatting"
            accessibilityRole="button"
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
    marginHorizontal: 25,
    marginVertical: '15%',
    padding: 20,
    color: '#757083',
    fontSize: 16,
  },
  image: {
    flex: 1,
    justifyContent: 'space-between',
    resizeMode: 'cover',
    flexDirection: 'column',
  },
  text: {
    color: '#757083',
    fontSize: 16,
    fontWeight: '300',
  },
  input: {
    backgroundColor: '#fff',
    height: 55,
    borderColor: '#8A95A5',
    borderWidth: 2,
    width: '100%',
    alignSelf: 'center',
    marginBottom: 30,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingRight: 60,
  },
  button: {
    backgroundColor: '#757083',
    width: 300,
    height: 55,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    padding: 15,
    marginTop: 50,
    alignSelf: 'center',
  },
});
