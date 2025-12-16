import { Stack } from "expo-router";

export default function TeamLayout() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Indietro" }}>
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
      <Stack.Screen 
        name="athlete/[athleteId]" 
        options={{ 
          title: "Dettaglio Atleta",
          presentation: "card",
        }} 
      />
    </Stack>
  );
}
