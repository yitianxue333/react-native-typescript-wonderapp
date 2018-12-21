import React from 'react';
import { View, StyleSheet } from 'react-native';
import Screen from 'src/views/components/screen';
import ProposalSwiper from 'src/views/components/proposal-swiper/proposal-swiper';

import { Dispatch } from 'redux';
import DeviceInfo from 'react-native-device-info';
import { connect } from 'react-redux';
import {
  getNewProposal,
  rateProposal,
  getNextProposal,
  clearProposals
} from 'src/store/sagas/proposal';

import FoundMatchModal from 'src/views/components/modals/found-match-modal';
import { persistCurrentMatch } from 'src/store/reducers/wonder';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import { selectCurrentUser } from 'src/store/selectors/user';
import WonderAppState from 'src/models/wonder-app-state';
import Proposal from 'src/models/proposal';
import User from 'src/models/user';
import { AlertModal, IAlertModalProps } from '@components';
import { updateUser } from '../../../store/sagas/user';
import {
  getConversations,
  getConversation
} from 'src/store/sagas/conversations';

import PushNotificationService from '../../../services/push-notification';
import { RNPushNotificationToken } from '../../../services/push-notification';

const mapState = (state: WonderAppState) => ({
  currentUser: selectCurrentUser(state),
  proposal: state.wonder.proposal,
  currentMatch: state.wonder.currentMatch
});

const mapDispatch = (dispatch: Dispatch) => ({
  updatePushToken: (data: {
    push_device_id: string;
    push_device_type: string;
    tzinfo: string;
    tzoffset: number;
  }) => dispatch(updateUser(data)),
  updateTZ: (data: { tzinfo: string; tzoffset: number }) =>
    dispatch(updateUser(data)),
  updateUserUIFlags: (objToUpdate: any) =>
    dispatch(
      updateUser({
        onboarding_ui_state: objToUpdate
      })
    ),
  onGetNewProposal: () => dispatch(getNewProposal()),
  clearProposals: () => dispatch(clearProposals()),
  getNextProposal: (limit: number) => dispatch(getNextProposal(limit)),
  onLeftSwipe: (proposal: Proposal) =>
    dispatch(rateProposal({ proposal, liked: false })),
  onRightSwipe: (proposal: Proposal) =>
    dispatch(rateProposal({ proposal, liked: true })),
  onClearCurrentMatch: () => dispatch(persistCurrentMatch({})),
  onRefreshConversations: () => dispatch(getConversations()),
  onGetConversation: (partnerId: number) =>
    dispatch(getConversation({ id: partnerId, successRoute: 'Chat' }))
});

type Candidate = Partial<User>;

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  clearProposals: () => void;
  getNextProposal: (limit: number) => void;
  updateUserUIFlags: (
    objToUpdate: { [onboarding_ui_state_key: string]: boolean }
  ) => void;
  onGetNewProposal: Function;
  onClearCurrentMatch: Function;
  onLeftSwipe: Function;
  onRightSwipe: Function;
  proposal: WonderAppState['wonder']['proposal'];
  currentUser: User;
  currentMatch: Proposal;
  onGetConversation: Function;
  onRefreshConversations: Function;
  updatePushToken: (
    data: {
      push_device_id: string;
      push_device_type: string;
      tzinfo: string;
      tzoffset: number;
    }
  ) => void;
  updateTZ: (
    data: {
      tzinfo: string;
      tzoffset: number;
    }
  ) => void;
}

