import { StyleSheet, Platform, StatusBar } from "react-native";
import { textStyles } from "./textStyles";
import { DIMENSIONS, COLORS } from "../theme/theme"; // Remplace par le chemin correct vers ton fichier theme

const { screenWidth, screenHeight } = DIMENSIONS;

export const selectMembersStyle = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: COLORS.background,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    ...textStyles.title,
    fontSize: 20,
    marginTop: screenHeight * 0.10,
    alignSelf: "center",
  },
  modalContainerError: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: screenHeight * 0.106,
  },
  modalContentError: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: screenHeight * 0.028,
    borderRadius: screenHeight * 0.019,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalErrorText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  arrowButton: {
    width: screenWidth * 0.121,
    height: screenWidth * 0.121,
    position: "absolute",
    bottom: screenHeight * 0.024,
    right: screenWidth * 0.024,
  },
  arrowImage: {
    width: screenWidth * 0.091,
    height: screenWidth * 0.091,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  Button: {
    backgroundColor: COLORS.purple,
    borderRadius: 5,
    width: screenWidth * 0.36,
    height: screenHeight * 0.17,
    margin: screenHeight * 0.02,
    justifyContent: "center",
    alignItems: "center",
  },
});
