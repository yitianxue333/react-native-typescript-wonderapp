import React from 'react';
import { Modal, ModalProps, View, StyleSheet } from 'react-native';
import { Agenda, DateObject } from 'react-native-calendars';
import AgendaDayItem from '../calendar/agenda-day-item';
import Topic from 'src/models/topic';
import moment from 'moment';
import { Text, IconButton, Title, PrimaryButton } from '../theme';
import theme from '../../../assets/styles/theme';
import _ from 'lodash';

interface UserCalendarModalProps extends ModalProps {
  agendaItems: CalendarItemMap;
  onDateChange: (dateString: string) => void;
}

interface UserCalendarModalState {
  selectedDate?: string;
}

export interface CalendarItem {
  title?: string;
  date?: Date;
  location?: string;
  start?: Date;
  end?: Date;
  id?: string;
  calendarId?: string;
  topic?: Topic | null;
}

export interface CalendarItemMap {
  [key: string]: CalendarItem[];
}

class UserCalendarModal extends React.Component<
  UserCalendarModalProps,
  UserCalendarModalState
> {
  state: UserCalendarModalState = {
    selectedDate: undefined
  };

  selectDay = ({ dateString }: { dateString: string }) => {
    this.setState({ selectedDate: dateString });
  }

  onClose = () => {
    const { selectedDate } = this.state;
    const { onDateChange, onRequestClose } = this.props;
    if (selectedDate && onRequestClose) {
      onDateChange(selectedDate);
      onRequestClose();
    }
  }

  buttonTitle = () => {
    const { selectedDate } = this.state;

    if (selectedDate) {
      return `Pick ${moment(selectedDate, 'YYYY-MM-DD').format('MMM Do')}`;
    }
    return 'Select Date';
  }

  render() {
    const today = moment();
    const { visible, agendaItems, onRequestClose } = this.props;
    const { selectedDate } = this.state;
    return (
      <Modal
        transparent={false}
        visible={visible}
        onRequestClose={this.onClose}
        animationType='slide'
      >
        <View style={styles.modalHeader}>
          <View flex={1} />
          <Title>Calendar</Title>
          <View flex={1} style={{ alignItems: 'flex-end' }}>
            <IconButton
              onPress={onRequestClose}
              icon='times'
              primary={theme.colors.primary}
              secondary='#FFF'
            />
          </View>
        </View>
        <Agenda
          pastScrollRange={0}
          futureScrollRange={1}
          items={agendaItems}
          selected={selectedDate}
          onDayPress={this.selectDay}
          onDayChange={this.selectDay}
          minDate={today.format('YYYY-MM-DD')}
          maxDate={today
            .clone()
            .add(1, 'month')
            .format('YYYY-MM-DD')}
          renderDay={(day?: DateObject, item?: CalendarItem) => {
            if (day) {
              const dayMoment = moment(day.dateString, 'YYYY-MM-DD');
              return (
                <View style={styles.agendaDayContainer}>
                  <Text style={styles.agendaDayDate}>
                    {dayMoment.format('ddd')}
                  </Text>
                  <Text style={styles.agendaDayDay}>
                    {dayMoment.format('MMM D')}
                  </Text>
                </View>
              );
            }
            return <View style={styles.agendaDayContainer} />;
          }}
          renderItem={(item: CalendarItem, firstItemInDay: boolean) => (
            <AgendaDayItem item={item} />
          )}
          renderEmptyDate={() => <View />}
          renderEmptyData={() => (
            <View style={styles.emptyDataContainer}>
              <Text>No events on this day</Text>
            </View>
          )}
          rowHasChanged={(a, b) => _.isEqual(a, b)}
          theme={{
            todayTextColor: theme.colors.primary,
            selectedDayBackgroundColor: theme.colors.primary,
            agendaDayTextColor: theme.colors.textColor,
            agendaDayNumColor: theme.colors.textColor,
            agendaTodayColor: theme.colors.textColor,
            agendaKnobColor: theme.colors.primary
          }}
        />
        <View style={styles.btnFooter}>
          <PrimaryButton
            title={this.buttonTitle()}
            onPress={this.onClose}
            disabled={!selectedDate}
          />
        </View>
      </Modal>
    );
  }
}

export default UserCalendarModal;

const styles = StyleSheet.create({
  emptyDataContainer: {
    paddingTop: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  agendaDayContainer: {
    marginVertical: 5,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  agendaDayDay: {
    fontSize: 9
  },
  agendaDayDate: {
    fontSize: 16
  },
  modalHeader: {
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  btnFooter: {
    position: 'absolute',
    bottom: 15,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center'
  }
});
