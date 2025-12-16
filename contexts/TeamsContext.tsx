import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState, useEffect, useMemo } from 'react';
import { Team, Athlete, Match, NotificationBadge, StatusType } from '@/types';

const STORAGE_KEY = '@teams_data';

const loadTeams = async (): Promise<Team[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveTeams = async (teams: Team[]): Promise<Team[]> => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
  return teams;
};

const getAthleteStatus = (athlete: Athlete): StatusType => {
  const now = new Date();
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  
  const requiredFields = [
    athlete.firstName,
    athlete.lastName,
    athlete.medicalCertExpiry,
    athlete.phone,
    athlete.birthDate,
  ];
  
  const hasMissingData = requiredFields.some(field => !field);
  
  if (hasMissingData) {
    return 'miss';
  }
  
  const checkDate = (dateStr?: string): 'ok' | 'warn' | 'alt' => {
    if (!dateStr) return 'ok';
    const date = new Date(dateStr);
    if (date < now) return 'alt';
    if (date < thirtyDaysFromNow) return 'warn';
    return 'ok';
  };
  
  const medicalStatus = checkDate(athlete.medicalCertExpiry);
  const selfCertStatus = checkDate(athlete.selfCertExpiry);
  
  if (medicalStatus === 'alt' || selfCertStatus === 'alt') return 'alt';
  if (medicalStatus === 'warn' || selfCertStatus === 'warn') return 'warn';
  
  return 'ok';
};

const getTeamBadges = (team: Team): NotificationBadge => {
  let warn = 0;
  let alt = 0;
  
  team.athletes.forEach(athlete => {
    const status = getAthleteStatus(athlete);
    if (status === 'warn') warn++;
    if (status === 'alt') alt++;
    if (status === 'miss') warn++;
  });
  
  return { warn, alt };
};

export const [TeamsProvider, useTeams] = createContextHook(() => {
  const [teams, setTeams] = useState<Team[]>([]);

  const teamsQuery = useQuery({
    queryKey: ['teams'],
    queryFn: loadTeams,
  });

  const saveMutation = useMutation({
    mutationFn: saveTeams,
  });

  useEffect(() => {
    if (teamsQuery.data) {
      setTeams(teamsQuery.data);
    }
  }, [teamsQuery.data]);

  const updateTeams = (newTeams: Team[]) => {
    setTeams(newTeams);
    saveMutation.mutate(newTeams);
  };

  const addTeam = (name: string) => {
    const newTeam: Team = {
      id: Date.now().toString(),
      name,
      athletes: [],
      matches: [],
    };
    updateTeams([...teams, newTeam]);
  };

  const updateTeam = (teamId: string, updates: Partial<Team>) => {
    updateTeams(teams.map(t => t.id === teamId ? { ...t, ...updates } : t));
  };

  const deleteTeam = (teamId: string) => {
    updateTeams(teams.filter(t => t.id !== teamId));
  };

  const addAthlete = (teamId: string, athlete: Omit<Athlete, 'id'>) => {
    const newAthlete: Athlete = {
      ...athlete,
      id: Date.now().toString(),
    };
    updateTeams(teams.map(t => 
      t.id === teamId 
        ? { ...t, athletes: [...t.athletes, newAthlete] }
        : t
    ));
  };

  const updateAthlete = (teamId: string, athleteId: string, updates: Partial<Athlete>) => {
    updateTeams(teams.map(t =>
      t.id === teamId
        ? { ...t, athletes: t.athletes.map(a => a.id === athleteId ? { ...a, ...updates } : a) }
        : t
    ));
  };

  const deleteAthlete = (teamId: string, athleteId: string) => {
    updateTeams(teams.map(t =>
      t.id === teamId
        ? { ...t, athletes: t.athletes.filter(a => a.id !== athleteId) }
        : t
    ));
  };

  const addMatch = (teamId: string, match: Omit<Match, 'id' | 'teamId'>) => {
    const newMatch: Match = {
      ...match,
      id: Date.now().toString(),
      teamId,
    };
    updateTeams(teams.map(t =>
      t.id === teamId
        ? { ...t, matches: [...t.matches, newMatch] }
        : t
    ));
  };

  const updateMatch = (teamId: string, matchId: string, updates: Partial<Match>) => {
    updateTeams(teams.map(t =>
      t.id === teamId
        ? { ...t, matches: t.matches.map(m => m.id === matchId ? { ...m, ...updates } : m) }
        : t
    ));
  };

  const deleteMatch = (teamId: string, matchId: string) => {
    updateTeams(teams.map(t =>
      t.id === teamId
        ? { ...t, matches: t.matches.filter(m => m.id !== matchId) }
        : t
    ));
  };

  const getTeam = (teamId: string) => teams.find(t => t.id === teamId);

  const getAthlete = (teamId: string, athleteId: string) => {
    const team = getTeam(teamId);
    return team?.athletes.find(a => a.id === athleteId);
  };

  const getAllMatches = useMemo(() => {
    return teams.flatMap(team => team.matches).sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`).getTime();
      const dateB = new Date(`${b.date} ${b.time}`).getTime();
      return dateA - dateB;
    });
  }, [teams]);

  return {
    teams,
    isLoading: teamsQuery.isLoading,
    addTeam,
    updateTeam,
    deleteTeam,
    addAthlete,
    updateAthlete,
    deleteAthlete,
    addMatch,
    updateMatch,
    deleteMatch,
    getTeam,
    getAthlete,
    getAthleteStatus,
    getTeamBadges,
    getAllMatches,
  };
});
