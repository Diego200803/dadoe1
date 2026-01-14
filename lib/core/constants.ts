// lib/core/constants.ts

/**
 * Umbral de agitación (threshold)
 * Ajusta este valor si es muy sensible o poco sensible:
 * - 1.5 = Muy sensible
 * - 1.78 = Equilibrado (recomendado)
 * - 2.0 = Menos sensible
 */
export const SHAKE_THRESHOLD = 1.78;

/**
 * Intervalo de actualización del acelerómetro (ms)
 */
export const ACCELEROMETER_UPDATE_INTERVAL = 100;

/**
 * Tiempo de espera entre lanzamientos (ms)
 */
export const SHAKE_COOLDOWN = 1000;

/**
 * Colores del dado
 */
export const DICE_COLORS = {
  background: '#1e293b',
  dot: '#f8fafc',
  shadow: 'rgba(0, 0, 0, 0.3)',
};