import { 
  VehicleInputs, 
  ValuationResult, 
  DepreciationPoint, 
  ShapAttribution, 
  TcoBreakdown, 
  StateArbitrageOpportunity,
  ComparisonVehicle,
  ExteriorDamageReport
} from '../types/car';
import { CAR_DATABASE } from '../data/carDatabase';
import { RTO_LIST } from '../data/rtoDatabase';

const CURRENT_YEAR = 2026;

export function formatIndianCurrency(num: number): string {
  const rounded = Math.round(num);
  const str = rounded.toString();
  if (str.length <= 3) return '₹' + str;
  const lastThree = str.substring(str.length - 3);
  const otherNumbers = str.substring(0, str.length - 3);
  const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return '₹' + formattedOther + ',' + lastThree;
}

export function formatLakh(inr: number): string {
  const lakhs = inr / 100000;
  return `₹${lakhs.toFixed(2)} Lakh`;
}

export function calculateValuation(inputs: VehicleInputs): ValuationResult {
  // 1. Locate vehicle data in catalogue
  const carData = CAR_DATABASE.find(c => c.make === inputs.make && c.model === inputs.model);
  const generation = carData?.generations.find(g => g.name === inputs.generation) 
    || carData?.generations[0];
  
  const spec = generation?.spec || {
    displacementCc: 1498,
    peakPowerBhp: 115,
    peakTorqueNm: 150,
    araiFuelEconomy: 17.5,
    realWorldFuelEconomy: 13.5,
    bootCapacityLiters: 400,
    drivetrain: 'FWD' as const,
    safetyRatingStars: 4,
    safetyAgency: 'Global NCAP' as const,
    groundClearanceMm: 180,
    originalExShowroomLakh: 13.0,
    segment: 'Mid-size SUV' as const,
  };

  const brandRank = generation?.brandResaleRank || 2;
  const originalMSRP = spec.originalExShowroomLakh * 100000;

  // 2. Age & Depreciation
  const carAge = Math.max(0, CURRENT_YEAR - inputs.registrationYear);
  
  // Base exponential depreciation calibrated with Spinny/Cars24 index:
  // Yr 1: ~16%, Yr 2: ~26%, Yr 3: ~35%, Yr 4: ~43%, Yr 5: ~50%, Yr 7: ~62%, Yr 10: ~74%
  let ageRetention = Math.exp(-0.135 * carAge);
  if (carAge === 0) ageRetention = 0.94;
  else if (carAge === 1) ageRetention = 0.84;
  else if (carAge === 2) ageRetention = 0.74;
  else if (carAge === 3) ageRetention = 0.65;
  else if (carAge === 4) ageRetention = 0.57;
  else if (carAge === 5) ageRetention = 0.50;

  // Brand resale adjustment: Rank 1 (Maruti, Toyota) gets +7%, Rank 4 gets -5%
  const brandFactor = 1.0 + (3 - brandRank) * 0.035;

  // 3. Odometer Penalty / Bonus (Unconstrained wear impact)
  const kmDriven = typeof inputs.kilometersDriven === 'number' && !isNaN(inputs.kilometersDriven) 
    ? inputs.kilometersDriven 
    : 35000;
  // Baseline expectation: 11,000 km/year
  const expectedKm = carAge * 11000;
  const kmDelta = kmDriven - expectedKm;
  // Direct unconstrained wear impact (~₹2.2 per excess or lower km)
  const kmImpactInr = -kmDelta * 2.2;

  // 4. RTO & Regional Road Tax Impact
  const rtoStr = inputs.rtoLocation || 'DL-01 (North Delhi / Mall Road)';
  const rtoObj = RTO_LIST.find(r => rtoStr.includes(r.code)) || RTO_LIST[0];
  let rtoMultiplier = rtoObj.roadTaxMultiplier;

  // Delhi-NCR NGT Diesel 10-Year Mandate:
  // If registered in NCR (DL/HR/UP) and is Diesel:
  let ncrDieselPenalty = 0;
  if (rtoObj.isNcrRegion && inputs.fuelType === 'Diesel') {
    if (carAge >= 8) {
      ncrDieselPenalty = originalMSRP * 0.35; // NGT scrappage cliff
    } else if (carAge >= 5) {
      ncrDieselPenalty = originalMSRP * 0.18;
    } else {
      ncrDieselPenalty = originalMSRP * 0.08;
    }
  }

  // 5. Ownership Count Penalty
  let ownerFactor = 1.0;
  if (inputs.owners === '2nd') ownerFactor = 0.92;
  else if (inputs.owners === '3rd') ownerFactor = 0.82;
  else if (inputs.owners === '4th+') ownerFactor = 0.68;

  // 6. Service & History Adjustments
  let serviceBonus = 0;
  if (inputs.serviceHistory === 'Authorized Dealer Full History') serviceBonus = 35000;
  else if (inputs.serviceHistory === 'Independent Garage') serviceBonus = -25000;

  let accidentalDiscount = 0;
  if (inputs.accidentalHistory === 'Minor Bodywork') accidentalDiscount = -35000;
  else if (inputs.accidentalHistory === 'Structural Repairs') accidentalDiscount = -(originalMSRP * 0.22);

  let insuranceBonus = 0;
  if (inputs.insuranceStatus === 'Zero Depreciation') insuranceBonus = 22000;
  else if (inputs.insuranceStatus === 'Third-Party') insuranceBonus = -12000;
  else if (inputs.insuranceStatus === 'Expired') insuranceBonus = -25000;

  // Tire & Battery Health Delta
  const tirePercent = typeof inputs.tireConditionPercent === 'number' && !isNaN(inputs.tireConditionPercent) 
    ? inputs.tireConditionPercent 
    : 75;
  const batteryPercent = typeof inputs.batteryHealthPercent === 'number' && !isNaN(inputs.batteryHealthPercent) 
    ? inputs.batteryHealthPercent 
    : 85;
  const tireAdjustment = ((tirePercent - 50) / 50) * 18000;
  const batteryAdjustment = ((batteryPercent - 70) / 30) * 6000;

  // Transmission & Fuel Type Market Demand Modifier
  let powertrainBonus = 0;
  if (inputs.transmission === 'Torque Converter AT' || inputs.transmission === 'DCT/DSG' || inputs.transmission === 'CVT') {
    powertrainBonus += 25000; // Rising AT demand in urban India
  }
  if (inputs.fuelType === 'Strong Hybrid') {
    powertrainBonus += 60000; // Strong hybrid premium
  } else if (inputs.fuelType === 'CNG' && carAge <= 4) {
    powertrainBonus += 20000; // High mileage commercial/city demand
  }

  // 7. Exterior Damage & Maintenance Analysis
  const defaultDamageReport: ExteriorDamageReport = {
    severity: 'None',
    affectedPanels: [],
    scratchDepth: 'None',
    repaintedPanelsCount: 0,
    estimatedRepairCostInr: 0,
    damageDeductionInr: 0,
    maintenanceConditionText: '+ ₹12,000 for excellent showroom exterior condition',
    maintenanceConditionDeltaInr: 12000,
  };

  const damage = inputs.damageReport || defaultDamageReport;

  let exteriorDeltaInr = 0;
  let exteriorDeltaText = '';

  if (damage.severity === 'None') {
    // Showroom gloss condition bonus (e.g. + ₹12,000 to + ₹16,000)
    exteriorDeltaInr = Math.round(originalMSRP * 0.01 + 6000);
    exteriorDeltaText = `+ ₹${exteriorDeltaInr.toLocaleString('en-IN')} for excellent showroom exterior condition (flawless original paint & zero panel damage)`;
  } else {
    // Damage severity penalties
    let baseSeverityDeduction = 0;
    if (damage.severity === 'Minor') baseSeverityDeduction = 8500;
    else if (damage.severity === 'Moderate') baseSeverityDeduction = 22000;
    else if (damage.severity === 'Severe') baseSeverityDeduction = 48000;
    else if (damage.severity === 'Critical') baseSeverityDeduction = 95000;

    // Panel multiplier: ~ ₹4,200 per affected panel beyond the first
    const panelCount = Math.max(1, damage.affectedPanels.length);
    const panelDeduction = (panelCount - 1) * 4200;

    // Scratch depth penalty
    let scratchDeduction = 0;
    if (damage.scratchDepth === 'Surface Swirls') scratchDeduction = 3000;
    else if (damage.scratchDepth === 'Clearcoat Cut') scratchDeduction = 7500;
    else if (damage.scratchDepth === 'Deep (Down to Primer)') scratchDeduction = 15000;

    // Repainted panel penalty (~₹4,000 per panel)
    const repaintDeduction = (damage.repaintedPanelsCount || 0) * 4000;

    const totalDamageCost = baseSeverityDeduction + panelDeduction + scratchDeduction + repaintDeduction;
    exteriorDeltaInr = -totalDamageCost;

    const panelsDesc = damage.affectedPanels.length > 0 
      ? `(${damage.affectedPanels.slice(0, 2).join(', ')}${damage.affectedPanels.length > 2 ? ` +${damage.affectedPanels.length - 2} more` : ''})`
      : '';
    exteriorDeltaText = `- ₹${Math.abs(exteriorDeltaInr).toLocaleString('en-IN')} for ${damage.severity.toLowerCase()} exterior damage ${panelsDesc} and paint repair`;
  }

  // Base Depreciated Valuation
  let baseVal = originalMSRP * ageRetention * brandFactor * ownerFactor * rtoMultiplier;
  let finalFairInr = baseVal + kmImpactInr + serviceBonus + accidentalDiscount + insuranceBonus + tireAdjustment + batteryAdjustment + powertrainBonus + exteriorDeltaInr - ncrDieselPenalty;

  // Ensure floor value (salvage scrap floor = ₹60,000 minimum)
  finalFairInr = Math.max(60000, Math.round(finalFairInr / 5000) * 5000);
  const fairMarketValueLakh = +(finalFairInr / 100000).toFixed(2);

  // Price Bands:
  // Instant Buyout (Cars24/Spinny instant cash buyout): ~6% to 9% lower
  const instantLower = Math.round((finalFairInr * 0.91) / 5000) * 5000;
  const instantUpper = Math.round((finalFairInr * 0.95) / 5000) * 5000;
  // Peer-to-Peer Direct Buyer Market: ~1% to 5% higher
  const p2pLower = Math.round((finalFairInr * 0.99) / 5000) * 5000;
  const p2pUpper = Math.round((finalFairInr * 1.05) / 5000) * 5000;

  // Market Liquidity & Resale Demand Index
  let liquidity: 'Very High' | 'High' | 'Moderate' | 'Low' = 'High';
  let demandScore = 8;
  let avgDays = 12;

  if (brandRank === 1 && inputs.owners === '1st' && inputs.accidentalHistory === 'Clean') {
    liquidity = 'Very High';
    demandScore = 9.4;
    avgDays = 7;
  } else if (rtoObj.isNcrRegion && inputs.fuelType === 'Diesel' && carAge >= 6) {
    liquidity = 'Low';
    demandScore = 3.5;
    avgDays = 38;
  } else if (inputs.accidentalHistory === 'Structural Repairs' || inputs.owners === '4th+') {
    liquidity = 'Low';
    demandScore = 4.0;
    avgDays = 42;
  } else if (inputs.transmission === 'Manual' && (inputs.make === 'Volkswagen' || inputs.make === 'Skoda')) {
    liquidity = 'Moderate';
    demandScore = 6.2;
    avgDays = 22;
  }

  // Model Remarks & Market Context
  const modelRemarks: string[] = [];
  if (brandRank <= 2) {
    modelRemarks.push(`Top-tier resale brand in India: ${inputs.make} commands higher liquidity and 6–10% lower annual depreciation than segment average.`);
  }
  if (rtoObj.isNcrRegion && inputs.fuelType === 'Diesel') {
    modelRemarks.push(`Delhi-NCR 10-Year NGT Rule Alert: Severe residual impact for Diesel vehicles in ${rtoObj.code}. Out-of-state NOC to Punjab/Rajasthan/UP can unlock higher value.`);
  } else if (rtoObj.stateCode === 'KA') {
    modelRemarks.push(`Karnataka RTO Premium: High state lifetime road tax (up to 18.8%) provides a resilient +14% pre-owned valuation floor.`);
  } else if (rtoObj.stateCode === 'KL') {
    modelRemarks.push(`Kerala Enthusiast Market: Exceptionally strong demand for well-maintained diesel and manual vehicles (+12% realized price).`);
  }
  if (inputs.serviceHistory === 'Authorized Dealer Full History') {
    modelRemarks.push(`Complete authorized service book log provides buyer transparency, commanding an estimated ₹${(serviceBonus).toLocaleString('en-IN')} premium.`);
  }
  if (inputs.accidentalHistory === 'Clean' && inputs.owners === '1st') {
    modelRemarks.push(`First-owner single-hand vehicle with clean unpainted bodywork qualifies for Spinny/Cars24 Prime certification tiers.`);
  }

  // SHAP Value Attribution
  const ageDepreciationAmount = -(originalMSRP - (originalMSRP * ageRetention));
  const shapBreakdown: ShapAttribution[] = [
    {
      featureName: 'Original Ex-Showroom Baseline',
      impactInr: originalMSRP,
      description: `Baseline MSRP when registered new in ${inputs.registrationYear}.`,
    },
    {
      featureName: `Age Depreciation (${carAge} Years)`,
      impactInr: ageDepreciationAmount,
      description: `Market age wear following Indian secondary transaction curves.`,
    },
    {
      featureName: 'Odometer Mileage Wear',
      impactInr: kmImpactInr,
      description: kmDelta > 0 
        ? `${Math.abs(kmDelta).toLocaleString('en-IN')} km above expected median.` 
        : `${Math.abs(kmDelta).toLocaleString('en-IN')} km below median (low mileage bonus).`,
    },
    {
      featureName: `RTO & Regional Multiplier (${rtoObj.code})`,
      impactInr: Math.round(originalMSRP * ageRetention * (rtoMultiplier - 1.0) - ncrDieselPenalty),
      description: rtoObj.isNcrRegion && inputs.fuelType === 'Diesel' 
        ? `NCR NGT 10-Year Diesel penalty applied.` 
        : `${rtoObj.state} regional road tax & demand index factor.`,
    },
    {
      featureName: `Ownership Count (${inputs.owners} Owner)`,
      impactInr: Math.round(originalMSRP * ageRetention * (ownerFactor - 1.0)),
      description: inputs.owners === '1st' ? 'First owner baseline (zero transfer penalty).' : 'Secondary transfer discount.',
    },
    {
      featureName: 'Service History & Maintenance',
      impactInr: serviceBonus,
      description: inputs.serviceHistory,
    },
    {
      featureName: 'Accidental & Body Status',
      impactInr: accidentalDiscount,
      description: inputs.accidentalHistory,
    },
    {
      featureName: 'Insurance & Wear Consumables',
      impactInr: insuranceBonus + tireAdjustment + batteryAdjustment,
      description: `${inputs.insuranceStatus} insurance, ${inputs.tireConditionPercent}% tyres, ${inputs.batteryHealthPercent}% battery.`,
    },
    {
      featureName: 'Exterior Condition & Body Damage',
      impactInr: exteriorDeltaInr,
      description: exteriorDeltaText,
    },
  ];

  // Depreciation & Future Projection Curve (Purchase Year -> Current -> Current + 5)
  const depreciationCurve: DepreciationPoint[] = [];
  const startYear = inputs.registrationYear;
  const endYear = CURRENT_YEAR + 5;

  let prevVal = originalMSRP;
  for (let calYear = startYear; calYear <= endYear; calYear++) {
    const ageAtYear = calYear - startYear;
    const isProjected = calYear > CURRENT_YEAR;
    
    let yearRetention = Math.exp(-0.135 * ageAtYear);
    if (ageAtYear === 0) yearRetention = 1.0;
    else if (ageAtYear === 1) yearRetention = 0.84;
    else if (ageAtYear === 2) yearRetention = 0.74;
    else if (ageAtYear === 3) yearRetention = 0.65;
    else if (ageAtYear === 4) yearRetention = 0.57;
    else if (ageAtYear === 5) yearRetention = 0.50;

    // Additional projected wear
    let projectedPenalty = 0;
    if (inputs.fuelType === 'Diesel' && rtoObj.isNcrRegion && ageAtYear >= 10) {
      projectedPenalty = originalMSRP * 0.45; // Scrap cliff
    }

    let calculatedInr = originalMSRP * yearRetention * brandFactor * rtoMultiplier - projectedPenalty;
    calculatedInr = Math.max(50000, calculatedInr);

    if (calYear === CURRENT_YEAR) {
      calculatedInr = finalFairInr;
    }

    const yoy = prevVal > 0 ? -((prevVal - calculatedInr) / prevVal) * 100 : 0;
    prevVal = calculatedInr;

    // Regulatory / Market Disruption Annotations
    let annotation: DepreciationPoint['annotation'] = undefined;
    if (calYear === 2020) {
      annotation = {
        year: 2020,
        title: 'BS6 Phase 1 Norms Transition',
        impactPercent: -6,
        description: 'Nationwide shift from BS4 to BS6 emission standards increased new car MSRPs, strengthening BS4 used car value retention.',
        type: 'emission',
      };
    } else if (calYear === 2021 || calYear === 2022) {
      annotation = {
        year: calYear,
        title: 'Post-COVID Supply Chain Crunch',
        impactPercent: +8,
        description: 'Semiconductor shortage resulted in 6-12 month new car waiting periods, triggering historic price surges in secondary market.',
        type: 'market',
      };
    } else if (calYear === 2023) {
      annotation = {
        year: 2023,
        title: 'BS6 Phase 2 / RDE Real Driving Norms',
        impactPercent: -5,
        description: 'Mandatory on-board RDE diagnostic sensors led manufacturers to axe small diesel engines, spurring turbo-petrol & EV adoption.',
        type: 'emission',
      };
    } else if (calYear === 2025 || calYear === 2026) {
      annotation = {
        year: calYear,
        title: 'E20 Ethanol Blending Mandate (20% Ethanol)',
        impactPercent: -4,
        description: 'Older pre-2023 petrol engines without E20-compliant fuel lines & injector seals face minor long-term corrosion concerns.',
        type: 'fuel',
      };
    } else if (inputs.fuelType === 'Diesel' && rtoObj.isNcrRegion && ageAtYear >= 9) {
      annotation = {
        year: calYear,
        title: '10-Year Diesel Rule (Delhi-NCR NGT Cliff)',
        impactPercent: -35,
        description: 'National Green Tribunal (NGT) de-registration mandate bans diesel vehicles older than 10 years in the National Capital Region.',
        type: 'regulatory',
      };
    } else if (calYear === CURRENT_YEAR + 3) {
      annotation = {
        year: calYear,
        title: 'Mass EV & Hybrid Parity Influx',
        impactPercent: -7,
        description: 'Sub-₹12 Lakh EV and Strong Hybrid expansion increases pressure on purely conventional ICE vehicle secondary resale.',
        type: 'market',
      };
    }

    depreciationCurve.push({
      year: ageAtYear,
      calendarYear: calYear,
      marketValueLakh: +(calculatedInr / 100000).toFixed(2),
      yoyDepreciationPercent: +yoy.toFixed(1),
      isProjected,
      annotation,
    });
  }

  // 5-Year Total Cost of Ownership (TCO)
  const annualKm = 12000;
  const fuelRate = inputs.fuelType === 'Diesel' ? 90 : inputs.fuelType === 'Petrol' ? 102 : inputs.fuelType === 'CNG' ? 76 : 8; // ₹/unit
  const kmPerUnit = spec.realWorldFuelEconomy;
  const annualFuel = (annualKm / kmPerUnit) * fuelRate;
  const fuelCost5Yr = Math.round(annualFuel * 5);

  const annualPms = brandRank <= 2 ? 8500 : brandRank === 3 ? 11000 : 18000;
  const pmsMaintenanceCost5Yr = Math.round(annualPms * 5);

  const annualInsurance = Math.round(finalFairInr * 0.024);
  const insuranceRenewals5Yr = Math.round(annualInsurance * 4.2); // decreasing IDV

  const wearAndTearCost5Yr = 42000; // 1 set of 4 tyres (~₹28,000) + 1 battery (~₹6,500) + brake pads (~₹7,500)
  const tcoTotal = fuelCost5Yr + pmsMaintenanceCost5Yr + insuranceRenewals5Yr + wearAndTearCost5Yr;

  const tco: TcoBreakdown = {
    fuelCost5Yr,
    pmsMaintenanceCost5Yr,
    insuranceRenewals5Yr,
    wearAndTearCost5Yr,
    total5Yr: tcoTotal,
  };

  // State Arbitrage / Inter-State Resale Opportunity
  const stateArbitrage: StateArbitrageOpportunity[] = [
    {
      stateCode: 'KA',
      stateName: 'Karnataka (Bengaluru)',
      rtoExample: 'KA-03 / KA-01',
      projectedRealizedValueInr: Math.round(finalFairInr * (1.18 / rtoMultiplier)),
      deltaPercentVsCurrent: +(((1.18 / rtoMultiplier) - 1.0) * 100).toFixed(1),
      marketDriverReason: 'Highest road tax bracket in India (up to 18.87%) creates huge demand for pre-registered out-of-state transfers.',
    },
    {
      stateCode: 'KL',
      stateName: 'Kerala (Kochi / Trivandrum)',
      rtoExample: 'KL-07 / KL-01',
      projectedRealizedValueInr: Math.round(finalFairInr * (1.15 / rtoMultiplier)),
      deltaPercentVsCurrent: +(((1.15 / rtoMultiplier) - 1.0) * 100).toFixed(1),
      marketDriverReason: 'Zero 10-year diesel ban and tremendous enthusiast preference for immaculate diesel/manual utility vehicles.',
    },
    {
      stateCode: 'MH',
      stateName: 'Maharashtra (Mumbai / Pune)',
      rtoExample: 'MH-02 / MH-12',
      projectedRealizedValueInr: Math.round(finalFairInr * (1.05 / rtoMultiplier)),
      deltaPercentVsCurrent: +(((1.05 / rtoMultiplier) - 1.0) * 100).toFixed(1),
      marketDriverReason: 'Massive secondary trading liquidity across Mumbai MMR and Pune IT corridor with rapid 7-day turnaround.',
    },
    {
      stateCode: 'DL',
      stateName: 'Delhi-NCR',
      rtoExample: 'DL-01 / HR-26',
      projectedRealizedValueInr: Math.round(finalFairInr * (inputs.fuelType === 'Diesel' ? 0.82 : 0.94 / rtoMultiplier)),
      deltaPercentVsCurrent: +((((inputs.fuelType === 'Diesel' ? 0.82 : 0.94) / rtoMultiplier) - 1.0) * 100).toFixed(1),
      marketDriverReason: inputs.fuelType === 'Diesel' 
        ? 'NGT 10-year diesel scrappage rule depresses local bids; ideal region to export OUT of NCR.' 
        : 'Affordable road tax and high buyer turnover in National Capital Region.',
    },
  ];

  return {
    fairMarketValueInr: finalFairInr,
    fairMarketValueLakh,
    instantBuyoutRangeInr: [instantLower, instantUpper],
    peerToPeerRangeInr: [p2pLower, p2pUpper],
    marketLiquidity: liquidity,
    resaleDemandScore: demandScore,
    avgDaysToSell: avgDays,
    modelRemarks,
    shapBreakdown,
    spec,
    depreciationCurve,
    tco,
    failureRisks: generation?.failureRisks || [],
    stateArbitrage,
    exteriorDeltaText,
    exteriorDeltaInr,
    damageReport: {
      ...damage,
      damageDeductionInr: exteriorDeltaInr < 0 ? Math.abs(exteriorDeltaInr) : 0,
      maintenanceConditionDeltaInr: exteriorDeltaInr,
      maintenanceConditionText: exteriorDeltaText,
    },
  };
}

