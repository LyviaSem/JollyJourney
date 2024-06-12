import { StyleSheet } from "react-native";
import { DIMENSIONS, COLORS } from "../theme/theme";
import { textStyles } from "./textStyles";

const { screenWidth } = DIMENSIONS;

export const todoListStyles = StyleSheet.create({
  todoListContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 5,
    width: screenWidth * 0.9,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.purple,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    paddingLeft: 5,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: screenWidth * 0.027,
    ...textStyles.buttonText
  },
  flex1: {
    flex: 1,
  },
  flatList: {
    backgroundColor: "#f0f0f0",
    margin: screenWidth * 0.027,
    borderRadius: screenWidth * 0.027,
    padding: screenWidth * 0.027,
  },
  input: {
    flex: 1,
    paddingHorizontal: screenWidth * 0.027,
    marginRight: screenWidth * 0.027,
    borderRadius: 5,
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: screenWidth * 0.027,
  },
  completed: {
    textDecorationLine: "line-through",
    color: "#888",
  },
});

