import React from 'react';
import _ from 'lodash';
import {
  Modal,
  View,
  ModalProps,
  StyleSheet,
  Platform,
  Dimensions
} from 'react-native';
import { IconButton, TextArea, Title, SecondaryButton } from '../theme';
import { Text, PrimaryButton, OutlineButton } from 'src/views/components/theme';
import TouchableOpacityOnPress from '../../../models/touchable-on-press';
import LinearGradient from 'react-native-linear-gradient';
import theme from 'src/assets/styles/theme';
const { width } = Dimensions.get('window');
interface Props extends ModalProps {
  onCancel?: TouchableOpacityOnPress;
  onSuccess?: Function;
  conversation?: object;
}

class ChatGhostingModal extends React.Component<Props> {
  static defaultProps = {
    onRequestClose: _.noop
  };

  state = {
    ghostMessage: `Hi ${
      this.props.conversation.partner.first_name
      }, Unfortunately I'm no longer interested but I hope you find someone wonder'ful! Good luck:)`
  };

  onSendGhost = () => {
    if (this.props.onSuccess) {
      this.props.onSuccess(this.state.ghostMessage);
    }
  }

  renderContent = () => {
    const { onCancel } = this.props;
    // style={styles.margin}
    return (
      <LinearGradient
        colors={['#FFF', '#feec5a', '#f48e5c']}
        style={styles.modal}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        locations={[0, 0.5, 1]}
      >
        <View
          flexDirection={'column'}
          flex={1}
          style={{ justifyContent: 'space-around' }}
        >
          <Title allowFontScaling={false} style={styles.title} color='#333'>
            {'Thanks for not ghosting!'}
          </Title>
          <View flex={1}>
            <Text allowFontScaling={false} style={styles.textColor}>
              Send a goodbye message, we will send it to them and remove them
              from your matches.
            </Text>
            <TextArea
              allowFontScaling={false}
              onChangeText={(ghostMessage) => this.setState({ ghostMessage })}
              value={this.state.ghostMessage}
              style={styles.textArea}
            />
          </View>
          <View style={styles.btnContainer}>
            <SecondaryButton
              innerStyle={{ minWidth: 120, backgroundColor: '#f1f1f1' }}
              title='Cancel'
              onPress={onCancel}
            // style={{ minWidth: 100 }}
            />
            <PrimaryButton
              innerStyle={{ minWidth: 120 }}
              style={{ shadowOpacity: 0 }}
              title='Submit'
              onPress={this.onSendGhost}
            />
          </View>
        </View>
      </LinearGradient>
    );
  }

  render() {
    const { onCancel, onSuccess, onRequestClose, ...rest } = this.props;
    return (
      <Modal onRequestClose={onRequestClose} transparent {...rest}>
        <View style={{ flex: 1, maxHeight: 320 }}>{this.renderContent()}</View>
      </Modal>
    );
  }
}

export default ChatGhostingModal;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'space-around',
    padding: 20
  },
  modalButton: {
    maxWidth: 100,
    backgroundColor: '#aaa'
  },
  header: {
    marginTop: Platform.select({ ios: 20, android: 0 }),
    height: 44,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#EEE',
    justifyContent: 'flex-end'
  },
  textContainer: {
    padding: 20,
    flexDirection: 'row'
  },
  footer: {
    paddingVertical: 10,
    flexDirection: 'row',
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center'
  },
  footerCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: { fontSize: 22, marginTop: 7 },
  margin: { marginTop: 5 },
  textColor: { color: '#333' },
  textArea: { backgroundColor: 'white', minHeight: 100, marginTop: 10 },
  btnContainer: {
    flexDirection: 'row',
    marginTop: 12,
    alignSelf: 'center',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-around'
  },
  secondInner: { minWidth: 130, backgroundColor: '#f1f1f1' },
  secondOuter: { marginRight: 5, height: 44, justifyContent: 'center' }
});
