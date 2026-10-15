/**
 * Tipos de datos para el Mapa Interactivo de Comunicación para el Desarrollo
 * Plataforma: CComuSoc (ccomusoc.com.ar)
 */

export type ProjectCategory = 
  | 'radios_comunitarias'
  | 'soberania_alimentaria'
  | 'educacion_popular'
  | 'salud_comunitaria'
  | 'habitat_ambiente'
  | 'genero_ddhh'
  | 'juventud_cultura';

export type ProjectStatus = 'planificacion' | 'en_ejecucion' | 'activo' | 'finalizado';

export interface SocialProject {
  id: string;
  title: string;
  summary: string;
  description: string;
  category: ProjectCategory;
  coordinates: [number, number]; // [lat, lng]
  locationName: string;
  province: string;
  country: string;
  impactRadiusKm: number; // Radio de impacto territorial
  directBeneficiaries: number;
  indirectBeneficiaries: number;
  status: ProjectStatus;
  startDate: string;
  organizationLeader: string;
  contactEmail: string;
  odsGoals: number[]; // Objetivos de Desarrollo Sostenible (1-17)
  coverImage?: string;
  updatedAt: string;
  syncedWithSheet?: boolean;
}

export type TestimonyStatus = 'pendiente' | 'aprobado' | 'destacado';
export type MediaType = 'none' | 'photo' | 'video' | 'audio';

export interface CommunityTestimony {
  id: string;
  projectId: string;
  projectName: string;
  authorName: string;
  isAnonymous: boolean;
  communityRole: string; // ej. Vecina, Promotora de Salud, Joven Comunicador
  neighborhood: string;
  coordinates: [number, number];
  date: string;
  rating: number; // 1-5 estrellas de percepción de impacto
  storyText: string;
  quoteHighlight: string;
  mediaType: MediaType;
  mediaUrl?: string;
  videoDurationSeconds?: number; // max 30s permitido
  status: TestimonyStatus;
  offlineQueued?: boolean;
  syncedWithSheet?: boolean;
}

export type UserRole = 
  | 'super_admin'
  | 'admin'
  | 'editor'
  | 'field_agent'
  | 'citizen';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  avatarUrl?: string;
  activeSince: string;
}

export interface OfflineQueueItem {
  id: string;
  timestamp: string;
  type: 'new_project' | 'new_testimony' | 'update_project' | 'status_change';
  payload: any;
  status: 'pending' | 'syncing' | 'synced' | 'error';
  errorMsg?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  level: 'info' | 'success' | 'warning' | 'critical';
  targetRole?: UserRole;
}

export interface GoogleSheetConfig {
  webhookUrl: string;
  sheetId: string;
  autoSyncEnabled: boolean;
  lastSyncTimestamp: string | null;
  syncedCount: number;
  isSyncing: boolean;
}

export interface UnitTestResult {
  id: string;
  name: string;
  category: 'geolocation' | 'offline_sync' | 'media_validation' | 'rbac_security' | 'sheets_export' | 'analytics';
  passed: boolean;
  durationMs: number;
  message: string;
}
