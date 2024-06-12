import { StyleSheet } from "react-native";
import { DIMENSIONS, COLORS } from "../theme/theme";
import { textStyles } from "./textStyles";

const { screenWidth, screenHeight } = DIMENSIONS;


export const overviewStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: screenHeight * 0.014,
    backgroundColor: COLORS.background,
  },
  addButton: {
    backgroundColor: COLORS.purple,
    borderRadius: screenWidth * 0.1,
    width: screenWidth * 0.13,
    height: screenWidth * 0.13,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: screenHeight * 0.036,
    right: screenWidth * 0.048,
    elevation: 5,
  },
  optionsContainer: {
    position: "absolute",
    bottom: screenHeight * 0.089,
    right: screenWidth * 0.048,
    width: screenWidth * 0.48,
    backgroundColor: COLORS.white,
    borderRadius: screenHeight * 0.02,
    padding: screenHeight * 0.014,
    elevation: 3,
  },
  listContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: screenHeight * 0.014,
    flex: 1,
  },
  titleInput: {
    borderWidth: 0,
    borderRadius: 5,
    width: '100%',
    marginBottom: 0,
    ...textStyles.text
  },
  input: {
    borderWidth: 1,
    borderColor: '#6E4B6B',
    borderRadius: 5,
    padding: 10,
    width: "91%",
    backgroundColor: 'white',
    ...textStyles.text
  },
});
