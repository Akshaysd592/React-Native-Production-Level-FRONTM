import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { PixelRatio, StyleSheet, Text, View,Button, Pressable, TouchableOpacity, Alert } from 'react-native';
import { theme } from './theme';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  const handleDelete=()=>{
    Alert.alert("Are you sure you want to delete this?","It will be gone for good",[
      {
        text:"yes",
        onPress:()=>{
          console.log("Ok , Deleting")
        },
        style:'destructive'
      },
      {
        text:'cancel',
        style:'cancel'

      }
    ])
  }

  return (
    // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    //   <Stack>
    //     <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    //     <Stack.Screen name="+not-found" />
    //   </Stack>
    // </ThemeProvider>
    <View style={styles.container}>
    <View style={[styles.itemContainer]}>
        <Text style={{}} onPress={()=>{
        alert("hello")
        }}>
        Coffee...
         </Text>

         <TouchableOpacity style={[styles.deleteBtn]} onPress={handleDelete} activeOpacity={0.5}>
        <Text style={styles.btnText}>Delete</Text>
       </TouchableOpacity>
        

    </View>
     <Button color={"green"} title='Delete'></Button>

    <Pressable  onPress={()=>{
      alert("pressed ")
      console.log("hello all ")
    }}>
        <Text style={styles.btnText}>Text</Text>
       </Pressable>

      
    
   
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
       flex : 1, 
       justifyContent:'center',

  },
  itemContainer:{
    backgroundColor:'rgb(215,215,255)',
    padding:8,
    borderRadius:4,
    borderBottomColor:'red',
    borderBottomWidth:2,
    fontSize:20,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  deleteBtn:{
    paddingHorizontal:20,
    paddingVertical:4,
    alignItems:"center",
    backgroundColor: theme.colorBlack,
    borderRadius:5,
    textTransform:"uppercase"

  },
  btnText:{
    fontWeight:'300',
    textTransform:"uppercase",
    letterSpacing:1,
  }

  

})
