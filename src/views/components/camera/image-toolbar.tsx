import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { IconButton } from '../theme';
import TouchableOpacityOnPress from 'src/models/touchable-on-press';

interface ImageToolbarProps {
  mode: 'photo' | 'video';
  isNew: boolean;
  onRotate?: () => void;
  onDelete: () => void;
  onSave: () => void;
  onRetake: () => void;
  onCancel?: TouchableOpacityOnPress;
}

const ImageToolbar: React.SFC<ImageToolbarProps> = ({
  mode,
  isNew,
  onRotate,
  onDelete,
  onRetake,
  onSave,
  onCancel
}) => {
  const options: Element[] = [];

  options.push(
    <IconButton
      icon={isNew ? 'times' : 'trash'}
      primary='#FFF'
      secondary='transparent'
      onPress={isNew ? onCancel : onDelete}
    />
  );

  if (isNew && onRotate) {
    options.push(
      <IconButton
        icon='refresh'
        primary='#FFF'
        secondary='transparent'
        onPress={onRotate}
      />
    );
  }

  options.push(
    <IconButton
      icon={mode === 'photo' ? 'camera' : 'video-camera'}
      primary='#FFF'
      secondary='transparent'
      onPress={onRetake}
    />
  );

  if (isNew) {
    options.push(
      <IconButton
        icon='check'
        primary='#FFF'
        secondary='transparent'
        onPress={onSave}
      />
    );
  }

  return (
    <View style={styles.footer}>
      {options.map((option: Element, idx: number) => (
        <View key={idx} style={styles.footerCol}>
          {option}
        </View>
      ))}
    </View>
  );
};

export default ImageToolbar;

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 10,
    flexDirection: 'row',
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  footerCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
