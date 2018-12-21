import _ from 'lodash';
import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {
  Text,
  PrimaryButton,
  TextInput,
  WonderPicker
} from 'src/views/components/theme';
import Screen from 'src/views/components/screen';

import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { getTopics } from 'src/store/sagas/topics';

import { updateUser } from 'src/store/sagas/user';
import WonderPickerSectionList from 'src/views/components/theme/wonder-picker/wonder-picker-sectionlist';
import PickedWonders from 'src/views/components/theme/wonder-picker/picked-wonders';

import { selectCurrentUser } from 'src/store/selectors/user';
import User from 'src/models/user';
import Topic from 'src/models/topic';
import WonderAppState from 'src/models/wonder-app-state';
import theme from '../../../assets/styles/theme';

interface Props {
  currentUser: User;
  navigation: NavigationScreenProp<any, NavigationParams>;
  topics: Topic[];
  getAllTopics: Function;
  onSave: Function;
}

interface State {
  search: string;
  selected: Topic[];
}

const mapState = (state: WonderAppState) => ({
  currentUser: selectCurrentUser(state),
  topics: state.wonder.topics
});

const mapDispatch = (dispatch: Dispatch) => ({
  getAllTopics: () => dispatch(getTopics()),
  onSave: (data: Partial<User>) => dispatch(updateUser(data))
});

const chosenItems = (arr: string[]) => {
  const arr2 = ['', '', ''];
  if (arr.length <= 3) {
    for (let i = 0; i < arr2.length; i++) {
      if (arr[i]) {
        arr2[i] = arr[i];
      }
    }
  }
  return arr2;
};

class ProfileWondersScreen extends React.Component<Props, State> {
  static defaultProps = {
    topics: []
  };

  state = {
    search: '',
    selected: this.props.currentUser.topics || []
  };

  componentWillMount() {
    this.props.getAllTopics();
  }

  onSearchTextChange = (text: string) => {
    this.setState({ search: text.toLowerCase() });
  }

  onChangeSelected = (topic: Topic) => {
    const limit = 3;
    const { selected } = this.state;
    if (
      (!limit || selected.length < limit) &&
      !selected.filter((t: Topic) => t.name === topic.name).length
    ) {
      this.setState({ selected: [...selected, topic] });
    } else {
      this.setState({
        selected: selected.filter((t: Topic) => t.name !== topic.name)
      });
    }
  }

  filterTopics = () => {
    const { search } = this.state;
    const { topics } = this.props;
    if (search) {
      return topics.filter((topic: Topic) => {
        const isInName = topic.name.toLowerCase().indexOf(search) >= 0;
        const isInKeywords = topic.keywords.indexOf(search) >= 0;

        return isInName || isInKeywords;
      });
    }
    return topics;
  }

  renderPicker = () => {
    const filteredTopics = this.filterTopics();
    const { selected } = this.state;
    const { topics } = this.props;
    const quickDates = topics.filter(
      (t) => t.name === 'Coffee' || t.name === 'Lunch' || t.name === 'Dinner'
    );

    const groupedTopics = _.chunk(filteredTopics, 3);
    const groupedQuickDates = _.chunk(quickDates, 3);

    if (filteredTopics.length) {
      return (
        <WonderPickerSectionList
          selected={selected}
          onChangeSelected={this.onChangeSelected}
          groupedTopics={groupedTopics}
          groupedQuickDates={groupedQuickDates}
        />
      );
    }
    return (
      <View>
        <Text style={{ textAlign: 'center' }}>
          Sorry! Looks like we do not have a wonder that matches what you are
          looking for.
        </Text>
      </View>
    );
  }

  renderPicks = () => {
    const { selected } = this.state;
    const choices = chosenItems(selected);
    return (
      <PickedWonders
        choices={choices}
        onChangeSelected={this.onChangeSelected}
        selected={selected}
      />
    );
  }

  validate = () => {
    const { onSave, currentUser, navigation } = this.props;
    const { selected } = this.state;
    if (selected.length === 3) {
      onSave({ topic_ids: selected.map((s: Topic) => s.id) });
      navigation.goBack();
    }
  }

  render() {
    const { selected } = this.state;
    return (
      <Screen>
        {/* <View style={{ paddingVertical: 15 }}>
          <Text style={{ textAlign: 'center' }}>
            Please select 3 Wonders for us to find people and activities in your area.
          </Text>
        </View> */}
        <View style={styles.contentContainer}>
          <View>{this.renderPicks()}</View>
          <View
            style={{paddingVertical: 15, width: '70%', alignSelf: 'center'}}
          >
            <TextInput
              color={theme.colors.primaryLight}
              containerStyles={{borderBottomColor: theme.colors.primaryLight}}
              autoCorrect={false}
              autoCapitalize='none'
              icon='search'
              placeholder='Search'
              onChangeText={this.onSearchTextChange}
            />
          </View>
          <View flex={1}>
            {this.renderPicker()}
          </View>
        </View>
        <PrimaryButton
          disabled={selected.length !== 3}
          title='Save'
          rounded={false}
          onPress={this.validate}
        />
      </Screen>
    );
  }
}

export default connect(
  mapState,
  mapDispatch
)(ProfileWondersScreen);

const styles = StyleSheet.create({
  welcome: {
    fontSize: 14,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  contentContainer: {paddingHorizontal: 20, flex: 1},
});
