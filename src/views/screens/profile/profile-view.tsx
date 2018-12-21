import _ from 'lodash';
import React from 'react';

import {
  Platform,
  Dimensions,
  Modal,
  View,
  StyleSheet,
  Alert,
  AlertButton,
  AlertOptions,
  Linking,
  TouchableHighlight,
  ScrollView,
  Share
} from 'react-native';
import Screen from 'src/views/components/screen';
import ElevatedButton from 'src/views/components/theme/elevated-button';
import {
  PrimaryButton,
  Text,
  SecondaryButton as Button,
  Title
} from 'src/views/components/theme';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';

import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import { logoutUser, getUser, deactivateAccount } from 'src/store/sagas/user';
import Avatar, { AvatarSize } from 'src/views/components/theme/avatar';

import { selectCurrentUser, selectAuth } from 'src/store/selectors/user';
import User from 'src/models/user';
import TouchableOpacityOnPress from 'src/models/touchable-on-press';
import WonderAppState from 'src/models/wonder-app-state';
import ProfileModalChat from 'src/views/components/modals/profile-modal-chat';
import { HTTP_DOMAIN } from 'src/services/api';

import moment from 'moment';
import VideoPlayer from 'react-native-video-player';
import LinearGradient from 'react-native-linear-gradient';
import { IconButton } from '../../components/theme';
import WonderImage from '../../components/theme/wonder-image';
import theme from '../../../assets/styles/theme';
import Wonder from '../../components/theme/wonder/wonder';
import Color from 'color';
import { INITIAL_PROFILE_NAV } from '@utils';
import { setAlertModal, IAPIAlert } from '@actions';
import { confirmLogoutAlertTexts, confirmDeactivateAlertTexts } from '@texts';

const { height } = Dimensions.get('window');

const gradient = [
  lighten(theme.colors.primaryLight, 0.5),
  lighten(theme.colors.primary, 0.5)
];

function lighten(color: string, value: number) {
  return Color(color)
    .fade(value)
    .toString();
}

interface AuthToken {
  uid: number;
  token: string;
}
interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  currentUser: User;
  onLogout: (id: number, token: string) => void;
  onRefreshProfile: () => void;
  deactivateUsersAccount: (data: { id: number; token: string }) => void;
  auth: AuthToken;
  setAlertModal: (data: IAPIAlert) => void;
}

const mapState = (state: WonderAppState) => ({
  currentUser: selectCurrentUser(state),
  auth: selectAuth(state)
});

const mapDispatch = (dispatch: Dispatch) => ({
  setAlertModal: (data: IAPIAlert) => dispatch(setAlertModal(data)),
  onLogout: (id: number, token: string) => dispatch(logoutUser({ id, token })),
  onRefreshProfile: () => dispatch(getUser()),
  deactivateUsersAccount: ({ id, token }: { id: number; token: string }) =>
    dispatch(deactivateAccount({ id, token }))
});

class ProfileViewScreen extends React.Component<Props> {
  static navigationOptions = {
    header: null
  };

  state = {
    profileModalOpen: false,
    showVideo: false,
    contentHeight: 0,
    showDetails: false
  };

  componentDidMount() {
    this.props.onRefreshProfile();

    if (INITIAL_PROFILE_NAV) {
      this.props.navigation.navigate(INITIAL_PROFILE_NAV);
    }
  }

  goTo = (key: string, params?: any) => {
    const { navigation } = this.props;
    return () => navigation.navigate(key);
  }

  getProfileImage = () => {
    const { currentUser } = this.props;

    if (currentUser.images && currentUser.images.length) {
      return currentUser.images[0].url;
    }
    return null;
  }
  deactivateAccount = () => {
    const {
      auth: { uid: id, token }
    } = this.props;

    this.props.setAlertModal({
      ...confirmDeactivateAlertTexts,
      onPress2: () => {
        this.props.deactivateUsersAccount({
          id,
          token
        });
      }
    });
  }

