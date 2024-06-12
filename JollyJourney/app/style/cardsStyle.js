import { StyleSheet } from 'react-native';
import { textStyles } from './textStyles';
import { COLORS, DIMENSIONS } from '../theme/theme';

const { screenWidth, screenHeight } = DIMENSIONS;

export const cardsStyle = StyleSheet.create({
  modalios:{
    marginTop: screenHeight * 0.1,
  },
  editButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: screenHeight * 0.02,
  },
  card: {
    width: screenWidth * 0.85,
    height: screenHeight * 0.09,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: screenHeight * 0.014,
    marginBottom: screenHeight * 0.04,
    backgroundColor: COLORS.white,
  },
  profileImage: {
    width: screenWidth * 0.1,
    height: screenWidth * 0.1,
    borderRadius: screenWidth * 0.056,
  },
  userInfo: {
    marginLeft: screenWidth * 0.029,
  },
  userName: {
    fontSize: 15,
    ...textStyles.text,
  },
  Button: {
    backgroundColor: COLORS.purple,
    borderRadius: screenHeight * 0.086,
    width: screenWidth * 0.55,
    height: screenHeight * 0.17,
    margin: screenHeight * 0.02,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  backButton: {
    width: screenWidth * 0.07,
    height: screenWidth * 0.06,
  },
  selectionButton: {
    width: screenWidth * 0.043,
    height: screenWidth * 0.043,
    borderRadius: screenWidth * 0.026,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  editing: {
    flexDirection: 'row',
  }
});