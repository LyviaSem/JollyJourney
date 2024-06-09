import { TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';



const ChangePic = ({image, defaultImage, setModalVisible, picStyle}) => {

  return (
    <>
        <TouchableOpacity style={[styles.profilImageContainer, picStyle]}>
            <Image
              source={image ? { uri: image } : defaultImage}
              style={styles.profilImage}
            />
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setModalVisible(true)}
            >
              <Icon name="camera-outline" size={20} color="#FFB703" />
            </TouchableOpacity>
        </TouchableOpacity>
    </>
  )
}

export default ChangePic

const styles = StyleSheet.create({
    profilImageContainer:{
      marginBottom: 50
    },
  
    profilImage:{
      borderRadius: 75,
      width: 150,
      height:150,
      borderColor: '#f0f0f0',
      borderWidth: 5,
    },
  
    editButton:{
      backgroundColor:'#f0f0f0',
      borderRadius: 24,
      padding: 8,
      position:'absolute',
      right:5,
      bottom: 5,
    }
});