import React from 'react';
import { ImageBackground, View, Text, TouchableOpacity } from 'react-native';
import { stylesCity } from '../style/StyleCity';
import { useNavigation } from '@react-navigation/native';
import { IMAGES } from '../theme/theme';

const City = ({picture, name, onPressProps, description }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (typeof onPressProps === 'string'){
      navigation.navigate(onPressProps);
    }
    else if (typeof onPressProps === 'object' && onPressProps.routeName) {
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
            <ImageBackground
              source={picture? { uri: picture } : IMAGES.defaultImage}
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
          </View>
        </TouchableOpacity>
  );
};

export default City;