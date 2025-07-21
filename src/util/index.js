export const moneyRanges = [10, 50, 100, 200, 500, 1000];

export function getTotalXPForLevel(level, base = 100, exponent = 1.05) {
  return Math.floor(base * Math.pow(level, exponent));
}

export function calculateEXPAndLevel(moneyAmount) {
  let level = 1;
  let eXPAmount = 0;
  let tempMoneyAmount = moneyAmount;

  eXPAmount = getTotalXPForLevel(level);

  while (tempMoneyAmount > eXPAmount) {
    tempMoneyAmount = tempMoneyAmount - eXPAmount;

    level++;
    eXPAmount = getTotalXPForLevel(level);
  }

  eXPAmount = tempMoneyAmount;

  return { eXPAmountCalculate: eXPAmount, eXPLevelCalculate: level };
}
