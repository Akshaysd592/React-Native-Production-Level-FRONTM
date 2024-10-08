import { Link, Stack } from "expo-router";
import { Text } from "react-native";

export default function Layout(){
    return(
        <Stack>
            <Stack.Screen name="index" options={{title:'Nested counter',
            headerRight:()=>( 
                <Link href={'/counter/history'}>History</Link>
            )}}/>
        </Stack>
    )
}