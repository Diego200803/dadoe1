// lib/hooks/useShakeDetection.ts

import { useEffect, useRef } from 'react';
import { useAccelerometer } from '@/lib/modules/sensors/accelerometer/useAccelerometer';
import { isShaking } from '@/lib/core/logic/motion';
import { SHAKE_COOLDOWN } from '@/lib/core/constants';

type ShakeCallback = () => void;

/**
 * Hook que detecta agitación y ejecuta un callback
 */
export const useShakeDetection = (
  onShake: ShakeCallback,
  enabled: boolean = true
) => {
  const { data, isAvailable } = useAccelerometer();
  const lastShakeTime = useRef<number>(0);

  useEffect(() => {
    if (!enabled || !isAvailable) return;

    const now = Date.now();

    // Verificar cooldown
    if (now - lastShakeTime.current < SHAKE_COOLDOWN) {
      return;
    }

    // Detectar agitación
    if (isShaking(data)) {
      lastShakeTime.current = now;
      onShake();
    }
  }, [data, enabled, isAvailable, onShake]);

  return { isAvailable };
};