import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../utils/style';

const LogoText = ({ style, textStyle }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.text, styles.board, textStyle]}>
        <Text style={{ color: theme.mainColors.lightBlue }}>B</Text>oard
      </Text>
      <Text style={[styles.text, styles.box, textStyle]}>
        <Text style={{ color: theme.mainColors.orange }}>B</Text>ox
      </Text>
    </View>
  );
};

export default LogoText;


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  text: {
    fontFamily: theme.fonts.logo,
    fontWeight: 'bold',
  },
  board: {
    transform: [{ rotate: '17.5deg' }],
    marginRight: 4,
  },
  box: {
    transform: [{ rotate: '-27deg' }],
  },
});
