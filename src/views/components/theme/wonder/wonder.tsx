import _ from 'lodash';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'src/views/components/theme';

import theme from 'src/assets/styles/theme';
import WonderImage from '../wonder-image';
import Topic from 'src/models/topic';

interface WonderProps {
  topic: Topic;
  active?: boolean;
  size?: number;
  labelStyles?: any;
}

const excludePaddingOnIcons = [ // These icons already include padding.
  'BIKING',
  'LUNCH',
  'GO KARTS'
];

const Wonder: React.SFC<WonderProps> = ({
  labelStyles,
  topic,
  active,
  size = 80
}) => {
  const imageSize = (size / 2) * 0.75;
  const containerStyles = {
    height: size,
    width: size,
    borderRadius: size / 2,
    backgroundColor: 'transparent',
  };
  const nameUpperCase = _.toUpper(topic.name);

  const wonderStyles = [styles.container, containerStyles];
  if (active) {
    wonderStyles.push(styles.selectedContainer);
  }
  return (
    <View style={wonderStyles}>
      <WonderImage
        style={{ height: imageSize, width: imageSize}}
        uri={topic.icon}
      />
      {_.indexOf(excludePaddingOnIcons, nameUpperCase) !== -1 ? null : <View style={{height: 5 }} />}
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit={true}
        allowFontScaling={false}
        style={[styles.label, labelStyles && labelStyles]}
      >
        {nameUpperCase}
      </Text>
    </View>
  );
};

Wonder.defaultProps = {
  active: false,
  size: 80,
};

export default Wonder;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectedContainer: {
    borderWidth: 2,
    borderColor: theme.colors.primaryLight,
    opacity: 0.8,
    shadowOffset: { width: 0, height: 1 },
    shadowColor: theme.colors.primaryLight,
    shadowOpacity: 0.7,
    shadowRadius: 3,
  },
  label: {
    fontSize: 6,
    textAlign: 'center',
  },
});
