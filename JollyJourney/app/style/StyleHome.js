import { StyleSheet } from 'react-native';
import { DIMENSIONS } from '../theme/theme';

const { screenHeight } = DIMENSIONS;

export const homeStyles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: screenHeight * 0.02,
  },
  buttonContainer: {
    marginTop: screenHeight * 0.05,
    flexDirection: "row",
  }
});
