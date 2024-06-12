import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useUser } from '../../context/UserContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { textStyles } from '../style/textStyles';

const Dropdown = ({ group, onSelectItem }) => {
  const { user } = useUser();

  const getDefaultItem = () => {
    if (!user || !group) return null;
    return group.find(item => item.pseudo === user.pseudo) || group[0];
  };

  const [selectedItem, setSelectedItem] = useState(getDefaultItem); 
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    if (selectedItem) {
      onSelectItem(selectedItem);
    }
  }, [selectedItem, onSelectItem]);

  const handleSelect = (item) => {
    setSelectedItem(item);
    onSelectItem(item)
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
        <Icon name={isDropdownVisible ? 'chevron-down' : 'chevron-right'} size={24} color="black" />
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
    marginBottom: 30
  },
  selectedItem: {
    padding: 10,
    backgroundColor: 'white',
    borderColor: 'gray',
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  selectedItemText: {
    fontSize: 16,
    ...textStyles.text
  },
  dropdown: {
    borderColor: 'gray',
    borderWidth: 1,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    maxHeight: 200,
    backgroundColor: 'white',
    padding: 10
  },
  item: {
    padding: 10,
  },
  itemText: {
    fontSize: 16,
    ...textStyles.text
  },
});

export default Dropdown;
