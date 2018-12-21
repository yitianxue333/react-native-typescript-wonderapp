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
  value: Date;
}

export default class DatePicker extends React.Component<Props, State> {
  static defaultProps = {
    displayFormat: 'MM-DD-YYYY'
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.initialDate || new Date(),
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
    const { open, value } = this.state;
    return (
      <View>
        {label && <Label>{label}</Label>}
        <View style={styles.container}>
          <Text style={{ textAlign: 'center' }}>
            {moment(value).format(displayFormat)}
          </Text>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => this.setState({ open: true })}
          >
            <Icon name='calendar' color={theme.colors.white} />
          </TouchableOpacity>
        </View>
        {<ErrorHint>{errorHint}</ErrorHint>}
        <FooterModal
          closeText='Done'
          animationType='slide'
          transparent
          visible={open}
          onClose={() => this.setState({ open: false })}
        >
          <DatePickerIOS
            mode='date'
            date={this.state.value}
            onDateChange={this.onChange}
            minimumDate={minDate}
            maximumDate={maxDate}
          />
        </FooterModal>
      </View>
    );
  }

  private onChange = (date: Date) => {
    const { onChange } = this.props;
    this.setState({ value: date });
    if (onChange) {
      onChange(date);
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
