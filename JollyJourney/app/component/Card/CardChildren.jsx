import React from 'react';
import { Image, View, Text } from 'react-native';
import { cardsStyle } from '../../style/cardsStyle';

const CardChildren = ({image, name}) => {

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {image &&(
            <Image
                source={image}
                style={cardsStyle.profileImage}
            />
        )}
      <View style={cardsStyle.userInfo}>
        <Text style={cardsStyle.userName}>{name}</Text>
      </View>
    </View>
  );
};

export default CardChildren;