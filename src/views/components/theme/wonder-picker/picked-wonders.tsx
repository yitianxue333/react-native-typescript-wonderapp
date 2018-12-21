import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../../../../assets/styles/theme';
import Topic from '../../../../models/topic';
import WonderPickerItem from '../../../components/theme/wonder-picker/wonder-picker-item';

interface Props {
  choices: string[];
  selected: Topic[];
  onChangeSelected?: Function;
}

const PickedWonders = (props: Props) => {
  return (
    <View style={styles.row}>
      {props.choices.map((topic, i) => {
        if (topic) {
          return (
            <WonderPickerItem
              key={i}
              topic={topic}
              selected={
                !!props.selected.filter((t: Topic) => t.name === topic.name)
                  .length
              }
              onPress={props.onChangeSelected}
            />
          );
        } else {
          return (
            <View key={i} style={styles.placeholder}>
              <Text style={{ color: theme.colors.textColor }}>+</Text>
            </View>
          );
        }
      })}
    </View>
  );
};

export default PickedWonders;

const styles = StyleSheet.create({
  row: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  placeholder: {
    height: 80,
    width: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 5,
    backgroundColor: '#FFF'
  }
});
