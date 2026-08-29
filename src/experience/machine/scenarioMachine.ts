import { assign, setup } from 'xstate';
import type { Defect, GuideStage, PortalState, Scenario } from '../../data/types';

export type ScenarioEvent =
  | { type: 'START'; scenario: Scenario }
  | { type: 'TICK'; delta: number }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'SKIP' }
  | { type: 'REPLAY' }
  | { type: 'EXPLORE' }
  | { type: 'RETURN_TO_GUIDE' }
  | { type: 'OPEN_FALLBACK' }
  | { type: 'SHOW_EVIDENCE' }
  | { type: 'HIDE_EVIDENCE' }
  | { type: 'RESET' };

export interface ScenarioMachineContext {
  scenario: Scenario | null;
  elapsed: number;
  inspectionElapsed: number;
  componentIndex: number;
  currentCoachIndex: number;
  currentComponent: string;
  discoveredDefects: Defect[];
  activeDefect: Defect | null;
  evidenceVisible: boolean;
  paused: boolean;
  portalState: PortalState;
  alertStatus: 'pending' | 'prepared';
}

const COMPONENTS = ['wheel', 'bogie', 'spring', 'brake'] as const;

function initialContext(scenario: Scenario | null = null): ScenarioMachineContext {
  return {
    scenario,
    elapsed: 0,
    inspectionElapsed: 0,
    componentIndex: 0,
    currentCoachIndex: 0,
    currentComponent: '',
    discoveredDefects: [],
    activeDefect: null,
    evidenceVisible: false,
    paused: false,
    portalState: 'standby',
    alertStatus: 'pending',
  };
}

function coachIdAt(context: ScenarioMachineContext) {
  return context.scenario?.trainRun.coaches[context.currentCoachIndex]?.coachId ?? '';
}

function activeComponent(context: ScenarioMachineContext) {
  return COMPONENTS[context.componentIndex] ?? COMPONENTS[0];
}

function matchingDefect(context: ScenarioMachineContext) {
  const coachId = coachIdAt(context);
  const component = activeComponent(context);
  return context.scenario?.defects.find(
    (defect) => defect.location.coachId === coachId && defect.location.componentType === component,
  ) ?? null;
}

function inspectionFinished(context: ScenarioMachineContext) {
  const coachCount = context.scenario?.trainRun.coachCount ?? 0;
  return context.currentCoachIndex >= coachCount;
}

