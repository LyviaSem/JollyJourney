import React from 'react';
import { ImageBackground, View, Text, TouchableOpacity } from 'react-native';
import { stylesCity } from '../style/StyleCity';
import { useNavigation } from '@react-navigation/native';

const City = ({picture, name, onPressProps, description }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    // Si onPressProps est une fonction, appelez-la
    if (typeof onPressProps === 'string'){
      console.log(onPressProps)
      navigation.navigate(onPressProps);
    }
    // Sinon, si onPressProps est un objet, naviguez vers la route spécifiée avec les props supplémentaires
    else if (typeof onPressProps === 'object' && onPressProps.routeName) {
      console.log(onPressProps)
      const { routeName, additionalProps } = onPressProps;
      navigation.navigate(routeName, additionalProps);
    }
  };

  return (
    <TouchableOpacity
          onPress={handlePress}
        >
          <View
            style={stylesCity.container}
          >
            {picture && (
            <ImageBackground
              source={{ uri: picture }}
              imageStyle={{ borderRadius: 10 }}
              style={stylesCity.imageBackground}
            >
              <View
                style={stylesCity.overlay}
              >
                <Text style={stylesCity.name}>
                  {name}
                </Text>
              </View>
            </ImageBackground>
            )}
          </View>
        </TouchableOpacity>
  );
};

export default City;