  showFaq = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Sorry! This link cannot be opened on your device');
      }
    });
  }

  promptLogout = () => {
    const { onLogout, auth } = this.props;

    this.props.setAlertModal({
      ...confirmLogoutAlertTexts,
      onPress2: () => onLogout(auth.uid, auth.token)
    });
  }

  openProfileModal = () => {
    this.setState({ profileModalOpen: !this.state.profileModalOpen });
  }

  getTopics = () => {
    const { currentUser, conversation } = this.props;
    const candidate = conversation.partner;
    const candidateTopics = candidate.topics || [];
    const userTopics = currentUser.topics;
    return (
      <View style={{ flexDirection: 'row' }}>
        {currentUser &&
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

  share = () => {
    Share.share({
      message:
        'Thought you would like to find someone Wonder’ful on the Wonder Dating App! Click here to download!',
      url: 'http://getwonderapp.com/',
      title: 'Heard of Wonder?'
    });
  }

  render() {
    const { currentUser, onLogout } = this.props;
    const { showVideo } = this.state;
    const years = moment().diff(currentUser.birthdate, 'years');
    return (
      <View style={styles.outerContainer}>
        <View style={[styles.row]}>
          <View style={[styles.col, styles.heading]}>
            <TouchableHighlight
              onPress={this.openProfileModal}
              underlayColor='transparent'
            >
              <Avatar
                rounded
                uri={this.getProfileImage()}
                size={AvatarSize.lg}
              />
            </TouchableHighlight>
            <Text allowFontScaling={false} style={{ marginTop: 6 }}>
              {currentUser.first_name}
            </Text>
          </View>
        </View>
        <View>
          <View style={styles.row}>
            <View style={styles.col}>
              <ElevatedButton
                style={styles.btnMargin}
                innerStyle={styles.btnHeight}
                icon='user'
                title={currentUser.first_name}
                onPress={this.goTo('ProfileEdit')}
              />
            </View>
            <View style={styles.col}>
              <ElevatedButton
                style={styles.btnMargin}
                innerStyle={styles.btnHeight}
                icon='heart'
                title='Activities'
                onPress={this.goTo('ProfileWonders')}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <ElevatedButton
                style={styles.btnMargin}
                innerStyle={styles.btnHeight}
                icon='image'
                title='Photos'
                onPress={this.goTo('ProfileMedia')}
              />
            </View>
            <View style={styles.col}>
              <ElevatedButton
                style={styles.btnMargin}
                innerStyle={styles.btnHeight}
                icon='envelope-o'
                title='Contact'
                onPress={this.goTo('Feedback')}
              />
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col}>
              <ElevatedButton
                style={styles.btnMargin}
                innerStyle={styles.btnHeight}
                icon='gear'
                title='Settings'
                onPress={this.goTo('ProfilePreferences')}
              />
            </View>
            <View style={styles.col}>
              <ElevatedButton
                style={styles.btnMargin}
                innerStyle={styles.btnHeight}
                icon='question'
                title='FAQ'
                onPress={() => this.showFaq(`${HTTP_DOMAIN}/faq.html`)}
              />
            </View>
          </View>
        </View>
        <View style={styles.btnContainer}>
          <TouchableHighlight onPress={this.share} underlayColor='transparent'>
            <Text style={{ color: theme.colors.primary, marginTop: 15 }}>
              Share Wonder with friends!
            </Text>
          </TouchableHighlight>
        </View>
        <View style={{ marginVertical: 10 }}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Button
                style={{ margin: 8 }}
                innerStyle={styles.logoutStyles}
                rounded
                title='Logout'
                onPress={this.promptLogout}
              />
            </View>
            <View style={styles.col}>
              <Button
                style={{ margin: 8 }}
                innerStyle={styles.logoutStyles}
                rounded
                title='Deactivate'
                onPress={this.deactivateAccount}
              />
            </View>
          </View>
        </View>
        <Modal
          transparent={true}
          animationType='fade'
          visible={this.state.profileModalOpen}
          onRequestClose={this.openProfileModal}
        >
          <LinearGradient colors={gradient} style={styles.modalContainer}>
            <View style={styles.modalInnerContainer}>
              <LinearGradient
                colors={['rgba(0,0,0,0.5)', 'transparent']}
                style={styles.topGradient}
              >
                <View style={styles.iconContainer}>
                  {currentUser.video ? (
                    <View>
                      {showVideo ? (
                        <IconButton
                          size={35}
                          icon={'camera'}
                          onPress={() =>
                            this.setState({ showVideo: !this.state.showVideo })
                          }
                          primary={theme.colors.primaryLight}
                          secondary='transparent'
                        />
                      ) : (
                        <IconButton
                          size={35}
                          icon={'video-camera'}
                          onPress={() =>
                            this.setState({ showVideo: !this.state.showVideo })
                          }
                          primary={theme.colors.primaryLight}
                          secondary='transparent'
                        />
                      )}
                    </View>
                  ) : (
                    <View />
                  )}
                  <IconButton
                    size={35}
                    icon={'close'}
                    onPress={this.openProfileModal}
                    primary={'#fff'}
                    secondary='transparent'
                  />
                </View>
              </LinearGradient>
              <View style={styles.scrollContainer}>
                <ScrollView>
                  {currentUser.video && showVideo ? (
                    <View style={styles.containerHeight}>
                      <VideoPlayer
                        customStyles={{ videoWrapper: styles.videoStyles }}
                        videoHeight={
                          Platform.OS === 'ios'
                            ? (height / 3) * 2 * 4.74
                            : height * 2.58
                        }
                        pauseOnPress={true}
                        disableFullscreen={true}
                        autoplay={true}
                        video={{
                          uri: `${currentUser.video}`
                        }}
                      />
                    </View>
                  ) : (
                    <View style={styles.imageContainer}>
                      {currentUser.images &&
                        currentUser.images.map((i, index) => {
                          if (index === 0) {
                            return (
                              <View key={i.url}>
                                <WonderImage
                                  background
                                  style={styles.containerHeight}
                                  uri={i.url}
                                >
                                  <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.5)']}
                                    style={[styles.imageTopGradient]}
                                  >
                                    <View>
                                      <Text
                                        allowFontScaling={false}
                                        style={styles.firstNameText}
                                      >
                                        {currentUser.first_name}, {years}
                                      </Text>
                                    </View>
                                  </LinearGradient>
                                </WonderImage>
                                <View style={styles.infoContainer}>
                                  <View style={{ flexDirection: 'row' }}>
                                    {currentUser.topics &&
                                      currentUser.topics.map((x) => {
                                        return (
                                          <Wonder
                                            key={x.name}
                                            topic={x}
                                            size={60}
                                            active={false}
                                          />
                                        );
                                      })}
                                  </View>
                                  <Text
                                    allowFontScaling={false}
                                    style={styles.occupationText}
                                  >
                                    {!!currentUser.occupation &&
                                      currentUser.occupation}
                                  </Text>
                                  <Text
                                    allowFontScaling={false}
                                    style={styles.genericText}
                                  >
                                    {!!currentUser.school && currentUser.school}
                                  </Text>
                                  <Text
                                    allowFontScaling={false}
                                    style={styles.genericText}
                                  >
                                    {!!currentUser.about && currentUser.about}
                                  </Text>
                                </View>
                              </View>
                            );
                          } else {
                            return (
                              <WonderImage
                                key={i.url}
                                style={styles.regularImageStyles}
                                uri={i.url}
                              />
                            );
                          }
                        })}
                    </View>
                  )}
                </ScrollView>
              </View>
            </View>
          </LinearGradient>
        </Modal>
      </View>
    );
  }
}

