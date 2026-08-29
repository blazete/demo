import { describe, expect, it } from 'vitest';
import { createActor } from 'xstate';
import { scenarioMachine } from './scenarioMachine';
import { SPRING_DEFECT_SCENARIO, CLEAN_DAY_SCENARIO } from '../../data/mock/scenarios';

function actorFor(scenario = SPRING_DEFECT_SCENARIO) {
  const actor = createActor(scenarioMachine, { input: { scenario } });
  actor.start();
  return actor;
}

function tick(actor: ReturnType<typeof actorFor>, seconds: number) {
  const steps = Math.ceil(seconds / 0.1);
  for (let i = 0; i < steps; i += 1) actor.send({ type: 'TICK', delta: 0.1 });
}

describe('MVIS scenario machine', () => {
  it('starts and pauses without advancing time', () => {
    const actor = actorFor();
    actor.send({ type: 'START', scenario: SPRING_DEFECT_SCENARIO });
    expect(actor.getSnapshot().value).toBe('SITE_ARRIVAL');
    actor.send({ type: 'PAUSE' });
    const before = actor.getSnapshot().context.elapsed;
    tick(actor, 2);
    expect(actor.getSnapshot().context.elapsed).toBe(before);
    actor.send({ type: 'RESUME' });
    tick(actor, 4);
    expect(actor.getSnapshot().value).toBe('STANDBY');
  });

  it('discovers a defect before exposing evidence', () => {
    const actor = actorFor();
    actor.send({ type: 'START', scenario: SPRING_DEFECT_SCENARIO });
    tick(actor, 31);
    expect(actor.getSnapshot().value).toBe('DEFECT_FOCUS');
    expect(actor.getSnapshot().context.evidenceVisible).toBe(false);
    tick(actor, 6);
    expect(actor.getSnapshot().value).toBe('EVIDENCE');
    expect(actor.getSnapshot().context.evidenceVisible).toBe(true);
  });

  it('completes a clean scenario without a defect', () => {
    const actor = actorFor(CLEAN_DAY_SCENARIO);
    actor.send({ type: 'START', scenario: CLEAN_DAY_SCENARIO });
    tick(actor, 25);
    expect(actor.getSnapshot().value).toBe('INSPECTION');
    actor.send({ type: 'SKIP' });
    expect(actor.getSnapshot().value).toBe('EXIT');
  });

  it('replays with transient state cleared', () => {
    const actor = actorFor();
    actor.send({ type: 'START', scenario: SPRING_DEFECT_SCENARIO });
    tick(actor, 31);
    expect(actor.getSnapshot().context.activeDefect).not.toBeNull();
    actor.send({ type: 'REPLAY' });
    expect(actor.getSnapshot().value).toBe('WELCOME');
    expect(actor.getSnapshot().context.activeDefect).toBeNull();
    expect(actor.getSnapshot().context.evidenceVisible).toBe(false);
  });
});
