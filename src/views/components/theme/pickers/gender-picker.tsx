import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Label } from '..';
import theme from 'src/assets/styles/theme';
import Gender from 'src/models/gender';

interface OptionProps {
  option: string;
  onPress?: any;
  selected?: boolean;
}

class GenderPickerOption extends React.Component<OptionProps> {
  render() {
    const { option, selected, onPress } = this.props;
    return (
      <View style={styles.optionContainer}>
        <TouchableOpacity style={styles.optionBtn} onPress={onPress}>
          <Icon
            name={option}
            color={
              selected ? theme.colors.primaryLight : theme.colors.textColor
            }
            size={48}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

interface Props {
  onChange?: Function;
}

interface State {
  selected: Gender;
}

export const GENDERS = [Gender.male, Gender.female];
// tslint:disable-next-line
export default class GenderPicker extends React.Component<Props, State> {
  static defaultProps = {
    onChange: undefined
  };

  static Genders = GENDERS;

  constructor(props: Props) {
    super(props);
    this.state = {
      selected: GENDERS[0]
    };
  }

  select = (gender: Gender) => {
    const { selected } = this.state;
    const { onChange } = this.props;
    if (selected !== gender) {
      this.setState({ selected: gender });
      if (onChange) {
        onChange(gender);
      }
    }
  }

  render() {
    const { selected } = this.state;
    return (
      <View>
        <Label>GENDER</Label>
        <View style={styles.buttonContainer}>
          {GENDERS.map((gender: Gender) => (
            <GenderPickerOption
              key={gender}
              selected={gender === selected}
              option={gender}
              onPress={() => this.select(gender)}
            />
          ))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    width: '75%',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  optionContainer: {
    flex: 1
  },
  optionBtn: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5
  }
});
