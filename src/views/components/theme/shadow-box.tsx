import React from 'react';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';

interface Props {}

export default class ShadowBox extends React.Component<Props> {
  render() {
    return <View style={styles.container}>{this.props.children}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 10,
    padding: 20,
    backgroundColor: '#FFF',
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowColor: '#383838',
    shadowOpacity: 0.4
  }
});
