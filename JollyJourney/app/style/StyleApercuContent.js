import { StyleSheet } from 'react-native';

export const stylesApercuContent = StyleSheet.create({

  taskContainer: {
    alignItems: 'center',
  },
  taskInput: {
    flex: 1,
    height: 40,
    width: 150,
  },
  deleteButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'red',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 10,
  },
  titleInput: {
    borderWidth: 0,
    borderRadius: 5,
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
    backgroundColor: '#6E4B6B',
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute', // ajouté
    bottom: 20, // ajouté
    right: 20, // ajouté
    elevation: 5,
  },
  optionsContainer: {
    position: 'absolute', // ajouté
    bottom: 80, // modifié pour être plus proche du bouton
    right: 20, // ajouté pour l'aligner avec le bouton
    width: 150, // élargi pour plus de lisibilité
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  optionText: {
    color: 'black',
    fontSize: 16,
  },
});