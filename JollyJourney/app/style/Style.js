import { StyleSheet, Platform, StatusBar } from 'react-native';
import { COLORS, DIMENSIONS } from '../theme/theme';

const { screenWidth, screenHeight } = DIMENSIONS;

export const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: COLORS.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    resizeMode: "contain",
  },
  buttonTextStyle: {
    fontWeight: "bold",
  },
  buttonStyle: {
    width: screenWidth * 0.4,
    height: screenHeight * 0.08,
    margin: screenWidth * 0.025,
  },
});
