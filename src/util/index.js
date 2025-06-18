export const moneyRanges = [10, 50, 100, 200, 500, 1000];

export function getTotalXPForLevel(level, base = 100, exponent = 2.5) {
  return Math.floor(base * Math.pow(level, exponent));
}
