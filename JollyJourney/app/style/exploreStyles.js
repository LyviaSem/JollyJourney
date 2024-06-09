import { StyleSheet, Platform, StatusBar } from 'react-native';

export const exploreStyles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    backgroundColor: "#FEF5EE",
    flex: 1,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
