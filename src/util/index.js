export const moneyRanges = [
  10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000,
];

export function getTotalXPForLevel(level, exponent, base = 100) {
  return Math.floor(base * Math.pow(level, exponent));
}

export function calculateEXPAndLevel(moneyAmount, exponent) {
  let level = 1;
  let eXPAmount = 0;
  let tempMoneyAmount = moneyAmount;

  eXPAmount = getTotalXPForLevel(level, exponent);

  while (tempMoneyAmount > eXPAmount) {
    tempMoneyAmount = tempMoneyAmount - eXPAmount;

    level++;
    eXPAmount = getTotalXPForLevel(level, exponent);
  }

  eXPAmount = tempMoneyAmount;

  return { eXPAmountCalculate: eXPAmount, eXPLevelCalculate: level };
}
