import React from 'react';
import _ from 'lodash';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import Screen from 'src/views/components/screen';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Text,
  Platform,
  ActivityIndicator
} from 'react-native';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import ChatActionButton from 'src/views/components/chat/chat-action-button';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import { getConversation, ghostContact } from 'src/store/sagas/conversations';
import { updateUser } from 'src/store/sagas/user';
import { blockUser } from 'src/store/sagas/partner';
import {
  getDecoratedConversation,
  decorateMessagesForGiftedChat
} from 'src/store/selectors/conversation';
import { selectCurrentUser } from 'src/store/selectors/user';
import User from 'src/models/user';
import {
  DecoratedConversation,
  ConversationNewMessage
} from 'src/models/conversation';
import GiftedChatMessage from 'src/models/chat-message';
import ChatGhostingModal from '../../components/modals/chat-ghosting-modal';
import WonderAppState from 'src/models/wonder-app-state';
import ChatResponseMessage from 'src/models/chat-response-message';
import {
  AppointmentState,
  persistAppointmentData
} from 'src/store/reducers/appointment';
import {
  persistNewChatMessage,
  persistMessageAsRead,
  persistGhostMessage,
  clearCurrentConversation
} from 'src/store/reducers/chat';
import Assets from 'src/assets/images';
import Topic from 'src/models/topic';
import ImagePicker from 'react-native-image-picker';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu';
import { Options, Response } from '../../../models/image-picker';
import { ImageSource } from 'react-native-vector-icons/Icon';
import Wonder from 'src/views/components/theme/wonder/wonder';
import ProfileModalChat from 'src/views/components/modals/profile-modal-chat';
import { AlertModal } from '@components';
import { setAlertModal, IAPIAlert } from '@actions';

interface DispatchProps {
  onGetMessage: (userId: number) => void;
  onSendMessage: (chatMessage: ConversationNewMessage) => void;
  onUpdateAppointment: (data: AppointmentState) => void;
  onGhostContact: (data: User) => void;
  onReadMessages: (data: any) => void;
  onSendGhostMessage: (data: any) => void;
  onReportUser: (data: object) => void;
  updateHasScheduledWonder: (
    onboardingUIState: WonderAppState['user']['profile']['onboarding_ui_state']
  ) => void;
}

interface StateProps {
  currentUser: User;
  token: string | null;
  conversation: DecoratedConversation;
}

interface Props extends DispatchProps, StateProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
  setAlertModal: (data: IAPIAlert) => void;
}

interface ChatViewState {
  isGhostingModalOpen: boolean;
  selectedSendImage: ImageSource;
  conversationMessages: GiftedChatMessage[];
  profileModalOpen: boolean;
  showVideo: boolean;
  showDetails: boolean;
  contentHeight: number;
  modalVisible: boolean;
}

const mapState = (state: WonderAppState): StateProps => ({
  token: state.user.auth.token,
  currentUser: selectCurrentUser(state),
  conversation: getDecoratedConversation(state)
});

const mapDispatch = (dispatch: Dispatch): DispatchProps => ({
  updateHasScheduledWonder: (
    onboardingUIState: WonderAppState['user']['profile']['onboarding_ui_state']
  ) =>
    dispatch(
      updateUser({
        onboarding_ui_state: onboardingUIState
      })
    ),
  onGetMessage: (userId: number) => dispatch(getConversation({ id: userId })),
  onUpdateAppointment: (data: AppointmentState) =>
    dispatch(persistAppointmentData(data)),
  onGhostContact: (data: User) => dispatch(ghostContact(data)),
  onSendMessage: (message: any) => dispatch(persistNewChatMessage(message)),
  onReadMessages: (data: object) => dispatch(persistMessageAsRead(data)),
  onSendGhostMessage: (data: object) => dispatch(persistGhostMessage(data)),
  onReportUser: (data: object) => dispatch(blockUser(data)),
  onClearConversation: () => dispatch(clearCurrentConversation()),
  setAlertModal: (data: IAPIAlert) => dispatch(setAlertModal(data))
});

class ChatScreen extends React.Component<Props> {
  cable: any;
  appChat: any;

