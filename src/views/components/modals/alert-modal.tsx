import * as React from 'react';
import { connect } from 'react-redux';
import {
  ImageProperties,
  ImageStyle,
  StyleSheet,
  Image,
  View,
  Modal
} from 'react-native';
import { Text, PrimaryButton } from 'src/views/components/theme';
import WonderAppState from 'src/models/wonder-app-state';
import { colors } from '@assets';
import images from '@images';
import { hideAlertModal } from '@actions';

const commonContainer = {
  flex: 1,
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center'
};

const localStyles = StyleSheet.create({
  container: {
    ...commonContainer,
    backgroundColor: colors.primary50
  },
  errorContainer: {
    ...commonContainer,
    backgroundColor: colors.red50
  },
  subContainer: {
    backgroundColor: colors.white,
    padding: 25,
    alignItems: 'center',
    width: '70%',
    borderRadius: 5
  },
  icon: {
    width: 65,
    height: 65,
    marginBottom: 10
  },
  text: {
    marginBottom: 15
  },
  textPadding: {
    paddingHorizontal: 10
  },
  button2: {
    marginTop: 10
  }
});

export interface IAlertModalProps {
  icon?: number;
  title: string;
  body: string;
  buttonTitle?: string;
  visible: boolean;
  onPress: (data?: any) => any;
  onRequestClose: () => void;
  animationType?: 'slide' | 'fade';
  iconStyle?: ImageStyle;
  resizeMode?: ImageProperties['resizeMode'];
  renderWonderful?: boolean;
  buttonTitle2?: string;
  onPress2?: (data?: any) => void;
  isError: boolean;
  hideAlertModal: () => void;
  alertVisible: boolean;
}

class AlertModal extends React.Component<IAlertModalProps> {
  public static defaultProps: Partial<IAlertModalProps> = {
    animationType: 'fade',
    resizeMode: 'contain',
    iconStyle: {},
    icon: images.LogoIcon,
    renderWonderful: true,
    buttonTitle: 'Got it!',
    buttonTitle2: '',
    isError: false,
    alertVisible: false
  };

  private renderWonderfulText = (): React.ReactNode => {
    const { renderWonderful, isError } = this.props;

    if (!renderWonderful || isError) {
      return null;
    }

    return (
      <Text
        align={'center'}
        color={colors.primary}
        style={localStyles.textPadding}
        //   allowFontScaling={false}
      >
        {` Wonder'ful!`}
        <Text align={'center'} color={colors.textColor}>
          "
        </Text>
      </Text>
    );
  }

  private handleOnPress = (): void => {
    const { isError, onPress, onRequestClose } = this.props;

    if (isError) {
      this.props.hideAlertModal();

      if (onPress) {
        onPress();
      }

      return;
    }

    onRequestClose();
    onPress();
  }

  private handleOnPress2 = (): void => {
    const { onPress2, onRequestClose, isError } = this.props;

    if (onRequestClose) {
      onRequestClose();
    }

    if (onPress2) {
      onPress2();
    }

    if (isError) {
      this.props.hideAlertModal();
    }
  }

  render(): React.ReactNode {
    const {
      title,
      buttonTitle,
      body,
      icon,
      iconStyle,
      visible,
      onRequestClose,
      animationType,
      resizeMode,
      buttonTitle2,
      isError,
      alertVisible
    } = this.props;

    return (
      <Modal
        onRequestClose={onRequestClose || this.props.hideAlertModal}
        animationType={animationType}
        visible={visible || alertVisible}
        transparent={true}
      >
        <View
          style={isError ? localStyles.errorContainer : localStyles.container}
        >
          <View style={localStyles.subContainer}>
            <Image
              source={isError ? images.warning : icon}
              style={[localStyles.icon, iconStyle]}
              resizeMode={resizeMode}
            />
            <Text
              align={'center'}
              color={colors.black}
              //   allowFontScaling={false}
              style={localStyles.text}
            >
              {title}
            </Text>
            <Text
              style={[localStyles.text, localStyles.textPadding]}
              align={'center'}
              color={colors.textColor}
            >
              {body}
              {this.renderWonderfulText()}
            </Text>
            <PrimaryButton title={buttonTitle} onPress={this.handleOnPress} />
            {!!buttonTitle2 && (
              <PrimaryButton
                style={localStyles.button2}
                title={buttonTitle2}
                onPress={this.handleOnPress2}
              />
            )}
          </View>
        </View>
      </Modal>
    );
  }
}

const mapStateToProps = ({ apiAlert }: WonderAppState) => ({
  ...apiAlert
});

const ConnectedAlert = connect(
  mapStateToProps,
  { hideAlertModal }
)(AlertModal);

export { AlertModal, ConnectedAlert };
