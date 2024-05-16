import { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserGroupsFromFirebase } from '../app/services/firebaseFunction'; // Assurez-vous d'importer votre fonction de récupération des groupes depuis Firebase
import { collection, onSnapshot } from 'firebase/firestore';
import { firestore } from '../FirebaseConfig';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userGroups, setUserGroups] = useState([]);

  const updateUser = (userData) => {
    setUser(userData);
  };

  useEffect(() => {
    if (user && user.uid) {
      const unsubscribe = onSnapshot(collection(firestore, "groups"), async (snapshot) => {
        try {
          const groups = await fetchUserGroupsFromFirebase(user.uid);
          setUserGroups(groups);
        } catch (error) {
          console.error("Erreur lors de la récupération des groupes :", error);
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, updateUser, userGroups }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
