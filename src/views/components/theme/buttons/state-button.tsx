import React from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import theme from 'src/assets/styles/theme';

// this component is a button that can hold an active and an inactive state
// The background and text colors change as the state that is passed to it changes
// active state will result in a colored background with white text
// inactive state will result in an outlined button
// the colors currently make use of the primary color of the app and white

interface StateButtonProps {
  active: boolean | undefined;
  text: string;
  onPress: () => void;
}

export const StateButton = (props: StateButtonProps) => {
  return (
    <TouchableHighlight
      onPress={props.onPress}
      style={[
        styles.btnContainer,
        {
          backgroundColor: props.active ? theme.colors.primary : '#fff',
          borderColor: props.active ? '#fff' : theme.colors.primary
        }
      ]}
    >
      <Text style={{ color: props.active ? '#fff' : theme.colors.primary }}>
        {props.text}
      </Text>
    </TouchableHighlight>
  );
};

export default StateButton;

const styles = StyleSheet.create({
  btnContainer: {
    padding: 4,
    borderRadius: 40,
    width: 80,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4
  }
});
