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
    const jsDate = new Date(date.seconds * 1000); // Conversion du timestamp Firestore en millisecondes
    const day = jsDate.getDate().toString().padStart(2, '0');
    const month = (jsDate.getMonth() + 1).toString().padStart(2, '0'); // Les mois commencent à 0
    const year = jsDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.totalExpensesText}>{totalExpenses}€</Text>

        <Btn
          name="Résumé des dettes"
          buttonStyle={{
            marginTop: 20,
            marginBottom: 0,
          }}
          action={() => setDebtsModalVisible(true)}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Dépenses</Text>
        {expenses.length > 0 ? (
          <FlatList
            data={expenses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => openModal(item)}>
                <View style={styles.expenseItem}>
                  <View style={styles.leftColumn}>
                    <Text style={styles.label}>{item.label}</Text>
                    <Text style={styles.paidBy}>
                      payé par{" "}
                      <Text style={styles.pseudo}>{item.paidByPseudo}</Text>
                    </Text>
                  </View>
                  <View style={styles.rightColumn}>
                    <Text style={styles.amount}>{item.amount}€</Text>
                    <Text style={styles.date}>{formatDate(item.date)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text>pas encore de dépense pour ce voyage</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#f0f0f0", // couleur de fond de l'en-tête
    padding: 40,
    alignItems: "center",
  },
  headerButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  headerButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  totalExpensesText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    marginTop: -10, // pour couvrir une partie de l'en-tête
    flex: 1, // pour prendre tout l'espace disponible
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  addButton: {
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
    margin: 20,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  modalDebtsPosition: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalDebtsContent: {
    //height: Dimensions.get('window').height * 0.75,
    height: "50%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
  },
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  leftColumn: {
    flexDirection: "column",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  paidBy: {
    fontSize: 14,
    color: "#555",
  },
  pseudo: {
    fontWeight: "bold",
  },
  rightColumn: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  date: {
    fontSize: 14,
    color: "#555",
  },
});
