import { createContext, useContext, useState, useEffect } from 'react';
import { fetchUserGroupsFromFirebase } from '../app/services/firebaseFunction';
import { collection, onSnapshot } from 'firebase/firestore';
import { firestore } from '../FirebaseConfig';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(false);

  const updateUser = (userData) => {
    setUser(userData);
  };

  const updateUserGroups = async (userId) => {
    try {
      setLoadingGroups(true)
      const groups = await fetchUserGroupsFromFirebase(userId);
      setUserGroups(groups);
      setLoadingGroups(false)
    } catch (error) {
      console.error("Erreur lors de la récupération des groupes :", error);
    }
  };

  useEffect(() => {
    if (user && user.uid) {
      const unsubscribe = onSnapshot(collection(firestore, "groups"), async (snapshot) => {
        updateUserGroups(user.uid);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, updateUser, userGroups, updateUserGroups, selectedUsers, setSelectedUsers, loadingGroups }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
