import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Platform, Linking } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Settings, Plus, Phone, AlertCircle, Clock, MapPin, Trash2, CreditCard, X } from "lucide-react-native";
import { useTeams } from "@/contexts/TeamsContext";
import { StatusType } from "@/types";
import { Image } from "expo-image";

export default function TeamDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getTeam, updateTeam, addAthlete, addMatch, deleteMatch, getAthleteStatus } = useTeams();
  const [activeTab, setActiveTab] = useState<'data' | 'matches'>('data');
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>("");
  const [showAddAthleteModal, setShowAddAthleteModal] = useState<boolean>(false);
  const [newAthleteName, setNewAthleteName] = useState<string>("");
  const [newAthleteSurname, setNewAthleteSurname] = useState<string>("");
  const [showAddMatchModal, setShowAddMatchModal] = useState<boolean>(false);
  const [matchForm, setMatchForm] = useState({
    date: "",
    time: "",
    homeTeam: "",
    awayTeam: "",
    location: "",
    locationAddress: "",
    championship: "",
    notes: "",
  });
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [selectedIdCardImage, setSelectedIdCardImage] = useState<string | null>(null);

  const team = getTeam(id!);

  if (!team) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Squadra non trovata</Text>
      </View>
    );
  }

  const handleEditName = () => {
    if (editedName.trim()) {
      updateTeam(id!, { name: editedName.trim() });
      setShowEditModal(false);
    }
  };

  const handleAddAthlete = () => {
    if (newAthleteName.trim() && newAthleteSurname.trim()) {
      addAthlete(id!, {
        firstName: newAthleteName.trim(),
        lastName: newAthleteSurname.trim(),
        isMember: false,
        hasPaid: false,
      });
      setNewAthleteName("");
      setNewAthleteSurname("");
      setShowAddAthleteModal(false);
    }
  };

  const getStatusColor = (status: StatusType) => {
    switch (status) {
      case 'ok': return '#10b981';
      case 'miss': return '#3b82f6';
      case 'warn': return '#f59e0b';
      case 'alt': return '#ef4444';
    }
  };

  const getStatusLabel = (status: StatusType) => {
    switch (status) {
      case 'ok': return 'OK';
      case 'miss': return 'MISS';
      case 'warn': return 'WARN';
      case 'alt': return 'ALT!';
    }
  };

  const handleAddMatch = () => {
    if (matchForm.date && matchForm.time && matchForm.homeTeam && matchForm.awayTeam && matchForm.location) {
      addMatch(id!, matchForm);
      setMatchForm({
        date: "",
        time: "",
        homeTeam: "",
        awayTeam: "",
        location: "",
        locationAddress: "",
        championship: "",
        notes: "",
      });
      setShowAddMatchModal(false);
    }
  };

  const handleDeleteMatch = (matchId: string) => {
    deleteMatch(id!, matchId);
  };

  const formatDateToDDMMYYYY = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      setMatchForm({ ...matchForm, date: `${year}-${month}-${day}` });
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const hours = String(selectedTime.getHours()).padStart(2, "0");
      const minutes = String(selectedTime.getMinutes()).padStart(2, "0");
      setMatchForm({ ...matchForm, time: `${hours}:${minutes}` });
    }
  };

  const getDateForPicker = (dateStr: string) => {
    if (!dateStr) return new Date();
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? new Date() : date;
  };

  const getTimeForPicker = (timeStr: string) => {
    if (!timeStr) return new Date();
    const [hours, minutes] = timeStr.split(":");
    const date = new Date();
    date.setHours(parseInt(hours) || 0, parseInt(minutes) || 0);
    return date;
  };

  const handlePhoneCall = (phoneNumber: string) => {
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleViewIdCard = (idCardImage: string) => {
    if (idCardImage) {
      setSelectedIdCardImage(idCardImage);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: team.name,
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                setEditedName(team.name);
                setShowEditModal(true);
              }}
              style={styles.headerButton}
            >
              <Settings size={24} color="#2563eb" />
            </TouchableOpacity>
          ),
        }} 
      />

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'data' && styles.activeTab]}
          onPress={() => setActiveTab('data')}
        >
          <Text style={[styles.tabText, activeTab === 'data' && styles.activeTabText]}>
            Dati
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'matches' && styles.activeTab]}
          onPress={() => setActiveTab('matches')}
        >
          <Text style={[styles.tabText, activeTab === 'matches' && styles.activeTabText]}>
            Gare
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'data' ? (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {team.athletes.length === 0 ? (
            <View style={styles.emptyState}>
              <AlertCircle size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>Nessun atleta</Text>
            </View>
          ) : (
            team.athletes.map((athlete) => {
              const status = getAthleteStatus(athlete);
              return (
                <TouchableOpacity
                  key={athlete.id}
                  style={styles.athleteCard}
                  onPress={() => router.push(`/(team)/athlete/${athlete.id}?teamId=${id}` as any)}
                >
                  <View style={styles.athleteHeader}>
                    <Text style={styles.athleteName}>
                      {athlete.firstName} {athlete.lastName}
                    </Text>
                    <View style={styles.athleteActions}>
                      {athlete.phone && (
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={(e) => {
                            e.stopPropagation();
                            handlePhoneCall(athlete.phone!);
                          }}
                        >
                          <Phone size={20} color="#2563eb" />
                        </TouchableOpacity>
                      )}
                      {athlete.idCardImage && (
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={(e) => {
                            e.stopPropagation();
                            handleViewIdCard(athlete.idCardImage!);
                          }}
                        >
                          <CreditCard size={20} color="#2563eb" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  <View style={styles.statusContainer}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) }]}>
                      <Text style={styles.statusText}>{getStatusLabel(status)}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          {team.matches.length === 0 ? (
            <View style={styles.emptyState}>
              <Clock size={48} color="#9ca3af" />
              <Text style={styles.emptyText}>Nessuna gara programmata</Text>
            </View>
          ) : (
            team.matches.map((match) => (
              <View key={match.id} style={styles.matchCard}>
                <TouchableOpacity
                  style={styles.matchDeleteButton}
                  onPress={() => handleDeleteMatch(match.id)}
                >
                  <Trash2 size={16} color="#ef4444" />
                </TouchableOpacity>
                <Text style={styles.matchDate}>{match.date} - {match.time}</Text>
                <View style={styles.matchTeams}>
                  <Text style={styles.matchTeam}>{match.homeTeam}</Text>
                  <Text style={styles.vsText}>vs</Text>
                  <Text style={styles.matchTeam}>{match.awayTeam}</Text>
                </View>
                {match.championship && (
                  <Text style={styles.matchChampionship}>{match.championship}</Text>
                )}
                <View style={styles.matchLocationRow}>
                  <MapPin size={14} color="#6b7280" />
                  <Text style={styles.matchLocation}>{match.location}</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          if (activeTab === 'data') {
            setShowAddAthleteModal(true);
          } else {
            setShowAddMatchModal(true);
          }
        }}
        activeOpacity={0.8}
      >
        <Plus size={28} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowEditModal(false)}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Modifica Nome Squadra</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome squadra"
              placeholderTextColor="#9ca3af"
              value={editedName}
              onChangeText={setEditedName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Annulla</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleEditName}
              >
                <Text style={styles.confirmButtonText}>Salva</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showAddAthleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddAthleteModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAddAthleteModal(false)}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Nuovo Atleta</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor="#9ca3af"
              value={newAthleteName}
              onChangeText={setNewAthleteName}
              autoFocus
            />
            <TextInput
              style={styles.input}
              placeholder="Cognome"
              placeholderTextColor="#9ca3af"
              value={newAthleteSurname}
              onChangeText={setNewAthleteSurname}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddAthleteModal(false);
                  setNewAthleteName("");
                  setNewAthleteSurname("");
                }}
              >
                <Text style={styles.cancelButtonText}>Annulla</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAddAthlete}
              >
                <Text style={styles.confirmButtonText}>Aggiungi</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showAddMatchModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddMatchModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAddMatchModal(false)}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <ScrollView>
              <Text style={styles.modalTitle}>Nuova Gara</Text>
              <View style={styles.row}>
                <View style={[styles.field, styles.halfField]}>
                  <Text style={styles.fieldLabel}>Data</Text>
                  <TouchableOpacity
                    style={styles.dateInputModal}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={matchForm.date ? styles.dateTextModal : styles.datePlaceholderModal}>
                      {matchForm.date ? formatDateToDDMMYYYY(matchForm.date) : "GG-MM-YYYY"}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={getDateForPicker(matchForm.date)}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={handleDateChange}
                    />
                  )}
                </View>
                <View style={[styles.field, styles.halfField]}>
                  <Text style={styles.fieldLabel}>Ora</Text>
                  <TouchableOpacity
                    style={styles.dateInputModal}
                    onPress={() => setShowTimePicker(true)}
                  >
                    <Text style={matchForm.time ? styles.dateTextModal : styles.datePlaceholderModal}>
                      {matchForm.time || "HH:MM"}
                    </Text>
                  </TouchableOpacity>
                  {showTimePicker && (
                    <DateTimePicker
                      value={getTimeForPicker(matchForm.time)}
                      mode="time"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={handleTimeChange}
                      is24Hour={true}
                    />
                  )}
                </View>
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Squadra Casa</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nome squadra"
                  placeholderTextColor="#9ca3af"
                  value={matchForm.homeTeam}
                  onChangeText={(text) => setMatchForm({ ...matchForm, homeTeam: text })}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Squadra Ospite</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nome squadra"
                  placeholderTextColor="#9ca3af"
                  value={matchForm.awayTeam}
                  onChangeText={(text) => setMatchForm({ ...matchForm, awayTeam: text })}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Campionato</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nome campionato"
                  placeholderTextColor="#9ca3af"
                  value={matchForm.championship}
                  onChangeText={(text) => setMatchForm({ ...matchForm, championship: text })}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Luogo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nome luogo"
                  placeholderTextColor="#9ca3af"
                  value={matchForm.location}
                  onChangeText={(text) => setMatchForm({ ...matchForm, location: text })}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Indirizzo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Indirizzo completo"
                  placeholderTextColor="#9ca3af"
                  value={matchForm.locationAddress}
                  onChangeText={(text) => setMatchForm({ ...matchForm, locationAddress: text })}
                />
              </View>
              <View style={styles.field}>
                <Text style={styles.fieldLabel}>Note</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Note aggiuntive"
                  placeholderTextColor="#9ca3af"
                  value={matchForm.notes}
                  onChangeText={(text) => setMatchForm({ ...matchForm, notes: text })}
                  multiline
                  numberOfLines={3}
                />
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setShowAddMatchModal(false);
                    setMatchForm({
                      date: "",
                      time: "",
                      homeTeam: "",
                      awayTeam: "",
                      location: "",
                      locationAddress: "",
                      championship: "",
                      notes: "",
                    });
                  }}
                >
                  <Text style={styles.cancelButtonText}>Annulla</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleAddMatch}
                >
                  <Text style={styles.confirmButtonText}>Aggiungi</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={!!selectedIdCardImage}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedIdCardImage(null)}
      >
        <View style={styles.imageModalOverlay}>
          <TouchableOpacity
            style={styles.imageModalClose}
            onPress={() => setSelectedIdCardImage(null)}
          >
            <X size={28} color="#fff" />
          </TouchableOpacity>
          {selectedIdCardImage && (
            <Image
              source={{ uri: selectedIdCardImage }}
              style={styles.fullScreenImage}
              contentFit="contain"
            />
          )}
        </View>
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
  errorText: {
    fontSize: 16,
    color: "#ef4444",
  },
  headerButton: {
    padding: 8,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#6b7280",
  },
  activeTabText: {
    color: "#2563eb",
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
  },
  emptyText: {
    fontSize: 16,
    color: "#9ca3af",
    marginTop: 12,
  },
  athleteCard: {
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
  athleteHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  athleteName: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#111827",
    flex: 1,
  },
  athleteActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
    backgroundColor: "#eff6ff",
    borderRadius: 8,
  },
  statusContainer: {
    flexDirection: "row",
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700" as const,
  },
  matchCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#2563eb",
  },
  matchDate: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#2563eb",
    marginBottom: 8,
  },
  matchTeams: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginBottom: 8,
  },
  matchTeam: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#111827",
    flex: 1,
    textAlign: "center",
  },
  vsText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#6b7280",
  },
  matchChampionship: {
    fontSize: 13,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 8,
    fontStyle: "italic" as const,
  },
  matchLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  matchLocation: {
    fontSize: 14,
    color: "#6b7280",
  },
  matchDeleteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 8,
    zIndex: 1,
  },
  field: {
    marginBottom: 12,
  },
  halfField: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#374151",
    marginBottom: 6,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
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
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
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
  dateInputModal: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  dateTextModal: {
    fontSize: 16,
    color: "#111827",
  },
  datePlaceholderModal: {
    fontSize: 16,
    color: "#9ca3af",
  },
  imageModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  imageModalClose: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 12,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 24,
  },
  fullScreenImage: {
    width: "90%",
    height: "80%",
  },
});
