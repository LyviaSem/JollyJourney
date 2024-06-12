import { Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { textStyles } from '../style/textStyles';

const RenderOptions = ({ options }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.optionButton} onPress={item.action}>
      <Text style={styles.optionText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={options}
      renderItem={renderItem}
      keyExtractor={item => item.id}
    />
  );
};

export default RenderOptions;

const styles = StyleSheet.create({
  optionButton: {
    padding: 10,
    backgroundColor: '#ddd',
    marginVertical: 5,
    borderRadius: 5,
  },
  optionText: {
    fontSize: 14,
    ...textStyles.text
  }
});