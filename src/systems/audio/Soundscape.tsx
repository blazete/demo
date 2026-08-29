import { useEffect, useRef } from 'react';
import type { GuideStage, PortalState, Weather } from '../../data/types';

type AudioGraph = {
  context: AudioContext;
  master: GainNode;
  rumble: GainNode;
  rain: GainNode;
  inspection: GainNode;
  sources: AudioScheduledSourceNode[];
};

function noiseBuffer(context: AudioContext, seconds: number) {
  const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    const white = Math.random() * 2 - 1;
    last = last * 0.985 + white * 0.015;
    data[i] = last;
  }
  return buffer;
}

function tone(context: AudioContext, destination: AudioNode, frequency: number, duration: number, gain = 0.06) {
  const oscillator = context.createOscillator();
  const envelope = context.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, context.currentTime);
  envelope.gain.setValueAtTime(0.0001, context.currentTime);
  envelope.gain.exponentialRampToValueAtTime(gain, context.currentTime + 0.025);
  envelope.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
  oscillator.connect(envelope).connect(destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration + 0.02);
}

function horn(context: AudioContext, destination: AudioNode) {
  const oscillator = context.createOscillator();
  const envelope = context.createGain();
  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(220, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(165, context.currentTime + 0.75);
  envelope.gain.setValueAtTime(0.0001, context.currentTime);
  envelope.gain.exponentialRampToValueAtTime(0.13, context.currentTime + 0.08);
  envelope.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.82);
  oscillator.connect(envelope).connect(destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.85);
}

function createGraph(): AudioGraph {
  const context = new AudioContext();
  const master = context.createGain();
  master.gain.value = 0.65;
  master.connect(context.destination);

  const rumble = context.createGain();
  const rumbleFilter = context.createBiquadFilter();
  rumbleFilter.type = 'lowpass'; rumbleFilter.frequency.value = 135;
  const rumbleSource = context.createOscillator();
  rumbleSource.type = 'sawtooth'; rumbleSource.frequency.value = 43;
  rumbleSource.connect(rumbleFilter).connect(rumble).connect(master);
  rumbleSource.start();

  const rain = context.createGain();
  const rainFilter = context.createBiquadFilter();
  rainFilter.type = 'highpass'; rainFilter.frequency.value = 900;
  const rainSource = context.createBufferSource();
  rainSource.buffer = noiseBuffer(context, 2); rainSource.loop = true;
  rainSource.connect(rainFilter).connect(rain).connect(master);
  rainSource.start();

  const inspection = context.createGain();
  const inspectionSource = context.createOscillator();
  inspectionSource.type = 'sine'; inspectionSource.frequency.value = 118;
  inspectionSource.connect(inspection).connect(master);
  inspectionSource.start();

  rumble.gain.value = 0; rain.gain.value = 0; inspection.gain.value = 0;
  return { context, master, rumble, rain, inspection, sources: [rumbleSource, rainSource, inspectionSource] };
}

export function Soundscape({ muted, stage, weather, portalState, hornTrigger }: { muted: boolean; stage: GuideStage; weather: Weather; portalState: PortalState; hornTrigger: number }) {
  const graph = useRef<AudioGraph | null>(null);
  const previousPortal = useRef<PortalState>('standby');
  const previousHorn = useRef(hornTrigger);

  useEffect(() => {
    const resume = () => { void graph.current?.context.resume().catch(() => undefined); };
    window.addEventListener('pointerdown', resume);
    window.addEventListener('keydown', resume);
    return () => { window.removeEventListener('pointerdown', resume); window.removeEventListener('keydown', resume); };
  }, []);

  useEffect(() => {
    if (!graph.current) graph.current = createGraph();
    const audio = graph.current;
    void audio.context.resume().catch(() => undefined);
    const now = audio.context.currentTime;
    const moving = ['APPROACH', 'INSPECTION', 'DEFECT_FOCUS', 'EVIDENCE', 'EXIT'].includes(stage);
    audio.master.gain.setTargetAtTime(muted ? 0 : 0.65, now, 0.08);
    audio.rumble.gain.setTargetAtTime(moving ? 0.055 : 0.008, now, 0.35);
    audio.rain.gain.setTargetAtTime(weather === 'rain' ? 0.18 : 0, now, 0.45);
    audio.inspection.gain.setTargetAtTime(portalState === 'active' || portalState === 'defect_detected' ? 0.018 : 0, now, 0.2);

    if (previousPortal.current !== portalState && !muted) {
      if (portalState === 'active') { tone(audio.context, audio.master, 620, 0.16); window.setTimeout(() => tone(audio.context, audio.master, 820, 0.18), 130); }
      if (portalState === 'defect_detected') { tone(audio.context, audio.master, 410, 0.3, 0.09); window.setTimeout(() => tone(audio.context, audio.master, 310, 0.38, 0.08), 220); }
    }
    previousPortal.current = portalState;

    if (!moving || muted) return undefined;
    const clacks = window.setInterval(() => tone(audio.context, audio.master, 150, 0.055, 0.025), 720);
    return () => window.clearInterval(clacks);
  }, [muted, portalState, stage, weather]);

  useEffect(() => {
    if (hornTrigger === previousHorn.current) return;
    previousHorn.current = hornTrigger;
    if (!muted && graph.current) horn(graph.current.context, graph.current.master);
  }, [hornTrigger, muted]);

  useEffect(() => () => {
    const audio = graph.current;
    graph.current = null;
    audio?.sources.forEach(source => { try { source.stop(); } catch { /* already stopped */ } });
    if (audio) void audio.context.close().catch(() => undefined);
  }, []);

  return null;
}
