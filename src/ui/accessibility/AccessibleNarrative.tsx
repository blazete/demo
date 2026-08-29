import type { PortalState, InspectionProgress, GuideStage } from '../../data/types';

export function AccessibleNarrative({ stage, portalState, progress, stageCaption }: {
  stage: GuideStage; portalState: PortalState; progress: InspectionProgress; stageCaption: string | null;
}) {
  return (
    <div role="region" aria-label="Inspection status" style={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}>
      <div aria-live="polite" aria-atomic="true">
        <span>Stage: {stage}.</span>
        <span>Inspection array: {portalState}.</span>
        {progress.currentCoach && progress.currentCoach !== '—' && <span>Coach {progress.currentCoach}, {progress.coachesInspected} of {progress.totalCoaches} inspected.</span>}
        {progress.activeComponent && <span>Inspecting: {progress.activeComponent}.</span>}
        {progress.defectsFound > 0 && <span>{progress.defectsFound} defect(s) found.</span>}
      </div>
      {stageCaption && <div aria-live="assertive" aria-atomic="true" style={{ position: 'absolute', left: -9999 }}>{stageCaption}</div>}
    </div>
  );
}
