import { StyleSheet } from "react-native";
import { textStyles } from "./textStyles";
import { COLORS, DIMENSIONS } from '../theme/theme';

const { screenWidth, screenHeight } = DIMENSIONS;

export const searchBarStyle = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: screenHeight * 0.04,
    marginTop: screenHeight * 0.04,
    marginBottom: screenHeight * 0.04,
    backgroundColor: "rgba(196, 196, 196, 0.22)",
    width: screenWidth * 0.85,
  },
  textInput: {
    flex: 1,
    height: screenHeight * 0.07,
    color: COLORS.shadow,
    borderRadius: screenHeight * 0.04,
    paddingHorizontal: screenWidth * 0.05,
    marginRight: screenWidth * 0.03,
    ...textStyles.text,
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: COLORS.yellow,
    borderRadius: screenHeight * 0.04,
    padding: screenWidth * 0.04,
    right: 0,
  },
});
