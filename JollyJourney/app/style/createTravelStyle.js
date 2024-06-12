import { StyleSheet, Platform, StatusBar } from "react-native";
import { COLORS, DIMENSIONS } from "../theme/theme";

const { screenWidth, screenHeight } = DIMENSIONS;

export const createTravelStyle = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: COLORS.background,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: screenHeight * 0.028,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: screenHeight * 0.028,
    borderRadius: screenHeight * 0.014,
    elevation: 5,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  profilImage: {
    borderRadius: screenWidth * 0.14,
    width: screenWidth * 0.14,
    height: screenWidth * 0.14,
    borderColor: "black",
    borderWidth: 1,
  },
  groupInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: screenHeight * 0.042,
    height: screenHeight * 0.098,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: screenHeight * 0.007,
    width: screenWidth * 0.91,
    paddingHorizontal: screenWidth * 0.027,
    marginBottom: screenHeight * 0.014,
  },
  textInput: {
    paddingHorizontal: screenWidth * 0.027,
    fontFamily: "Inter-Regular",
    fontSize: 14,
    width: "35%",
  },
  btn: {
    width: screenWidth * 0.32,
  },
});
