import { View, Text, StyleSheet, FlatList} from "react-native";
import React, {useState, useEffect} from "react";
import TodoList from "../../component/TodoList";
import Moment from 'moment';
import { collection, orderBy, setDoc, getDocs, addDoc, updateDoc, query, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../../FirebaseConfig";
import 'moment/locale/fr';


const ItineraireContent = ({route}) => {

  const {trip} = route.params;

  const [elements, setElements] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try{
        const itineraryDocRef = collection(firestore, 'trips', trip.id, 'itinerary');
        const q = query(itineraryDocRef, orderBy('date', 'asc'));
        const itinerarySnapshot = await getDocs(q);

        if(itinerarySnapshot.empty){
          await generateElements();
        } else {
          const itineraryData = [];
          itinerarySnapshot.forEach((doc) => {
            itineraryData.push(doc.data());
          })
          setElements(itineraryData);
        }

      }catch(error){
        console.error("error fetch itinerary data: ", error);
      }
    }
    fetchData();
  }, []);


  const handleElementChange = async (updatedElement) => {
    const updatedElements = elements.map(element =>
        element.id === updatedElement.id ? updatedElement : element
    );
    setElements(updatedElements);
    try{
      const itineraryDocRef = doc(firestore, 'trips', trip.id, 'itinerary', updatedElement.id);
      await updateDoc(itineraryDocRef, updatedElement);
    } catch (error){
      console.error('Error update data:', error);
    }
  }
   
  const generateElements = () => {
    const debut = trip.dateDebut;
    const fin = trip.dateFin;
    let currentDate = new Date(debut);
    const addElements = [];
    const itineraryDocRef = collection(firestore, 'trips', trip.id, 'itinerary')
    
    while (currentDate <= new Date(fin)) {
      const newDocRef = doc(itineraryDocRef);
      const docId = newDocRef.id;
      const newElement = {
        id: docId,
        date: currentDate,
        label: Moment(currentDate).format('ddd DD/MM'),
        tasks: [{ id: 1, text: '', completed: false }]
      }
      setDoc(newDocRef, newElement)
      addElements.push(newElement)
      currentDate.setDate(currentDate.getDate() + 1);
    }
  
    setElements(addElements);

  };
  
  const removeElement = async (itemId) => {
    const updatedElements = overviewElements.filter(element => element.id !== itemId);
    setOverviewElements(updatedElements);

    try{
      const overviewCollection = collection(firestore, 'trips', trip.id, 'overview');
      const q = query(overviewCollection, where('id', '==', itemId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert('Erreur', 'Aucun membre trouvé avec cet ID.');
        return;
      }else{
        querySnapshot.forEach(async (docSnapshot) => {
          await deleteDoc(docSnapshot.ref)
        })
      }
    }catch(error){
      console.error('error remove data: ', error)
    }
  };

  const renderJours = ({item}) => {
    return(
      <View style={{marginTop: 10}}>
      <TodoList 
        element={item} 
        onElementChange={handleElementChange} 
        removeElement={removeElement}
      />
    </View>
    )
  };

  return (
    <View
      style={{ 
        paddingTop: 10,
        backgroundColor: "#FEF5EE",
        flex: 1 
      }}
    >
      <Text>Itinéraire du voyage :</Text>
      <FlatList
        data={elements}
        keyExtractor={(item) => item.id}
        renderItem={renderJours}
      />
    </View>
  );
};

export default ItineraireContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskText: {
    flex: 1,
    fontSize: 18,
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
  },
});