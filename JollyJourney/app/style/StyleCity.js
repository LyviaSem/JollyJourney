import { StyleSheet } from 'react-native';

export const stylesCity = StyleSheet.create({
    container: {
        overflow: "hidden",
        width: 344,
        height: 165,
        marginBottom: 30,
    },
    imageBackground: {
      resizeMode: "cover",
      overflow: "hidden",
      flex: 1,
      width: "100%",
      height: "100%",
    },
    image: {
      borderRadius: 10,
    },
    overlay: {
      position: "absolute",
      bottom: 0,
      left: 0,
      backgroundColor: "#FFFF",
      opacity: 0.85,
      width: 144,
      height: 38,
      justifyContent: "center",
      alignItems: "center",
      borderBottomLeftRadius: 10,
    },
    name: {
      color: "#6E4B6B",
      fontSize: 12,
    },

})