// import React from 'react';
// import { StyleSheet, View, KeyboardAvoidingView } from 'react-native';
// import { GiftedChat, Bubble } from 'react-native-gifted-chat';
// const firebase = require('firebase');
// require('firebase/firestore');

// export default class Chat extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       messages: [],
//       uid: 0,
//       user: {
//         _id: '',
//         avatar: '',
//         name: '',
//       },
//     };

//     //Set up Firebase
//     const firebaseConfig = {
//       apiKey: 'AIzaSyCWe_wL8D8Sciaox3A9R_n2WjJgfczi8wA',
//       authDomain: 'chatapp-cf917.firebaseapp.com',
//       projectId: 'chatapp-cf917',
//       storageBucket: 'chatapp-cf917.appspot.com',
//       messagingSenderId: '724354341351',
//       appId: '1:724354341351:web:0a48639ea534eda1e5c542',
//       measurementId: 'G-F5DG0BDKQT',
//     };

//     if (!firebase.apps.length) {
//       firebase.initializeApp(firebaseConfig);
//     }

//     this.referenceChatMessages = firebase.firestore().collection('messages');
//   }

//   //Retrieve collection data & store in messages
//   onCollectionUpdate = (querySnapshot) => {
//     const messages = [];
//     // Go through each document
//     querySnapshot.forEach((doc) => {
//       // Get QueryDocumentSnapshot's data
//       let data = doc.data();
//       messages.push({
//         _id: data._id,
//         text: data.text || '',
//         createdAt: data.createdAt.toDate(),
//         user: {
//           _id: data.user._id,
//           name: data.user.name,
//           avatar: data.user.avatar || '',
//         },
//       });
//     });
//     this.setState({
//       messages,
//     });
//   };

//   componentDidMount() {
//     //Display username in navigation
//     let { name } = this.props.route.params;
//     this.props.navigation.setOptions({ title: name });

//     //Anonymous user authentication
//     this.referenceChatMessages = firebase.firestore().collection('messages');

//     this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
//       if (!user) {
//         firebase.auth().signInAnonymously();
//       }
//       this.setState({
//         uid: user.uid,
//         messages: [],
//         user: {
//           _id: user.uid,
//           name: name,
//         },
//       });
//       this.unsubscribe = this.referenceChatMessages
//         .orderBy('createdAt', 'desc')
//         .onSnapshot(this.onCollectionUpdate);
//     });
//   }

//   componentWillUnmount() {
//     this.unsubscribe();
//     this.authUnsubscribe();
//   }

//   //Save messages to database
//   addMessages = () => {
//     const message = this.state.messages[0];
//     this.referenceChatMessages.add({
//       uid: this.state.uid,
//       _id: message._id,
//       text: message.text || '',
//       createdAt: message.createdAt,
//       user: message.user,
//     });
//   };

//   //Appends new message to previous
//   onSend(messages = []) {
//     this.setState(
//       (previousState) => ({
//         messages: GiftedChat.append(previousState.messages, messages),
//       }),
//       () => {
//         this.addMessages(this.state.messages[0]);
//       }
//     );
//   }

//   //Allows bubble customization
//   renderBubble(props) {
//     return <Bubble {...props} wrapperStyle={styles.bubble} />;
//   }

//   render() {
//     const { color, name } = this.props.route.params;

//     return (
//       <View style={[{ backgroundColor: color }, styles.container]}>
//         <GiftedChat
//           renderBubble={this.renderBubble.bind(this)}
//           messages={this.state.messages}
//           onSend={(messages) => this.onSend(messages)}
//           user={{
//             _id: this.state.user._id,
//             name: name,
//           }}
//         />
//         {/*Prevent hidden input field on Android*/}
//         {Platform.OS === 'android' ? (
//           <KeyboardAvoidingView behavior="height" />
//         ) : null}
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   chatTitle: {
//     color: '#FFFFFF',
//   },
//   bubble: {
//     left: {
//       backgroundColor: 'white',
//     },
//     right: {
//       backgroundColor: 'blue',
//     },
//   },
// });

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
      });
    });
    this.setState({ messages });
  };

  componentDidMount() {
    //Set the name in the navigation bar
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    //identify the database
    this.referenceMessages = firebase.firestore().collection('messages');
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
    });
  }
  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
  }
  // append new message to previous
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }), // appending the new msg to the message state.
      () => {
        this.addMessage(); // I had this line of code outside the setState method, this was the reason sender's msg could not be added to the database.
      }
    );
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

  render() {
    let color = this.props.route.params.color;
    return (
      <View style={{ flex: 1, backgroundColor: color }}>
        <GiftedChat
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
