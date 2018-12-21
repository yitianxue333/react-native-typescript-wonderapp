import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  Alert,
  Linking,
  TouchableOpacity
} from 'react-native';
import { Text, Button, PrimaryButton } from 'src/views/components/theme';
import theme from 'src/assets/styles/theme';
import Screen from 'src/views/components/screen';
import Images, { Logo } from 'src/assets/images';
import { NavigationScreenProp, NavigationParams } from 'react-navigation';
import { LoginManager } from 'react-native-fbsdk';
import TextButton from 'src/views/components/theme/text-button';
import { HTTP_DOMAIN } from 'src/services/api';

interface Props {
  navigation: NavigationScreenProp<any, NavigationParams>;
}

export default class Welcome extends React.Component<Props> {
  onFacebookLogin() {
    LoginManager.logInWithReadPermissions(['email', 'public_profile']).then(
      (result) => {
        if (result.isCancelled) {
          Alert.alert('login cancelled');
        } else {
          Alert.alert(
            'login successful with permissions: ' +
              result.grantedPermissions.toString()
          );
        }
      },
      (error) => {
        Alert.alert('login failed with error: ' + error);
      }
    );
  }

  showDocument = (url: string) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        Alert.alert('Sorry! This link cannot be opened on your device');
      }
    });
  }

  render() {
    const { navigation } = this.props;
    return (
      <Screen backgroundImage={Images.WELCOME}>
        <View flex={1} style={styles.header}>
          <Image
            style={{ width: '80%', height: 50, marginBottom: 40 }}
            source={Logo.DARK}
            resizeMode='contain'
          />
        </View>
        <View style={styles.body}>
          <View />
          <View style={{ width: '80%', marginBottom: 45 }}>
            <PrimaryButton
              fullWidth
              icon='envelope-o'
              title='CREATE ACCOUNT'
              onPress={() => navigation.navigate('Register1')}
              innerStyle={{
                minHeight: 44,
                paddingTop: 14,
                paddingBottom: 14
              }}
            />
            <TouchableOpacity
              style={styles.facebookLoginButton}
              onPress={() => navigation.navigate('Login')}
            >
              <View style={{ flex: 1 }}>
                <Image
                  style={styles.buttonLogo}
                  source={require('src/assets/images/icons/LogoIcon.png')}
                  resizeMode='contain'
                />
              </View>
              <Text allowFontScaling={false} style={styles.loginText}>
                LOGIN
              </Text>
              <View style={{ flex: 1 }} />
            </TouchableOpacity>
          </View>

          <View style={styles.legalContainer}>
            <Text style={styles.legalText}>
              By creating an account, you are agreeing to our
              <Text
                onPress={() => this.showDocument(`${HTTP_DOMAIN}/terms.html`)}
                style={styles.legalTextBtn}
              >
                {' '}
                Terms and Conditions
              </Text>{' '}
              and{' '}
              <Text
                onPress={() => this.showDocument(`${HTTP_DOMAIN}/privacy.html`)}
                style={styles.legalTextBtn}
              >
                Privacy Policy
              </Text>
            </Text>
          </View>
        </View>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  body: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20
  },
  facebookLoginButton: {
    backgroundColor: '#FFF',
    marginTop: 10,
    minWidth: 150,
    minHeight: 44,
    flexDirection: 'row',
    paddingTop: 14,
    paddingBottom: 14,
    borderRadius: 30,
    shadowOffset: {
      width: 0,
      height: 5
    },
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 1
  },
  legalContainer: {
    flexDirection: 'row'
  },
  legalText: {
    fontSize: 12,
    color: theme.colors.textColorLight,
    textAlign: 'center'
  },
  legalTextBtn: {
    fontWeight: 'bold',
    color: theme.colors.textColorLight,
    fontSize: 12
  },
  middleContainer: {
    marginTop: 25,
    alignItems: 'center'
  },
  boldText: { fontWeight: 'bold' },
  buttonLogo: {
    width: 20,
    height: 20,
    marginLeft: 10
  },
  loginText: {
    textAlign: 'center',
    flex: 1,
    color: '#3D90F0',
    fontSize: 14
  }
});
