import React, {useEffect, useState} from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Button, FlatList, Platform, StatusBar } from 'react-native';
import { getUserInfo, deleteMembers } from '../../services/firebaseFunction';
import { useUser } from '../../../context/UserContext';
import { images } from "../../theme/theme";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomModal from '../../component/Card/DeleteMemberModal';


const GroupDetails = ({ route, navigation: { goBack, navigate } }) => {

    const {user, updateUserGroups} = useUser();
    const {group} = route.params;
    const [isAdmin, setIsAdmin] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [creatorName, setCreatorName] = useState("");
    const [memberNames, setMemberNames] = useState([]);
    const [modalMessage, setModalMessage] = useState("");
    const [modalAction, setModalAction] = useState(() => () => {});
 console.log(memberNames)


    useEffect(() => {

        if (user.uid === group.info.creator) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
        
        // Récupération du nom du créateur
        getUserInfo(group.info.creator)
            .then(username => setCreatorName(username))
            .catch(error => console.error("Error fetching creator info:", error));

        // Récupération des noms des membres
        Promise.all(group.members.map(member => getUserInfo(member.userId)))
        .then(memberUsernames => {
            setMemberNames(memberUsernames);
        })
        .catch(error => console.error("Error fetching member info:", error));
       

    }, [group]);

    const handleOpenModal = (message, action) => {
        setModalMessage(message);
        setModalAction(() => action);
        setIsVisible(true);
    };

    const handleDeleteMember = (memberId) => {
        deleteMembers(group.info.id, memberId, updateUserGroups, navigate, user.uid);
        setIsVisible(false);
    };
    

    return (
        <View 
            style={{
                paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
                backgroundColor: "#FEF5EE",
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >

<TouchableOpacity 
    onPress={() => goBack()}
    style={{ top: 20, left: 20 }}
  >
    <Image
      source={images.planeBtn}
      style={{ width: 40, height: 34 }}
    />
  </TouchableOpacity>
            <Image
             source={group.info.imageURL ? { uri: group.info.imageURL } : images.defaultProfile} 
             style={styles.groupImage} 
            />
            <Text style={styles.groupName}>{group.info.name}</Text>
            <Text style={styles.memberCount}>Members: {group.members.length}</Text>
            <Text style={styles.createdBy}>Created by {creatorName.pseudo} </Text>

            <FlatList
                data={memberNames}
                renderItem={({ item }) => (
                    <View>
                        <Image
                            source={item.imageURL ? { uri: item.imageURL } : images.defaultProfile}
                            style={styles.profilImage}
                        />
                        <Text>{item.pseudo}</Text>
                        {isAdmin && item.id !== user.uid && (
                            <TouchableOpacity
                            onPress={() => handleOpenModal(
                                `Etes vous sur de voulour supprimer ${item.pseudo} de ce groupe ?`,
                                () => handleDeleteMember(item.id)
                            )}
                        >
                            <Icon name="trash-can-outline" size={24} color="black" />
                        </TouchableOpacity>
                        )}
                        
                    </View>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
            

            <TouchableOpacity onPress={() => handleOpenModal(
                "Etes vous sûr de vouloir quiter ce groupe ?",
                () => handleDeleteMember(user.uid)
            )}>
                <Icon name="exit-to-app" size={24} color="red" />
                <Text>Quitter le groupe</Text>
            </TouchableOpacity>

            <CustomModal
                visible={isVisible}
                onClose={() => setIsVisible(false)}
                message={modalMessage}
                onConfirm={modalAction}
            />

        </View>
    );
};

export default GroupDetails;

const styles = {
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    groupImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    groupName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    memberCount: {
        fontSize: 16,
        marginBottom: 5,
    },
    createdBy: {
        fontSize: 14,
        marginBottom: 10,
    },
    adminButtons: {
        flexDirection: 'row',
        marginVertical: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    profilImage:{
        borderRadius: 75,
        width: 50,
        height:50,
    },
    adminButtons: {
        flexDirection: 'row',
        marginVertical: 10,
    },
};

