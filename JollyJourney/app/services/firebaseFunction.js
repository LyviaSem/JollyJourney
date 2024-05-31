import { collection, query, getDocs, where, getDoc, doc, deleteDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { firestore } from '../../FirebaseConfig'; 

export const fetchUserGroupsFromFirebase = async (userId) => {

    const userGroups = [];
    
    try {
        const groupsQuery = query(collection(firestore, "groups"));
        const groupDocs = await getDocs(groupsQuery);

        for (const groupDoc of groupDocs.docs) {
           
            const membersCollection = collection(groupDoc.ref, "members");
            const membersQuery = query(membersCollection, where("userId", "==", userId));
            const membersDocs = await getDocs(membersQuery);
            const members = await getDocs(membersCollection)

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
        console.log('userData',userData)
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

export const addExpense = async (tripId, label, amount, userId, participant, setIsVisible, setExpenses, setTitle, setAmount, userPseudo) => {
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
        setTitle('');
        setAmount('');
        setIsVisible(false)

    } catch(error){
        console.log("error add expens: ", error)
    }
}

