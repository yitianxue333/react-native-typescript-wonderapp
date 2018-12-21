import React from 'react';
import { View, Modal, Dimensions, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import VideoPlayer from 'react-native-video-player';
import { IconButton } from 'src/views/components/theme';
import theme from 'src/assets/styles/theme';
import { BASE_URL } from 'src/services/api';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

interface Props {
  visible: boolean;
  onRequestClose: () => void;
  videoUrl: string | undefined;
}

const VibeVideoModal = (props: Props) => {
  return (
    <Modal
      animationType='slide'
      transparent={false}
      visible={props.visible}
      onRequestClose={props.onRequestClose}
    >
      <View style={styles.container}>
        <VideoPlayer
          customStyles={{
            wrapper: {
              flex: 1
            }
          }}
          videoHeight={deviceHeight}
          videoWidth={deviceWidth}
          pauseOnPress={true}
          disableFullscreen={true}
          autoplay={true}
          video={{
            uri: `${BASE_URL}/${props.videoUrl}`
          }}
        />
        <LinearGradient
          style={styles.gradientStyles}
          colors={['rgb(0,0,0)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <IconButton
            size={54}
            icon={'close'}
            onPress={props.onRequestClose}
            primary={theme.colors.primaryLight}
            secondary='transparent'
          />
        </LinearGradient>
      </View>
    </Modal>
  );
};

export default VibeVideoModal;

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradientStyles: {
    position: 'absolute',
    top: 0,
    height: 80,
    alignItems: 'flex-end',
    width: '100%'
  }
});
