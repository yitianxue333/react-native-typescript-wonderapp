import React from 'react';
import {DeckSwiper} from 'native-base';
import {Text, Title, WonderImage} from '../theme';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
  Image,
  Alert, ImageBackground
} from 'react-native';
import _ from 'lodash';
import moment from 'moment-timezone';
import Icon from 'react-native-vector-icons/Entypo';
import {Swiper} from '@components';
import Topic from 'src/models/topic';
import Images from 'src/assets/images';
import LinearGradient from 'react-native-linear-gradient';
import Wonder from '../theme/wonder/wonder';
import Proposal from 'src/models/proposal';
import User from 'src/models/user';
import ProfileImage from 'src/models/profile-image';
import Candidate from 'src/models/candidate';
import Screen from 'src/views/components/screen';
import googleMaps, {GoogleGeoLocation} from '../../../services/google-maps';
import MatchAvailableMedia from '../../components/proposal-swiper/match-available-media';
import VibeVideoModal from '../modals/vibe-video-modal';

const deviceHeight = Dimensions.get('window').height;

interface State {
}

interface Props {
  proposal: Proposal[];
  onSwipeLeft: (index: number) => void;
  onSwipeRight: (index: number) => void;
  currentUser: User;
  clearProposals: () => void;
}

interface CardDetailsOverlayProps {
  candidate: Candidate;
  currentUser: User;
}

interface CardDetailsOverlayState {
  showDetails: boolean;
  animation: Animated.Value;
  contentHeight: number;
  imageCount: number;
  location: string;
  showVideoPlayer: boolean;
}

class CardDetailsOverlay extends React.Component<CardDetailsOverlayProps,
  CardDetailsOverlayState> {
  state = {
    contentHeight: 0,
    showDetails: false,
    imageCount: 0,
    showVideoPlayer: false,
    location: '',
    animation: new Animated.Value(0)
  };

  componentDidMount() {
    this.lookupZipcode();
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.candidate.id !== prevProps.candidate.id) {
      this.setState({imageCount: 0});
    }
  }

  lookupZipcode = async () => {
    const {zipcode} = this.props.candidate;
    if (zipcode) {
      const geolocation: GoogleGeoLocation = await googleMaps.geocodeByZipCode(
        zipcode
      );
      this.setState({location: `${geolocation.city}, ${geolocation.state}`});
    }
  }

  renderDistance = () => {
    const {candidate} = this.props;
    const distance =
      candidate.distance && _.get(candidate, 'distance', 0).toFixed(0);
    return (
      <Text
        allowFontScaling={false}
        style={{fontSize: 14, marginBottom: 5, color: '#fff'}}
      >
        {distance <= 1 ? '< 1 mile' : distance + ' miles'}
      </Text>
    );
  }

  toggleDetails = () => {
    const showDetails = !this.state.showDetails;
    const {contentHeight} = this.state;
    const fromValue = showDetails ? 0 : contentHeight;
    const toValue = showDetails ? contentHeight : 0;
    this.state.animation.setValue(fromValue);
    Animated.timing(this.state.animation, {
      toValue,
      duration: 100
    }).start();
    this.setState({showDetails});
  }

  getTopics = () => {
    const {candidate, currentUser} = this.props;
    const candidateTopics = candidate.topics || [];
    const userTopics = currentUser.topics;

    return (
      <View style={{flexDirection: 'row'}}>
        {candidate &&
        candidateTopics.map((x: Topic) => {
          if (userTopics) {
            const active: boolean = !!userTopics.find(
              (i: Topic) => i.name === x.name
            );
            return (
              <View key={x.name} style={{marginRight: 4}}>
                <Wonder topic={x} size={60} active={active} labelStyles={{color: '#fff'}}/>
              </View>
            );
          }
        })}
      </View>
    );
  }

  getNextPhoto = () => {
    const {candidate} = this.props;
    const {images = []} = candidate;
    const {imageCount} = this.state;

    if (imageCount < images.length - 1) {
      this.setState({imageCount: this.state.imageCount + 1});
    } else {
      this.setState({imageCount: 0});
    }
  }

  showAlert = () => {
    Alert.alert(
      'Coming Soon',
      'Check back soon for Wonder Premium!',
      [{text: 'Ok'}],
      {cancelable: false}
    );
  }

  private showVideoPlayer = (): void => {
    this.setState({showVideoPlayer: true});
  }

  private hideVideoPlayer = (): void => {
    this.setState({showVideoPlayer: false});
  }

  render() {
    const {showDetails, imageCount} = this.state;
    const {candidate} = this.props;

    const details = (
      <React.Fragment>
        <Text color='#FFF'>
          {candidate.occupation}
          {'\n'}
          {candidate.school}
        </Text>
        {!!candidate.about && <Text color='#FFF'>{candidate.about}</Text>}
      </React.Fragment>
    );

    return (
      <TouchableWithoutFeedback
        style={styles.cardOverlayContainer}
        onPress={this.getNextPhoto}
      >
        <WonderImage
          background
          uri={_.get(candidate, `images[${imageCount}].url`, Images.WELCOME)}
          style={styles.container}
        >
          <MatchAvailableMedia
            onPress={this.showVideoPlayer}
            candidate={candidate}
            currentImageIndex={this.state.imageCount}
          />
          <LinearGradient
            style={styles.textContainer}
            colors={['transparent', 'rgb(0,0,0)']}
            start={{x: 0, y: 0}}
            end={{x: 0, y: 1}}
          >
            <View flex={1}>
              <Title style={{fontSize: 24, fontWeight: 'bold'}} color='#FFF'>
                {[
                  candidate.first_name,
                  moment().diff(candidate.birthdate, 'years')
                ].join(', ')}
              </Title>
              {this.renderDistance()}
              <View style={{paddingBottom: 6}}>{this.getTopics()}</View>
              <Animated.View style={{height: this.state.animation}}>
                {details}
              </Animated.View>
              <View
                style={{position: 'absolute', bottom: -deviceHeight}}
                onLayout={(event: any) =>
                  this.setState({
                    contentHeight: event.nativeEvent.layout.height
                  })
                }
              >
                {details}
              </View>
            </View>
            <View
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: 15,
                paddingTop: 15
              }}
            >
              <View>
                <TouchableWithoutFeedback onPress={this.showAlert}>
                  <Image
                    source={Images.LogoIcon}
                    style={{width: 40, height: 40}}
                  />
                </TouchableWithoutFeedback>
              </View>
              <Icon
                name={showDetails ? 'chevron-thin-down' : 'chevron-thin-up'}
                color={'#fff'}
                size={20}
                onPress={this.toggleDetails}
              />
            </View>
          </LinearGradient>
          <VibeVideoModal
            visible={this.state.showVideoPlayer}
            onRequestClose={this.hideVideoPlayer}
            videoUrl={candidate.video}
          />
        </WonderImage>
      </TouchableWithoutFeedback>
    );
  }
}

