import _ from 'lodash';
import React from 'react';
import Screen from 'src/views/components/screen';
import { StyleSheet, View, Dimensions } from 'react-native';
import { TextButton, PrimaryButton, Text } from 'src/views/components/theme';
import VideoPlayer from 'react-native-video-player';
import theme from 'src/assets/styles/theme';
import { Dispatch } from 'redux';
import { updateVideo, deleteProfileVideo } from 'src/store/sagas/user';
import { connect } from 'react-redux';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import { Response, Options } from 'src/models/image-picker';
import ImageToolbar from '../../components/camera/image-toolbar';
import { addProfileVideo } from 'src/store/reducers/user';

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
  onUpdateVideo: Function;
  onDeleteVideo: Function;
}
interface State {
  data: Response | null;
}
const mapDispatch = (dispatch: Dispatch) => ({
  onUpdateVideo: (data: any) => dispatch(updateVideo(data)),
  onDeleteVideo: () => dispatch(deleteProfileVideo()),
  onAddVideo: (data) => dispatch(addProfileVideo(data))
});

class ProfileVideoScreen extends React.Component<Props, State> {
  timer = 0;

  state: State = {
    data: null
  };

  onDelete = () => {
    const { navigation, onDeleteVideo } = this.props;
    onDeleteVideo();
    navigation.goBack();
  }

  onClear = () => {
    this.setState({ data: null });
  }

  onSave = () => {
    const { data } = this.state;
    const { onUpdateVideo, navigation } = this.props;
    if (data) {
      this.props.onAddVideo(data);
      onUpdateVideo(data);
      navigation.goBack();
    }
  }

  getVideo = () => {
    const options: Options = {
      mediaType: 'video',
      durationLimit: 15
    };

    ImagePicker.launchCamera(options, (res: Response) => {
      if (res.didCancel) {
        console.log('User cancelled!');
      } else if (res.error) {
        console.log('Error', res.error);
      } else {
        this.setState({ data: res });
      }
    });
  }

  renderContent = () => {
    const { navigation } = this.props;
    const { data } = this.state;

    const currentVideo = navigation.getParam('data', null);

    let video = null;
    if (currentVideo) {
      video = (
        <VideoPlayer video={currentVideo} videoHeight={1} videoWidth={1} />
      );
    }
    if (data) {
      video = <VideoPlayer video={data} videoHeight={1} videoWidth={1} />;
    }
    if (video) {
      return (
        <View flex={1}>
          <View style={[styles.imgcontainer, { padding: 0 }]}>{video}</View>
          <ImageToolbar
            mode='video'
            isNew={!currentVideo || !!data}
            onRetake={this.getVideo}
            onCancel={this.onClear}
            onDelete={this.onDelete}
            onSave={this.onSave}
          />
        </View>
      );
    }
    return (
      <View flex={1}>
        <View style={styles.container}>
          <Text>
            Create a 15 second Vibe Video for others to see. Show them who you
            are!
          </Text>
        </View>
        <PrimaryButton
          rounded={false}
          title='Open Camera'
          onPress={this.getVideo}
        />
      </View>
    );
  }

  render() {
    return <Screen>{this.renderContent()}</Screen>;
  }
}

export default connect(
  null,
  mapDispatch
)(ProfileVideoScreen);

const styles = StyleSheet.create({
  imgcontainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 20
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    padding: 20
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    backgroundColor: theme.colors.primary,
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    height: 50,
    width: 50,
    alignSelf: 'center',
    margin: 20
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  footerCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
