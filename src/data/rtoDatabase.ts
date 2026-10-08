export interface RtoLocation {
  code: string;
  name: string;
  state: string;
  stateCode: string;
  isNcrRegion: boolean;
  roadTaxMultiplier: number; // Baseline = 1.0 (e.g. KA is 1.18, DL is 0.95, KL is 1.14)
}

export const RTO_LIST: RtoLocation[] = [
  // Delhi NCR
  { code: 'DL-01', name: 'DL-01 (North Delhi / Mall Road)', state: 'Delhi', stateCode: 'DL', isNcrRegion: true, roadTaxMultiplier: 0.94 },
  { code: 'DL-04', name: 'DL-04 (West Delhi / Janakpuri)', state: 'Delhi', stateCode: 'DL', isNcrRegion: true, roadTaxMultiplier: 0.94 },
  { code: 'DL-08', name: 'DL-08 (South Delhi / Sheikh Sarai)', state: 'Delhi', stateCode: 'DL', isNcrRegion: true, roadTaxMultiplier: 0.94 },
  { code: 'HR-26', name: 'HR-26 (Gurugram NCR)', state: 'Haryana', stateCode: 'HR', isNcrRegion: true, roadTaxMultiplier: 0.96 },
  { code: 'UP-16', name: 'UP-16 (Noida / Gautam Buddha Nagar)', state: 'Uttar Pradesh', stateCode: 'UP', isNcrRegion: true, roadTaxMultiplier: 0.97 },
  { code: 'UP-14', name: 'UP-14 (Ghaziabad NCR)', state: 'Uttar Pradesh', stateCode: 'UP', isNcrRegion: true, roadTaxMultiplier: 0.96 },
  
  // Karnataka (Highest road tax in India -> high resale value)
  { code: 'KA-01', name: 'KA-01 (Bengaluru Central / Koramangala)', state: 'Karnataka', stateCode: 'KA', isNcrRegion: false, roadTaxMultiplier: 1.18 },
  { code: 'KA-03', name: 'KA-03 (Bengaluru East / Indiranagar)', state: 'Karnataka', stateCode: 'KA', isNcrRegion: false, roadTaxMultiplier: 1.18 },
  { code: 'KA-04', name: 'KA-04 (Bengaluru North / Yeshwanthpur)', state: 'Karnataka', stateCode: 'KA', isNcrRegion: false, roadTaxMultiplier: 1.17 },
  { code: 'KA-05', name: 'KA-05 (Bengaluru South / Jayanagar)', state: 'Karnataka', stateCode: 'KA', isNcrRegion: false, roadTaxMultiplier: 1.18 },
  { code: 'KA-51', name: 'KA-51 (Bengaluru Electronic City)', state: 'Karnataka', stateCode: 'KA', isNcrRegion: false, roadTaxMultiplier: 1.17 },

  // Maharashtra
  { code: 'MH-01', name: 'MH-01 (South Mumbai / Tardeo)', state: 'Maharashtra', stateCode: 'MH', isNcrRegion: false, roadTaxMultiplier: 1.05 },
  { code: 'MH-02', name: 'MH-02 (Mumbai West / Andheri)', state: 'Maharashtra', stateCode: 'MH', isNcrRegion: false, roadTaxMultiplier: 1.05 },
  { code: 'MH-04', name: 'MH-04 (Thane)', state: 'Maharashtra', stateCode: 'MH', isNcrRegion: false, roadTaxMultiplier: 1.04 },
  { code: 'MH-12', name: 'MH-12 (Pune City)', state: 'Maharashtra', stateCode: 'MH', isNcrRegion: false, roadTaxMultiplier: 1.06 },
  { code: 'MH-14', name: 'MH-14 (Pimpri-Chinchwad)', state: 'Maharashtra', stateCode: 'MH', isNcrRegion: false, roadTaxMultiplier: 1.04 },

  // Kerala
  { code: 'KL-01', name: 'KL-01 (Thiruvananthapuram)', state: 'Kerala', stateCode: 'KL', isNcrRegion: false, roadTaxMultiplier: 1.14 },
  { code: 'KL-07', name: 'KL-07 (Ernakulam / Kochi)', state: 'Kerala', stateCode: 'KL', isNcrRegion: false, roadTaxMultiplier: 1.16 },
  { code: 'KL-11', name: 'KL-11 (Kozhikode)', state: 'Kerala', stateCode: 'KL', isNcrRegion: false, roadTaxMultiplier: 1.13 },

  // Tamil Nadu
  { code: 'TN-01', name: 'TN-01 (Chennai Central / Ayanavaram)', state: 'Tamil Nadu', stateCode: 'TN', isNcrRegion: false, roadTaxMultiplier: 1.09 },
  { code: 'TN-09', name: 'TN-09 (Chennai South / K.K. Nagar)', state: 'Tamil Nadu', stateCode: 'TN', isNcrRegion: false, roadTaxMultiplier: 1.09 },
  { code: 'TN-38', name: 'TN-38 (Coimbatore North)', state: 'Tamil Nadu', stateCode: 'TN', isNcrRegion: false, roadTaxMultiplier: 1.08 },

  // Telangana
  { code: 'TS-09', name: 'TS-09 (Hyderabad Central / Khairatabad)', state: 'Telangana', stateCode: 'TS', isNcrRegion: false, roadTaxMultiplier: 1.07 },
  { code: 'TS-07', name: 'TS-07 (Secunderabad)', state: 'Telangana', stateCode: 'TS', isNcrRegion: false, roadTaxMultiplier: 1.06 },

  // Gujarat
  { code: 'GJ-01', name: 'GJ-01 (Ahmedabad)', state: 'Gujarat', stateCode: 'GJ', isNcrRegion: false, roadTaxMultiplier: 1.02 },
  { code: 'GJ-05', name: 'GJ-05 (Surat)', state: 'Gujarat', stateCode: 'GJ', isNcrRegion: false, roadTaxMultiplier: 1.01 },

  // West Bengal
  { code: 'WB-01', name: 'WB-01 (Kolkata Beltala)', state: 'West Bengal', stateCode: 'WB', isNcrRegion: false, roadTaxMultiplier: 1.01 },
  { code: 'WB-02', name: 'WB-02 (Kolkata Salt Lake)', state: 'West Bengal', stateCode: 'WB', isNcrRegion: false, roadTaxMultiplier: 1.02 },

  // Punjab & Chandigarh
  { code: 'CH-01', name: 'CH-01 (Chandigarh)', state: 'Chandigarh', stateCode: 'CH', isNcrRegion: false, roadTaxMultiplier: 1.03 },
  { code: 'PB-10', name: 'PB-10 (Ludhiana)', state: 'Punjab', stateCode: 'PB', isNcrRegion: false, roadTaxMultiplier: 1.03 },

  // Rajasthan
  { code: 'RJ-14', name: 'RJ-14 (Jaipur South)', state: 'Rajasthan', stateCode: 'RJ', isNcrRegion: false, roadTaxMultiplier: 1.02 },
];