class ProposalSwiper extends React.Component<Props, State> {
  renderProfileImage = (images?: ProfileImage[]) => {
    if (images && images.length) {
      return (
        <View style={styles.noImageContainer}>
          <WonderImage
            style={{width: '100%', height: '100%'}}
            uri={images[0].url}
            resizeMode='cover'
          />
        </View>
      );
    } else {
      return (
        <View style={styles.noImageContainer}>
          <Icon name='user' color='#CCC' size={100}/>
        </View>
      );
    }
  }

  renderCard = (proposal: Proposal) => {
    return (
      <CardDetailsOverlay
        candidate={proposal.candidate}
        currentUser={this.props.currentUser}
      />
    );
  }

  private checkIfEnd = (index: number): void => {
    const {proposal} = this.props;

    if (index === proposal.length) {
      this.props.clearProposals();
    }
  }

  private onSwipeRight = (index: number): void => {
    this.props.onSwipeRight(index);
    this.checkIfEnd(index);
  }

  private onSwipeLeft = (index: number): void => {
    this.props.onSwipeLeft(index);
    this.checkIfEnd(index);
  }

  private renderNoMatches = (): React.ReactNode => (
    <View style={styles.noMatchesContainer}>
      <Image
        source={Images.LogoIcon}
        style={{resizeMode: 'contain', alignSelf: 'center', height: '30%', width:' 50%', marginTop: -100}}
      />
      <Title style={[styles.messageText, styles.titleText]}>
        Wonder is just getting started!
      </Title>
      <Text style={styles.messageText}>We will have some more Wonder'ful people for you soon.</Text>
      <Text style={styles.messageText}>Thanks for sticking with us!</Text>
    </View>
  )

  render() {
    const {proposal} = this.props;

    if (proposal && proposal.length) {
      return (
        <Swiper
          onSwipeLeft={this.onSwipeLeft}
          onSwipeRight={this.onSwipeRight}
          data={proposal}
          renderCard={this.renderCard}
        />
      );
    }

    return this.renderNoMatches();
  }
}

export default ProposalSwiper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#eee',
    justifyContent: 'space-between',
    height: Dimensions.get('window').height - 60,
    width: Dimensions.get('window').width
  },
  textContainer: {
    padding: 15,
    flexDirection: 'row'
  },
  noMatchesContainer: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 24
  },
  messageText: {
    textAlign: 'center',
    color: 'black'
  },
  cardOverlayContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1
  }
});
