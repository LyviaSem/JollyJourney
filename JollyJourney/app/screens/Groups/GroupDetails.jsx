import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import { getUserInfo, deleteMembers } from "../../services/firebaseFunction";
import { useUser } from "../../../context/UserContext";
import { IMAGES } from "../../theme/theme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomModal from "../../component/DeleteMemberModal";
import ChangePic from "../../component/ChangePic";
import PicModal from "../../component/PicModal";
import { uploadImage } from "../../services/imageService";
import { removeImage } from "../../services/imageService";
import { groupDetailStyle } from "../../style/groupDetailStyle";
import Btn from "../../component/Btn";
import { textStyles } from "../../style/textStyles";

const GroupDetails = ({ route, navigation: { goBack, navigate } }) => {
  const { user, updateUserGroups } = useUser();
  const { group } = route.params;
  const [isAdmin, setIsAdmin] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [creatorName, setCreatorName] = useState("");
  const [memberNames, setMemberNames] = useState([]);
  const [modalMessage, setModalMessage] = useState("");
  const [modalAction, setModalAction] = useState(() => () => {});
  const [modalVisible, setModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState();

  useEffect(() => {
    if (user.uid === group.info.creator) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }

    getUserInfo(group.info.creator)
      .then((username) => setCreatorName(username))
      .catch((error) => console.error("Error fetching creator info:", error));

    Promise.all(group.members.map((member) => getUserInfo(member.userId)))
      .then((memberUsernames) => {
        const sortedMemberUsernames = memberUsernames.sort((a, b) => {
          if (a.id === user.uid) return -1;
          if (b.id === user.uid) return 1;
          return 0;
        });
        setMemberNames(sortedMemberUsernames);
      })
      .catch((error) => console.error("Error fetching member info:", error));

    setImageUri(group.info.imageURL);
  }, [group]);

  const handleOpenModal = (message, action) => {
    setModalMessage(message);
    setModalAction(() => action);
    setIsVisible(true);
  };

  const handleDeleteMember = (memberId) => {
    deleteMembers(
      group.info.id,
      memberId,
      updateUserGroups,
      navigate,
      user.uid
    );
    setIsVisible(false);
  };

  return (
    <View style={groupDetailStyle.container}>
      <TouchableOpacity
        onPress={() => goBack()}
        style={{ top: 55, position: "absolute", left: 30 }}
      >
        <Image source={IMAGES.planeBtn} style={{ width: 40, height: 34 }} />
      </TouchableOpacity>
      <View style={groupDetailStyle.groupProfilContainer}>
        <ChangePic
          image={imageUri}
          defaultImage={IMAGES.defaultProfile}
          setModalVisible={setModalVisible}
          picStyle={{ marginBottom: 0 }}
        />
        <PicModal
          collection="groups"
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          uploadImage={uploadImage}
          removeImage={removeImage}
          imageUri={setImageUri}
        />
        <Text style={[groupDetailStyle.groupName, textStyles.text]}>{group.info.name}</Text>
        <View style={groupDetailStyle.groupInfoContainer}>
          <Text style={[groupDetailStyle.memberCount, textStyles.text]}>
            Membres: {group.members.length}
          </Text>
          <Text style={[groupDetailStyle.createdBy, textStyles.text]}>
            Créé par {creatorName.pseudo}
          </Text>
        </View>
      </View>
      <View style={{ flex: 1, width: 380 }}>
        <FlatList
          data={memberNames}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#000",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 20,
                }}
              >
                <Image
                  source={
                    item.imageURL
                      ? { uri: item.imageURL }
                      : IMAGES.defaultProfile
                  }
                  style={groupDetailStyle.profilImage}
                />
                <Text style={textStyles.text}>{item.pseudo}</Text>
              </View>
              {isAdmin && item.id !== user.uid && (
                <TouchableOpacity
                  onPress={() =>
                    handleOpenModal(
                      `Êtes-vous sûr de vouloir supprimer ${item.pseudo} de ce groupe ?`,
                      () => handleDeleteMember(item.id)
                    )
                  }
                >
                  <Icon name="trash-can-outline" size={24} color="black" />
                </TouchableOpacity>
              )}
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <Btn
        name="Quitter le groupe"
        action={() =>
          handleOpenModal("Êtes-vous sûr de vouloir quitter ce groupe ?", () =>
            handleDeleteMember(user.uid)
          )
        }
        iconName="exit-to-app"
      />

      {/* <TouchableOpacity
        style={groupDetailStyle.button}
        onPress={() =>
          handleOpenModal("Êtes-vous sûr de vouloir quitter ce groupe ?", () =>
            handleDeleteMember(user.uid)
          )
        }
      >
        <Icon name="exit-to-app" size={24} color="#fff" />
        <Text style={groupDetailStyle.buttonText}>Quitter le groupe</Text>
      </TouchableOpacity> */}
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
