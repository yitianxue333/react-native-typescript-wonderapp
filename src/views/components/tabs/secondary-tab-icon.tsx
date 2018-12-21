import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../theme';

interface Props {
  focused?: boolean | null;
  tintColor?: string | null;
}

class SecondaryTabIcon extends React.Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.txt}>A</Text>
      </View>
    );
  }
}

export default SecondaryTabIcon;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%'
  },
  txt: {
    textAlign: 'center',
    flex: 1,
    width: '100%'
  }
});
