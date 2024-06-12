import { StyleSheet } from "react-native";
import { DIMENSIONS, COLORS } from "../theme/theme";
import { textStyles } from "./textStyles";

const { screenHeight, screenWidth } = DIMENSIONS;

export const expenseStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.background,
    padding: screenHeight * 0.054,
    alignItems: "center",
  },
  totalExpensesText: {
    fontSize: 24,
    ...textStyles.buttonText,
  },
  content: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: screenHeight * 0.027,
    borderTopRightRadius: screenHeight * 0.027,
    padding: screenHeight * 0.027,
    marginTop: -screenHeight * 0.014,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    ...textStyles.buttonText,
    marginBottom: screenHeight * 0.014,
  },
  modalDebtsPosition: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalDebtsContent: {
    height: "50%",
    backgroundColor: COLORS.white,
    borderRadius: screenHeight * 0.054,
    padding: screenHeight * 0.027,
  },
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: screenHeight * 0.014,
    paddingHorizontal: screenWidth * 0.027,
    marginVertical: screenHeight * 0.007,
    backgroundColor: "#f9f9f9",
    borderRadius: screenHeight * 0.014,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  leftColumn: {
    flexDirection: "column",
  },
  label: {
    fontSize: 16,
    ...textStyles.buttonText,
  },
  paidBy: {
    fontSize: 14,
    color: "#555",
    ...textStyles.text,
  },
  pseudo: {
    ...textStyles.subTitle,
  },
  rightColumn: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    ...textStyles.buttonText,
    color: "#000",
  },
  date: {
    fontSize: 14,
    color: "#555",
    ...textStyles.text,
  },
});
