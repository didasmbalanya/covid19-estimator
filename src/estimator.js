import {
  toDays,
  sCasesTime,
  getBeds,
  getInfectedImpact,
  iBTime,
  casesICU,
  casesVent,
  dailyLoss
} from './utils';

const covid19ImpactEstimator = (data) => {
  const originalData = { ...data };
  const impact = {};
  const severeImpact = {};

  // configs
  const {
    reportedCases,
    timeToElapse,
    periodType,
    totalHospitalBeds,
    region: { avgDailyIncomeInUSD, avgDailyIncomePopulation }
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

  // casesForICUByRequestedTime
  impact.casesForICUByRequestedTime = casesICU(
    impact.infectionsByRequestedTime
  );
  severeImpact.casesForICUByRequestedTime = casesICU(
    severeImpact.infectionsByRequestedTime
  );

  // casesForVentilatorsByRequestedTime
  impact.casesForVentilatorsByRequestedTime = casesVent(
    impact.infectionsByRequestedTime
  );
  severeImpact.casesForVentilatorsByRequestedTime = casesVent(
    severeImpact.infectionsByRequestedTime
  );

  // dollarsInFlight
  impact.dollarsInFlight = dailyLoss(
    impact.infectionsByRequestedTime,
    avgDailyIncomeInUSD,
    avgDailyIncomePopulation,
    days
  );
  severeImpact.dollarsInFlight = dailyLoss(
    severeImpact.infectionsByRequestedTime,
    avgDailyIncomeInUSD,
    avgDailyIncomePopulation,
    days
  );

  return {
    data: originalData,
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
