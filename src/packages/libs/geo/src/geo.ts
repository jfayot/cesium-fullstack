const Minute2Degree = 1 / 60;
const Second2Degree = 1 / 3600;

export function dmsToDd(degrees: number, minutes = 0, seconds = 0): number {
  return degrees + minutes * Minute2Degree + seconds * Second2Degree;
}