export default connect(
  mapState,
  mapDispatch
)(ProfileViewScreen);

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-around',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
    // marginBottom: 5
  },
  col: {
    flex: 1
  },
  heading: {
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  modalInnerContainer: {
    position: 'relative',
    height: (height / 3) * 2,
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
    marginRight: 15,
    marginLeft: 15,
    marginBottom: 15
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    padding: 5,
    zIndex: 999,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10
  },
  iconContainer: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  scrollContainer: { borderRadius: 10, overflow: 'hidden' },
  containerHeight: {
    height: (height / 3) * 2,
    zIndex: 1,
    justifyContent: 'flex-end'
  },
  imageContainer: { borderRadius: 10, overflow: 'hidden' },
  videoStyles: {
    backgroundColor: 'black',
    borderRadius: 10,
    overflow: 'hidden'
  },
  imageTopGradient: {
    padding: 10,
    zIndex: 999
  },
  firstNameText: {
    fontSize: 26,
    color: '#fff',
    marginLeft: 5,
    marginBottom: 2,
    fontWeight: '800'
  },
  regularImageStyles: { height: (height / 3) * 2, zIndex: 1 },
  topicsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4
  },
  schoolText: { color: '#fff', marginLeft: 5, fontSize: 12 },
  distanceText: { color: '#fff', fontSize: 13, marginLeft: 2 },
  detailsChevron: { justifyContent: 'flex-end' },
  occupationText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333'
  },
  genericText: { marginLeft: 5, fontSize: 12, lineHeight: 18, color: '#333' },
  infoContainer: { backgroundColor: '#fff', padding: 10 },
  btnMargin: { margin: 6 },
  btnHeight: { height: 40 },
  logoutStyles: { height: 40, backgroundColor: '#f2f2f2' },
  btnContainer: {
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '70%',
    alignSelf: 'center'
  }
});
