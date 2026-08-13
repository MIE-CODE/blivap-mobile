import { store } from "@/../stores";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: "white" }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "white" },
          }}
        />
        <Toast />
      </GestureHandlerRootView>
    </Provider>
  );
}
