import React from 'react';
import { View, FlatList, FlatListProps, RefreshControl } from 'react-native';
import AppointmentItem from './appointment-item';
import { DecoratedAppointment } from 'src/models/appointment';
import { SwipeRow, Button } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Props {
  data: DecoratedAppointment[];
  onRefresh?: () => void;
  isLoading?: boolean;
  onPress?: Function;
  onDelete?: (appointment: DecoratedAppointment) => void;
  onPressCallNumber: Function;
}

class AppointmentList extends React.PureComponent<Props> {
  static defaultProps = {
    isLoading: false
  };

  keyExtractor = (item: any, index: number) => `${item.id}`;

  renderRow = ({ item }: { item: DecoratedAppointment }) => {
    const { onPress, onDelete, onPressCallNumber, isPast } = this.props;

    return (
      <SwipeRow
        rightOpenValue={-75}
        right={
          <Button danger onPress={() => onDelete && onDelete(item)}>
            <Icon name='trash' size={36} color='#FFF' />
          </Button>}
        body={
          <AppointmentItem
            callNumber={onPressCallNumber}
            item={item}
            onPress={onPress}
            isPast={isPast}
          />
        }
      />
    );
  }

  render() {
    const { data, onRefresh, isLoading } = this.props;

    return (
      <FlatList
        refreshing={isLoading || false}
        onRefresh={onRefresh}
        keyExtractor={this.keyExtractor}
        data={data}
        renderItem={this.renderRow}
      />
    );
  }
}

export default AppointmentList;
