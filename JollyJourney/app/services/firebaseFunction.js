import { collection, query, getDocs, where } from 'firebase/firestore';
import { firestore } from '../../FirebaseConfig'; // Assurez-vous d'importer correctement votre configuration Firebase

export const fetchUserGroupsFromFirebase = async (userId) => {
    console.log(userId)
    const userGroups = [];
    
    try {
        const groupsQuery = query(collection(firestore, "groups"));
        const groupDocs = await getDocs(groupsQuery);

        for (const groupDoc of groupDocs.docs) {
            const groupId = groupDoc.id;
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
                userGroups.push({id: groupId, ...group});
            }
            console.log(userGroups)
        }

        return userGroups;
    } catch (error) {
        throw error;
    }
};
