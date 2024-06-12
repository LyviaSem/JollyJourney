import { StyleSheet, Platform, StatusBar } from "react-native";
import { textStyles } from "./textStyles";
import { DIMENSIONS, COLORS } from "../theme/theme";

const { screenWidth, screenHeight } = DIMENSIONS;

export const groupTripsStyle = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: COLORS.background,
    flex: 1,
  },
  backButton: {
    top: screenHeight * 0.025,
    left: screenWidth * 0.03,
    width: screenWidth * 0.1,
    height: screenWidth * 0.08
  },
  backgroundImage: {
    width: screenWidth,
    height: screenHeight * 0.25,
    marginBottom: screenHeight * 0.07,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
  createTripButton: {
    backgroundColor: COLORS.purple,
    borderRadius: screenHeight * 0.086,
    width: screenWidth * 0.46,
    height: screenHeight * 0.17,
    margin: screenHeight * 0.02,
    justifyContent: "center",
    alignItems: "center",
  },
  optionsContainer: {
    width: screenWidth * 0.48,
    position: "absolute",
    top: screenHeight * 0.048,
    right: 0,
    backgroundColor: COLORS.white,
    borderRadius: screenHeight * 0.014,
    padding: screenHeight * 0.014,
    elevation: 5,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  optionsIconContainer: {
    position: "absolute",
    top: screenHeight * 0.02,
    right: screenWidth * 0.024,
  },
  safeAreaView: {
    alignItems: "center",
  },
  noTripText: {
    ...textStyles.subTitle,
    fontSize: 14,
    marginTop: screenHeight * 0.143,
    alignSelf: "center",
  },
  centeredContainer: {
    alignItems: "center",
  },
  flatlistHeight: {
    height: screenHeight * 0.60,
  },
});