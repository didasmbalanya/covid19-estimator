const getInfectedImpact = (rc, caseValue) => parseInt(rc * caseValue, 10);

// convert period to days
const toDays = (period, periodType) => {
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
const iBTime = (cInfected, days) => cInfected * 2 ** parseInt(days / 3, 10);

// get severe cases for the reqeusted time
// const sCasesTime = (infections) => infections * 0.15;

const covid19ImpactEstimator = (data) => {
  const originalData = { ...data };
  const impact = {};
  const severeImpact = {};

  // configs
  const { reportedCases, timeToElapse, periodType } = data;
  const days = toDays(timeToElapse, periodType);

  // currentlyInfected
  impact.currentlyInfected = getInfectedImpact(reportedCases, 10);
  severeImpact.currentlyInfected = getInfectedImpact(reportedCases, 50);

  // //infected by time requested
  impact.infectionsByRequestedTime = iBTime(impact.currentlyInfected, days);
  severeImpact.infectionsByRequestedTime = iBTime(
    severeImpact.currentlyInfected,
    days
  );

  return {
    data: originalData,
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
