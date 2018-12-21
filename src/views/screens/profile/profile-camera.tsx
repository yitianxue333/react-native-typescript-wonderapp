import React from 'react';
import Screen from 'src/views/components/screen';
import { StyleSheet, View, Image, Dimensions } from 'react-native';
import { Text, PrimaryButton, TextButton } from 'src/views/components/theme';
import theme from 'src/assets/styles/theme';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import { updateImage, deleteProfileImage } from 'src/store/sagas/user';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import ImagePicker from 'react-native-image-picker';
import ImageRotate from 'react-native-image-rotate';
import { Options, Response } from 'src/models/image-picker';
import ImageToolbar from 'src/views/components/camera/image-toolbar';
import ProfileImage from 'src/models/profile-image';
import { addProfileImage, removeProfileImage } from 'src/store/reducers/user';
const backgrounImageExtension =
  '?w=600&h=1200&auto=enhance,format&fit=crop&crop=entropy&q=60';

const mapDispatch = (dispatch: Dispatch) => ({
  onUpdateImage: (data: Response) => dispatch(updateImage(data)),
  onDeleteImage: (data: ProfileImage) => dispatch(deleteProfileImage(data)),
  onAddImage: (data) => dispatch(addProfileImage(data)),
  onRemoveImage: (data) => dispatch(removeProfileImage(data))
});

interface ProfileCameraScreenProps {
  navigation: NavigationScreenProp<any, NavigationParams>;
  onUpdateImage: (data: Response) => void;
  onDeleteImage: (data: ProfileImage) => void;
}

interface ProfileCameraScreenState {
  data: Response | null;
}

class ProfileCameraScreen extends React.Component<
  ProfileCameraScreenProps,
  ProfileCameraScreenState
> {
  state: ProfileCameraScreenState = {
    data: null
  };

  onClear = () => this.setState({ data: null });
  onSave = () => {
    const { onUpdateImage, navigation } = this.props;
    const { data } = this.state;

    this.props.onAddImage(data);
    onUpdateImage(data);
    navigation.goBack();
  }

  getImage = () => {
    const options: Options = {
      title: 'Upload a Photo',
      mediaType: 'photo',
      storageOptions: {
        skipBackup: true,
        cameraRoll: true
      }
    };

    ImagePicker.showImagePicker(options, (res: Response) => {
      if (res.didCancel) {
        // console.log("User cancelled!");
      } else if (res.error) {
        // console.log("Error", res.error);
      } else {
        this.setState({ data: res });
      }
    });
  }

  onRotate = () => {
    const { data } = this.state;
    if (data !== null) {
      ImageRotate.rotateImage(
        data.uri,
        90,
        (uri: string) => {
          this.setState({
            data: {
              ...data,
              uri
            }
          });
        },
        (error: Error) => {
          console.error(error);
        }
      );
    }
  }

  onDeleteImage = () => {
    const { navigation, onDeleteImage } = this.props;
    const currentImage: ProfileImage = navigation.getParam('data');
    if (currentImage) {
      onDeleteImage(currentImage);
      this.props.onRemoveImage(currentImage);
      // Delete the image
      navigation.goBack();
    }
  }

  renderContent = () => {
    const { navigation } = this.props;
    const { data } = this.state;
    const currentImage = navigation.getParam('data');

    let image = null;
    if (currentImage) {
      image = (
        <Image
          source={{ uri: currentImage.url + backgrounImageExtension }}
          style={{ flex: 1, width: null, height: null, resizeMode: 'cover' }}
        />
      );
    }
    if (data) {
      image = (
        <Image
          source={data}
          style={{ flex: 1, width: null, height: null, resizeMode: 'cover' }}
        />
      );
    }
    if (image) {
      return (
        <View flex={1}>
          <View style={[styles.imgcontainer, { padding: 0 }]}>{image}</View>
          <ImageToolbar
            mode='photo'
            isNew={!currentImage || !!data}
            onRotate={this.onRotate}
            onRetake={this.getImage}
            onCancel={this.onClear}
            onDelete={this.onDeleteImage}
            onSave={this.onSave}
          />
        </View>
      );
    }

    return (
      <View flex={1}>
        <View style={styles.container}>
          <Text>
            Take a selfie to express who you are. Your profile images are
            displayed for other people who match your interests
          </Text>
        </View>
        <View>
          <PrimaryButton
            rounded={false}
            title='SELECT IMAGE'
            onPress={this.getImage}
          />
        </View>
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
)(ProfileCameraScreen);
// export default ProfileCameraScreen;

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
