import { theme } from "@/app/theme";
import {
  AntDesign,
  Entypo,
  Fontisto,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  name?: string | boolean;
  isCompleted?: boolean;
  onDelete : ()=> void;
  onToggle : ()=>void;

};

export function ItemComponent({ name, isCompleted, onDelete,onToggle}: Props) {
  const handleDelete = () => {
    Alert.alert(
      `Are you sure you want to delete ${name}?`,
      "It will be gone for good",
      [
        {
          text: "yes",
          onPress: () =>onDelete(),
          style: "destructive",
        },
        {
          text: "cancel",
          style: "cancel",
        },
      ]
    );
  };
  return (
    <Pressable
      style={[
        styles.itemContainer,
        isCompleted ? styles.completedbg : undefined,
      ]}
      onPress={onToggle}
    >
      <View style={styles.row}>
      <Entypo name={isCompleted? "check":"circle"} size={24} color="black" />
      <Text
        numberOfLines={2}
        style={[isCompleted ? styles.textCompleted : undefined,styles.gaps]}
        onPress={() => {
          Alert.alert(`${name} 😊`);
        }}
      >
        {name}
      </Text>

      </View>

      <TouchableOpacity
      style={{paddingLeft:4}}
        onPress={handleDelete}
        activeOpacity={0.5}
      >
       <Ionicons name="close-circle" size={30} color={isCompleted?theme.colorRed:theme.colorGrey} />
      </TouchableOpacity>


    </Pressable>
  );
}

const styles = StyleSheet.create({
  completedbg: {
    backgroundColor: theme.colorLightGrey,
    borderBottomColor: theme.colorGrey,
  },
  itemContainer: {
    backgroundColor: "rgb(215,215,255)",
    padding: 8,
    borderRadius: 4,
    borderBottomColor: "red",
    borderBottomWidth: 2,
    fontSize: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    margin:30,
    
  },
  textCompleted: {
    textDecorationLine: "line-through",
    textDecorationColor: theme.colorGrey,
  },
  deleteBtn: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    alignItems: "center",
    backgroundColor: theme.colorBlack,
    borderRadius: 5,
    textTransform: "uppercase",
  },
  btncompleted: {
    backgroundColor: theme.colorGrey,
  },
  btnText: {
    fontWeight: "300",
    textTransform: "uppercase",
    letterSpacing: 1,
    
  },
  row:{
    flexDirection:'row',
    gap:4,
    flex:1
  },
  gaps:{
  
    marginRight:15,
    marginLeft:5,

  }
});
