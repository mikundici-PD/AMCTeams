import { StyleSheet, Text, View, ScrollView } from "react-native";
import { Calendar, MapPin, Clock } from "lucide-react-native";
import { useTeams } from "@/contexts/TeamsContext";

export default function MatchesScreen() {
  const { getAllMatches, teams } = useTeams();

  const getTeamName = (teamId: string) => {
    return teams.find(t => t.id === teamId)?.name || "";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("it-IT", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const isUpcoming = (dateStr: string, timeStr: string) => {
    const matchDate = new Date(`${dateStr} ${timeStr}`);
    return matchDate >= new Date();
  };

  const upcomingMatches = getAllMatches.filter(m => isUpcoming(m.date, m.time));
  const pastMatches = getAllMatches.filter(m => !isUpcoming(m.date, m.time));

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {getAllMatches.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar size={64} color="#9ca3af" />
            <Text style={styles.emptyTitle}>Nessuna Gara</Text>
            <Text style={styles.emptyText}>
              Le gare vengono aggiunte dalla sezione di ogni squadra
            </Text>
          </View>
        ) : (
          <>
            {upcomingMatches.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Prossime Gare</Text>
                {upcomingMatches.map((match) => (
                  <View key={match.id} style={styles.matchCard}>
                    <View style={styles.matchHeader}>
                      <View style={styles.dateContainer}>
                        <Calendar size={16} color="#2563eb" />
                        <Text style={styles.dateText}>{formatDate(match.date)}</Text>
                      </View>
                      <View style={styles.timeContainer}>
                        <Clock size={16} color="#6b7280" />
                        <Text style={styles.timeText}>{match.time}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.teamsContainer}>
                      <Text style={styles.teamText}>{match.homeTeam}</Text>
                      <Text style={styles.vsText}>vs</Text>
                      <Text style={styles.teamText}>{match.awayTeam}</Text>
                    </View>

                    {match.championship && (
                      <Text style={styles.championshipText}>{match.championship}</Text>
                    )}

                    <View style={styles.locationContainer}>
                      <MapPin size={14} color="#6b7280" />
                      <Text style={styles.locationText}>{match.location}</Text>
                    </View>

                    <Text style={styles.teamBadge}>{getTeamName(match.teamId)}</Text>
                  </View>
                ))}
              </View>
            )}

            {pastMatches.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Gare Passate</Text>
                {pastMatches.map((match) => (
                  <View key={match.id} style={[styles.matchCard, styles.pastMatchCard]}>
                    <View style={styles.matchHeader}>
                      <View style={styles.dateContainer}>
                        <Calendar size={16} color="#9ca3af" />
                        <Text style={[styles.dateText, styles.pastText]}>{formatDate(match.date)}</Text>
                      </View>
                      <View style={styles.timeContainer}>
                        <Clock size={16} color="#9ca3af" />
                        <Text style={[styles.timeText, styles.pastText]}>{match.time}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.teamsContainer}>
                      <Text style={[styles.teamText, styles.pastText]}>{match.homeTeam}</Text>
                      <Text style={[styles.vsText, styles.pastText]}>vs</Text>
                      <Text style={[styles.teamText, styles.pastText]}>{match.awayTeam}</Text>
                    </View>

                    {match.championship && (
                      <Text style={[styles.championshipText, styles.pastText]}>{match.championship}</Text>
                    )}

                    <View style={styles.locationContainer}>
                      <MapPin size={14} color="#9ca3af" />
                      <Text style={[styles.locationText, styles.pastText]}>{match.location}</Text>
                    </View>

                    <Text style={[styles.teamBadge, styles.pastBadge]}>{getTeamName(match.teamId)}</Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#111827",
    marginBottom: 12,
  },
  matchCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#2563eb",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pastMatchCard: {
    borderLeftColor: "#d1d5db",
    opacity: 0.7,
  },
  matchHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#2563eb",
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  timeText: {
    fontSize: 14,
    color: "#6b7280",
  },
  teamsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    gap: 12,
  },
  teamText: {
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
  championshipText: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#6b7280",
  },
  teamBadge: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#2563eb",
    backgroundColor: "#eff6ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  pastText: {
    color: "#9ca3af",
  },
  pastBadge: {
    color: "#9ca3af",
    backgroundColor: "#f3f4f6",
  },
});
