import { Link, Stack } from "expo-router";
import { StyleSheet, View, Text } from "react-native";
import { AlertCircle } from "lucide-react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Pagina non trovata" }} />
      <View style={styles.container}>
        <AlertCircle size={64} color="#ef4444" />
        <Text style={styles.title}>Pagina non trovata</Text>
        <Link href="/" style={styles.link}>
          Torna alla home
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f3f4f6",
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 24,
    backgroundColor: "#2563eb",
    borderRadius: 8,
    color: "#fff",
    fontSize: 16,
    fontWeight: "600" as const,
  },
});
