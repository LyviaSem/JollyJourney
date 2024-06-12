import { StyleSheet } from 'react-native';
import { textStyles } from './textStyles';
import { COLORS, DIMENSIONS } from '../theme/theme';

const { screenWidth, screenHeight } = DIMENSIONS;

export const thumbnailStyle = StyleSheet.create({
  container: {
    overflow: "hidden",
    width: screenWidth * 0.85,
    height: screenHeight * 0.20,
    marginBottom: screenHeight * 0.04,
  },
  imageBackground: {
    resizeMode: "cover",
    overflow: "hidden",
    flex: 1,
    width: "100%",
    height: "100%",
  },
  image: {
    borderRadius: 10,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: COLORS.white,
    opacity: 0.85,
    width: screenWidth * 0.40,
    height: screenHeight * 0.05,
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 10,
  },
  name: {
    color: COLORS.purple,
    fontSize: 16,
    ...textStyles.title,
  },
});