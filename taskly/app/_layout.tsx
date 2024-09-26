import { MaterialIcons } from "@expo/vector-icons";
import { StackRouter } from "@react-navigation/native";
import { Stack, Tabs } from "expo-router";
import { View } from "react-native";
import { theme } from "./theme";

export default function Layout() {
  return (
    // <Stack>
    //   <Stack.Screen name="index" options={{title:'Shopping List',animation:'fade'}}/>
    //   <Stack.Screen name="counter" options={{title:'Counter List',animation:'fade_from_bottom'}}/>
    //   <Stack.Screen name="idea" options={{title:'Idea List',animation:'fade'}}/>
    // </Stack>
    <Tabs screenOptions={{ tabBarActiveTintColor: theme.colorRed }}>
      <Tabs.Screen name="index" options={{ title: "Shopping List" }} />
      <Tabs.Screen
        name="counter"
        options={{ title: "Counter List", headerShown: false }}
      />
      <Tabs.Screen
        name="idea"
        options={{
          title: "Idea List",

          tabBarIcon: (
            { color, size } //tabBarIcon provides color and size properties
          ) => (
            <MaterialIcons name="insert-emoticon" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