export function getComparisonAlternatives(currentInputs: VehicleInputs, currentValuation: ValuationResult): ComparisonVehicle[] {
  const currentLakh = currentValuation.fairMarketValueLakh;
  
  // List of segment rivals and budget-equivalent alternatives across the Indian market
  const pool: ComparisonVehicle[] = [
    {
      id: 'rival-creta',
      name: 'Hyundai Creta 1.5 SX',
      make: 'Hyundai',
      model: 'Creta',
      variant: 'SX (Executive)',
      yearBracket: '2021 – 2023',
      fuel: 'Petrol',
      transmission: 'Manual',
      estimatedResaleLakh: +(currentLakh * 1.04).toFixed(2),
      engineOutput: '115 bhp · 144 Nm',
      realWorldMileage: '13.8 km/l',
      runningCostPerKmInr: 7.4,
      safetyScore: '3 Stars (Global NCAP)',
      airbagCount: 6,
      keyFeatures: ['Panoramic Sunroof', '10.25-inch Touchscreen', 'Rear Sunblinds', 'Bose 8-Speaker Audio'],
      resaleRetentionScore3Yr: 76,
      tier1PartsAvailabilityScore: 9.6,
      tier2PartsAvailabilityScore: 9.2,
      rationale: 'Direct segment benchmark with class-leading resale value and immense used-car buyer liquidity.',
      isDirectRival: true,
    },
    {
      id: 'rival-seltos',
      name: 'Kia Seltos HTX',
      make: 'Kia',
      model: 'Seltos',
      variant: 'HTX',
      yearBracket: '2021 – 2023',
      fuel: 'Diesel',
      transmission: 'Torque Converter AT',
      estimatedResaleLakh: +(currentLakh * 1.02).toFixed(2),
      engineOutput: '115 bhp · 250 Nm',
      realWorldMileage: '15.5 km/l',
      runningCostPerKmInr: 5.8,
      safetyScore: '3 Stars (Global NCAP)',
      airbagCount: 6,
      keyFeatures: ['Smart Air Purifier', 'LED Sound Mood Lighting', 'Ventilated Front Seats', 'All-Wheel Disc Brakes'],
      resaleRetentionScore3Yr: 74,
      tier1PartsAvailabilityScore: 9.3,
      tier2PartsAvailabilityScore: 8.8,
      rationale: 'Punchy diesel torque converter powertrain with premium European cabin aesthetic.',
      isDirectRival: true,
    },
    {
      id: 'rival-kushaq',
      name: 'Skoda Kushaq 1.0 TSI Style',
      make: 'Skoda',
      model: 'Kushaq',
      variant: 'Style AT',
      yearBracket: '2021 – 2023',
      fuel: 'Petrol',
      transmission: 'Torque Converter AT',
      estimatedResaleLakh: +(currentLakh * 0.94).toFixed(2),
      engineOutput: '114 bhp · 178 Nm',
      realWorldMileage: '12.4 km/l',
      runningCostPerKmInr: 8.2,
      safetyScore: '5 Stars (Global NCAP)',
      airbagCount: 6,
      keyFeatures: ['5-Star GNCAP Crash Rating', 'Ventilated Seats', 'Subwoofer Audio', 'High-Speed Stability'],
      resaleRetentionScore3Yr: 66,
      tier1PartsAvailabilityScore: 8.4,
      tier2PartsAvailabilityScore: 7.2,
      rationale: 'Enthusiast handling and rock-solid 5-star crash safety, though higher spare parts cost.',
      isDirectRival: true,
    },
    {
      id: 'rival-grand-vitara',
      name: 'Maruti Grand Vitara Zeta',
      make: 'Maruti Suzuki',
      model: 'Grand Vitara',
      variant: 'Zeta Smart Hybrid',
      yearBracket: '2022 – 2024',
      fuel: 'Petrol',
      transmission: 'Manual',
      estimatedResaleLakh: +(currentLakh * 1.08).toFixed(2),
      engineOutput: '102 bhp · 137 Nm',
      realWorldMileage: '16.8 km/l',
      runningCostPerKmInr: 6.1,
      safetyScore: '4 Stars (Tested Platform)',
      airbagCount: 6,
      keyFeatures: ['Smart Hybrid Idle Start-Stop', 'Nexa Black/Burgundy Leatherette', 'Wireless Apple CarPlay', 'Full LED Projectors'],
      resaleRetentionScore3Yr: 81,
      tier1PartsAvailabilityScore: 9.9,
      tier2PartsAvailabilityScore: 9.7,
      rationale: 'Exceptional fuel economy and undisputed countrywide Maruti service reach.',
      isDirectRival: true,
    },
    {
      id: 'budget-city',
      name: 'Honda City 5th Gen ZX CVT',
      make: 'Honda',
      model: 'City',
      variant: 'ZX',
      yearBracket: '2020 – 2022',
      fuel: 'Petrol',
      transmission: 'CVT',
      estimatedResaleLakh: +(currentLakh * 0.98).toFixed(2),
      engineOutput: '119 bhp · 145 Nm',
      realWorldMileage: '13.5 km/l',
      runningCostPerKmInr: 7.5,
      safetyScore: '5 Stars (ASEAN NCAP)',
      airbagCount: 6,
      keyFeatures: ['LaneWatch Blind-Spot Camera', 'Sunroof', '506L Boot Space', 'Ultra-Refined i-VTEC'],
      resaleRetentionScore3Yr: 72,
      tier1PartsAvailabilityScore: 9.2,
      tier2PartsAvailabilityScore: 8.5,
      rationale: 'Budget-Equivalent Sedan Upgrade: Superior ride comfort and enormous luggage boot for the same valuation.',
      isDirectRival: false,
    },
    {
      id: 'budget-baleno',
      name: 'Maruti Baleno Alpha AMT',
      make: 'Maruti Suzuki',
      model: 'Baleno',
      variant: 'Alpha Top Model',
      yearBracket: '2022 – 2024',
      fuel: 'Petrol',
      transmission: 'AMT/AGS',
      estimatedResaleLakh: +(currentLakh * 0.76).toFixed(2),
      engineOutput: '88 bhp · 113 Nm',
      realWorldMileage: '17.2 km/l',
      runningCostPerKmInr: 5.9,
      safetyScore: '3 Stars (Global NCAP)',
      airbagCount: 6,
      keyFeatures: ['360-Degree Camera', 'Heads-Up Display (HUD)', '9-inch SmartPlay Pro+', 'Ultra-Low Maintenance'],
      resaleRetentionScore3Yr: 79,
      tier1PartsAvailabilityScore: 9.9,
      tier2PartsAvailabilityScore: 9.8,
      rationale: 'Budget Downgrade / Cash Surplus: Downsize to a newer hatchback with HUD and 360-cam while retaining cash.',
      isDirectRival: false,
    },
    {
      id: 'budget-xuv700',
      name: 'Mahindra XUV700 AX5 Petrol MT',
      make: 'Mahindra',
      model: 'XUV700',
      variant: 'AX5 7-Str',
      yearBracket: '2021 – 2022',
      fuel: 'Petrol',
      transmission: 'Manual',
      estimatedResaleLakh: +(currentLakh * 1.25).toFixed(2),
      engineOutput: '197 bhp · 380 Nm',
      realWorldMileage: '9.8 km/l',
      runningCostPerKmInr: 10.4,
      safetyScore: '5 Stars (Global NCAP)',
      airbagCount: 6,
      keyFeatures: ['Dual 10.25-inch Screen Cockpit', 'Panoramic Skyroof', '197 bhp mStallion Turbo', '7-Seat Capacity'],
      resaleRetentionScore3Yr: 78,
      tier1PartsAvailabilityScore: 9.2,
      tier2PartsAvailabilityScore: 8.9,
      rationale: 'Upmarket 7-Seater Step-Up: Upgrade to massive 200 PS highway dominance by topping up slightly.',
      isDirectRival: false,
    },
    {
      id: 'budget-thar',
      name: 'Mahindra Thar LX Hard Top 4x4',
      make: 'Mahindra',
      model: 'Thar',
      variant: 'LX Diesel 4x4 MT',
      yearBracket: '2020 – 2022',
      fuel: 'Diesel',
      transmission: 'Manual',
      estimatedResaleLakh: +(currentLakh * 1.15).toFixed(2),
      engineOutput: '130 bhp · 300 Nm',
      realWorldMileage: '11.5 km/l',
      runningCostPerKmInr: 7.8,
      safetyScore: '4 Stars (Global NCAP)',
      airbagCount: 2,
      keyFeatures: ['Shift-on-the-Fly 4WD with Low Range', 'Roll Cage', 'Water-Resistant Infotainment', 'High Resale Cult Value'],
      resaleRetentionScore3Yr: 84,
      tier1PartsAvailabilityScore: 9.1,
      tier2PartsAvailabilityScore: 8.6,
      rationale: 'Lifestyle Off-Roader Trade: Swap for an iconic 4x4 with the highest secondary market value retention in India.',
      isDirectRival: false,
    },
  ];

  return pool;
}
