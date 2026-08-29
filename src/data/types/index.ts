export type InspectionStatus =
  | 'scheduled'
  | 'approaching'
  | 'inspecting'
  | 'review_required'
  | 'complete'
  | 'unavailable';

export type Severity = 'information' | 'review_required' | 'urgent';
export type ComponentType = 'wheel' | 'spring' | 'brake' | 'bogie' | 'axle_box';
export type BogiePosition = 'front' | 'rear';
export type Side = 'left' | 'right';
export type TimeOfDay = 'day' | 'night';
export type Weather = 'clear' | 'overcast' | 'rain';
export type QualityTier = 'high' | 'balanced' | 'low';
export type ScenarioId = 'clean-day' | 'spring-defect-day' | 'clean-night' | 'spring-defect-weather';

export interface ComponentLocation {
  coachId: string;
  componentType: ComponentType;
  bogiePosition?: BogiePosition;
  side?: Side;
  positionLabel?: string;
}

export interface Defect {
  defectId: string;
  defectType: string;
  severity: Severity;
  location: ComponentLocation;
  detectedAt: string;
  reviewStatus: 'new' | 'prepared' | 'under_review' | 'resolved';
  evidenceIds: string[];
  simulated: boolean;
}

export interface EvidenceAsset {
  evidenceId: string;
  kind: 'inspection_image' | 'inspection_snapshot' | 'defect_snapshot' | 'report';
  thumbnailUrl?: string;
  contentUrl?: string;
  mediaType: string;
  width?: number;
  height?: number;
  alt: string;
  capturedAt: string;
}

export interface TrainRun {
  trainId: string;
  direction: 'positive_z';
  coachCount: number;
  locomotiveId: string;
  coaches: CoachRecord[];
}

export interface CoachRecord {
  coachId: string;
  order: number;
  variant: string;
}

export function getComponentId(location: ComponentLocation): string {
  const bogie = location.bogiePosition ?? 'front';
  const side = location.side ?? 'left';
  const slot = (location.positionLabel?.match(/\d+/)?.[0] ?? '01').padStart(2, '0');
  const base = `${location.coachId}/bogie/${bogie}`;
  if (location.componentType === 'bogie') return base;
  if (location.componentType === 'wheel') return `${base}/wheelset/1`;
  if (location.componentType === 'spring') return `${base}/spring/${side}-primary-${slot}`;
  if (location.componentType === 'brake') return `${base}/brake/${side}-${slot}`;
  return `${base}/axle_box/${side}-${slot}`;
}

export interface ScenarioEnvironment {
  timeOfDay: TimeOfDay;
  weather: Weather;
}

export interface Scenario {
  scenarioId: ScenarioId;
  scenarioSeed: number;
  mode: 'simulated' | 'live';
  environment: ScenarioEnvironment;
  trainRun: TrainRun;
  defects: Defect[];
  evidence: EvidenceAsset[];
}

export interface SiteMetrics {
  totalTrainsInspected: number;
  defectsFound: number;
  todayActivity: number;
  latestAlerts: number;
}

export type PortalState = 'standby' | 'preparing' | 'active' | 'defect_detected' | 'resetting' | 'fault';
export type GuideStage = 'BOOT' | 'LOADING' | 'WELCOME' | 'SITE_ARRIVAL' | 'STANDBY' | 'APPROACH' | 'ACTIVATION' | 'INSPECTION' | 'DEFECT_FOCUS' | 'EVIDENCE' | 'EXIT' | 'COMPLETE' | 'FREE_ROAM' | 'FALLBACK' | 'RECOVERABLE_ERROR';

export interface InspectionProgress {
  currentCoach: string;
  coachesInspected: number;
  totalCoaches: number;
  activeComponent: string;
  defectsFound: number;
  portalStatus: string;
}

export interface ScenarioContext {
  scenario: Scenario | null;
  scenarioSeed: number;
  trainPosition: number;
  trainSpeed: number;
  currentCoachIndex: number;
  totalCoaches: number;
  currentComponent: string;
  defects: Defect[];
  evidenceIds: string[];
  alertStatus: 'pending' | 'prepared' | 'sent' | 'delivered' | 'failed';
  qualityTier: QualityTier;
  muted: boolean;
  captionsOn: boolean;
  paused?: boolean;
  reducedMotion: boolean;
  error: string | null;
  inspectionStartTime: number | null;
  inspectionEndTime: number | null;
  coachesInspected: number;
  currentCoach: string;
}
