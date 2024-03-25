import { Text, View, StatusBar, StyleSheet, ImageBackground } from 'react-native'
import React, { Component } from 'react'

const CreateTravel = (navigation) => {
    return (
      <View
        style={{
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
            backgroundColor: "#FEF5EE",
            flex: 1,
        }}
      >
        <Text>Create Travel</Text>
      </View>
    )
}

export default CreateTravel;

const styles = StyleSheet.create({
    backButton: {
        width: 40,
        height: 34,
    },
    backgroundImage: {
        width: 414,
        height: 276,
    },
})