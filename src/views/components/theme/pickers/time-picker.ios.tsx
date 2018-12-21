import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  DatePickerIOS,
  TouchableOpacity
} from 'react-native';
import { Label, Text } from '..';
import moment from 'moment-timezone';
import theme from 'src/assets/styles/theme';
import Color from 'color';
import ErrorHint from '../text/error-hint';
import TextButton from '../text-button';
import FooterModal from '../../modals/footer-modal';
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
}

interface State {
  open: boolean;
  value?: Date;
}

export default class TimePicker extends React.Component<Props, State> {
  static defaultProps = {
    displayFormat: 'h:mma'
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.initialDate,
      open: false
    };
  }

  private onClose = () => {
    const { onChange } = this.props;
    const { value } = this.state;
    const dateAsMoment = moment(value);
    if (onChange) {
      onChange({ hour: dateAsMoment.hour(), minute: dateAsMoment.minutes() });
    }
    this.setState({ open: false });
  }

  private onChange = (date: Date) => {
    this.setState({ value: date });
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
    const { open, value } = this.state;
    return (
      <View>
        {label && <Label>{label}</Label>}
        <View style={styles.container}>
          <Text>
            {value ? moment(value).format(displayFormat) : 'Select Time'}
          </Text>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => this.setState({ open: true })}
          >
            <Icon name='clock-o' color={theme.colors.white} />
          </TouchableOpacity>
        </View>
        {<ErrorHint>{errorHint}</ErrorHint>}
        <FooterModal
          closeText='Done'
          animationType='slide'
          transparent
          visible={open}
          onClose={this.onClose}
        >
          <DatePickerIOS
            mode='time'
            date={this.state.value || new Date()}
            onDateChange={this.onChange}
            minimumDate={minDate}
            maximumDate={maxDate}
            minuteInterval={15}
          />
        </FooterModal>
      </View>
    );
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
