import { Slot } from "expo-router";
import { AuthProvider } from "../auth/AuthProvider";
import { PaperProvider } from "react-native-paper";
import { theme } from "../theme";

export default function Layout() {
  return (
    <AuthProvider>
      <PaperProvider theme={theme}>
        <Slot />
      </PaperProvider>
    </AuthProvider>
  );
}
