import { useRouter } from "expo-router";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";

export default function IdeaScreen() {
    const router = useRouter();
  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={()=>router.push('/counter')}>
                     <Text style={{textAlign:'center', backgroundColor:'grey',justifyContent:'center',marginBottom:20,padding:10}}> Go to Counter</Text>
        </TouchableOpacity>
      <Text style={styles.text}>Idea</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 24,
  },
});
