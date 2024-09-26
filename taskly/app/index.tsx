import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Link, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import AntDesign from "@expo/vector-icons/AntDesign";

import { useColorScheme } from "@/hooks/useColorScheme";
import {
  PixelRatio,
  StyleSheet,
  Text,
  View,
  Button,
  Pressable,
  TouchableOpacity,
  Alert,
  TextInput,
  ScrollView,
  FlatList,
  LayoutAnimation,
} from "react-native";
import { theme } from "./theme";
import { ItemComponent } from "@/components/ItemComponent";
import { getFromStorage, setToStorage } from "@/utils/storage";
import * as Haptic from 'expo-haptics'
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

type shoppingItemType = {
  id: string;
  name: string;
  completedAtTimestamp?: number;
  lastStampItemUpdate: number;
};


let storageKey = 'shopping-item-key'

export default function App() {
 

  // let ShoppingItem: shoppingItemType[] = [
  //   {
  //     id: "1",
  //     name: "coffee",
  //     lastStampItemUpdate:1,
  //   },
  //   {
  //     id: "2",
  //     name: "Tea",
  //     lastStampItemUpdate:2,

  //   },
  //   {
  //     id: "3",
  //     name: "Special Tea",
  //     lastStampItemUpdate:3,

  //   },
  // ];

   

  const [value, setValue] = useState("");
  const [shoppingItems, setshoppingItems] =
    useState<shoppingItemType[]>([]);

  function submitHandler() {
    if (value) {
      let newShoppingList = [
        {
          id: new Date().toISOString(),
          name: value,
          lastStampItemUpdate: Date.now()
          
        },
        ...shoppingItems,
      ];
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
      setshoppingItems(newShoppingList);
     
      setToStorage(storageKey,shoppingItems);
      setValue("");
    }
  }

  useEffect(()=>{ // useEffect works syncronously
      
      const shoppingData = async()=>{
        let data  = await getFromStorage(storageKey);
        if(data){
          LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
            setshoppingItems(data);
        }

      }

    shoppingData();

  },[])

  function handleDelete(id: string) {
    let updatedShoppingItem = shoppingItems.filter((item) => item.id != id);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Medium)
    setshoppingItems(updatedShoppingItem);
    setToStorage(storageKey,shoppingItems);
  }

  function handleToggle(id: string) {
    let updatedTimeStampedShoppingItems = shoppingItems.map((item) => {
      if (item.id == id) {
        if(item.completedAtTimestamp){
          Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Medium);
        }else{
          Haptic.notificationAsync(Haptic.NotificationFeedbackType.Success);
        }
        return {
          ...item,
          lastStampItemUpdate: Date.now(),
          completedAtTimestamp: item.completedAtTimestamp
            ? undefined
            : Date.now(),
        };
      } else {
        return item;
      }
    });
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
    setshoppingItems(updatedTimeStampedShoppingItems);
    setToStorage(storageKey,shoppingItems);
  }

  return (
    // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    //   <Stack>
    //     <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    //     <Stack.Screen name="+not-found" />
    //   </Stack>
    // </ThemeProvider>

    //       <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}  stickyHeaderIndices={[0]}>
    //   {/* <View style={{backgroundColor:'pink', ...StyleSheet.absoluteFillObject}}></View>   */}
    //   {/* <Link style={{textAlign:'center', backgroundColor:'grey',justifyContent:'center',marginBottom:20,padding:10}} href={'/counter'}> Go to Counter Page</Link> */}
    //   {/* <Link style={{textAlign:'center', backgroundColor:'grey',justifyContent:'center',marginBottom:20,padding:10}} href={'/idea'}> Go to Idea Page</Link> */}
    //   <TextInput
    //     style={styles.inputBox}
    //     placeholder="e.g. Coffee"
    //     numberOfLines={2}
    //     value={value}
    //     onChangeText={setValue}
    //     // keyboardType="number-pad"
    //     returnKeyType="done"
    //     onSubmitEditing={submitHandler}
    //   />

    //     {/* {shoppingItems.map((value) => (
    //       <ItemComponent name={value.name} key={value.id} />
    //     ))} */}

    //  </ScrollView>
    <FlatList
      data={orderShoppingList(shoppingItems)}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      //   stickyHeaderIndices={[0]}
      ListEmptyComponent={
        <View style={styles.listEmpty}>
          <Text>Your Item List is empty </Text>
        </View>
      }
      ListHeaderComponent={
        <TextInput
          style={styles.inputBox}
          placeholder="e.g. Coffee"
          numberOfLines={2}
          value={value}
          onChangeText={setValue}
          //     // keyboardType="number-pad"
          //   //   keyboardAppearance="light"
          returnKeyType="done"
          onSubmitEditing={submitHandler}
        />
      }
      renderItem={({ item }) => {
        return (
          <ItemComponent
            name={item.name}
            onDelete={() => handleDelete(item.id)}
            onToggle={() => handleToggle(item.id)}
            isCompleted={Boolean(item.completedAtTimestamp)}
          />
        );
      }}
    />
  );
}

function orderShoppingList(shoppingList: shoppingItemType[]) {
  return shoppingList.sort((item1, item2) => {
    if (item1.completedAtTimestamp && item2.completedAtTimestamp) {
      return item2.completedAtTimestamp - item1.completedAtTimestamp;
    }

    if (item1.completedAtTimestamp && !item2.completedAtTimestamp) {
      return 1;
    }

    if (!item1.completedAtTimestamp && item2.completedAtTimestamp) {
      return -1;
    }

    if (!item1.completedAtTimestamp && !item2.completedAtTimestamp) { // id both completedAtTimestamp not available
      return item2.lastStampItemUpdate - item1.lastStampItemUpdate;
    }

    return 0;
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    //   justifyContent: "center",
    //  justifyContent:'center',
    //    alignItems:'center'
  },
  contentContainer: {
    paddingBottom: 24,
  },
  listEmpty: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 18,
  },
  inputBox: {
    borderRadius: 4,
    borderColor: theme.colorGrey,
    borderWidth: 3,
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginBottom: 12,
    paddingHorizontal: 10,
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
  },
  deleteBtn: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    alignItems: "center",
    backgroundColor: theme.colorBlack,
    borderRadius: 5,
    textTransform: "uppercase",
  },
  btnText: {
    fontWeight: "300",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
});
