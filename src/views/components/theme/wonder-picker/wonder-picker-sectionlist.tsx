import React from 'react';
import { View, Text, SectionList, StyleSheet } from 'react-native';
import theme from 'src/assets/styles/theme';
import Topic from 'src/models/topic';
import WonderPickerItem from 'src/views/components/theme/wonder-picker/wonder-picker-item';

interface Props {
  selected: Topic[];
  onChangeSelected?: Function;
  groupedQuickDates: Topic[][];
  groupedTopics: Topic[][];
}

const WonderPickerSectionList = (props: Props) => {
  const renderWonder = (topic: Topic) => {
    const selected = props.selected;
    return (
      <WonderPickerItem
        key={topic.name}
        topic={topic}
        selected={!!selected.filter((t: Topic) => t.name === topic.name).length}
        onPress={props.onChangeSelected}
      />
    );
  };

  const renderRow = ({ item }: { item: any }) => {
    if (item.length < 3) {
      return (
        <View style={styles.lessThanThree}>
          {item.map((i) => {
            return (
              <View key={i.name} style={styles.wonderMargin}>
                {renderWonder(i)}
              </View>
            );
          })}
        </View>
      );
    }
    return <View style={styles.row}>{item.map(renderWonder)}</View>;
  };
  return (
    <SectionList
      stickySectionHeadersEnabled={false}
      renderItem={renderRow}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.sectionHeader}>{title}</Text>
      )}
      sections={[
        { title: 'Quick Dates', data: props.groupedQuickDates },
        { title: '', data: props.groupedTopics }
      ]}
      keyExtractor={(item, index) => item + index}
      renderSectionFooter={() => <View style={styles.sectionFooter} />}
      ListFooterComponent={() => <View style={styles.footer} />}
    />
  );
};

export default WonderPickerSectionList;

const styles = StyleSheet.create({
  row: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sectionHeader: {
    textAlign: 'center',
    margin: 4,
    color: theme.colors.textColor
  },
  sectionFooter: {
    alignSelf: 'center',
    borderBottomColor: theme.colors.primaryLight,
    borderBottomWidth: 2,
    width: '80%',
    padding: 10
  },
  footer: { height: 80 },
  lessThanThree: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15
  },
  wonderMargin: { marginRight: 20 }
});
