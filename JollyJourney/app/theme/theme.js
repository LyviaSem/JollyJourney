import { Dimensions } from "react-native";

export const COLORS = {
  background: "#FEF5EE",
  purple: "#6E4B6B",
  loading: "#0000FF",
  yellow: "#FFB703",
  redirectText: "#fff",
  shadow: "#000",
  borderInput: "#ccc",
  white: "#fff",
};

export const IMAGES = {
  logo: require("../assets/logo-jolly-journey.png"),
  planeBtn: require("../assets/avion-papier-retour.png"),
  whitePlaneBtn: require("../assets/avion-en-papier-blanc.png"),
  defaultProfile: require("../assets/utilisateur.png"),
  plusIcon: require("../assets/plus.png"),
  defaultImage: require("../assets/image_default.jpg"),
  globe: require("../assets/planete-terre.png"),
  group: require("../assets/groupe.png"),
  travel: require("../assets/logo-jolly-journey-coeur-blanc.png"),
  chat: require("../assets/un-message.png"),
  profil: require("../assets/profil.png"),
};

export const DIMENSIONS = {
  screenWidth: Dimensions.get("window").width,
  screenHeight: Dimensions.get("window").height,
};
