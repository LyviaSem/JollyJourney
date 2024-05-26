import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { stylesApercuContent } from '../style/StyleApercuContent';

const TodoList = ({ element, onElementChange }) => {

    const [localTitle, setLocalTitle] = useState(element.label)
    const [localTasks, setLocalTasks] = useState(element.tasks);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const isValidDate = (dateString) => {
      const regex = /^[a-zA-Z]{3}\.\s\d{2}\/\d{2}$/;
      return regex.test(dateString);
    };

    const handleAddTask = () => {
        const newId = localTasks.length + 1;
        setLocalTasks([...localTasks, { id: newId, text: '', completed: false }]);
    };

    const handleTaskChange = (text, id) => {
        const updatedTasks = localTasks.map(task =>
          task.id === id ? { ...task, text } : task
        );
        setLocalTasks(updatedTasks);
    };

    const handleToggleTask = (id) => {
        const updatedTasks = localTasks.map(task =>
          task.id === id ? { ...task, completed: !task.completed } : task
        );
        setLocalTasks(updatedTasks);
    };
  
    const handleDeleteTask = (id) => {
        if (localTasks.length > 1) {
            const updatedTasks = localTasks.filter(task => task.id !== id);
            setLocalTasks(updatedTasks);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
      // Créer une copie de l'élément actuel
      const updatedElement = { ...element };
  
      // Vérifiez si le titre a changé
      if (localTitle !== element.label) {
          updatedElement.label = localTitle;
      }
  
      // Vérifiez si les tâches ont changé
      if (JSON.stringify(localTasks) !== JSON.stringify(element.tasks)) {
          updatedElement.tasks = localTasks;
      }
  
      // Si des changements ont été effectués, appelez onElementChange
      if (
          localTitle !== element.label ||
          JSON.stringify(localTasks) !== JSON.stringify(element.tasks)
      ) {
          onElementChange(updatedElement);
      }
    }, [localTasks, localTitle, onElementChange, element]);
  
    return (
      <View style={styles.todoListContainer}>
        <TouchableOpacity onPress={toggleMenu} style={styles.dateContainer}>
        {
          isValidDate(element.label) ? (
            <Text style={styles.dateText}>{element.label}</Text>
          ) : (
            <TextInput
              placeholder='Todo liste'
              value={element.label}
              onChangeText={(text) => {
                setLocalTitle(text)
              }}
            />
          )
        }
          <View style={{ flex: 1 }} />
          <Icon name={isMenuOpen ? 'chevron-down' : 'chevron-right'} size={24} color="black" />
        </TouchableOpacity>
        {isMenuOpen && (
          <FlatList
            data={localTasks}
            renderItem={({ item, index }) => (
              <View style={styles.taskContainer}>
                <TouchableOpacity onPress={() => handleToggleTask(item.id)}>
                  <Icon name={item.completed ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'} size={24} color={item.completed ? 'green' : 'black'} style={styles.checkbox} />
                </TouchableOpacity>
                <TextInput
                  style={[styles.input, item.completed && styles.completed]}
                  placeholder="Ajouter une tâche"
                  value={item.text}
                  onChangeText={text => handleTaskChange(text, item.id)}
                  onSubmitEditing={handleAddTask}
                />
                {index > 0 && (
                    <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                       <Icon name={'close'} size={24} color={'red'}/>
                    </TouchableOpacity>
                )}
              </View>
            )}
            keyExtractor={(item) => item.id}
            style={styles.flatList}
          />
        )}
      </View>
    );
};

export default TodoList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  todoListContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 5
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 35,
    fontWeight: 'bold',
    marginRight: 10,
  },
  flatList: {
    backgroundColor: '#f0f0f0', // Fond gris pour la FlatList
    margin: 10, // Marge autour de la FlatList
    borderRadius: 10, // Bordure arrondie pour la FlatList
    padding: 10,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    marginRight: 10,
    borderRadius: 5, // Optionnel : Arrondir légèrement les bords de l'input
  },
  addButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskText: {
    flex: 1,
    fontSize: 18,
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  toggleButton: {
    color: 'green',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
});
