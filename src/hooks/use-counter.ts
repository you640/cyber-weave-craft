import { useEffect, useRef, useState } from "react";

interface UseCounterOptions {
  /** Base value at midnight */
  baseAtMidnight?: number;
  /** Average increments per second across the day */
  ratePerSecond?: number;
  /** Min ms between ticks */
  minTickMs?: number;
  /** Max ms between ticks */
  maxTickMs?: number;
  /** Min increment per tick */
  minStep?: number;
  /** Max increment per tick */
  maxStep?: number;
  /** Tween duration ms for smooth count-up */
  tweenMs?: number;
}

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

/**
 * Deterministic-ish counter that starts at a value derived from time-since-midnight
 * and ticks upward smoothly. Looks like a real "blocked attacks today" counter.
 */
export function useCounter({
  baseAtMidnight = 0,
  ratePerSecond = 0.6,
  minTickMs = 900,
  maxTickMs = 2800,
  minStep = 1,
  maxStep = 5,
  tweenMs = 400,
}: UseCounterOptions = {}) {
  const computeStart = () => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(0, 0, 0, 0);
    const elapsedSec = (now.getTime() - midnight.getTime()) / 1000;
    return Math.floor(baseAtMidnight + elapsedSec * ratePerSecond);
  };

  const [displayed, setDisplayed] = useState(computeStart);
  const targetRef = useRef(displayed);
  const rafRef = useRef<number | null>(null);
  const tickTimerRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const animateTo = (next: number) => {
      const start = targetRef.current;
      const startTime = performance.now();
      const delta = next - start;
      targetRef.current = next;

      const step = (now: number) => {
        if (cancelled) return;
        const t = Math.min(1, (now - startTime) / tweenMs);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplayed(Math.round(start + delta * eased));
        if (t < 1) {
          rafRef.current = requestAnimationFrame(step);
        }
      };

      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(step);
    };

    const scheduleTick = () => {
      const wait = rand(minTickMs, maxTickMs);
      tickTimerRef.current = window.setTimeout(() => {
        const inc = Math.floor(rand(minStep, maxStep + 1));
        animateTo(targetRef.current + inc);
        scheduleTick();
      }, wait);
    };

    targetRef.current = displayed;
    scheduleTick();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (tickTimerRef.current) clearTimeout(tickTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return displayed;
}
