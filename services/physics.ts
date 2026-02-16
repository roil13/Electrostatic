
import { EPSILON_0, G } from '../constants';
import { SimulationParams, SimulationResult } from '../types';

/**
 * Electric field of an infinite uniformly charged sheet: E = sigma / (2 * epsilon_0)
 * Note: If the sheet is inside a conductor or we consider just one side, it might differ,
 * but the standard "large sheet" approximation in physics problems is E = sigma / (2 * eps0).
 */
export const calculateResults = (params: SimulationParams, charge: number): SimulationResult => {
  const electricField = params.sigma / (2 * EPSILON_0);
  const forceElectric = Math.abs(charge * electricField);
  const forceGravity = params.m1 * G;
  
  // tan(alpha) = Fe / Fg
  const tanAlpha = forceElectric / forceGravity;
  const alpha = Math.atan(tanAlpha);
  const forceTension = Math.sqrt(forceElectric ** 2 + forceGravity ** 2);

  return {
    alpha,
    tanAlpha,
    forceElectric,
    forceGravity,
    forceTension,
  };
};

export const formatScientific = (num: number): string => {
  return num.toExponential(2);
};
