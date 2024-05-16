import React from 'react';
import { View, Text, Image, TouchableOpacity, Modal, Button, FlatList } from 'react-native';
import { collection, addDoc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { firestore } from '../../../FirebaseConfig';
import { images } from "../../theme/theme";

const GroupDetails = ({ route }) => {

    const {group} = route.params;
    console.log(group)

    return (
        <View style={styles.container}>
            <Image
             source={group.imageURL ? { uri: group.imageURL } : images.defaultProfile} 
             style={styles.groupImage} 
            />
            <Text style={styles.groupName}>{group.name}</Text>
            {/* <Text style={styles.memberCount}>Members: {groupData.members.length}</Text> */}
            <Text style={styles.createdBy}>Created by {group.creator}</Text>
            
            {/* <FlatList
                data={groupData.members}
                renderItem={({ item }) => (
                    <Text>{item.name}</Text>
                )}
                keyExtractor={(item, index) => index.toString()}
            /> */}
            
            {/* {isAdmin && (
                <View style={styles.adminButtons}>
                    <TouchableOpacity onPress={onAddMember}>
                        <Text>Add Member</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onRemoveMember}>
                        <Text>Remove Member</Text>
                    </TouchableOpacity>
                </View>
            )} */}

            <TouchableOpacity /*onPress={onLeaveGroup}*/>
                <Text>Leave Group</Text>
            </TouchableOpacity>

            <Modal visible={false}>
                <View style={styles.modal}>
                    <Text>Are you sure you want to leave the group?</Text>
                    <Button title="Yes" /*onPress={onLeaveGroup}*/ />
                    <Button title="No" /*onPress={() => setModalVisible(false)}*/ />
                </View>
            </Modal>
        </View>
    );
};

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
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
};

export default GroupDetails;
