import { StyleSheet, Platform, StatusBar } from "react-native";
import { DIMENSIONS, COLORS } from "../theme/theme";
import { textStyles } from "./textStyles";

const { screenHeight } = DIMENSIONS;

export const travelStyle = StyleSheet.create({
  safeAreaView: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: COLORS.background,
    flex: 1,
  },
  headerText: {
    fontSize: 20,
    marginTop: screenHeight * 0.1,
    alignSelf: "center",
    ...textStyles.title
  },
  flatListContainer: {
    alignItems: "center",
    marginTop: screenHeight * 0.042,
  },
  noTripsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noTripsText: {
    color: COLORS.black,
    fontSize: 14,
    ...textStyles.subTitle
  },
  flatListContentContainer: {
    paddingBottom: screenHeight * 0.1,
  },
});

