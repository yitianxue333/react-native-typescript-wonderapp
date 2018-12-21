import React from 'react';
import { View, Text, Modal, StyleSheet, Image } from 'react-native';
import { PrimaryButton, RoundedTextInput, SecondaryButton } from '../theme';
import theme from '../../../assets/styles/theme';
import TouchableOpacityOnPress from '../../../models/touchable-on-press';
import Images from 'src/assets/images';

interface Props {
  visible: boolean;
  onRequestClose: Function;
  getRef: Function;
  onChangeText: (text: string) => void;
  errorHint: string | undefined;
  submit: Function;
  onPress?: TouchableOpacityOnPress;
}

const ForgotPasswordModal = (props: Props) => {
  return (
    <Modal
      animationType='slide'
      transparent={false}
      visible={props.visible}
      onRequestClose={() => props.onRequestClose}
    >
      <View style={styles.container}>
        <Image style={styles.logo} source={Images.Logo.DARK} resizeMode='contain' />
        <View style={styles.emailGroup}>
          <Text style={styles.descriptionText}>Having trouble logging in?</Text>
          <RoundedTextInput
            returnKeyType='next'
            getRef={props.getRef}
            autoCapitalize='none'
            autoCorrect={false}
            icon='envelope-o'
            placeholder='Email'
            onChangeText={props.onChangeText}
            fullWidth
            errorHint={props.errorHint}
          />
          <Text style={styles.actionText}>
            {`Enter your email address to\ncontact support.`}
          </Text>
        </View>
        <View style={styles.btnContainer}>
          <PrimaryButton title='Send' onPress={props.submit} />
          <SecondaryButton
            innerStyle={styles.secondaryButton}
            title='Cancel'
            onPress={props.onRequestClose} 
          />
        </View>
      </View>
    </Modal>
  );
};

export default ForgotPasswordModal;

const styles = StyleSheet.create({
  container: {
    flex: 2,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: 60
  },
  logo: {
    width: 300,
    height: 100
  },
  emailGroup: {
    paddingBottom: 60,
    width: '80%'
  },
  descriptionText: {
    paddingBottom: 50,
    fontSize: 15,
    color: theme.colors.textColor,
    textAlign: 'center'
  },
  actionText: {
    fontSize: 14,
    color: theme.colors.textColor,
    textAlign: 'center',
    marginTop: 10,
  },
  btnContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-around'
  },
  secondaryButton: {
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 1,
    backgroundColor: '#f1f1f1',
    minWidth: 130
  },

});
