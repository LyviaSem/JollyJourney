import { StyleSheet } from "react-native";
import { DIMENSIONS, COLORS } from "../theme/theme";
import { textStyles } from "./textStyles";

const { screenHeight } = DIMENSIONS;

export const itineraryStyle = StyleSheet.create({
  container: {
    paddingTop: screenHeight * 0.014,
    backgroundColor: COLORS.background,
    flex: 1,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: screenHeight * 0.014,
    ...textStyles.subTitle
  },
  flatListContainer: {
    flex: 1,
  },
});
