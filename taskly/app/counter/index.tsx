import { Text, View, StyleSheet, TouchableOpacity, Alert, Dimensions } from "react-native";
import { theme } from "../theme";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationAsync";
import * as device from "expo-device";
import * as Notification from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { intervalToDuration, isBefore } from "date-fns";
import { TimeSegment } from "@/components/TimeSegment";
import { getFromStorage,setToStorage } from "@/utils/storage";
import * as Haptic from 'expo-haptics'
import ConffettiCannon from 'react-native-confetti-cannon'
// const timestamp = Date.now() + 10 * 1000;
const frequency = 14*24*60*60* 1000; // 14 days in milliseconds
export const countdownStorageKey = "taskly-countdown";

export type PersistedCountdownState = {
  currentNotificationId : string | undefined;
  completedAtTimestamps: number[];
}

type CountDownStatus = {
  isOverdue: boolean;
  distance: ReturnType<typeof intervalToDuration>;
};

export default function CounterScreen() {
  
       const conffettiRef = useRef<any>();





  const handleNotification = async () => {
      Haptic.notificationAsync(Haptic.NotificationFeedbackType.Success)
      conffettiRef?.current?.start()
    let pushNotificationId;
    const status = await registerForPushNotificationsAsync();
     
    console.log("clicked", status);
    if (status === "granted") {
       pushNotificationId = await Notification.scheduleNotificationAsync({
        
        content: {
          title: " Car wash overdue..",
        },
        trigger: {
          seconds: frequency/1000,
        },
      });
      // console.log("inside if")
    } else {
      Alert.alert(
        "Please provide permission for sending push Notification ",
        "you can allow it by going into phone setting and allow expo go notification "
      );
    }



    if(countdownState?.currentNotificationId){
       await Notification.cancelScheduledNotificationAsync(
        countdownState.currentNotificationId
       )
    }


    const newCountdownState : PersistedCountdownState  = {
      currentNotificationId: pushNotificationId,
      completedAtTimestamps: countdownState?
       [Date.now(),...countdownState.completedAtTimestamps]:
       [Date.now()]
    }

    setCountdownState(newCountdownState);
    await setToStorage(countdownStorageKey,newCountdownState)
  };
  const [countdownState, setCountdownState] = useState<PersistedCountdownState>();
  const [status, setStatus] = useState<CountDownStatus>({
    isOverdue: false,
    distance: {},
  });

  useEffect(()=>{
    const init = async ()=>{

      const value = await getFromStorage(countdownStorageKey);
      setCountdownState(value);
    }
    init();
  },[]);

  const lastCompletedAt = countdownState?.completedAtTimestamps[0]


  const [secondsElapsed, setSecondsElapsed] = useState(0);
  useEffect(() => {
    let setId = setInterval(() => {

      const timestamp = lastCompletedAt ? lastCompletedAt +frequency: Date.now()
      //  setSecondsElapsed(val=> val +1)
      const isOverdue = isBefore(timestamp, Date.now());
      const distance = intervalToDuration(
        isOverdue
          ? { end: Date.now(), start: timestamp }
          : { start: Date.now(), end: timestamp }
      );
      setStatus({ isOverdue, distance });
    }, 1000);
    return () => {
      clearInterval(setId);
    };
  }, [lastCompletedAt]);

  return (
    <View style={styles.container}>
      {/* <Text style={{}}>{secondsElapsed}</Text> */}
      <View
        style={[
          styles.container,
          status.isOverdue ? styles.containerLate : undefined,
        ]}
      >
        {!status.isOverdue ? (
          <Text style={[styles.heading]}>Next car wash overdue in </Text>
        ) : (
          <Text style={[styles.heading, styles.whiteText]}>
            Car wash overdue by
          </Text>
        )}
        <View style={styles.row}>
          <TimeSegment
            unit="Days"
            number={status.distance?.days ?? 0}
            textStyle={status.isOverdue ? styles.whiteText : undefined}
          />
          <TimeSegment
            unit="Hours"
            number={status.distance?.hours ?? 0}
            textStyle={status.isOverdue ? styles.whiteText : undefined}
          />
          <TimeSegment
            unit="Minutes"
            number={status.distance?.minutes ?? 0}
            textStyle={status.isOverdue ? styles.whiteText : undefined}
          />
          <TimeSegment
            unit="Seconds"
            number={status.distance?.seconds ?? 0}
            textStyle={status.isOverdue ? styles.whiteText : undefined}
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleNotification}
        >
          {/* <Text style={styles.notifyText}>Schedule Notification</Text> */}
          <Text style={styles.notifyText}>I've washed the Car!</Text>
        </TouchableOpacity>
        <ConffettiCannon
        ref={conffettiRef}
        count={50}
        origin={{x:Dimensions.get("window").width/2,y:-30}}
        autoStart={false}
        fadeOut={true}
        />
      </View>
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
  button: {
    padding: 15,
    backgroundColor: theme.colorGrey,
    borderRadius: 5,
  },
  notifyText: {
    fontSize: 24,
    color: theme.colorWhite,
  },
  row: {
    flexDirection: "row",
    marginBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    color: theme.colorBlack,
  },
  containerLate: {
    backgroundColor: theme.colorRed,
  },
  whiteText: {
    color: theme.colorWhite,
  },
});
