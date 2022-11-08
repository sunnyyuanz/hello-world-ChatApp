import React from 'react';
import { View, Text } from 'react-native';

export default class Chat extends React.Component {
  componentDidMount() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Welcome to Chat {this.props.route.params.name}!</Text>
      </View>
    );
  }
}
