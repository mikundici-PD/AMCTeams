export type StatusType = 'ok' | 'miss' | 'warn' | 'alt';

export interface Athlete {
  id: string;
  firstName: string;
  lastName: string;
  medicalCertExpiry?: string;
  phone?: string;
  shirtSize?: string;
  shortsSize?: string;
  role?: string;
  selfCertExpiry?: string;
  idCardNumber?: string;
  idCardImage?: string;
  fiscalCode?: string;
  fiscalCodeImage?: string;
  jerseyNumber?: string;
  matricola?: string;
  birthDate?: string;
  isMember: boolean;
  hasPaid: boolean;
}

export interface Match {
  id: string;
  teamId: string;
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  location: string;
  locationAddress?: string;
  championship?: string;
  notes?: string;
}

export interface Team {
  id: string;
  name: string;
  athletes: Athlete[];
  matches: Match[];
}

export interface NotificationBadge {
  warn: number;
  alt: number;
}
