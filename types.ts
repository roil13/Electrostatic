
export interface SimulationParams {
  sigma: number; // Surface charge density in C/m^2
  q1: number;    // Charge of first ball in C
  m1: number;    // Mass of first ball in kg
  L: number;     // Length of string in m
  showSecondBall: boolean;
  q2: number;    // Charge of second ball in C
}

export interface SimulationResult {
  alpha: number;      // Deflection angle in radians
  tanAlpha: number;   // Tan of deflection angle
  forceElectric: number; // Electric force in N
  forceGravity: number;  // Gravity force in N
  forceTension: number;  // Tension force in N
}
