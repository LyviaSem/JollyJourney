import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useUser } from '../../context/UserContext';

const Dropdown = ({ group }) => {
  const { user } = useUser();

  const getDefaultItem = () => {
    if (!user || !group) return null;
    return group.find(item => item.pseudo === user.pseudo) || group[0];
  };

  const [selectedItem, setSelectedItem] = useState(getDefaultItem); 
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleSelect = (item) => {
    setSelectedItem(item);
    setIsDropdownVisible(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleSelect(item)}
      style={styles.item}
    >
      <Text style={styles.itemText}>{item.pseudo}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setIsDropdownVisible(!isDropdownVisible)}
        style={styles.selectedItem}
      >
        <Text style={styles.selectedItemText}>{selectedItem.pseudo}</Text>
      </TouchableOpacity>

      {isDropdownVisible && (
        <FlatList
          data={group}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          style={styles.dropdown}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    marginTop: 20,
  },
  selectedItem: {
    padding: 10,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
  },
  selectedItemText: {
    fontSize: 16,
  },
  dropdown: {
    borderColor: 'gray',
    borderWidth: 1,
    maxHeight: 200, // Limite la hauteur du dropdown
    backgroundColor: 'white',
  },
  item: {
    padding: 10,
  },
  itemText: {
    fontSize: 16,
  },
});

export default Dropdown;
