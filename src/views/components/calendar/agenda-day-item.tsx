import React from 'react';
import moment, { Moment } from 'moment';
import { View, StyleSheet } from 'react-native';
import { Text } from 'src/views/components/theme';
import { CalendarItem } from '../modals/user-calendar.modal';
import Wonder from '../theme/wonder/wonder';

export interface AgendaDayItemProps {
  item: CalendarItem;
}
const AgendaDayItem: React.SFC<AgendaDayItemProps> = ({ item }) => {
  const { title, start, end, topic } = item;
  const startDate: Moment | undefined = start ? moment(start) : undefined;
  const endDate: Moment | undefined = end ? moment(end) : undefined;

  const times = [];
  if (startDate) {
    times.push(startDate.format('h:mma'));
    if (endDate) {
      times.push(endDate.format('h:mma'));
    }
  }

  return (
    <View style={styles.agendaItemContainer}>
      {topic && <Wonder topic={topic} active={false} size={60} />}
      <View style={styles.agendaItemTextContainer}>
        <Text style={styles.titleText}>{title || 'Event'}</Text>
        <Text style={styles.timeText}>{times.join(' - ')}</Text>
      </View>
    </View>
  );
};

export default AgendaDayItem;

const styles = StyleSheet.create({
  agendaItemContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    minHeight: 50,
    elevation: 2,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowColor: '#000',
    shadowOpacity: 0.1
  },
  agendaItemTextContainer: {
    justifyContent: 'center'
  },
  titleText: {
    fontWeight: 'bold'
  },
  timeText: {
    fontSize: 11
  }
});