export const scenarioMachine = setup({
  types: {
    context: {} as ScenarioMachineContext,
    events: {} as ScenarioEvent,
    input: {} as { scenario?: Scenario | null },
  },
  actions: {
    setScenario: assign(({ event }) => event.type === 'START' ? initialContext(event.scenario) : {}),
    advanceStageClock: assign(({ context, event }) => ({
      elapsed: context.paused || event.type !== 'TICK' ? context.elapsed : context.elapsed + Math.min(event.delta, 0.25),
    })),
    advanceInspectionClock: assign(({ context, event }) => ({
      inspectionElapsed: context.paused || event.type !== 'TICK'
        ? context.inspectionElapsed
        : context.inspectionElapsed + Math.min(event.delta, 0.25),
      currentComponent: context.paused ? context.currentComponent : activeComponent(context),
    })),
    resetStageClock: assign({ elapsed: 0 }),
    advanceComponent: assign(({ context }) => {
      const nextComponentIndex = context.componentIndex + 1;
      if (nextComponentIndex < COMPONENTS.length) {
        return { componentIndex: nextComponentIndex, inspectionElapsed: 0 };
      }
      return {
        componentIndex: 0,
        currentCoachIndex: context.currentCoachIndex + 1,
        inspectionElapsed: 0,
      };
    }),
    discoverDefect: assign(({ context }) => {
      const defect = matchingDefect(context);
      return defect
        ? { activeDefect: defect, discoveredDefects: [defect], portalState: 'defect_detected' as const }
        : {};
    }),
    exposeEvidence: assign({ evidenceVisible: true, alertStatus: 'prepared' as const }),
    pause: assign({ paused: true }),
    resume: assign({ paused: false }),
    reset: assign(({ context }) => initialContext(context.scenario)),
    clearForReplay: assign(() => initialContext(null)),
    activatePortal: assign({ portalState: 'active' as const }),
    preparePortal: assign({ portalState: 'preparing' as const }),
    resetPortal: assign({ portalState: 'resetting' as const }),
    showEvidence: assign({ evidenceVisible: true }),
    hideEvidence: assign({ evidenceVisible: false }),
  },
  guards: {
    notPaused: ({ context }) => !context.paused,
    stageClockAtLeast: ({ context }, params: { seconds: number }) => context.elapsed >= params.seconds,
    componentReady: ({ context }) => context.inspectionElapsed >= 0.6,
    defectReady: ({ context }) => matchingDefect(context) !== null && context.discoveredDefects.length === 0,
    inspectionComplete: ({ context }) => inspectionFinished(context),
  },
}).createMachine({
  id: 'mvisScenario',
  initial: 'WELCOME',
  context: ({ input }) => initialContext(input?.scenario ?? null),
  on: {
    PAUSE: { actions: 'pause' },
    RESUME: { actions: 'resume' },
    OPEN_FALLBACK: { target: '.FALLBACK' },
    SHOW_EVIDENCE: { actions: 'showEvidence' },
    HIDE_EVIDENCE: { actions: 'hideEvidence' },
    RESET: { target: '.WELCOME', actions: 'reset' },
    REPLAY: { target: '.WELCOME', actions: 'clearForReplay' },
  },
  states: {
    WELCOME: {
      on: {
        START: { target: 'SITE_ARRIVAL', actions: 'setScenario' },
        OPEN_FALLBACK: 'FALLBACK',
      },
    },
    SITE_ARRIVAL: {
      entry: 'resetStageClock',
      on: { TICK: { actions: 'advanceStageClock' }, SKIP: 'STANDBY' },
      always: { guard: { type: 'stageClockAtLeast', params: { seconds: 4 } }, target: 'STANDBY', actions: 'resetStageClock' },
    },
    STANDBY: {
      entry: 'resetStageClock',
      on: { TICK: { actions: 'advanceStageClock' }, SKIP: { target: 'APPROACH', actions: 'preparePortal' } },
      always: { guard: { type: 'stageClockAtLeast', params: { seconds: 5 } }, target: 'APPROACH', actions: ['preparePortal', 'resetStageClock'] },
    },
    APPROACH: {
      entry: 'resetStageClock',
      on: { TICK: { actions: 'advanceStageClock' }, SKIP: 'ACTIVATION' },
      always: { guard: { type: 'stageClockAtLeast', params: { seconds: 5 } }, target: 'ACTIVATION', actions: 'resetStageClock' },
    },
    ACTIVATION: {
      entry: 'resetStageClock',
      on: { TICK: { actions: 'advanceStageClock' }, SKIP: { target: 'INSPECTION', actions: 'activatePortal' } },
      always: { guard: { type: 'stageClockAtLeast', params: { seconds: 4 } }, target: 'INSPECTION', actions: ['activatePortal', 'resetStageClock'] },
    },
    INSPECTION: {
      entry: ['resetStageClock', 'activatePortal'],
      on: { TICK: { actions: 'advanceInspectionClock' }, SKIP: { target: 'EXIT', actions: 'resetPortal' } },
      always: [
        { guard: { type: 'defectReady' }, target: 'DEFECT_FOCUS', actions: 'discoverDefect' },
        { guard: { type: 'inspectionComplete' }, target: 'EXIT', actions: 'resetPortal' },
        { guard: { type: 'componentReady' }, actions: 'advanceComponent' },
      ],
    },
    DEFECT_FOCUS: {
      entry: 'resetStageClock',
      on: { TICK: { actions: 'advanceStageClock' }, SKIP: 'EVIDENCE' },
      always: { guard: { type: 'stageClockAtLeast', params: { seconds: 6 } }, target: 'EVIDENCE', actions: ['exposeEvidence', 'resetStageClock'] },
    },
    EVIDENCE: {
      entry: ['exposeEvidence', 'resetStageClock'],
      on: { TICK: { actions: 'advanceStageClock' }, SKIP: { target: 'EXIT', actions: 'resetPortal' } },
      always: { guard: { type: 'stageClockAtLeast', params: { seconds: 8 } }, target: 'EXIT', actions: 'resetPortal' },
    },
    EXIT: {
      entry: 'resetStageClock',
      on: { TICK: { actions: 'advanceStageClock' }, SKIP: 'COMPLETE' },
      always: { guard: { type: 'stageClockAtLeast', params: { seconds: 4 } }, target: 'COMPLETE', actions: 'resetPortal' },
    },
    COMPLETE: {
      on: { EXPLORE: 'FREE_ROAM', REPLAY: { target: 'WELCOME', actions: 'clearForReplay' } },
    },
    FREE_ROAM: {
      on: { RETURN_TO_GUIDE: 'COMPLETE', REPLAY: { target: 'WELCOME', actions: 'clearForReplay' } },
    },
    FALLBACK: {
      on: { START: { target: 'SITE_ARRIVAL', actions: 'setScenario' }, REPLAY: { target: 'WELCOME', actions: 'clearForReplay' } },
    },
  },
});

export function createScenarioMachine(scenario: Scenario | null = null) {
  void scenario;
  return scenarioMachine;
}

export function stageFromSnapshot(value: unknown): GuideStage {
  return typeof value === 'string' ? value as GuideStage : 'WELCOME';
}
