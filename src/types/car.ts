export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Strong Hybrid';

export type TransmissionType = 
  | 'Manual' 
  | 'AMT/AGS' 
  | 'Torque Converter AT' 
  | 'CVT' 
  | 'DCT/DSG'
  | 'e-CVT';

export type OwnerCount = '1st' | '2nd' | '3rd' | '4th+';

export type InsuranceType = 'Zero Depreciation' | 'Comprehensive' | 'Third-Party' | 'Expired';

export type ServiceHistoryType = 'Authorized Dealer Full History' | 'Partial' | 'Independent Garage';

export type AccidentalHistoryType = 'Clean' | 'Minor Bodywork' | 'Structural Repairs';

export type DamageSeverity = 'None' | 'Minor' | 'Moderate' | 'Severe' | 'Critical';

export type DamagePanel = 
  | 'Front Bumper' 
  | 'Rear Bumper' 
  | 'Bonnet/Hood' 
  | 'Left Front Door' 
  | 'Left Rear Door' 
  | 'Right Front Door' 
  | 'Right Rear Door' 
  | 'Roof' 
  | 'Tailgate/Boot' 
  | 'Quarter Panels';

export type ScratchDepth = 'None' | 'Surface Swirls' | 'Clearcoat Cut' | 'Deep (Down to Primer)';

export interface ExteriorDamageReport {
  severity: DamageSeverity;
  affectedPanels: DamagePanel[];
  scratchDepth: ScratchDepth;
  repaintedPanelsCount: number;
  estimatedRepairCostInr: number;
  damageDeductionInr: number;
  maintenanceConditionText: string;
  maintenanceConditionDeltaInr: number;
}

export interface VehicleInputs {
  make: string;
  model: string;
  generation: string;
  variant: string;
  registrationYear: number;
  fuelType: FuelType;
  transmission: TransmissionType;
  kilometersDriven: number;
  rtoLocation: string; // e.g., 'DL-01 (New Delhi)', 'KA-03 (Bengaluru East)'
  owners: OwnerCount;
  // Optional parameters
  insuranceStatus: InsuranceType;
  serviceHistory: ServiceHistoryType;
  accidentalHistory: AccidentalHistoryType;
  tireConditionPercent: number; // 0 - 100
  batteryHealthPercent: number; // 0 - 100
  damageReport?: ExteriorDamageReport;
}

export interface VehicleSpec {
  displacementCc: number;
  peakPowerBhp: number;
  peakTorqueNm: number;
  araiFuelEconomy: number; // km/l or km/kWh
  realWorldFuelEconomy: number; // km/l or km/kWh
  bootCapacityLiters: number;
  drivetrain: 'FWD' | 'RWD' | 'AWD' | '4x4';
  safetyRatingStars: number; // 0 to 5
  safetyAgency: 'Global NCAP' | 'Bharat NCAP' | 'ASEAN NCAP' | 'Euro NCAP';
  groundClearanceMm: number;
  originalExShowroomLakh: number; // original price when new
  segment: 'Hatchback' | 'Premium Hatchback' | 'Compact Sedan' | 'Sedan' | 'Compact SUV' | 'Mid-size SUV' | 'Full-size SUV' | 'MPV' | 'Off-roader';
}

export interface ComponentFailureRisk {
  component: string;
  system: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  avgFailureKmRange: string;
  typicalRepairCostInr: number;
  symptomsAndRemedy: string;
}

export interface RegulatoryAnnotation {
  year: number;
  title: string;
  impactPercent: number;
  description: string;
  type: 'regulatory' | 'market' | 'emission' | 'fuel';
}

export interface DepreciationPoint {
  year: number;
  calendarYear: number;
  marketValueLakh: number;
  yoyDepreciationPercent: number;
  isProjected: boolean;
  annotation?: RegulatoryAnnotation;
}

export interface ShapAttribution {
  featureName: string;
  impactInr: number; // positive (green) or negative (red)
  description: string;
}

export interface TcoBreakdown {
  fuelCost5Yr: number;
  pmsMaintenanceCost5Yr: number;
  insuranceRenewals5Yr: number;
  wearAndTearCost5Yr: number; // Tyres + battery + brake pads
  total5Yr: number;
}

export interface StateArbitrageOpportunity {
  stateCode: string;
  stateName: string;
  rtoExample: string;
  projectedRealizedValueInr: number;
  deltaPercentVsCurrent: number; // e.g. +14% or -8%
  marketDriverReason: string;
}

export interface ValuationResult {
  fairMarketValueInr: number; // e.g. 845000
  fairMarketValueLakh: number; // e.g. 8.45
  instantBuyoutRangeInr: [number, number]; // [780000, 815000] - Spinny / Cars24 instant dealer buyout
  peerToPeerRangeInr: [number, number]; // [840000, 890000] - Direct buyer market
  marketLiquidity: 'Very High' | 'High' | 'Moderate' | 'Low';
  resaleDemandScore: number; // 1 to 10
  avgDaysToSell: number; // e.g., 9 - 18 days
  modelRemarks: string[];
  shapBreakdown: ShapAttribution[];
  spec: VehicleSpec;
  depreciationCurve: DepreciationPoint[];
  tco: TcoBreakdown;
  failureRisks: ComponentFailureRisk[];
  stateArbitrage: StateArbitrageOpportunity[];
  exteriorDeltaText: string; // e.g. "+ ₹12,000 for excellent exterior condition"
  exteriorDeltaInr: number; // positive for bonus, negative for damage deduction
  damageReport: ExteriorDamageReport;
}

export interface ComparisonVehicle {
  id: string;
  name: string;
  make: string;
  model: string;
  variant: string;
  yearBracket: string;
  fuel: FuelType;
  transmission: TransmissionType;
  estimatedResaleLakh: number;
  engineOutput: string;
  realWorldMileage: string;
  runningCostPerKmInr: number;
  safetyScore: string;
  airbagCount: number;
  keyFeatures: string[];
  resaleRetentionScore3Yr: number; // e.g. 74%
  tier1PartsAvailabilityScore: number; // 1 - 10
  tier2PartsAvailabilityScore: number; // 1 - 10
  rationale: string;
  isDirectRival: boolean; // Rival vs budget alternative
}
