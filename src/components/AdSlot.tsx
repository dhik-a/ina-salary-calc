/// <reference types="vite/client" />

import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

interface AdSlotProps {
  slot: string;
  format?: string;
  layout?: string;
  className?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
}

const CLIENT = import.meta.env.VITE_ADSENSE_CLIENT || '';

export function AdSlot({ slot, format = 'auto', layout, className, responsive = true, style }: AdSlotProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    if (!CLIENT) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // adsbygoogle not loaded yet (adblock, network) — fail silent
    }
  }, []);

  if (!CLIENT) return null;

  return (
    <ins
      className={`adsbygoogle block ${className ?? ''}`}
      style={{ display: 'block', ...style }}
      data-ad-client={CLIENT}
      data-ad-slot={slot}
      data-ad-format={format}
      {...(layout ? { 'data-ad-layout': layout } : {})}
      {...(responsive ? { 'data-full-width-responsive': 'true' } : {})}
    />
  );
}
