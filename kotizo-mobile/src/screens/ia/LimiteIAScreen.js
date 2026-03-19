import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PlaceholderScreen({ route }) {
  const nom = route?.name || "Ecran";
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{nom}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  text: { fontSize: 18, color: "#2563EB", fontWeight: "bold" },
});
