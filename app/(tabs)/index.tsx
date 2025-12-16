import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Modal } from "react-native";
import { useState } from "react";
import { Plus, AlertCircle, Users } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTeams } from "@/contexts/TeamsContext";

export default function TeamsScreen() {
  const { teams, addTeam, getTeamBadges, isLoading } = useTeams();
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTeamName, setNewTeamName] = useState<string>("");

  const handleAddTeam = () => {
    if (newTeamName.trim()) {
      addTeam(newTeamName.trim());
      setNewTeamName("");
      setShowAddModal(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Caricamento...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {teams.length === 0 ? (
          <View style={styles.emptyState}>
            <Users size={64} color="#9ca3af" />
            <Text style={styles.emptyTitle}>Nessuna Squadra</Text>
            <Text style={styles.emptyText}>
              Tocca il pulsante + per aggiungere la tua prima squadra
            </Text>
          </View>
        ) : (
          teams.map((team) => {
            const badges = getTeamBadges(team);
            return (
              <TouchableOpacity
                key={team.id}
                style={styles.teamCard}
                onPress={() => router.push(`/(team)/${team.id}` as any)}
                activeOpacity={0.7}
              >
                <View style={styles.teamHeader}>
                  <Text style={styles.teamName}>{team.name}</Text>
                  <View style={styles.badgeContainer}>
                    {badges.alt > 0 && (
                      <View style={[styles.badge, styles.badgeRed]}>
                        <AlertCircle size={14} color="#fff" />
                        <Text style={styles.badgeText}>{badges.alt}</Text>
                      </View>
                    )}
                    {badges.warn > 0 && (
                      <View style={[styles.badge, styles.badgeYellow]}>
                        <AlertCircle size={14} color="#fff" />
                        <Text style={styles.badgeText}>{badges.warn}</Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={styles.teamInfo}>
                  <Text style={styles.teamInfoText}>
                    {team.athletes.length} atleti
                  </Text>
                  <Text style={styles.teamInfoText}>•</Text>
                  <Text style={styles.teamInfoText}>
                    {team.matches.length} gare
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
        activeOpacity={0.8}
      >
        <Plus size={28} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAddModal(false)}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Nuova Squadra</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome squadra"
              placeholderTextColor="#9ca3af"
              value={newTeamName}
              onChangeText={setNewTeamName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddModal(false);
                  setNewTeamName("");
                }}
              >
                <Text style={styles.cancelButtonText}>Annulla</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddTeam}
              >
                <Text style={styles.confirmButtonText}>Aggiungi</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  loadingText: {
    fontSize: 16,
    color: "#6b7280",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#111827",
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 8,
  },
  teamCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  teamHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  teamName: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#111827",
    flex: 1,
  },
  badgeContainer: {
    flexDirection: "row",
    gap: 6,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeRed: {
    backgroundColor: "#ef4444",
  },
  badgeYellow: {
    backgroundColor: "#f59e0b",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700" as const,
  },
  teamInfo: {
    flexDirection: "row",
    gap: 8,
  },
  teamInfoText: {
    fontSize: 14,
    color: "#6b7280",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#111827",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#111827",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f3f4f6",
  },
  confirmButton: {
    backgroundColor: "#2563eb",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#374151",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#fff",
  },
});
