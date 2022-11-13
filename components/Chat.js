import React from 'react';
import { View, Text, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
const firebase = require('firebase');
require('firebase/firestore');

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
      loggedInText: 'Please wait, youare getting logged in',
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
    this.referenceMessages = firebase.firestore().collection('messages');
  }
  componentDidMount() {
    //Set the name in the navigation bar
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        //Will get type error if use uid, my firebase is using UID. 
        uid: user.UID,
        messages: [],
        user: { _id: user.UID, name: name },
        loggedInText: '',
      });
      this.unsubscribe = this.referenceMessages
        .orderBy('createdAt', 'desc')
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    //go through each document
    querySnapshot.forEach((doc) => {
      //get the QueryDocumentSnapshot's data
      var data = doc.data();
      messages.push({
        id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar || '',
        },
      });
    });
    this.setState({ messages });
  };

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    () => {
      this.addMessage();
    };
  }

  addMessage() {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      uid: this.state.uid,
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
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

  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
  }
  render() {
    let color = this.props.route.params.color;
    return (
      <View style={{ flex: 1, backgroundColor: color }}>
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{ id: 1 }}
          style={{ backgroundColor: color }}
        />
        {Platform.OS === 'android' ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}
