import { collection, query, getDocs, where, getDoc, doc, deleteDoc, serverTimestamp, setDoc, updateDoc, orderBy } from 'firebase/firestore';
import { firestore } from '../../FirebaseConfig'; 

export const fetchUserGroupsFromFirebase = async (userId) => {
    const userGroups = [];

    try {
        // Trier les groupes par date de création (createdAt) en ordre décroissant
        const groupsQuery = query(collection(firestore, "groups"), orderBy("createdAt", "desc"));
        const groupDocs = await getDocs(groupsQuery);

        for (const groupDoc of groupDocs.docs) {
            const membersCollection = collection(groupDoc.ref, "members");
            const membersQuery = query(membersCollection, where("userId", "==", userId));
            const membersDocs = await getDocs(membersQuery);
            const members = await getDocs(membersCollection);

            if (!membersDocs.empty) {
                const groupData = groupDoc.data();
                const group = { info: groupData, members: [] };

                members.forEach(doc => {
                    group.members.push(doc.data());
                });
                userGroups.push(group);
            }
        }

        return userGroups;
    } catch (error) {
        throw error;
    }
};

export const getUserInfo = async (userId) => {
    const userDoc = await getDoc(doc(firestore, "users", userId));
    if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
            pseudo: userData.pseudo,
            imageURL: userData.imageURL || null,
            id: userId 
        };
    } else {
        return {
            pseudo: "Unknown",
            imageURL: null
        };
    }
};

export const deleteMembers = async (groupId, userId, updateUserGroups, navigate, uid) => {
    try {
        const membersRef = collection(firestore, 'groups', groupId, 'members');
        const q = query(membersRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          alert('Erreur', 'Aucun membre trouvé avec cet ID.');
          return;
        }
  
        querySnapshot.forEach(async (docSnapshot) => {
            await deleteDoc(docSnapshot.ref);
        });
        
         updateUserGroups(uid)
         navigate('Contacts')
    } catch (error) {
        console.error('Erreur de suppression du membre: ', error);
        alert('Erreur', 'La suppression du membre a échoué.');
    }
}

export const addExpense = async (tripId, label, amount, userId, participant, setIsVisible, setExpenses, setTitle, setAmount, userPseudo, resetForm) => {
    try{
        const expensesCollection = collection(firestore, 'trips', tripId, 'expenses');
        const newExpenseDocRef = doc(expensesCollection);
        const docId = newExpenseDocRef.id;

        const newExpense = {
            id: docId,
            tripId: tripId,
            paidById: userId,
            paidByPseudo: userPseudo,
            label: label,
            amount: amount,
            participants: participant,
            date: serverTimestamp()
        }

        await setDoc(newExpenseDocRef, newExpense);
        setExpenses((prev) => [...prev, newExpense]);
        setIsVisible(false);
        resetForm()

    } catch(error){
        console.error("error add expens: ", error)
    }
}

export const deleteExpense = async (tripId, expenseId, setExpenses, expenses) => {
    try{
        const expenseRef = collection(firestore, 'trips', tripId, 'expenses')
        const q = query(expenseRef, where('id', '==', expenseId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            alert('Erreur', 'Aucun membre trouvé avec cet ID.');
            return;
        }
    
        querySnapshot.forEach(async (docSnapshot) => {
            await deleteDoc(docSnapshot.ref);
        });

        const updatedExpenses = expenses.filter(expense => expense.id !== expenseId);
        setExpenses(updatedExpenses);

    } catch(error){
        console.error("error on delete expense", error)
    }
}

export const updateExpense = async (expenseId, updateElement, setIsVisible, tripId, setExpenses) => {
    try{
        const expensesDocRef = doc(firestore, 'trips', tripId, 'expenses', expenseId);
        await updateDoc(expensesDocRef, updateElement)
        setExpenses(prevExpenses =>
            prevExpenses.map(expense =>
              expense.id === expenseId ? { ...expense, ...updateElement } : expense
            )
        );
        setIsVisible(false)
    } catch(error){
        console.error('Error update data:', error)
    }
}

