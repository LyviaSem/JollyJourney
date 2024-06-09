import { StyleSheet } from 'react-native';
import { styles } from './Style';
import { DIMENSIONS } from '../theme/theme';

const { screenWidth, screenHeight } = DIMENSIONS;

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
  },
  logo: {
    ...styles.logo,
    width: screenWidth * 0.6,
    height: screenHeight * 0.2,
  }
});
