import { describe, expect, it } from 'vitest';
import { ALL_SCENARIOS } from '../data/mock/scenarios';
import { getComponentId } from '../data/types';

describe('MVIS scenario data consistency', () => {
  it('declares exactly the rendered coach count with unique IDs', () => {
    Object.values(ALL_SCENARIOS).forEach((scenario) => {
      expect(scenario.trainRun.coaches).toHaveLength(scenario.trainRun.coachCount);
      expect(new Set(scenario.trainRun.coaches.map((coach) => coach.coachId)).size)
        .toBe(scenario.trainRun.coachCount);
    });
  });

  it('keeps every defect connected to a declared coach and stable component path', () => {
    Object.values(ALL_SCENARIOS).forEach((scenario) => {
      const coachIds = new Set(scenario.trainRun.coaches.map((coach) => coach.coachId));
      scenario.defects.forEach((defect) => {
        expect(coachIds.has(defect.location.coachId)).toBe(true);
        expect(getComponentId(defect.location)).toContain(defect.location.coachId);
        expect(getComponentId(defect.location)).toContain(defect.location.componentType);
      });
    });
  });
});
