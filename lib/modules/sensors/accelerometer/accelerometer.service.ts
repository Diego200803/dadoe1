// lib/modules/sensors/accelerometer/accelerometer.service.ts

import { Accelerometer } from 'expo-sensors';
import { ACCELEROMETER_UPDATE_INTERVAL } from '@/lib/core/constants';
import type { Vector3 } from '@/lib/core/logic/motion';

type AccelerometerCallback = (data: Vector3) => void;
type AccelerometerSubscription = { remove: () => void };

/**
 * Servicio para comunicarse con el acelerómetro del dispositivo
 */
export const AccelerometerService = {
  /**
   * Inicia la escucha del acelerómetro
   */
  subscribe: (callback: AccelerometerCallback): AccelerometerSubscription => {
    Accelerometer.setUpdateInterval(ACCELEROMETER_UPDATE_INTERVAL);
    return Accelerometer.addListener(callback);
  },

  /**
   * Detiene la escucha (importante para evitar memory leaks)
   */
  unsubscribe: (subscription: AccelerometerSubscription | null): void => {
    if (subscription) {
      subscription.remove();
    }
  },

  /**
   * Verifica si el acelerómetro está disponible
   */
  isAvailable: async (): Promise<boolean> => {
    try {
      return await Accelerometer.isAvailableAsync();
    } catch (error) {
      console.error('Error checking accelerometer:', error);
      return false;
    }
  },
};