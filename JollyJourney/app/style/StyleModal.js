import { StyleSheet } from 'react-native';

export const stylesModal = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    
    modalView: {
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
      width: 350,
      height: 150,
    },

    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
    },

    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },

    button: {
        width: '30%',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        padding: 14,
        borderRadius: 10,
    },

    closeButton: {
      position: 'absolute',
      top: 10,
      right: 10,
    },
});