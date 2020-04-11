import {
  toDays,
  sCasesTime,
  getBeds,
  getInfectedImpact,
  iBTime
} from './utils';

// import { data as data2 } from './test';

const covid19ImpactEstimator = (data) => {
  const originalData = { ...data };
  const impact = {};
  const severeImpact = {};

  // configs
  const {
    reportedCases, timeToElapse, periodType, totalHospitalBeds
  } = data;
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

  // severeCasesByRequestedTime
  impact.severeCasesByRequestedTime = sCasesTime(
    impact.infectionsByRequestedTime
  );
  severeImpact.severeCasesByRequestedTime = sCasesTime(
    severeImpact.infectionsByRequestedTime
  );

  // hospitalBedsByRequestedTime
  impact.hospitalBedsByRequestedTime = getBeds(
    impact.severeCasesByRequestedTime,
    totalHospitalBeds
  );
  severeImpact.hospitalBedsByRequestedTime = getBeds(
    severeImpact.severeCasesByRequestedTime,
    totalHospitalBeds
  );

  return {
    data: originalData,
    impact,
    severeImpact
  };
};

// console.log(covid19ImpactEstimator(data2));

export default covid19ImpactEstimator;
