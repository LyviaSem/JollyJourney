import React from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { searchBarStyle } from '../style/searchBarStyle';
import Icon from 'react-native-vector-icons/FontAwesome';



const SearchBar = ({ searchQuery, handleSearch}) => {

  return (
    <View style={searchBarStyle.searchContainer}>
      <TextInput
        placeholder="search"
        clearButtonMode="always"
        style={searchBarStyle.textInput}
        value={searchQuery}
        onChangeText={(query) => handleSearch(query)}
      />
      <TouchableOpacity
        style={searchBarStyle.searchButton}
      >
        <Icon name="search" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;