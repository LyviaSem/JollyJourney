import { StyleSheet } from "react-native";
import { textStyles } from "./textStyles";
import { DIMENSIONS } from '../theme/theme';

const { screenWidth, screenHeight } = DIMENSIONS;


export const citiesStyle = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: screenHeight * 0.35,
  },
  backButton: {
    width: screenWidth * 0.1,
    height: screenWidth * 0.08,
  },
  text: {
    marginTop: screenHeight * 0.03,
    paddingHorizontal: screenWidth * 0.025,
    fontSize: 14,
    ...textStyles.text,
  },
  title: {
    fontSize: 20,
    ...textStyles.title,
  },
  container: {
    alignItems: "center",
  },
  backButtonContainer: {
    position: "absolute",
    top: screenHeight * 0.02,
    left: screenWidth * 0.03,
    width: screenWidth * 0.15,
    height: screenWidth * 0.15,
  },
});
