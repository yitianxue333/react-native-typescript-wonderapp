import React from 'react';
import { ModalProps, Modal, View, StyleSheet } from 'react-native';
import { TextButton } from '../theme';

interface Props extends ModalProps {
  visible: boolean;
  closeText: string;
  children: React.ReactNode;
  onClose: (data?: any) => void;
}

class FooterModal extends React.Component<Props> {
  public render() {
    const {
      closeText,
      children,
      visible,
      animationType,
      transparent,
      onClose
    } = this.props;
    return (
      <Modal
        animationType={animationType}
        transparent={transparent}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={{ justifyContent: 'flex-end', flex: 1 }}>
          <View style={{ backgroundColor: '#FFF' }}>
            <View style={styles.header}>
              <TextButton text={closeText} onPress={onClose} />
            </View>

            {children}
          </View>
        </View>
      </Modal>
    );
  }
}

export default FooterModal;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#DDD',
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});
