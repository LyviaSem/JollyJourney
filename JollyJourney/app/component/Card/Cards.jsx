import React from 'react';
import { TouchableOpacity, Image, View } from 'react-native';
import { stylesCards } from '../../style/StyleCards';
import CardChildren from './CardChildren';
import CardChildrenProfil from './CardChildrenProfil';
import { useNavigation } from '@react-navigation/native';

const Cards = ({onPressProps, behaviorType, name, onSelect, isSelected, isEditing, newData, setNewData, type, handleSavePress, image}) => {
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
  if (behaviorType === 'toggle') {
    buttonContent = (
      <TouchableOpacity onPress={onSelect}>
        <View style={[stylesCards.selectionButton, isSelected ? { backgroundColor: '#6E4B6B', borderColor: '#6E4B6B' } : { borderColor: '#6E4B6B' }]}>
          {/* Contenu du bouton de basculement */}
        </View>
      </TouchableOpacity>
    );
  } else {
    buttonContent = (
      <TouchableOpacity onPress={handlePress}>
        <Image
          source={require('../../../assets/avion-papier-retour.png')}
          style={[stylesCards.backButton]}
        />
      </TouchableOpacity>
    );
  }

  return (
    <View style={stylesCards.card}>
      <ChildComponent name={name} image={image} isEditing={isEditing} newData={newData} setNewData={setNewData} type={type} handleSavePress={handleSavePress}/>
      {buttonContent}
    </View>
  );
};

export default Cards;