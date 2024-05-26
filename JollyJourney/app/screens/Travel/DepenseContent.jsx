import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native';
import { firestore } from '../../../FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useUser } from '../../../context/UserContext';
import { getUserInfo } from '../../services/firebaseFunction';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AddExpenseForm from '../../component/AddExpenseForm';

const TripScreen = ({ route, navigation }) => {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [debts, setDebts] = useState([]);
  const [otherReimbursements, setOtherReimbursements] = useState([]);
  const {trip} = route.params
  const [addExpenseVisible, setAddExpenseVisible] = useState(false)
  const {user, userGroups} = useUser();
  const [group, setGroup] = useState();
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState({});

  



  const getGroupMembersById = (id) => {
    const membersPseudo = [];
    const group = userGroups.find(group => group.info.id === id);

    group.members.forEach(member =>{
      getUserInfo(member.userId).then(memberInfo => {
        membersPseudo.push(memberInfo)
      })
    })
    setGroup(membersPseudo);
      
     
  };

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const expenseCollection = collection(firestore, 'trips', trip.id, 'expenses')
        const expensesSnapshot = await getDocs(expenseCollection)
        let total = 0;
        let userDebts = [];
        let otherDebts = [];

        if(expensesSnapshot.empty){
          return
        } else{
          expensesSnapshot.forEach(doc => {
          const data = doc.data();
          total += data.amount;

          // Calcul des dettes
          const numMembers = data.members.length;
          const individualShare = data.amount / numMembers;

          if (data.userId === userId) {
            data.members.forEach(member => {
              if (member !== userId) {
                userDebts.push({ member, amount: individualShare });
              }
            });
          } else {
            otherDebts.push({ userId: data.userId, amount: individualShare });
          }
        });

        setTotalExpenses(total);
        setDebts(userDebts);
        setOtherReimbursements(otherDebts);
        }

        
      } catch (error) {
        console.error('Error fetching expenses: ', error);
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
    <View>
      <TouchableOpacity>
        <Text>Résumé des dettes</Text>
      </TouchableOpacity>
      <Text >Total des dépenses: {totalExpenses}€</Text>
      
      <Text>Dépenses</Text>
      {debts.length > 0 ? (
        <Text>ouais</Text>
      ):(
        <>
        <Text>pas encore de dépense pour ce voyage</Text>
        <TouchableOpacity
          onPress={() => setAddExpenseVisible(true)}
        >
          <Text> Ajouter une dépense</Text>
        </TouchableOpacity>
        </>
      )}

      <AddExpenseForm group={group} isVisible={addExpenseVisible} setIsVisible={setAddExpenseVisible} />
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

export default TripScreen;
