import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../theme/theme";
import { todoListStyles } from "../style/todoListStyle";
import { textStyles } from "../style/textStyles";

const TodoList = ({ element, onElementChange }) => {
  const [localTitle, setLocalTitle] = useState(element.label);
  const [localTasks, setLocalTasks] = useState(element.tasks);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isValidDate = (dateString) => {
    const regex = /^[a-zA-Z]{3}\.\s\d{2}\/\d{2}$/;
    return regex.test(dateString);
  };

  const handleAddTask = () => {
    const newId = localTasks.length + 1;
    setLocalTasks([...localTasks, { id: newId, text: "", completed: false }]);
  };

  const handleTaskChange = (text, id) => {
    const updatedTasks = localTasks.map((task) =>
      task.id === id ? { ...task, text } : task
    );
    setLocalTasks(updatedTasks);
  };

  const handleToggleTask = (id) => {
    const updatedTasks = localTasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setLocalTasks(updatedTasks);
  };

  const handleDeleteTask = (id) => {
    if (localTasks.length > 1) {
      const updatedTasks = localTasks.filter((task) => task.id !== id);
      setLocalTasks(updatedTasks);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const updatedElement = { ...element };

    if (localTitle !== element.label) {
      updatedElement.label = localTitle;
    }

    if (JSON.stringify(localTasks) !== JSON.stringify(element.tasks)) {
      updatedElement.tasks = localTasks;
    }

    if (
      localTitle !== element.label ||
      JSON.stringify(localTasks) !== JSON.stringify(element.tasks)
    ) {
      onElementChange(updatedElement);
    }
  }, [localTasks, localTitle, onElementChange, element]);

  return (
    <View style={todoListStyles.todoListContainer}>
      <TouchableOpacity onPress={toggleMenu} style={todoListStyles.dateContainer}>
        {isValidDate(element.label) ? (
          <Text style={todoListStyles.dateText}>{element.label}</Text>
        ) : (
          <TextInput
            style={textStyles.text}
            placeholder="Todo liste"
            value={element.label}
            onChangeText={(text) => {
              setLocalTitle(text);
            }}
          />
        )}
        <View style={todoListStyles.flex1} />
        <Icon
          name={isMenuOpen ? "chevron-down" : "chevron-right"}
          size={24}
          color="black"
        />
      </TouchableOpacity>
      {isMenuOpen && (
        <FlatList
          data={localTasks}
          renderItem={({ item, index }) => (
            <View style={todoListStyles.taskContainer}>
              <TouchableOpacity onPress={() => handleToggleTask(item.id)}>
                <Icon
                  name={
                    item.completed
                      ? "checkbox-marked-circle"
                      : "checkbox-blank-circle-outline"
                  }
                  size={24}
                  color={item.completed ? COLORS.purple : COLORS.yellow}
                  style={todoListStyles.checkbox}
                />
              </TouchableOpacity>
              <TextInput
                style={[todoListStyles.input, item.completed && todoListStyles.completed, textStyles.text]}
                placeholder="Ajouter une tâche"
                value={item.text}
                onChangeText={(text) => handleTaskChange(text, item.id)}
                onSubmitEditing={handleAddTask}
              />
              {index > 0 && (
                <TouchableOpacity onPress={() => handleDeleteTask(item.id)}>
                  <Icon name={"close"} size={24} color={"gray"} />
                </TouchableOpacity>
              )}
            </View>
          )}
          keyExtractor={(item) => item.id}
          style={todoListStyles.flatList}
        />
      )}
    </View>
  );
};

export default TodoList;

