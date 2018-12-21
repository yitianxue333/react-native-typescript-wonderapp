import React from 'react';
import { Text } from '.';
import { StyleProp, TextStyle, StyleSheet } from 'react-native';

interface Props {
  children?: any;
  style?: StyleProp<TextStyle>;
}

class SubHeader extends React.Component<Props> {
  render() {
    const { children, style } = this.props;
    return <Text style={[styles.header, style]}>{children}</Text>;
  }
}

const styles = StyleSheet.create({
  header: {
    fontSize: 14,
    // fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default SubHeader;
