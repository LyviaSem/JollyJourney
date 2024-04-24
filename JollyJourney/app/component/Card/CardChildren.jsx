import React from 'react';
import { Image, View, Text } from 'react-native';
import { stylesCards } from '../../style/StyleCards';

const CardChildren = ({image, name}) => {

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {image &&(
            <Image
                source={image}
                style={stylesCards.profileImage}
            />
        )}
      <View style={stylesCards.userInfo}>
        <Text style={stylesCards.userName}>{name}</Text>
      </View>
    </View>
  );
};

export default CardChildren;