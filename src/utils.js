export const getInfectedImpact = (rc, caseValue) => parseInt(rc * caseValue, 10);

// convert period to days
export const toDays = (period, periodType) => {
  const pt = periodType.toLowerCase();
  if (pt === 'months' || pt === 'month') {
    return period * 30;
  }
  if (pt === 'weeks' || pt === 'week') {
    return period * 7;
  }
  return period;
};

// calc for infectionsByRequestedTime
export const iBTime = (cInfected, days) => cInfected * 2 ** parseInt(days / 3, 10);

// get severe cases for the reqeusted time
export const sCasesTime = (infections) => parseInt(infections * 0.15, 10);

export const getBeds = (cases, total) => parseInt((0.35 * total) - cases, 10);

export const casesICU = (infected) => Math.trunc(infected * 0.05);

export const casesVent = (infected) => Math.trunc(infected * 0.02);

export const dailyLoss = (
  infected, inc, incomePop, days
) => Math.trunc((infected * incomePop * inc) / days);
