import { collection, query, getDocs, where, getDoc, doc, deleteDoc } from 'firebase/firestore';
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
                // L'utilisateur est membre de ce groupe
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
        alert('Succès', 'Le membre a été supprimé avec succès.');
    } catch (error) {
        console.error('Erreur de suppression du membre: ', error);
        alert('Erreur', 'La suppression du membre a échoué.');
    }
}

