import { View, Text, FlatList} from "react-native";
import React, {useState, useEffect} from "react";
import TodoList from "../../component/TodoList";
import Moment from 'moment';
import { collection, orderBy, setDoc, getDocs, updateDoc, query, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../../FirebaseConfig";
import { itineraryStyle } from "../../style/itineraryStyle";
import 'moment/locale/fr';


const Itinerary = ({route}) => {

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
      <View style={{marginTop: 10, justifyContent:'center', alignItems: 'center'}}>
      <TodoList 
        element={item} 
        onElementChange={handleElementChange} 
        removeElement={removeElement}
      />
    </View>
    )
  };

  return (
    <View style={itineraryStyle.container}>
      <Text style={itineraryStyle.title}>Liste des activités :</Text>
      <View style={itineraryStyle.flatListContainer}>
        <FlatList
          data={elements}
          keyExtractor={(item) => item.id}
          renderItem={renderJours}
        />
      </View>
    </View>
  );
};

export default Itinerary;