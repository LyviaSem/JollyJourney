import { StyleSheet } from 'react-native';
import { DIMENSIONS } from '../theme/theme';

const { screenWidth, screenHeight } = DIMENSIONS;

export const signInStyle = StyleSheet.create({
  errorContainer: {
    marginVertical: screenHeight * 0.01,
  },
  errorText: {
    color: 'red',
    fontSize: screenWidth * 0.04,
  },
});
