import { Platform, StatusBar } from "react-native";
import { DIMENSIONS, COLORS } from "../theme/theme";
import { textStyles } from "./textStyles";

const { screenWidth, screenHeight } = DIMENSIONS;

export const groupsStyles = {
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: COLORS.background,
    flex: 1,
    alignItems: "center",
  },
  title: {
    ...textStyles.title,
    fontSize: 20,
    marginTop: screenHeight * 0.1,
    marginBottom: screenHeight * 0.03,
  },
  addButtonContainer: {
    position: "absolute",
    top: screenHeight * 0.05,
    right: screenWidth * 0.03,
    padding: screenHeight * 0.02,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  flatlistContainer: {
    alignItems: "center",
    marginTop: screenHeight * 0.04,
    flex: 1,
  },
};
