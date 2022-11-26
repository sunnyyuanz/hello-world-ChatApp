import React from 'react';
import { View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
const firebase = require('firebase');
require('firebase/firestore');
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';
export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: '',
        avatar: '',
        name: '',
      },
      image: null,
      location: null,
      isConnected: false,
    };

    //Firebase configuration
    const firebaseConfig = {
      apiKey: 'AIzaSyCWe_wL8D8Sciaox3A9R_n2WjJgfczi8wA',
      authDomain: 'chatapp-cf917.firebaseapp.com',
      projectId: 'chatapp-cf917',
      storageBucket: 'chatapp-cf917.appspot.com',
      messagingSenderId: '724354341351',
      appId: '1:724354341351:web:0a48639ea534eda1e5c542',
      measurementId: 'G-F5DG0BDKQT',
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }

  //Retrieve collection data and store in messages.
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    //go through each document in the database
    querySnapshot.forEach((doc) => {
      //get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id, // I had id instead of _id which was not matching with the database format, this was the reason the sender msg kept repeating.
        createdAt: data.createdAt.toDate(),
        text: data.text || '',

        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar || '',
        },
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({ messages });
  };
  // get the message from AsyncStorage and save it to local messages, then set the state messages to the local messages value.
  async getMessages() {
    let messages = '';
    try {
      messages = (await AsyncStorage.getItem('messsages')) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(errormessage);
    }
  }
  componentDidMount() {
    //Set the name in the navigation bar
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    this.getMessages(); //get Message from async storage
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log('online');
      } else {
        console.log('offline');
      }
    });
    this.referenceMessages = firebase.firestore().collection('messages');
    this.unsubscribe = this.referenceMessages.onSnapshot(
      this.onCollectionUpdate
    );
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      //Anonymous user authentication
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid, //sender's info
        messages: [], //starting message state
        user: { _id: user.uid, name: name }, //sender's info
      });
      this.unsubscribe = this.referenceMessages
        .orderBy('createdAt', 'desc')
        .onSnapshot(this.onCollectionUpdate); // stop updating after the messages are loaded from database and sorted by createdAt , the first load will only load msg created before the current time.
      this.saveMessages(); //save the messages to async storage
    });
  }
  componentWillUnmount() {
    if (this.isConnected) {
      //"this" here is the whole app isConnected from NetInfo not the state isConnected.
      this.unsubscribe();
      this.authUnsubscribe();
    }
  }
  // append new message to previous
  //Why the onSend messages here is an array?
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }), // appending the new msg to the message state.
      () => {
        this.saveMessages(); //every time message sent will be saved to asyncStorage.
        this.addMessage(); // I had this line of code outside the setState method, this was the reason sender's msg could not be added to the database.
      }
    );
  }
  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        'messages',
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }
  //save messages to databse
  addMessage() {
    const message = this.state.messages[0]; //adding the newest msg to the database
    this.referenceMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{ right: { backgroundColor: '#000' } }}
      />
    );
  }

  renderInputToolbar(props) {
    //hide the inputToolbar if the connection is off
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  renderCustomView(props) {
    //this currentMessage is from giftChat
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  renderCustomActions(props) {
    return <CustomActions {...props} />;
  }
  render() {
    let color = this.props.route.params.color;
    return (
      <View style={{ flex: 1, backgroundColor: color }}>
        <GiftedChat
          renderCustomView={this.renderCustomView.bind(this)}
          renderActions={this.renderCustomActions.bind(this)}
          isConnected={this.state.isConnected}
          renderInputToolbar={this.renderInputToolbar.bind(this)} //Bind creates a new function that will force the this inside the function to be the parameter passed to bind(). not bound, this could be a global this.
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{ id: this.state.user._id, name: this.state.user.name }}
          style={{ backgroundColor: color }}
        />
        {Platform.OS === 'android' ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}
