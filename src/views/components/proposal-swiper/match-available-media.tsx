import React from 'react';
import { View, TouchableHighlight, StyleSheet } from 'react-native';
import theme from 'src/assets/styles/theme';
import Icon from 'react-native-vector-icons/Entypo';
import Candidate from 'src/models/candidate';

interface Props {
  candidate: Candidate;
  currentImageIndex: number;
  onPress: () => void;
}

const MatchAvailableMedia = (props: Props) => {
  return (
    <View style={styles.container}>
      <View style={styles.center}>
        {props.candidate.images.map((c, i) => (
          <View
            key={i}
            style={[
              styles.photoIndex,
              {
                opacity: i === props.currentImageIndex ? 1 : 0.2,
                backgroundColor:
                  i === props.currentImageIndex
                    ? theme.colors.primaryLight
                    : theme.colors.textColorLight
              }
            ]}
          />
        ))}
      </View>
      {props.candidate.video && (
        <TouchableHighlight
          style={styles.iconContainer}
          onPress={props.onPress}
          underlayColor='transparent'
        >
          <Icon
            size={20}
            name={'video-camera'}
            color={theme.colors.textColor}
          />
        </TouchableHighlight>
      )}
    </View>
  );
};

export default MatchAvailableMedia;

const styles = StyleSheet.create({
  container: { alignSelf: 'flex-end', padding: 10 },
  center: { alignItems: 'center' },
  photoIndex: {
    height: 9,
    width: 9,
    borderRadius: 4.5,
    margin: 3
  },
  iconContainer: { alignItems: 'center', margin: 4, padding: 10 }
});
