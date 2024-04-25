import { StyleSheet } from 'react-native';

export const stylesApercuContent = StyleSheet.create({
    
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
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6E4B6B',
    borderRadius: 50,
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
  container: {
    flex: 1,
    position: 'relative',
  },
});