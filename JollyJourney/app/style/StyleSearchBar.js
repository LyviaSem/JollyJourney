import { StyleSheet } from 'react-native';

export const stylesSearchBar = StyleSheet.create({
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      //paddingHorizontal: 20,
      borderRadius: 28.5,
      marginTop: 30,
      marginBottom: 30,
      backgroundColor: "rgba(196, 196, 196, 0.22)", // Opacité appliquée
      width: 344,
    },
    textInput: {
      flex: 1,
      height: 50, // Hauteur de la barre de recherche
      color: "#000000",
      borderRadius: 28.5,
      paddingHorizontal: 20,
      marginRight: 10, // Espacement entre le TextInput et le bouton
    },
    searchButton: {
      backgroundColor: '#FFB703',
      borderRadius: 28.5, // Garder le même rayon de bordure que le conteneur de recherche
      padding: 15,
      right: 0
      //marginLeft: -0, // Décaler le bouton vers la gauche pour l'intégrer visuellement dans la barre de recherche
    },
  });