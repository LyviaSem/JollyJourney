import React from 'react';
import { TouchableOpacity, Image, View } from 'react-native';
import { stylesCards } from '../../style/StyleCards';
import CardChildren from './CardChildren';
import CardChildrenProfil from './CardChildrenProfil';
import { useNavigation } from '@react-navigation/native';
import { images } from '../../theme/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const Cards = ({onPressProps, behaviorType, name, onSelect, isSelected, isEditing, newData, setNewData, type, handleSavePress, image, setIsEditing}) => {
  const navigation = useNavigation();

  const ChildComponent = behaviorType === 'type1' ? CardChildrenProfil : CardChildren;

  const handlePress = () => {
    // Si onPressProps est une fonction, appelez-la
    if (typeof onPressProps === 'function' && type) {
      onPressProps(type);
    } 
    else if (typeof onPressProps === 'function'){
      onPressProps();
    }
    // Si onPressProps est une chaîne de caractères, naviguez vers la route correspondante
    else if (typeof onPressProps === 'string') {
      navigation.navigate(onPressProps);
    } 
    // Sinon, si onPressProps est un objet, naviguez vers la route spécifiée avec les props supplémentaires
    else if (typeof onPressProps === 'object' && onPressProps.routeName) {
      const { routeName, additionalProps } = onPressProps;
      navigation.navigate(routeName, additionalProps);
    }
  };

  let buttonContent;
  if (behaviorType === 'type1' && isEditing[type]) {
    buttonContent = (
      <View style={stylesCards.editing}>
        <TouchableOpacity 
          onPress={() => handleSavePress(type)}
        >
          <Icon name="check" size={24} color="green" />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setIsEditing({...isEditing, [type]: false})}
        >
          <Icon name="close" size={24} color="red" />
        </TouchableOpacity>
      </View>
    );
  } else if (behaviorType === 'toggle') {
    buttonContent = (
      <TouchableOpacity onPress={onSelect}>
        <View style={[stylesCards.selectionButton, isSelected ? { backgroundColor: '#6E4B6B', borderColor: '#6E4B6B' } : { borderColor: '#6E4B6B' }]}>
        </View>
      </TouchableOpacity>
    );
  } else {
    buttonContent = (
      <TouchableOpacity onPress={handlePress}>
        <Image
          source={images.planeBtn}
          style={[stylesCards.backButton]}
        />
      </TouchableOpacity>
    );
  }

  return (
    <View style={stylesCards.card}>
      <ChildComponent name={name} image={image} isEditing={isEditing} newData={newData} setNewData={setNewData} type={type} handleSavePress={handleSavePress} setIsEditing={setIsEditing}/>
      {buttonContent}
    </View>
  );
};

export default Cards;