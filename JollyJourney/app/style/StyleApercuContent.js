import { StyleSheet } from 'react-native';

export const stylesApercuContent = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     margin: 20,
    //     //width: '80%',
    //   },
      inputContainer: {
        marginBottom: 10,
      },
      titleInput: {
        borderWidth: 0, // Retire la bordure du TextInput du titre
        borderRadius: 5,
        //padding: 10,
        width: '100%',
        marginBottom: 0,
      },
      input: {
        borderWidth: 1,
        borderColor: '#6E4B6B',
        borderRadius: 5,
        padding: 10,
        width: '100%',
        backgroundColor: 'white',
      },
      addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#6E4B6B',
        borderRadius: 50, // Pour rendre le bouton rond
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
      },
      optionsContainer: {
        position: 'absolute',
        bottom: 80,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        elevation: 3, // Pour donner une ombre sur Android
      },
      option: {
        paddingVertical: 8,
        paddingHorizontal: 16,
      },
      optionText: {
        color: 'black',
        fontSize: 16,
      },
      container: {
        flex: 1, // Assurez-vous que le conteneur occupe tout l'espace disponible
        position: 'relative', // Position relative pour le positionnement absolu du bouton
      },
  });