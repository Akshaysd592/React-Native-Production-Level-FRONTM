import AsyncStorage from "@react-native-async-storage/async-storage";


export async function getFromStorage(key:string){
    try {
        
      let dataObtained =   await AsyncStorage.getItem(key);

      return dataObtained? JSON.parse(dataObtained): null;

    } catch (error) {
        return null;
        
    }
}

export async function setToStorage(key:string,value:object){
    try {

        await AsyncStorage.setItem(key,JSON.stringify(value));
        
    } catch (error) {
        
    }
}