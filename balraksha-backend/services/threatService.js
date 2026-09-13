const calculateRiskLevel = (score) => {
  if (score >= 90) {
    return "CRITICAL";
  }

  if (score >= 70) {
    return "HIGH";
  }

  if (score >= 40) {
    return "MEDIUM";
  }

  return "LOW";
};

const analyzeThreat = ({ riskScore, signals = [] }) => {
  const riskLevel = calculateRiskLevel(riskScore);

  return {
    riskScore,
    riskLevel,
    signals,
  };
};

module.exports = {
  calculateRiskLevel,
  analyzeThreat,
};
