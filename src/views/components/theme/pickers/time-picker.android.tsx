import React from 'react';
import {
  View,
  StyleSheet,
  DatePickerAndroid,
  TouchableOpacity,
  TimePickerAndroid
} from 'react-native';
import { Label, Text } from '..';
import moment from 'moment-timezone';
import theme from 'src/assets/styles/theme';
import Color from 'color';
import ErrorHint from '../text/error-hint';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Props {
  displayFormat: string;
  errorHint?: string;
  label?: string;
  onChange: Function;
  placeholder?: string;
  initialDate?: Date;
  minDate?: Date;
  maxDate?: Date;
  is24Hour?: boolean;
}

interface State {
  open: boolean;
  hour?: number;
  minute?: number;
}

export default class DatePicker extends React.Component<Props, State> {
  static defaultProps = {
    displayFormat: 'h:mma',
    is24Hour: false
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      hour: undefined,
      minute: undefined,
      open: false
    };
  }

  public render() {
    const {
      label,
      displayFormat,
      errorHint,
      minDate,
      maxDate,
      onChange
    } = this.props;
    const { open, hour, minute } = this.state;

    return (
      <View>
        {label && <Label>{label}</Label>}
        <View style={styles.container}>
          <Text>
            {hour && minute
              ? moment(`${hour}:${minute}`, 'HH:mm').format(displayFormat)
              : 'Select Time'}
          </Text>
          <TouchableOpacity style={styles.iconBtn} onPress={this.openModal}>
            <Icon name='clock-o' color={theme.colors.white} />
          </TouchableOpacity>
        </View>
        {<ErrorHint>{errorHint}</ErrorHint>}
      </View>
    );
  }

  openModal = async () => {
    try {
      const { minDate, maxDate, is24Hour } = this.props;
      const { hour: sHour, minute: sMinute } = this.state;

      const { action, hour, minute } = await TimePickerAndroid.open({
        hour: 12,
        minute: 0,
        is24Hour
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        if (hour >= 0 && minute >= 0) {
          this.onChange({ hour, minute });
        }
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  }

  onChange = ({ hour, minute }: { hour: number; minute: number }) => {
    const { onChange } = this.props;
    this.setState({ hour, minute });
    if (onChange) {
      onChange({ hour, minute });
    }
  }
}

const styles = StyleSheet.create({
  iconBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 3,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: Color(theme.colors.textColor).lighten(0.5)
  },
  text: {
    color: theme.colors.textColor,
    fontFamily: theme.fonts.primary
  }
});
