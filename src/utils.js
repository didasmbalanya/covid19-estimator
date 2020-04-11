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

export const getBeds = (cases, total) => (parseInt(0.35 * total, 10) - cases) + 1;

export const casesICU = (infected) => infected * 0.05;

export const casesVent = (infected) => infected * 0.02;

export const dailyLoss = (
  infected, inc, incomePop
) => parseInt((infected * incomePop * inc) / 30, 10);
