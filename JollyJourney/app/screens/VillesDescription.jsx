import { View, Text, StatusBar, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import Explorer from './Explorer';

const VillesDescription = ({ route, navigation }) => {
    const {ville, text}= route.params;
    console.log('data '+JSON.stringify(text))
  return (
    <View style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        flex:1}}>
        {/* <TouchableOpacity onPress={navigation.navigate('Explorer')} style={{ position: 'absolute', top: 20, left: 20 }}> */}
            <Image source={require('../../assets/avion-en-papier-violet.png')} style={{position: 'absolute', top: 20, left: 20, width: 30, height: 30 }} />
        {/* </TouchableOpacity> */}
      <Text>{text}</Text>
    </View>
  )
}

export default VillesDescription