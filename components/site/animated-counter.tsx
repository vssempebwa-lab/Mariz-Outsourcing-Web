'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type ParsedValue = {
  prefix: string;
  target: number;
  decimals: number;
  suffix: string;
};

function parseValue(value: string): ParsedValue {
  const ratio = value.match(/^(\d+)\/(\d+)$/);
  if (ratio) {
    return { prefix: '', target: Number(ratio[1]), decimals: 0, suffix: `/${ratio[2]}` };
  }

  const match = value.match(/^([^\d.]*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) {
    return { prefix: '', target: 0, decimals: 0, suffix: value };
  }

  const [, prefix, number, suffix] = match;
  const decimals = number.includes('.') ? number.split('.')[1].length : 0;
  return { prefix, target: Number(number), decimals, suffix };
}

function formatValue({ prefix, decimals, suffix }: ParsedValue, value: number) {
  return `${prefix}${value.toFixed(decimals)}${suffix}`;
}

type AnimatedCounterProps = {
  value: string;
  duration?: number;
  className?: string;
};

export function AnimatedCounter({ value, duration = 2200, className }: AnimatedCounterProps) {
  const parsed = useMemo(() => parseValue(value), [value]);
  const [display, setDisplay] = useState(() => formatValue(parseValue(value), 0));
  const elementRef = useRef<HTMLSpanElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const finalValue = formatValue(parsed, parsed.target);
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion) {
      setDisplay(finalValue);
      return;
    }

    const animate = () => {
      if (startedRef.current) return;
      startedRef.current = true;

      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(formatValue(parsed, parsed.target * eased));

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(step);
        } else {
          setDisplay(finalValue);
        }
      };

      frameRef.current = requestAnimationFrame(step);
    };

    if (!('IntersectionObserver' in window)) {
      animate();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(element.closest('[data-count-group]') ?? element);

    return () => {
      observer.disconnect();
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration, parsed]);

  return (
    <span ref={elementRef} aria-label={value} className={cn('inline-block tabular-nums', className)}>
      {display}
    </span>
  );
}
