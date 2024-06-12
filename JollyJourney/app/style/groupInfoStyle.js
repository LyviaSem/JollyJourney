import { StyleSheet, Platform, StatusBar } from "react-native";
import { DIMENSIONS, COLORS } from "../theme/theme";
import { textStyles } from "./textStyles";

const { screenWidth, screenHeight } = DIMENSIONS;

export const groupInfoStyle = StyleSheet.create({
    container: {
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      backgroundColor: "#FEF5EE",
      flex: 1,
    },
    title: {
      width: "100%",
      textAlign: "center",
      ...textStyles.title,
      fontSize: 20,
      marginTop: screenHeight * 0.1, 
    },
    groupInfoContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    groupInfo: {
      flexDirection: "row",
      alignItems: "center",
      height: screenHeight * 0.1,
      borderColor: "gray",
      borderWidth: 1,
      borderRadius: screenWidth * 0.013,
      width: screenWidth * 0.95,
      paddingHorizontal: screenWidth * 0.025,
      marginBottom: screenHeight * 0.07,
    },
    profilImageContainer: {
      marginRight: screenWidth * 0.03,
    },
    input: {
      ...textStyles.text,
      fontSize: 14,
      width: "35%"
    },
    button: {
      justifyContent: "center",
      alignItems: "center",
    },
    Button: {
      backgroundColor: COLORS.purple,
      borderRadius: 5,
      width: screenWidth * 0.3,
      height: screenHeight * 0.15,
      margin: screenWidth * 0.025,
      justifyContent: "center",
      alignItems: "center",
    },
    arrowButton: {
      width: screenWidth * 0.125,
      height: screenWidth * 0.125,
      position: "absolute",
      bottom: screenHeight * 0.025,
      right: screenWidth * 0.025,
    },
    modalContainerError: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "center",
      marginBottom: screenHeight * 0.2,
    },
    modalContentError: {
      backgroundColor: "rgba(0, 0, 0, 0.5);",
      padding: screenWidth * 0.05,
      borderRadius: screenWidth * 0.025,
      shadowColor: COLORS.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    modalErrorText: {
      color: COLORS.white,
      fontWeight: "bold",
    },
    profilImage: {
      borderRadius: screenWidth * 0.1,
      width: screenWidth * 0.125,
      height: screenWidth * 0.125,
      borderColor: COLORS.shadow,
      borderWidth: 1,
    },
    backButton: {
      width: screenWidth * 0.1,
      height: screenWidth * 0.08,
      top: screenHeight * 0.03,
      left: screenWidth * 0.05,
    },
  });