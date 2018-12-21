import React from 'react';
import { StyleSheet } from 'react-native';
import BaseButton, { BaseButtonProps } from './buttons/base-button';

export default class ElevatedButton extends React.Component<BaseButtonProps> {
  static defaultProps = {
    start: undefined
  };

  render() {
    const { onPress, title, style, innerStyle, start, ...rest } = this.props;
    return (
      <BaseButton
        title={title}
        onPress={onPress}
        start={start}
        colors={['#FEFEFE', '#FFF']}
        {...rest}
        style={[styles.container, style]}
        innerStyle={[styles.inner, innerStyle]}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 3,
    elevation: 3,
    shadowRadius: 3,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 3
    }
  },
  inner: {
    borderRadius: 3,
    height: 44
    // paddingVertical: 20,
  }
});
