import _ from 'lodash';
import React from 'react';
import {
  View,
  StyleSheet,
  TextInput as Input,
  TextInputProps
} from 'react-native';
import theme from 'src/assets/styles/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import Color from 'color';
import LinearGradient from 'react-native-linear-gradient';

import ErrorHint from './text/error-hint';

const palette = Color(theme.colors.backgroundPrimary);

interface PasswordProps {
  secureTextEntry?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | undefined;
  autoCorrect?: boolean;
}

interface RoundedTextInputProps extends TextInputProps {
  getRef?: any;
  errorHint?: string;
  type?: string;
  label?: string;
  icon?: string;
  color?: string;
  fullWidth?: boolean;
  colors?: string[];
  padLeft?: boolean;
  onValidate?: Function;
  // start?: GradientPoint;
  // end?: GradientPoint;
}

interface State {
  text?: string;
}

export default class RoundedTextInput extends React.Component<
  RoundedTextInputProps,
  State
> {
  innerRef: any = null;

  static defaultProps = {
    padLeft: false,
    start: undefined,
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
    return <ErrorHint style={{ marginLeft: 20 }}>{errorHint}</ErrorHint>;
    // }
  }

  validate = () => {
    const { onValidate } = this.props;
    const { text } = this.state;
    const valid = onValidate && onValidate(text);
    return (
      <View style={styles.iconContainer}>
        <Icon
          color={valid ? 'green' : styles.container.backgroundColor}
          size={14}
          name='check'
        />
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
      errorHint,
      type,
      label,
      style,
      start,
      end,
      color,
      colors,
      padLeft,
      getRef,
      ...rest
    } = this.props;

    const passwordProps: PasswordProps = {};
    if (type === 'password') {
      passwordProps.secureTextEntry = true;
      passwordProps.autoCapitalize = 'none';
      passwordProps.autoCorrect = false;
    }

    const input = (
      <Input
        ref={getRef}
        underlineColorAndroid='transparent'
        placeholderTextColor={color}
        secureTextEntry={passwordProps.secureTextEntry}
        autoCapitalize={passwordProps.autoCapitalize}
        autoCorrect={passwordProps.autoCorrect}
        style={[styles.input, style]}
        {...rest}
        onChangeText={this.onTextChange}
      />
    );

    if (colors) {
      return (
        <View>
          <LinearGradient
            start={start}
            end={end}
            colors={colors}
            style={[styles.container]}
          >
            {this.renderIcon()}
            {padLeft && <View flex={1} />}
            {input}
            {this.validate()}
          </LinearGradient>
          {this.renderErrorHint()}
        </View>
      );
    }

    return (
      <View>
        <View style={styles.container}>
          {this.renderIcon()}
          {padLeft && <View flex={1} />}
          {input}
          {this.validate()}
        </View>
        {this.renderErrorHint()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 10
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    width: '100%',
    backgroundColor: palette.toString()
  },
  iconContainer: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    fontFamily: theme.fonts.primary,
    flex: 10,
    color: theme.colors.black,
    height: 44
  }
});
