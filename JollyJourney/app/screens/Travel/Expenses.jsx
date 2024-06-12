import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { firestore } from "../../../FirebaseConfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useUser } from "../../../context/UserContext";
import { getUserInfo } from "../../services/firebaseFunction";
import AddExpenseForm from "../../component/AddExpenseForm";
import { calculateTotalExpenses } from "../../services/CalculService";
import { calculateDebts } from "../../services/CalculService";
import DebtsModal from "../../component/DebtsModal";
import Btn from "../../component/Btn";
import { expenseStyle } from "../../style/expenseStyle";
import { textStyles } from "../../style/textStyles";

const Expenses = ({ route, navigation }) => {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const { trip } = route.params;
  const [addExpenseVisible, setAddExpenseVisible] = useState(false);
  const { user, userGroups } = useUser();
  const [group, setGroup] = useState();
  const [loading, setLoading] = useState(true);
  const [debts, setDebts] = useState([]);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [debtsModalVisible, setDebtsModalVisible] = useState(false);

  const getGroupMembersById = (id) => {
    const membersPseudo = [];
    const group = userGroups.find((group) => group.info.id === id);
    const currentUserId = user.uid;

    Promise.all(group.members.map((member) => getUserInfo(member.userId)))
      .then((memberInfos) => {
        
        const sortedMemberInfos = memberInfos.sort((a, b) => {
          if (a.id === currentUserId) return -1;
          if (b.id === currentUserId) return 1;
          return 0;
        });
        membersPseudo.push(sortedMemberInfos);
        setGroup(sortedMemberInfos);
      })
      .catch((error) => console.error("Error fetching member info:", error));
    setGroup(membersPseudo);
  };

  const openModal = (expense) => {
    setSelectedExpense(expense);
    setAddExpenseVisible(true);
  };

  useEffect(() => {
    calculateTotalExpenses(expenses, setTotalExpenses);
    calculateDebts(expenses, setDebts);
  }, [expenses]);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const expenseCollection = collection(
          firestore,
          "trips",
          trip.id,
          "expenses"
        );
        const q = query(expenseCollection, orderBy("date", "asc"));
        const expensesSnapshot = await getDocs(q);
        let expenses = [];

        if (expensesSnapshot.empty) {
          return;
        } else {
          expensesSnapshot.forEach((doc) => {
            expenses.push(doc.data());
          });

          setExpenses(expenses);
        }
      } catch (error) {
        console.error("Error fetching expenses: ", error);
      }
    };
    setLoading(true);
    fetchExpenses();
    getGroupMembersById(trip.groupId);
    setLoading(false);
  }, []);

  const formatDate = (date) => {
    if (date && date.seconds) {
      const jsDate = new Date(date.seconds * 1000);
      const day = jsDate.getDate().toString().padStart(2, '0');
      const month = (jsDate.getMonth() + 1).toString().padStart(2, '0');
      const year = jsDate.getFullYear();
      return `${day}/${month}/${year}`;
    } else if (date instanceof Date) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return "Date non définie";
  };

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={expenseStyle.container}>
      <View style={expenseStyle.header}>
        <Text style={expenseStyle.totalExpensesText}>{totalExpenses}€</Text>
  
        <Btn
          name="Résumé des dettes"
          buttonStyle={{
            marginTop: 20,
            marginBottom: 0,
          }}
          action={() => setDebtsModalVisible(true)}
        />
      </View>
      <View style={expenseStyle.content}>
        <Text style={expenseStyle.sectionTitle}>Dépenses</Text>
        {expenses.length > 0 ? (
          <FlatList
            data={expenses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => openModal(item)}>
                <View style={expenseStyle.expenseItem}>
                  <View style={expenseStyle.leftColumn}>
                    <Text style={expenseStyle.label}>{item.label}</Text>
                    <Text style={expenseStyle.paidBy}>
                      payé par{" "}
                      <Text style={expenseStyle.pseudo}>{item.paidByPseudo}</Text>
                    </Text>
                  </View>
                  <View style={expenseStyle.rightColumn}>
                    <Text style={expenseStyle.amount}>{item.amount}€</Text>
                    <Text style={expenseStyle.date}>{formatDate(item.date)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={textStyles.text}>pas encore de dépense pour ce voyage</Text>
        )}
  
        <Btn
          name="Ajouter une dépense"
          buttonStyle={{
            margin: 10,
          }}
          action={() => setAddExpenseVisible(true)}
        />
  
        <DebtsModal
          visible={debtsModalVisible}
          setDebtsModalVisible={setDebtsModalVisible}
          debts={debts}
        />
  
        <AddExpenseForm
          group={group}
          isVisible={addExpenseVisible}
          setIsVisible={setAddExpenseVisible}
          trip={trip}
          setExpenses={setExpenses}
          selectedExpense={selectedExpense}
          setSelectedExpense={setSelectedExpense}
          expenses={expenses}
        />
      </View>
    </View>
  );  
};

export default Expenses;