interface State {
  candidate?: Candidate | null;
  modalOpen: 'firstTime1' | 'firstTime2' | 'pass' | 'accept' | '';
  index: number;
}
class ProposalViewScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      candidate: null,
      modalOpen: '',
      index: 0
    };
  }

  componentDidMount() {
    const { proposal, updatePushToken, updateTZ, currentUser } = this.props;
    // Get a (guaranteed to be) new batch of 5 proposals

    this.setCandidate(null);
    this.props.getNextProposal(5);

    PushNotificationService.onRegister = (token: RNPushNotificationToken) => {
      const newDeviceId =
        !currentUser.push_device_id ||
        currentUser.push_device_id !== token.token;

      if (newDeviceId) {
        updatePushToken({
          push_device_id: token.token,
          push_device_type: token.os === 'ios' ? 'apns' : 'fcm',
          tzinfo: DeviceInfo.getTimezone(),
          tzoffset: (new Date().getTimezoneOffset() / 60) * -100
        });
      } else {
        updateTZ({
          tzinfo: DeviceInfo.getTimezone(),
          tzoffset: (new Date().getTimezoneOffset() / 60) * -100
        });
      }
    };

    PushNotificationService.configure(currentUser);
  }

  componentDidUpdate({ currentUser: { id: prevId } }: Props) {
    const {
      currentUser: { id, onboarding_ui_state }
    } = this.props;

    const userJustPersisted = !prevId && id;

    if (userJustPersisted) {
      if (onboarding_ui_state && !onboarding_ui_state.has_matched) {
        this.updateHasMatched();
        this.setState({ modalOpen: 'firstTime1' });
      }
    }
  }

  setCandidate = (candidate?: Candidate | null) => {
    this.setState({ candidate });
  }

  clearCandidate = () => {
    this.setState({ candidate: null });
  }

  clearCurrentMatch = () => {
    this.props.onClearCurrentMatch();
    this.props.onRefreshConversations();
  }

  goToChat = () => {
    const { onGetConversation, currentMatch } = this.props;
    this.props.onClearCurrentMatch();
    this.props.onRefreshConversations();
    onGetConversation(currentMatch.candidate.id);
    this.props.navigation.navigate('Chat', { name: currentMatch.candidate.first_name });
  }

  swipeRight = (index: number) => {
    const { proposal, currentUser } = this.props;

    const onboarding_ui_state = currentUser.onboarding_ui_state || {};
    const { has_swiped_right } = onboarding_ui_state;

    if (!has_swiped_right) {
      this.setState({ modalOpen: 'accept', index });
      this.props.updateUserUIFlags({
        ...onboarding_ui_state,
        has_swiped_right: true
      });
    } else {
      this.props.onRightSwipe(proposal[index]);
    }
  }

  swipeLeft = (index: number) => {
    const { proposal, currentUser } = this.props;

    const onboarding_ui_state = currentUser.onboarding_ui_state || {};
    const { has_swiped_left } = onboarding_ui_state;

    if (!has_swiped_left) {
      this.props.updateUserUIFlags({
        ...onboarding_ui_state,
        has_swiped_left: true
      });
      this.setState({ modalOpen: 'pass', index });
    } else {
      this.props.onLeftSwipe(proposal[index]);
    }
  }

  private handleModalPress = (): void => {
    const { modalOpen, index } = this.state;
    const { proposal } = this.props;

    if (modalOpen === 'pass') {
      this.props.onLeftSwipe(proposal[index]);
    } else if (modalOpen === 'accept') {
      this.props.onRightSwipe(proposal[index]);
    }

    this.closeModal();
  }

  private closeModal = (): void => {
    this.setState({ modalOpen: '' });
  }

  private onCloseFirstModal = (): void => {
    const { modalOpen } = this.state;

    if (modalOpen === 'firstTime1') {
      this.setState({ modalOpen: 'firstTime2' });
    } else {
      this.closeModal();
    }
  }

  private getFirstMatchModalProps = (): IAlertModalProps => {
    const { modalOpen } = this.state;

    const isFirst = modalOpen === 'firstTime1';

    const modalProps = {
      visible: modalOpen.includes('firstTime'),
      title: isFirst ? 'Wonders' : `About`,
      body: isFirst
        ? '"Activities" with circles around them are "Wonders" you have in common!'
        : 'Press the right bottom arrow to learn more about someone!',
      renderWonderful: false,
      onRequestClose: this.onCloseFirstModal,
      onPress: this.onCloseFirstModal,
      onPress2: this.onCloseFirstModal
    };

    return modalProps;
  }

  private getModalProps = (): IAlertModalProps => {
    const { modalOpen, index } = this.state;
    const { proposal } = this.props;

    const validProposal = proposal[index];
    const isPass = modalOpen === 'pass';
    const name = validProposal ? validProposal.candidate.first_name || '' : '';

    const modalProps = {
      visible: !!modalOpen && !modalOpen.includes('firstTime'),
      title: isPass ? "It's a Pass?" : `Wonder'n about ${name}?`,
      body: isPass
        ? "Swiping left means you don't want to get to know them."
        : 'Swiping right means you wanna chat with them.',
      buttonTitle: 'Cancel',
      buttonTitle2: isPass ? 'Pass' : 'Yep',
      onRequestClose: this.closeModal,
      renderWonderful: false,
      onPress: this.closeModal,
      onPress2: this.handleModalPress
    };

    return modalProps;
  }

  private updateHasMatched = (): void => {
    const onboarding_ui_state =
      this.props.currentUser.onboarding_ui_state || {};

    this.props.updateUserUIFlags({
      ...onboarding_ui_state,
      has_matched: true
    });
  }

  render() {
    const { proposal, currentMatch, currentUser } = this.props;

    return (
      <Screen>
        <AlertModal {...this.getModalProps()} />
        <AlertModal {...this.getFirstMatchModalProps()} />
        <View style={styles.flex1}>
          <ProposalSwiper
            currentUser={currentUser}
            proposal={proposal}
            onSwipeRight={this.swipeRight}
            onSwipeLeft={this.swipeLeft}
            clearProposals={this.props.clearProposals}
          />
        </View>
        <FoundMatchModal
          currentUser={currentUser}
          onSuccess={this.goToChat}
          onRequestClose={this.clearCurrentMatch}
          visible={Object.keys(currentMatch).length > 0}
          proposal={currentMatch}
        />
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  flex1: {
    flex: 1
  }
});

export default connect(
  mapState,
  mapDispatch
)(ProposalViewScreen);
