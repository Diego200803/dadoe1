// lib/modules/sensors/accelerometer/useAccelerometer.ts

import { useState, useEffect } from 'react';
import { AccelerometerService } from './accelerometer.service';
import type { Vector3 } from '@/lib/core/logic/motion';

/**
 * Hook para acceder al acelerómetro
 */
export const useAccelerometer = () => {
  const [data, setData] = useState<Vector3>({ x: 0, y: 0, z: 0 });
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  useEffect(() => {
    let subscription: any = null;

    const init = async () => {
      const available = await AccelerometerService.isAvailable();
      setIsAvailable(available);

      if (available) {
        subscription = AccelerometerService.subscribe((newData) => {
          setData(newData);
        });
      }
    };

    init();

    // Cleanup al desmontar
    return () => {
      AccelerometerService.unsubscribe(subscription);
    };
  }, []);

  return { data, isAvailable };
};