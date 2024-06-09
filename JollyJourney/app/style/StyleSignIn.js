// signInStyles.js
import { StyleSheet } from 'react-native';
import { styles } from './Style';
import { COLORS, DIMENSIONS } from '../theme/theme';

const { screenWidth, screenHeight } = DIMENSIONS;

export const signInStyle = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    marginBottom: screenHeight * 0.05,
  },
  logo: {
    ...styles.logo,
    width: screenWidth * 0.8,
    height: screenHeight * 0.2,
  },
  switchButton: {
    marginVertical: screenHeight * 0.02,
    alignItems: "center",
  },
  switchButtonText: {
    color: COLORS.purple,
    fontSize: screenWidth * 0.04,
  },
  input: {
    marginVertical: screenHeight * 0.01,
    height: screenHeight * 0.07,
    width: screenWidth * 0.9,
    borderRadius: 5,
    padding: screenWidth * 0.03,
    backgroundColor: COLORS.white,
  },
  errorContainer: {
    marginVertical: screenHeight * 0.01,
  },
  errorText: {
    color: 'red',
    fontSize: screenWidth * 0.04,
  },
});
