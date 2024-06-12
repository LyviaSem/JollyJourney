import { StyleSheet } from 'react-native';
import { DIMENSIONS } from '../theme/theme';


const { screenWidth } = DIMENSIONS;

export const signUpStyle = StyleSheet.create({
  container: {
    marginHorizontal: screenWidth * 0.05,
    justifyContent: "center",
  }
});
