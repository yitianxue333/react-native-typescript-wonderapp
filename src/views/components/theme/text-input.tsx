import _ from 'lodash';
import React from 'react';
import {
  View,
  StyleSheet,
  TextInput as Input,
  TextInputProps,
  StyleProp,
  ViewStyle
} from 'react-native';
import theme from 'src/assets/styles/theme';
import Color from 'color';
import Label from './label';
import Icon from 'react-native-vector-icons/FontAwesome';
import ErrorHint from './text/error-hint';

interface Props extends TextInputProps {
  getRef?: any;
  icon?: string;
  color?: string;
  errorHint?: string;
  label?: string;
  padLeft?: boolean;
  disabled?: boolean;
  onValidate?: Function;
  containerStyles?: StyleProp<ViewStyle>;
}

interface State {
  text?: string;
}

const palette = Color(theme.colors.backgroundPrimary);
export default class TextInput extends React.Component<Props, State> {
  static defaultProps = {
    disabled: false,
    getRef: _.noop
  };

  state = {
    text: undefined
  };

  renderIcon = () => {
    const { icon, color } = this.props;
    if (icon) {
      return (
        <View style={styles.iconContainer}>
          <Icon
            name={icon}
            color={color || palette.darken(0.2).toString()}
            size={14}
          />
        </View>
      );
    }
  }

  renderErrorHint = () => {
    const { errorHint } = this.props;
    // if (errorHint) {
    return <ErrorHint>{errorHint}</ErrorHint>;
    // }
  }

  validate = () => {
    const { onValidate } = this.props;
    const { text } = this.state;
    const valid = onValidate && onValidate(text);
    return (
      <View style={styles.iconContainer}>
        <Icon color={valid ? 'green' : 'transparent'} size={14} name='check' />
      </View>
    );
  }

  onTextChange = (text: string) => {
    const { onChangeText } = this.props;
    this.setState({ text });
    if (onChangeText) {
      onChangeText(text);
    }
  }

  render() {
    const {
      disabled,
      autoCorrect,
      label,
      style,
      containerStyles,
      padLeft,
      getRef,
      outerContainerStyles,
      ...rest
    } = this.props;
    return (
      <View style={[styles.container, outerContainerStyles]}>
        {label && <Label>{label.toUpperCase()}</Label>}
        <View style={[styles.inputContainer, containerStyles]}>
          {this.renderIcon()}
          {padLeft && <View flex={1} />}
          <Input
            ref={getRef}
            editable={!disabled}
            autoCorrect={autoCorrect}
            underlineColorAndroid='transparent'
            {...rest}
            style={[styles.input, style]}
            onChangeText={this.onTextChange}
          />
          {this.validate()}
        </View>
        {this.renderErrorHint()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  errorHintContainer: {
    borderWidth: 2
  },
  errorHintText: {
    color: 'red',
    fontSize: 9,
    marginLeft: 20
  },
  label: {
    marginBottom: 0
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: Color(theme.colors.textColor).lighten(0.5)
  },
  input: {
    height: 40,
    flex: 10,
    fontFamily: theme.fonts.primary,
    color: theme.colors.black
  },
  iconContainer: {
    flex: 1,
    paddingHorizontal: 10
  }
});
