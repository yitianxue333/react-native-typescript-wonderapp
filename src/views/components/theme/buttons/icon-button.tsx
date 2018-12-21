import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import theme from 'src/assets/styles/theme';
import TouchableOpacityOnPress from 'src/models/touchable-on-press';

interface IconButtonProps {
  disabled?: boolean;
  icon: string;
  circle?: boolean;
  primary?: string;
  secondary?: string;
  onPress?: TouchableOpacityOnPress;
  size?: number;
  iconSize?: number;
}

class IconButton extends React.Component<IconButtonProps> {
  static defaultProps = {
    primary: theme.colors.primary,
    secondary: theme.colors.primaryLight,
    size: 45,
    disabled: false,
    iconSize: undefined
  };

  render() {
    const {
      size,
      icon,
      primary,
      secondary,
      circle,
      onPress,
      disabled,
      iconSize
    } = this.props;

    const btnStyle: StyleProp<ViewStyle> = {
      backgroundColor: secondary
    };

    let computedIconSize = 18;
    if (size) {
      btnStyle.borderRadius = circle ? size / 2 : 3;
      btnStyle.width = size;
      btnStyle.height = size;
      computedIconSize = size * 0.4;
    }

    return (
      <TouchableOpacity
        disabled={disabled}
        style={[styles.btnContainer, btnStyle]}
        onPress={onPress}
      >
        <Icon name={icon} color={primary} size={iconSize || computedIconSize} />
      </TouchableOpacity>
    );
  }
}

export default IconButton;

const styles = StyleSheet.create({
  btnContainer: {
    width: 50,
    height: 50,
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
