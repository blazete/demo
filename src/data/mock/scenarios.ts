import type { Scenario, EvidenceAsset, SiteMetrics, CoachRecord } from '../types';

const EVIDENCE: EvidenceAsset[] = [
  { evidenceId: 'EV-001', kind: 'inspection_image', mediaType: 'image/webp', alt: 'Wide portal view showing coach B4 passing through MVIS', capturedAt: '2026-08-26T14:32:18+05:30', width: 1200, height: 800 },
  { evidenceId: 'EV-002', kind: 'inspection_snapshot', mediaType: 'image/webp', alt: 'Coach B4 front bogie captured during inspection', capturedAt: '2026-08-26T14:32:18+05:30', width: 1024, height: 768 },
  { evidenceId: 'EV-003', kind: 'defect_snapshot', mediaType: 'image/webp', alt: 'Close-up of front bogie left primary spring 01', capturedAt: '2026-08-26T14:32:18+05:30', width: 800, height: 600 },
  { evidenceId: 'EV-004', kind: 'report', mediaType: 'text/html', alt: 'Inspection report summarizing spring defect on coach B4', capturedAt: '2026-08-26T14:32:19+05:30' },
];

export const SPRING_DEFECT_SCENARIO: Scenario = {
  scenarioId: 'spring-defect-day', scenarioSeed: 240826, mode: 'simulated',
  environment: { timeOfDay: 'day', weather: 'clear' },
  trainRun: { trainId: 'DEMO-12952', direction: 'positive_z', locomotiveId: 'Loco', coachCount: 18,
    coaches: Array.from({ length: 18 }, (_, index): CoachRecord => ({ coachId: `B${index + 1}`, order: index, variant: 'standard' })) },
  defects: [{
    defectId: 'DEF-DEMO-001', defectType: 'Suspension spring anomaly', severity: 'review_required',
    location: { coachId: 'B4', componentType: 'spring', bogiePosition: 'front', side: 'left', positionLabel: 'Primary spring 01' },
    detectedAt: '2026-08-26T14:32:18+05:30', reviewStatus: 'prepared', evidenceIds: ['EV-001','EV-002','EV-003','EV-004'], simulated: true,
  }],
  evidence: EVIDENCE,
};

export const CLEAN_DAY_SCENARIO: Scenario = { ...SPRING_DEFECT_SCENARIO, scenarioId: 'clean-day', scenarioSeed: 240827, defects: [], evidence: [] };
export const NIGHT_SCENARIO: Scenario = { ...SPRING_DEFECT_SCENARIO, scenarioId: 'clean-night', scenarioSeed: 240828, environment: { timeOfDay: 'night', weather: 'clear' }, defects: [], evidence: [] };
export const WEATHER_SCENARIO: Scenario = { ...SPRING_DEFECT_SCENARIO, scenarioId: 'spring-defect-weather', scenarioSeed: 240829, environment: { timeOfDay: 'day', weather: 'rain' } };

export const MOCK_SITE_METRICS: SiteMetrics = { totalTrainsInspected: 1247, defectsFound: 83, todayActivity: 42, latestAlerts: 3 };
export const ALL_SCENARIOS: Record<string, Scenario> = { 'clean-day': CLEAN_DAY_SCENARIO, 'spring-defect-day': SPRING_DEFECT_SCENARIO, 'clean-night': NIGHT_SCENARIO, 'spring-defect-weather': WEATHER_SCENARIO };
export function getScenario(id: string): Scenario { return ALL_SCENARIOS[id] ?? SPRING_DEFECT_SCENARIO; }
