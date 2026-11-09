import type { Outcome } from './scoring';

const DEG = Math.PI / 180;

/**
 * Converts DeviceOrientation beta/gamma into a single "screen pitch" in degrees:
 * +90 = screen facing the ceiling, 0 = screen vertical (phone on forehead), -90 = facing the floor.
 * Uses the vertical component of the screen normal, cos(beta)*cos(gamma), which is continuous in
 * both portrait and landscape and avoids the gamma ±90° flip that happens in landscape.
 */
export function screenPitch(beta: number, gamma: number): number {
  const up = Math.cos(beta * DEG) * Math.cos(gamma * DEG);
  return Math.asin(Math.max(-1, Math.min(1, up))) / DEG;
}

export interface TiltOptions {
  threshold: number; // degrees from neutral to trigger
  neutralZone: number; // must come back within this many degrees to re-arm
  cooldownMs: number; // minimum time between triggers
}

export const DEFAULT_TILT: TiltOptions = { threshold: 32, neutralZone: 14, cooldownMs: 700 };

export class TiltDetector {
  neutral = 0;
  private armed = true;
  private sawNeutral = true;
  private lastTrigger = -Infinity;
  private samples: number[] = [];
  opts: TiltOptions;
  constructor(opts: TiltOptions = DEFAULT_TILT) { this.opts = opts; }

  /** Collect samples for calibration. */
  addCalibrationSample(pitch: number) { this.samples.push(pitch); if (this.samples.length > 60) this.samples.shift(); }

  /** Finish calibration using the median of collected samples. Returns the neutral angle. */
  finishCalibration(): number {
    if (this.samples.length) {
      const s = this.samples.slice().sort((a, b) => a - b);
      this.neutral = s[Math.floor(s.length / 2)];
    }
    this.samples = [];
    this.armed = true;
    return this.neutral;
  }

  reset() { this.armed = true; this.sawNeutral = true; this.lastTrigger = -Infinity; }

  /** Feed a pitch sample. Returns an outcome once per tilt gesture, otherwise null. */
  feed(pitch: number, nowMs: number): Outcome | null {
    const d = pitch - this.neutral;
    if (!this.armed) {
      // Must come back to neutral (at any point) AND wait out the cooldown before re-arming.
      if (Math.abs(d) <= this.opts.neutralZone) this.sawNeutral = true;
      if (!this.sawNeutral || nowMs - this.lastTrigger < this.opts.cooldownMs) return null;
      this.armed = true;
    }
    if (nowMs - this.lastTrigger < this.opts.cooldownMs) return null;
    if (d >= this.opts.threshold) return this.trigger('correct', nowMs);
    if (d <= -this.opts.threshold) return this.trigger('pass', nowMs);
    return null;
  }

  private trigger(o: Outcome, now: number): Outcome {
    this.armed = false;
    this.sawNeutral = false;
    this.lastTrigger = now;
    return o;
  }
}

type IOSOrientation = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<'granted' | 'denied'> };

export const motionSupported = () => typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;
export const needsMotionPermission = () =>
  motionSupported() && typeof (DeviceOrientationEvent as IOSOrientation).requestPermission === 'function';

/** Must be called from a user tap on iOS. */
export async function requestMotionPermission(): Promise<boolean> {
  if (!motionSupported()) return false;
  const req = (DeviceOrientationEvent as IOSOrientation).requestPermission;
  if (typeof req !== 'function') return true;
  try { return (await req.call(DeviceOrientationEvent)) === 'granted'; } catch { return false; }
}
