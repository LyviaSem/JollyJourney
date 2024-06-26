import React from 'react';
import { ImageBackground, View, Text, TouchableOpacity } from 'react-native';
import { thumbnailStyle } from '../style/thumbnailStyle';
import { useNavigation } from '@react-navigation/native';
import { IMAGES } from '../theme/theme';

const Thumbnail = ({picture, name, onPressProps, description }) => {
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
            style={thumbnailStyle.container}
          >
            <ImageBackground
              source={picture? { uri: picture } : IMAGES.defaultImage}
              imageStyle={{ borderRadius: 10 }}
              style={thumbnailStyle.imageBackground}
            >
              <View
                style={thumbnailStyle.overlay}
              >
                <Text style={thumbnailStyle.name}>
                  {name}
                </Text>
              </View>
            </ImageBackground>
          </View>
        </TouchableOpacity>
  );
};

export default Thumbnail;