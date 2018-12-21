import React from 'react';
import _ from 'lodash';
import {
  Modal,
  View,
  ModalProps,
  StyleSheet,
  Platform,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import {
  Text,
  TextArea,
  Title,
  SubTitle,
  Strong,
  Label,
  PrimaryButton,
  TextButton
} from '../theme';

import Avatar from '../theme/avatar';
import { Card, CardItem, Body, Content } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import theme from 'src/assets/styles/theme';
import BooleanToggle from '../theme/boolean-toggle';
import StarRatingInput from '../theme/star-rating-input';
import { DecoratedAppointment } from 'src/models/appointment';
import User from 'src/models/user';
import Icon from 'react-native-vector-icons/FontAwesome';

interface AppointmentReviewModalProps extends ModalProps {
  currentUser: User;
  appointment: DecoratedAppointment;
}

interface AppointmentReviewModalState {
  // isModalOpen: boolean;
}

class AppointmentReviewModal extends React.Component<
  AppointmentReviewModalProps,
  AppointmentReviewModalState
> {
  state: AppointmentReviewModalState = {
    flaked: false,
    photo: true,
    fib: false,
    dateAgain: true,
    details: '',
    value: 0
  };

  onValueChangeDetails = (value: number) => {
    this.setState({ value });
  }

  renderOption = (key: number) => {
    const { value } = this.state;
    return (
      <TouchableOpacity
        style={styles.option}
        key={key}
        onPress={() => this.onValueChangeDetails(key)}
      >
        <Icon
          name='star'
          color={
            value >= key ? theme.colors.primaryLight : theme.colors.textColor
          }
          size={25}
        />
      </TouchableOpacity>
    );
  }

  onSubmit = () => {
    const { flaked, photo, fib, dateAgain, details, value } = this.state;
    const { currentUser, appointment } = this.props;
    const data = {
      review: {
        flake: flaked,
        fib,
        looks_like_photo: photo,
        activity_score: value,
        details
      },
      attendanceId: appointment.attendanceId
    };
    this.props.onSubmit(data);
    this.props.onRequestClose();
  }

  render() {
    const { appointment, currentUser, ...rest } = this.props;

    const firstName = appointment.match
      ? appointment.match.first_name
      : '[Deactivated User]';

    return (
      <Modal {...rest} animationType='fade' transparent>
        <LinearGradient
          colors={[theme.colors.cottonCandyBlue, theme.colors.cottonCandyPink]}
          style={styles.modal}
        >
          <Content>
            <Card style={styles.container}>
              <CardItem header style={styles.header}>
                <Title style={{ textAlign: 'center' }}>
                  We are <Strong>Wonder&apos;N</Strong>
                  {'\n'}how your date went?
                </Title>

                <View style={styles.userAvatarContainer}>
                  <Avatar
                    circle
                    size='md'
                    uri={_.get(appointment, 'match.images[0].url', null)}
                  />
                  <SubTitle style={styles.subTitle}>{firstName}</SubTitle>
                </View>
              </CardItem>
              <CardItem>
                <View style={styles.body}>
                  <View style={styles.row}>
                    <Text style={styles.label}>Did {firstName} Flake?</Text>

                    <View style={styles.btnContainer}>
                      <TouchableOpacity
                        onPress={() => this.setState({ flaked: true })}
                      >
                        <Text
                          style={{
                            color: this.state.flaked
                              ? theme.colors.primary
                              : 'grey'
                          }}
                        >
                          Yes
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.setState({ flaked: false })}
                      >
                        <Text
                          style={{
                            color: !this.state.flaked
                              ? theme.colors.primary
                              : 'grey'
                          }}
                        >
                          No
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>
                      Hows was {appointment.name}?
                    </Text>
                    <View style={{ flexDirection: 'row' }}>
                      {_.range(1, 6).map(this.renderOption)}
                    </View>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>
                      Did {firstName} look like their photos?
                    </Text>

                    <View style={styles.btnContainer}>
                      <TouchableOpacity
                        onPress={() => this.setState({ photo: true })}
                      >
                        <Text
                          style={{
                            color: this.state.photo
                              ? theme.colors.primary
                              : 'grey'
                          }}
                        >
                          Yes
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.setState({ photo: false })}
                      >
                        <Text
                          style={{
                            color: !this.state.photo
                              ? theme.colors.primary
                              : 'grey'
                          }}
                        >
                          No
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>
                      Did {firstName} fib about anything? (Height, Weight, etc.)
                    </Text>

                    <View style={styles.btnContainer}>
                      <TouchableOpacity
                        onPress={() => this.setState({ fib: true })}
                      >
                        <Text
                          style={{
                            color: this.state.fib
                              ? theme.colors.primary
                              : 'grey'
                          }}
                        >
                          Yes
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.setState({ fib: false })}
                      >
                        <Text
                          style={{
                            color: !this.state.fib
                              ? theme.colors.primary
                              : 'grey'
                          }}
                        >
                          No
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.label}>
                      Do you want to setup another wonder with {firstName}?
                    </Text>

                    <View style={styles.btnContainer}>
                      <TouchableOpacity
                        onPress={() => this.setState({ dateAgain: true })}
                      >
                        <Text
                          style={{
                            color: this.state.dateAgain
                              ? theme.colors.primary
                              : 'grey'
                          }}
                        >
                          Yes
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.setState({ dateAgain: false })}
                      >
                        <Text
                          style={{
                            color: !this.state.dateAgain
                              ? theme.colors.primary
                              : 'grey'
                          }}
                        >
                          No
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={[styles.row, { alignItems: undefined }]}>
                    <TextArea
                      onChangeText={(e) => this.setState({ details: e })}
                      placeholder="Tell us more! How'd it go?"
                      style={{ flex: 1, minHeight: 150 }}
                    />
                  </View>
                </View>
              </CardItem>
              <CardItem footer style={styles.footer}>
                <View>
                  <Label style={{ textAlign: 'center', marginTop: -10 }}>
                    All feedback is anonymous and used to improve Wonder for
                    you!
                  </Label>
                </View>
                <View style={styles.btnContainer}>
                  <PrimaryButton title='Submit' onPress={this.onSubmit} />
                  <TextButton
                    text='Cancel'
                    onPress={this.props.onRequestClose}
                  />
                </View>
              </CardItem>
            </Card>
          </Content>
        </LinearGradient>
      </Modal>
    );
  }
}

export default AppointmentReviewModal;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  container: {
    borderRadius: 10,
    backgroundColor: '#FFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 5
  },
  header: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    flexDirection: 'column',
    alignItems: 'center'
  },
  footer: {
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: 'center',
    flexDirection: 'column'
  },
  userAvatarContainer: {
    marginTop: 15
  },
  body: {},
  label: {
    textAlign: 'center'
  },
  row: {
    width: '90%',
    alignItems: 'center',
    margin: 2
  },
  // btnContainer: {
  //   flexDirection: 'row',
  //   width: '30%',
  //   justifyContent: 'space-around'
  // },
  option: {
    padding: 5,
    marginTop: 10,
    marginBottom: 10
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    alignItems: 'center',
    marginTop: 5
  },
  subTitle: { textAlign: 'center', marginTop: 8 }
});
