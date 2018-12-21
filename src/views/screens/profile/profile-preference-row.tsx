import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, Switch } from 'src/views/components/theme';

export const prefRowStyles = StyleSheet.create({
  row: {
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 5
    },
    marginVertical: 10
  }
});

interface IProfilePreferenceRowProps {
  text: string;
  value: boolean;
  onValueChange: () => void;
}

const ProfilePreferenceRow: React.SFC<IProfilePreferenceRowProps> = ({
  text,
  value,
  onValueChange
}) => {
  return (
    <View style={prefRowStyles.row}>
      <Text>{text}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
};

export { ProfilePreferenceRow };
