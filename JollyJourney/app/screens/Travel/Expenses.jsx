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
  console.log("debts", debts);
  console.log("expenses", expenses);

  const getGroupMembersById = (id) => {
    const membersPseudo = [];
    const group = userGroups.find((group) => group.info.id === id);
    const currentUserId = user.uid; // Supposons que vous avez l'ID de l'utilisateur connecté ici

    Promise.all(group.members.map((member) => getUserInfo(member.userId)))
      .then((memberInfos) => {
        // Réorganiser les membres pour mettre l'utilisateur connecté en premier
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

          // setTotalExpenses(total);

          setExpenses(expenses);
          // setOtherReimbursements(otherDebts);
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
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => setDebtsModalVisible(true)}
        >
          <Text style={styles.headerButtonText}>Résumé des dettes</Text>
        </TouchableOpacity>
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
                  <Text>{item.paidByPseudo}</Text>
                  <Text>{item.label}</Text>
                  <Text>{item.amount}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text>pas encore de dépense pour ce voyage</Text>
        )}
        <TouchableOpacity
          onPress={() => setAddExpenseVisible(true)}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}> Ajouter une dépense</Text>
        </TouchableOpacity>

        <DebtsModal visible={debtsModalVisible} setDebtsModalVisible={setDebtsModalVisible} debts={debts} />

        <AddExpenseForm
          group={group}
          isVisible={addExpenseVisible}
          setIsVisible={setAddExpenseVisible}
          trip={trip}
          setExpenses={setExpenses}
          selectedExpense={selectedExpense}
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
  expenseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  addButton: {
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
    margin: 20, // espace autour du bouton
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
});
