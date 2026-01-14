// lib/core/logic/motion.ts

import { SHAKE_THRESHOLD } from '@/lib/core/constants';

/**
 * Vector 3D (X, Y, Z)
 */
export type Vector3 = {
  x: number;
  y: number;
  z: number;
};

/**
 * Calcula la magnitud euclidiana del vector
 * Fórmula: √(x² + y² + z²)
 */
export const calculateMagnitude = (data: Vector3): number => {
  return Math.sqrt(data.x ** 2 + data.y ** 2 + data.z ** 2);
};

/**
 * Detecta si el dispositivo está siendo agitado
 */
export const isShaking = (data: Vector3): boolean => {
  const magnitude = calculateMagnitude(data);
  return magnitude > SHAKE_THRESHOLD;
};

/**
 * Genera un número aleatorio entre 1 y 6
 */
export const rollDice = (): number => {
  return Math.floor(Math.random() * 6) + 1;
};