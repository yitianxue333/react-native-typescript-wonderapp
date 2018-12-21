import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import Label from './label';
import theme from 'src/assets/styles/theme';

interface Props extends TextInputProps {
  label?: string;
}

export default class TextArea extends React.Component<Props> {
  render() {
    const { label, placeholder, onChangeText, style, ...rest } = this.props;
    return (
      <View style={styles.container}>
        {label && <Label>{label}</Label>}
        <TextInput
          style={[styles.input, style]}
          multiline
          placeholder={placeholder}
          onChangeText={onChangeText}
          numberOfLines={4}
          underlineColorAndroid='transparent'
          {...rest}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  input: {
    textAlignVertical: 'top',
    maxHeight: 150,
    borderRadius: 5,
    fontFamily: theme.fonts.primary,
    borderWidth: 1,
    borderColor: 'rgb(223,223,231)',
    padding: 10
  }
});