  static navigationOptions = ({
    navigation
  }: {
    navigation: NavigationScreenProp<any, NavigationParams>;
  }) => {
    return {
      title: navigation.getParam('title', 'Chat'),
      headerRight: (
        <View style={{ marginRight: 10 }}>
          <Menu>
            <MenuTrigger>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 40
                }}
              >
                <Icon name='ellipsis-v' size={20} color='#9292ad' />
              </View>
            </MenuTrigger>
            <MenuOptions>
              <MenuOption
                onSelect={() => navigation.state.params.openProfileModal()}
              >
                <Text style={{ fontSize: 16, color: 'black' }}>
                  View profile
                </Text>
              </MenuOption>
              <MenuOption
                onSelect={() => navigation.state.params.onBlockConversation()}
              >
                <Text style={{ fontSize: 16, color: 'black' }}>
                  Block and report
                </Text>
              </MenuOption>

              <MenuOption
                onSelect={() => navigation.state.params.onGhostPartner()}
              >
                <Text style={{ fontSize: 16, color: 'black' }}>Unmatch</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
      )
    };
  }

  _hasShownModal: boolean = false;

  state: ChatViewState = {
    isGhostingModalOpen: false,
    selectedSendImage: '',
    conversationMessages: [],
    profileModalOpen: false,
    showVideo: false,
    contentHeight: 0,
    showDetails: false,
    modalVisible: false
  };

  componentWillMount() {
    const { conversation, navigation } = this.props;
    navigation.setParams({
      title: navigation.state.params.name,
      onGhostPartner: this.showAlert,
      onBlockConversation: this.showBlockAlert,
      openProfileModal: this.openProfileModal
    });
  }

  componentDidMount() {
    const { currentUser, conversation, navigation } = this.props;
    const chats = decorateMessagesForGiftedChat(currentUser, conversation);
    this.setState({ conversationMessages: chats.giftedChatMessages });

    const redirect = navigation.getParam('redirect', '');
    if (redirect === 'ghosting') {
      this.openGhostingModal();
      navigation.setParams({ redirect: '' });
    } else if (redirect === 'profile') {
      this.openProfileModal();
      navigation.setParams({ redirect: '' });
    }
  }

  componentDidUpdate(prevProps: any) {
    const { currentUser, conversation } = this.props;

    if (
      !this._hasShownModal &&
      conversation &&
      (!currentUser.onboarding_ui_state ||
        !currentUser.onboarding_ui_state.has_scheduled_wonder)
    ) {
      const chats = decorateMessagesForGiftedChat(currentUser, conversation);

      if (chats && chats.giftedChatMessages.length >= 4) {
        this._hasShownModal = true;

        this.setState(
          { modalVisible: true },
          this.localUpdateHasScheduledWonder
        );
      }
    }

    if (conversation !== prevProps.conversation && !_.isEmpty(conversation)) {
      const chats = decorateMessagesForGiftedChat(currentUser, conversation);

      if (chats) {
        this.setState({ conversationMessages: chats.giftedChatMessages });
      }
    }
  }

  componentWillUnmount() {
    const { currentUser, conversation } = this.props;
    if (this.appChat) {
      this.cable.subscriptions.remove(this.appChat);
    }
    this.props.onReadMessages({
      user: currentUser.id,
      conversation_id: conversation.id
    });
    this.props.onClearConversation();
  }

  private localUpdateHasScheduledWonder = (): void => {
    const {
      currentUser: { onboarding_ui_state = {} }
    } = this.props;

    this.props.updateHasScheduledWonder({
      ...onboarding_ui_state,
      has_scheduled_wonder: true
    });
  }

  scheduleWonder = () => {
    const { navigation, conversation, onUpdateAppointment } = this.props;
    onUpdateAppointment({ match: conversation.partner });
    navigation.navigate('WonderMap', { id: conversation.partner.id });
  }

  openGhostingModal = () => {
    this.setState({ isGhostingModalOpen: true });
  }

  closeGhostingModal = () => {
    this.setState({ isGhostingModalOpen: false });
  }

  openProfileModal = () => {
    this.setState({ profileModalOpen: !this.state.profileModalOpen });
  }

  showBlockAlert = () => {
    this.props.setAlertModal({
      title: 'Please Confirm',
      body: `Are you sure you want to Block and Report this User?`,
      alertVisible: true,
      buttonTitle: 'Cancel',
      buttonTitle2: 'Block',
      onPress2: this.blockPartner
    });
  }

  // could refactor these two alerts
  showAlert = () => {
    this.props.setAlertModal({
      title: 'Please Confirm',
      body: `Are you sure you want to unmatch?`,
      alertVisible: true,
      buttonTitle: 'Cancel',
      buttonTitle2: 'Yes',
      onPress2: this.ghostPartner
    });
  }

  onSend = (messages: ChatResponseMessage[] = []) => {
    const { conversation } = this.props;
    messages.forEach((message: ChatResponseMessage) => {
      this.props.onSendMessage({
        message,
        recipient_id: conversation.partner.id,
        recipient: conversation.partner,
        sender: this.props.currentUser,
        conversation_id: this.props.conversation.id
      });
    });

    this.setState({ selectedSendImage: '' });
  }

  renderBubble(props: any) {
    return (
      <Bubble
        {...props}
        textStyle={bubbleTextStyle}
        wrapperStyle={bubbleWrapperStyle}
      />
    );
  }

  renderSend = (props: any) => {
    return (
      <Send {...props}>
        <View style={{ marginRight: 12, marginBottom: 15 }}>
          <Icon name='paper-plane' size={20} color='#9292ad' />
        </View>
      </Send>
    );
  }

  renderActions = (props: any) => {
    return (
      <TouchableOpacity onPress={this.getImage}>
        <View style={{ marginLeft: 12, marginBottom: 15 }}>
          <Icon name='plus' size={20} color='#9292ad' />
        </View>
      </TouchableOpacity>
    );
  }

  getImage = () => {
    const options: Options = {
      title: 'Upload a Photo',
      mediaType: 'photo'
    };

    ImagePicker.showImagePicker(options, (res: Response) => {
      if (res.didCancel) {
        // console.log("User cancelled!");
      } else if (res.error) {
        // console.log("Error", res.error);
      } else {
        const source = { uri: res.uri.replace('file://', '') };
        this.setState({ selectedSendImage: source });
      }
    });
  }

  blockPartner = () => {
    const { conversation, navigation } = this.props;

    this.props.onReportUser({ id: conversation.partner.id });
    this.props.onSendGhostMessage({
      ghostMessage: '',
      conversation_id: conversation.id,
      partner: conversation.partner
    });
    navigation.navigate('ChatList');
  }

  ghostPartner = (ghostMessage: string) => {
    const { navigation, onGhostContact, conversation } = this.props;

    this.props.onSendGhostMessage({
      ghostMessage,
      conversation_id: conversation.id,
      partner: conversation.partner
    });
    onGhostContact({ partner: conversation.partner, message: ghostMessage });
    this.closeGhostingModal();
    navigation.navigate('ChatList');
  }

  getTopics = () => {
    const { currentUser, conversation } = this.props;
    const candidate = conversation.partner;
    const candidateTopics = candidate.topics || [];
    const userTopics = currentUser.topics;

    return (
      <View style={{ flexDirection: 'row' }}>
        {candidate &&
          candidateTopics.map((x: Topic) => {
            if (userTopics) {
              const active: boolean = !!userTopics.find(
                (i: Topic) => i.name === x.name
              );
              return (
                <Wonder key={x.name} topic={x} size={60} active={active} />
              );
            }
          })}
      </View>
    );
  }

  toggleDetails = () => {
    const showDetails = !this.state.showDetails;
    this.setState({ showDetails });
  }

  renderFooter = () => {
    return (
      <View style={styles.footerContainer}>
        <View style={styles.actionBtnContainer} flexDirection={'row'}>
          <ChatActionButton
            bold={Platform.OS === 'ios' ? false : true}
            title='Schedule Wonder'
            onPress={this.scheduleWonder}
          />
          <TouchableOpacity
            onPress={this.openGhostingModal}
            style={[styles.ghostButtonStyle, { borderWidth: 2 }]}
          >
            <Image
              source={Assets.GhostButton}
              style={{ width: 28, height: 32 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  private closeModalAndScheduleWonder = (): void => {
    this.setState({ modalVisible: false }, () => {
      setTimeout(this.scheduleWonder, 500);
    });
  }

  render() {
    const { currentUser, conversation } = this.props;
    const { modalVisible } = this.state;

    if (!_.isEmpty(conversation)) {
      return (
        <Screen>
          <AlertModal
            onPress={this.closeModalAndScheduleWonder}
            onRequestClose={this.closeModalAndScheduleWonder}
            buttonTitle={'Schedule Wonder'}
            renderWonderful={true}
            visible={modalVisible}
            title={'Wonder Time!'}
            body={`Schedule with ${
              conversation.partner.first_name
            } to do something`}
          />
          <GiftedChat
            renderAvatarOnTop
            user={{ _id: currentUser.id }}
            renderSend={this.renderSend}
            renderBubble={this.renderBubble}
            messages={this.state.conversationMessages}
            renderFooter={this.renderFooter}
            onSend={this.onSend}
            renderActions={this.renderActions}
            dateFormat={'LLL'}
            renderTime={() => null}
            onPressAvatar={this.openProfileModal}
          />
          <ChatGhostingModal
            visible={this.state.isGhostingModalOpen}
            onSuccess={this.ghostPartner}
            onCancel={this.closeGhostingModal}
            conversation={conversation}
          />
          <ProfileModalChat
            currentUser={currentUser}
            conversation={conversation}
            visible={this.state.profileModalOpen}
            onRequestClose={this.openProfileModal}
            showVideo={this.state.showVideo}
            openProfileModal={this.openProfileModal}
            toggleVideo={() =>
              this.setState({ showVideo: !this.state.showVideo })
            }
            showDetails={this.state.showDetails}
            toggleDetails={this.toggleDetails}
          />
        </Screen>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff'
          }}
        >
          <ActivityIndicator />
        </View>
      );
    }
  }
}

export default connect(
  mapState,
  mapDispatch
)(ChatScreen);

const bubbleTextStyle = StyleSheet.create({
  right: {
    color: '#FFF',
    fontWeight: 'bold'
  },
  left: {
    color: '#000',
    fontWeight: 'bold'
  }
});

const bubbleWrapperStyle = StyleSheet.create({
  right: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    elevation: 3,
    shadowColor: 'blue',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {
      width: 3,
      height: 1
    },
    backgroundColor: '#fcb26a',
    marginVertical: 5
  },
  left: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: {
      width: -3,
      height: 1
    },
    backgroundColor: '#FFF',
    marginVertical: 5
  }
});

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  ghostButtonStyle: {
    marginLeft: 20,
    marginTop: 2,
    borderRadius: 100 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: 46,
    height: 46,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#fcbd77'
  },
  footerContainer: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  actionBtnContainer: { width: '50%', alignItems: 'center' }
});
