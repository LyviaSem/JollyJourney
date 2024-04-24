import React from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { stylesSearchBar } from '../style/StyleSearchBar';
import Icon from 'react-native-vector-icons/FontAwesome';



const SearchBar = ({ searchQuery, handleSearch}) => {

  return (
    <View style={stylesSearchBar.searchContainer}>
      <TextInput
        placeholder="search"
        clearButtonMode="always"
        style={stylesSearchBar.textInput}
        value={searchQuery}
        onChangeText={(query) => handleSearch(query)}
      />
      <TouchableOpacity
        style={stylesSearchBar.searchButton}
      >
        <Icon name="search" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;