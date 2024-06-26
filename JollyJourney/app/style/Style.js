import { StyleSheet, Platform, StatusBar } from 'react-native';
import { COLORS, DIMENSIONS } from '../theme/theme';
import { textStyles } from './textStyles';

const { screenWidth, screenHeight } = DIMENSIONS;

export const style = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: COLORS.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonStyle: {
    width: screenWidth * 0.4,
    height: screenHeight * 0.08,
    margin: screenWidth * 0.025,
    alignSelf: 'center',
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: screenHeight * 0.02,
  },
  logo: {
    resizeMode: "contain",
    width: screenWidth * 0.7,
    height: screenHeight * 0.2,
  },
  input: {
    marginVertical: screenHeight * 0.01,
    height: screenHeight * 0.07,
    width: screenWidth * 0.9,
    borderRadius: 5,
    padding: screenWidth * 0.03,
    backgroundColor: COLORS.white,
    ...textStyles.text,
  },
  switchButton: {
    alignItems: "center",
    marginVertical: screenHeight * 0.02,
  },
  switchButtonText: {
    color: COLORS.purple,
    fontSize: screenWidth * 0.04,
    ...textStyles.text,
  },
});
