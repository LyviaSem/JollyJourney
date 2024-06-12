import { StyleSheet } from "react-native";
import { COLORS, DIMENSIONS } from "../theme/theme";

const { screenWidth, screenHeight } = DIMENSIONS;

export const groupDetailStyle = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  groupName: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: screenHeight * 0.014,
    textAlign: "center",
  },
  memberCount: {
    fontSize: 16,
    marginBottom: screenHeight * 0.007,
    textAlign: "center",
  },
  createdBy: {
    fontSize: 16,
    marginBottom: screenHeight * 0.014,
    textAlign: "center",
  },
  profilImage: {
    marginBottom: screenHeight * 0.007,
    borderRadius: screenWidth * 0.14,
    width: screenWidth * 0.14,
    height: screenWidth * 0.14,
  },
  groupProfilContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  groupInfoContainer: {
    flexDirection: "row",
    gap: screenHeight * 0.028,
  },
  button: {
    backgroundColor: COLORS.purple,
    borderRadius: screenHeight * 0.086,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: screenWidth * 0.056,
    padding: screenHeight * 0.028,
    marginBottom: screenHeight * 0.036,
  },
  buttonText: {
    color: COLORS.white,
  },
});

