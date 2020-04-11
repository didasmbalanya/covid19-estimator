const getInfectedImpact = (reportedCases, caseValue) => {
  parseInt(reportedCases * caseValue, 10);
};

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

const covid19ImpactEstimator = (data) => {
  const originalData = { ...data };

  // configs
  const { reportedCases, timeToElapse, periodType } = data;
  const days = toDays(timeToElapse, periodType);

  // currentlyInfected
  const currentlyInfectedImpact = getInfectedImpact(reportedCases, 10);
  const currentlyInfectedSevere = getInfectedImpact(reportedCases, 50);

  return {
    data: originalData,
    impact: {
      currentlyInfected: currentlyInfectedImpact,
      infectionsByRequestedTime: iBTime(currentlyInfectedImpact, days)
    },
    severeImpact: {
      currentlyInfected: currentlyInfectedSevere,
      infectionsByRequestedTime: iBTime(currentlyInfectedSevere, days)
    }
  };
};

export default covid19ImpactEstimator;
