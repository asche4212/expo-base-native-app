import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useAuth } from "../../auth/AuthProvider";

export default function Home() {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={logout}>
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
