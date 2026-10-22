// Original scalar analytic solver. A target is constant within each step.
// Coordinates may be px, points, dp or normalized units; velocity is units/s.
export function springStep(state, target, dt, config) {
  const {x, v} = state;
  const {omega: w, zeta: z} = config;
  if (![x, v, target, dt, w, z].every(Number.isFinite) || dt < 0 || w <= 0 || z < 0) {
    throw new RangeError('Finite state; dt >= 0, omega > 0 and zeta >= 0 required');
  }
  if (dt === 0) return {x, v};
  const y = x - target;
  let nextY, nextV;
  if (Math.abs(z - 1) < 1e-7) {
    const e = Math.exp(-w * dt), b = v + w * y;
    nextY = (y + b * dt) * e;
    nextV = (v - w * b * dt) * e;
  } else if (z < 1) {
    const a = z * w, b = w * Math.sqrt(1 - z * z);
    const c = Math.cos(b * dt), s = Math.sin(b * dt), e = Math.exp(-a * dt);
    nextY = e * (y * c + (v + a * y) * s / b);
    nextV = e * (v * c - (a * v + w * w * y) * s / b);
  } else {
    const h = Math.sqrt(z * z - 1);
    const r1 = -w / (z + h), r2 = -w * (z + h);
    const a = (v - r2 * y) / (r1 - r2), b = y - a;
    const e1 = Math.exp(r1 * dt), e2 = Math.exp(r2 * dt);
    nextY = a * e1 + b * e2;
    nextV = r1 * a * e1 + r2 * b * e2;
  }
  return {x: target + nextY, v: nextV};
}

export function exponentialFollow(x, target, rate, dt) {
  if (![x, target, rate, dt].every(Number.isFinite) || rate < 0 || dt < 0) {
    throw new RangeError('Finite inputs; rate and dt must be nonnegative');
  }
  return x + (target - x) * -Math.expm1(-rate * dt);
}

export function isSettled(state, target, positionTolerance = 0.0001, velocityTolerance = 0.001) {
  return Math.abs(state.x - target) <= positionTolerance && Math.abs(state.v) <= velocityTolerance;
}
