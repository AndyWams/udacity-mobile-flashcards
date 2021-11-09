import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
// import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
const NOTIFICATION_KEY = "MobileFlashcard:notifications";
const CHANNEL_ID = "DailyReminder";

export function clearLocalNotification() {
  return AsyncStorage.removeItem(NOTIFICATION_KEY).then(
    Notifications.cancelAllScheduledNotificationsAsync
  );
}

function createNotification() {
  return {
    title: "Mobile Flashcards Reminder",
    body: "👋 Don't forget to study for today!",
    ios: {
      sound: true,
    },
    android: {
      channelId: CHANNEL_ID,
      sticky: false,
      color: "red",
    },
  };
}

function createChannel() {
  return {
    name: "Daily Reminder",
    description: "This is a daily reminder for you to study your flashcards.",
    sound: true,
    priority: "high",
  };
}

export function setLocalNotification() {
  AsyncStorage.getItem(NOTIFICATION_KEY)
    .then(JSON.parse)
    .then((data) => {
      // if (true) {
      if (data === null) {
        Location.requestForegroundPermissionsAsync().then(({ status }) => {
          if (status === "granted") {
            Notifications.createChannelAndroidAsync(CHANNEL_ID, createChannel())
              .then((val) => console.log("channel return:", val))
              .then(() => {
                Notifications.cancelAllScheduledNotificationsAsync();

                const tomorrow = new Date();
                // 2 minute from now
                // tomorrow.setTime(tomorrow.getTime() + 2 * 60000);

                tomorrow.setDate(tomorrow.getDate() + 1);
                tomorrow.setHours(20);
                tomorrow.setMinutes(0);

                Notifications.scheduleLocalNotificationAsync(
                  createNotification(),
                  {
                    time: tomorrow,
                    repeat: "day",
                  }
                );

                AsyncStorage.setItem(NOTIFICATION_KEY, JSON.stringify(true));
              })
              .catch((err) => {
                console.log("err", err);
              });
          }
        });
      }
    });
}
