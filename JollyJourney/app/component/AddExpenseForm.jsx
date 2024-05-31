import React, { useState, useEffect } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Dropdown from "./DropDown";
import { addExpense } from "../services/firebaseFunction";
import { useUser } from "../../context/UserContext";
import { colors } from "../theme/theme";

const AddExpenseForm = ({
  group,
  isVisible,
  setIsVisible,
  trip,
  setExpenses,
  selectedExpense,
}) => {
  const { user } = useUser();

  const [checkedItems, setCheckedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(true);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const getDefaultItem = () => {
    if (!user || !group) return null;
    return group.find((item) => item.pseudo === user.pseudo) || group[0];
  };

  const [selectedItem, setSelectedItem] = useState(getDefaultItem);

  useEffect(() => {
    const allIds = group.map((item) => item.id);
    setCheckedItems(allIds);
  }, [isVisible]);

  useEffect(() => {
    if (selectedExpense) {
      setTitle(selectedExpense.label);
      setAmount(selectedExpense.amount.toString());
      setSelectedItem(
        group.find((item) => item.id === selectedExpense.paidById)
      );
      setCheckedItems(selectedExpense.participants);
    }
  }, [selectedExpense]);

  const toggleCheckBox = (id) => {
    setCheckedItems((prevCheckedItems) => {
      if (prevCheckedItems.includes(id)) {
        return prevCheckedItems.filter((itemId) => itemId !== id);
      } else {
        return [...prevCheckedItems, id];
      }
    });
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setCheckedItems([]);
    } else {
      const allItemIds = group.map((item) => item.id);
      setCheckedItems(allItemIds);
    }
    setSelectAll((prevState) => !prevState);
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  const handleAmountChange = (text, setAmount) => {
    let newText = text.replace(/[^0-9.]/g, "");
    const pointCount = (newText.match(/\./g) || []).length;
    if (pointCount > 1) {
      const indexOfFirstPoint = newText.indexOf(".");
      newText =
        newText.slice(0, indexOfFirstPoint + 1) +
        newText.slice(indexOfFirstPoint + 1).replace(/\./g, "");
    }
    setAmount(newText);
  };

  const handleAmountBlur = (amount, setAmount) => {
    const parts = amount.split(".");
    if (parts.length === 2 && parts[1].length === 1) {
      setAmount(`${parts[0]}.${parts[1]}0`);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setIsVisible(false)}
    >
      <View style={styles.contentPosition}>
        <View style={styles.modalContent}>
          <View style={{flexDirection:"row", justifyContent:"space-between", marginBottom:10}}>
            <TouchableOpacity
              onPress={() => {
                if (title && amount && checkedItems.length > 0) {
                  addExpense(
                    trip.id,
                    title,
                    amount,
                    selectedItem.id,
                    checkedItems,
                    setIsVisible,
                    setExpenses,
                    setTitle,
                    setAmount,
                    selectedItem.pseudo
                  );
                } else {
                  alert("Veuillez remplir tous les champs.");
                }
              }}
            >
              <Text> Enregistrer </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsVisible(false)}>
              <Icon name={"close"} size={24} color={"gray"} />
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Titre"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <View style={styles.amountContainer}>
            <TextInput
              placeholder="Montant"
              value={amount}
              onChangeText={(text) => handleAmountChange(text, setAmount)}
              onBlur={() => handleAmountBlur(amount, setAmount)}
              keyboardType="decimal-pad"
              style={styles.amountInput}
            />
            <Text style={styles.currencySymbol}>€</Text>
          </View>

          <Dropdown group={group} onSelectItem={handleSelectItem} />

          <TouchableOpacity
            onPress={() => toggleSelectAll()}
            style={{ flexDirection: "row", gap:10, alignItems:"center" }}
          >
            <Icon
              name={selectAll ? "checkbox-marked" : "checkbox-blank-outline"}
              size={24}
              color={selectAll ? colors.purple : colors.yellow}
            />
            <Text>Pour qui ?</Text>
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <FlatList
              data={group}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.checkboxContainer}>
                  <TouchableOpacity
                    key={item.id}
                    style={styles.checkbox}
                    onPress={() => toggleCheckBox(item.id)}
                  >
                    <Icon
                      name={
                        checkedItems.includes(item.id)
                          ? "checkbox-marked"
                          : "checkbox-blank-outline"
                      }
                      size={24}
                      color={checkedItems.includes(item.id) ? colors.purple : colors.yellow}
                    />
                  </TouchableOpacity>
                  <Text>{item.pseudo}</Text>
                </View>
              )}
            />
          </View>

          {/* {selectedExpense ? (
            <TouchableOpacity
              onPress={() => {
                // Logique de suppression ici
                deleteExpense(selectedExpense.id);
                setIsVisible(false);
              }}
            >
              <Text> Supprimer </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                if (title && amount && checkedItems.length > 0) {
                  addExpense(
                    trip.id,
                    title,
                    amount,
                    selectedItem.id,
                    checkedItems,
                    setIsVisible,
                    setExpenses,
                    setTitle,
                    setAmount,
                    selectedItem.pseudo
                  );
                } else {
                  alert("Veuillez remplir tous les champs.");
                }
              }}
            >
              <Text style={styles.btnSave}> Enregistrer </Text>
            </TouchableOpacity>
          )} */}
        </View>
      </View>
    </Modal>
  );
};

export default AddExpenseForm;

const styles = StyleSheet.create({
  contentPosition: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    height: "50%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
  },
  input: {
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 40,
    borderColor: "gray",
    borderBottomWidth: 1,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: "gray",
    paddingHorizontal: 10,
  },
  amountInput: {
    flex: 1,
    height: 40,
    paddingRight: 10,
  },
  currencySymbol: {
    fontSize: 18,
    marginLeft: 5,
  },
  selectAllContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",

  },
  checkbox: {
    width: 24,
    height: 24,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
