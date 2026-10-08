import { 
  FuelType, 
  TransmissionType, 
  OwnerCount, 
  InsuranceType, 
  ServiceHistoryType, 
  AccidentalHistoryType,
  ExteriorDamageReport,
  DamagePanel,
  DamageSeverity,
  ScratchDepth
} from '../types/car';
import { RTO_LIST } from '../data/rtoDatabase';

export interface ExtractedEntities {
  make?: string;
  model?: string;
  generation?: string;
  variant?: string;
  registrationYear?: number;
  fuelType?: FuelType;
  transmission?: TransmissionType;
  kilometersDriven?: number;
  rtoLocation?: string;
  owners?: OwnerCount;
  insuranceStatus?: InsuranceType;
  serviceHistory?: ServiceHistoryType;
  accidentalHistory?: AccidentalHistoryType;
  damageReport?: ExteriorDamageReport;
  rawText: string;
}

export function parseFreeTextLocal(text: string): ExtractedEntities {
  const lower = text.toLowerCase();
  const extracted: ExtractedEntities = { rawText: text };

  // 1. Year (2005 - 2026)
  const yearMatch = text.match(/\b(200[5-9]|201[0-9]|202[0-6])\b/);
  if (yearMatch) {
    extracted.registrationYear = parseInt(yearMatch[1], 10);
  }

  // 2. Make & Model
  if (lower.includes('carens')) {
    extracted.make = 'Kia';
    extracted.model = 'Carens';
  } else if (lower.includes('carnival')) {
    extracted.make = 'Kia';
    extracted.model = 'Carnival';
  } else if (lower.includes('seltos')) {
    extracted.make = 'Kia';
    extracted.model = 'Seltos';
  } else if (lower.includes('sonet')) {
    extracted.make = 'Kia';
    extracted.model = 'Sonet';
  } else if (lower.includes('wagon r') || lower.includes('wagonr')) {
    extracted.make = 'Maruti Suzuki';
    extracted.model = 'Wagon R';
  } else if (lower.includes('swift dzire') || lower.includes('dzire')) {
    extracted.make = 'Maruti Suzuki';
    extracted.model = 'Dzire';
  } else if (lower.includes('swift')) {
    extracted.make = 'Maruti Suzuki';
    extracted.model = 'Swift';
  } else if (lower.includes('fronx')) {
    extracted.make = 'Maruti Suzuki';
    extracted.model = 'Fronx';
  } else if (lower.includes('alto k10') || lower.includes('alto')) {
    extracted.make = 'Maruti Suzuki';
    extracted.model = 'Alto K10';
  } else if (lower.includes('jimny')) {
    extracted.make = 'Maruti Suzuki';
    extracted.model = 'Jimny';
  } else if (lower.includes('baleno')) {
    extracted.make = 'Maruti Suzuki';
    extracted.model = 'Baleno';
  } else if (lower.includes('brezza') || lower.includes('vitara brezza')) {
    extracted.make = 'Maruti Suzuki';
    extracted.model = 'Brezza';
  } else if (lower.includes('ertiga')) {
    extracted.make = 'Maruti Suzuki';
    extracted.model = 'Ertiga';
  } else if (lower.includes('grand vitara')) {
    extracted.make = 'Maruti Suzuki';
    extracted.model = 'Grand Vitara';
  } else if (lower.includes('ciaz')) {
    extracted.make = 'Maruti Suzuki';
    extracted.model = 'Ciaz';
  } else if (lower.includes('creta')) {
    extracted.make = 'Hyundai';
    extracted.model = 'Creta';
  } else if (lower.includes('venue')) {
    extracted.make = 'Hyundai';
    extracted.model = 'Venue';
  } else if (lower.includes('verna')) {
    extracted.make = 'Hyundai';
    extracted.model = 'Verna';
  } else if (lower.includes('i20') || lower.includes('elite i20')) {
    extracted.make = 'Hyundai';
    extracted.model = 'i20';
  } else if (lower.includes('grand i10') || lower.includes('i10 nios') || lower.includes('nios')) {
    extracted.make = 'Hyundai';
    extracted.model = 'Grand i10 Nios';
  } else if (lower.includes('alcazar')) {
    extracted.make = 'Hyundai';
    extracted.model = 'Alcazar';
  } else if (lower.includes('aura')) {
    extracted.make = 'Hyundai';
    extracted.model = 'Aura';
  } else if (lower.includes('nexon')) {
    extracted.make = 'Tata';
    extracted.model = 'Nexon';
  } else if (lower.includes('punch')) {
    extracted.make = 'Tata';
    extracted.model = 'Punch';
  } else if (lower.includes('harrier')) {
    extracted.make = 'Tata';
    extracted.model = 'Harrier';
  } else if (lower.includes('safari')) {
    extracted.make = 'Tata';
    extracted.model = 'Safari';
  } else if (lower.includes('altroz')) {
    extracted.make = 'Tata';
    extracted.model = 'Altroz';
  } else if (lower.includes('tiago')) {
    extracted.make = 'Tata';
    extracted.model = 'Tiago';
  } else if (lower.includes('xuv700') || lower.includes('xuv 700')) {
    extracted.make = 'Mahindra';
    extracted.model = 'XUV700';
  } else if (lower.includes('scorpio-n') || lower.includes('scorpio n') || lower.includes('scorpio')) {
    extracted.make = 'Mahindra';
    extracted.model = 'Scorpio-N';
  } else if (lower.includes('thar')) {
    extracted.make = 'Mahindra';
    extracted.model = 'Thar';
  } else if (lower.includes('xuv 3xo') || lower.includes('3xo') || lower.includes('xuv300')) {
    extracted.make = 'Mahindra';
    extracted.model = 'XUV 3XO';
  } else if (lower.includes('innova hycross') || lower.includes('hycross')) {
    extracted.make = 'Toyota';
    extracted.model = 'Innova Hycross';
  } else if (lower.includes('innova') || lower.includes('crysta')) {
    extracted.make = 'Toyota';
    extracted.model = 'Innova Crysta';
  } else if (lower.includes('fortuner')) {
    extracted.make = 'Toyota';
    extracted.model = 'Fortuner';
  } else if (lower.includes('hyryder')) {
    extracted.make = 'Toyota';
    extracted.model = 'Urban Cruiser Hyryder';
  } else if (lower.includes('elevate')) {
    extracted.make = 'Honda';
    extracted.model = 'Elevate';
  } else if (lower.includes('city')) {
    extracted.make = 'Honda';
    extracted.model = 'City';
  } else if (lower.includes('amaze')) {
    extracted.make = 'Honda';
    extracted.model = 'Amaze';
  } else if (lower.includes('taigun')) {
    extracted.make = 'Volkswagen';
    extracted.model = 'Taigun';
  } else if (lower.includes('virtus')) {
    extracted.make = 'Volkswagen';
    extracted.model = 'Virtus';
  } else if (lower.includes('kushaq')) {
    extracted.make = 'Skoda';
    extracted.model = 'Kushaq';
  } else if (lower.includes('slavia')) {
    extracted.make = 'Skoda';
    extracted.model = 'Slavia';
  } else if (lower.includes('hector')) {
    extracted.make = 'MG';
    extracted.model = 'Hector';
  } else if (lower.includes('zs ev') || lower.includes('zsev')) {
    extracted.make = 'MG';
    extracted.model = 'ZS EV';
  } else if (lower.includes('compass')) {
    extracted.make = 'Jeep';
    extracted.model = 'Compass';
  } else if (lower.includes('magnite')) {
    extracted.make = 'Nissan';
    extracted.model = 'Magnite';
  } else if (lower.includes('kwid')) {
    extracted.make = 'Renault';
    extracted.model = 'Kwid';
  }

  // 3. Variant
  if (lower.includes('fearless+') || lower.includes('fearless plus')) extracted.variant = 'Fearless+';
  else if (lower.includes('fearless')) extracted.variant = 'Fearless';
  else if (lower.includes('creative+')) extracted.variant = 'Creative+';
  else if (lower.includes('creative')) extracted.variant = 'Creative';
  else if (lower.includes('pure')) extracted.variant = 'Pure';
  else if (lower.includes('smart')) extracted.variant = 'Smart';
  else if (lower.includes('sx(o)') || lower.includes('sx o') || lower.includes('sx-o') || lower.includes('sxo')) extracted.variant = 'SX(O)';
  else if (lower.includes('sx tech')) extracted.variant = 'SX Tech';
  else if (lower.includes('sx+')) extracted.variant = 'SX+';
  else if (lower.includes('sx')) extracted.variant = 'SX';
  else if (lower.includes('s(o)')) extracted.variant = 'S(O)';
  else if (lower.includes('s+')) extracted.variant = 'S+';
  else if (lower.includes('ex')) extracted.variant = 'EX';
  else if (lower.includes('luxury plus') || lower.includes('luxury+')) extracted.variant = 'Luxury Plus';
  else if (lower.includes('luxury')) extracted.variant = 'Luxury';
  else if (lower.includes('limousine')) extracted.variant = 'Limousine';
  else if (lower.includes('prestige')) extracted.variant = 'Prestige';
  else if (lower.includes('premium')) extracted.variant = 'Premium';
  else if (lower.includes('ax7l') || lower.includes('ax7 l') || lower.includes('ax7 luxury')) extracted.variant = 'AX7L';
  else if (lower.includes('ax7')) extracted.variant = 'AX7';
  else if (lower.includes('ax5')) extracted.variant = 'AX5';
  else if (lower.includes('ax3')) extracted.variant = 'AX3';
  else if (lower.includes('z8l') || lower.includes('z8 l')) extracted.variant = 'Z8L';
  else if (lower.includes('z8')) extracted.variant = 'Z8';
  else if (lower.includes('z6')) extracted.variant = 'Z6';
  else if (lower.includes('z4')) extracted.variant = 'Z4';
  else if (lower.includes('zxi+') || lower.includes('zxi plus')) extracted.variant = 'ZXi+';
  else if (lower.includes('zxi')) extracted.variant = 'ZXi';
  else if (lower.includes('vxi+') || lower.includes('vxi plus')) extracted.variant = 'VXi+';
  else if (lower.includes('vxi')) extracted.variant = 'VXi';
  else if (lower.includes('lxi')) extracted.variant = 'LXi';
  else if (lower.includes('alpha turbo') || lower.includes('alpha')) extracted.variant = 'Alpha';
  else if (lower.includes('zeta turbo') || lower.includes('zeta')) extracted.variant = 'Zeta';
  else if (lower.includes('delta+') || lower.includes('delta plus')) extracted.variant = 'Delta+';
  else if (lower.includes('delta')) extracted.variant = 'Delta';
  else if (lower.includes('sigma')) extracted.variant = 'Sigma';
  else if (lower.includes('gt plus') || lower.includes('gt+')) extracted.variant = 'GT Plus';
  else if (lower.includes('gt line')) extracted.variant = 'GT Line';
  else if (lower.includes('topline')) extracted.variant = 'Topline';
  else if (lower.includes('highline')) extracted.variant = 'Highline';
  else if (lower.includes('comfortline')) extracted.variant = 'Comfortline';
  else if (lower.includes('htx+') || lower.includes('htx plus')) extracted.variant = 'HTX+';
  else if (lower.includes('gtx+') || lower.includes('gtx plus')) extracted.variant = 'GTX+';
  else if (lower.includes('htx')) extracted.variant = 'HTX';
  else if (lower.includes('htk+')) extracted.variant = 'HTK+';
  else if (lower.includes('zx')) extracted.variant = 'ZX';
  else if (lower.includes('vx')) extracted.variant = 'VX';
  else if (lower.includes('v')) extracted.variant = 'V';

  // 4. Fuel Type
  if (lower.includes('diesel') || lower.includes('crdi') || lower.includes('ddis') || lower.includes('mhawk')) {
    extracted.fuelType = 'Diesel';
  } else if (lower.includes('cng')) {
    extracted.fuelType = 'CNG';
  } else if (lower.includes('electric') || lower.includes('ev') || lower.includes('nexon ev')) {
    extracted.fuelType = 'Electric';
  } else if (lower.includes('strong hybrid') || lower.includes('hybrid') || lower.includes('e:hev') || lower.includes('hyryder')) {
    extracted.fuelType = 'Strong Hybrid';
  } else if (lower.includes('petrol') || lower.includes('vtec') || lower.includes('tsi') || lower.includes('tgdi') || lower.includes('k-series')) {
    extracted.fuelType = 'Petrol';
  }

  // 5. Transmission
  if (lower.includes('dct') || lower.includes('dsg') || lower.includes('dca') || lower.includes('dual clutch')) {
    extracted.transmission = 'DCT/DSG';
  } else if (lower.includes('amt') || lower.includes('ags') || lower.includes('auto gear shift') || lower.includes('smart auto')) {
    extracted.transmission = 'AMT/AGS';
  } else if (lower.includes('cvt') || lower.includes('ivt')) {
    extracted.transmission = 'CVT';
  } else if (lower.includes('at') || lower.includes('automatic') || lower.includes('torque converter')) {
    extracted.transmission = 'Torque Converter AT';
  } else if (lower.includes('manual') || lower.includes('mt')) {
    extracted.transmission = 'Manual';
  }

  // 6. Kilometers / Odometer (completely unconstrained parsing)
  // Check for "X.X lakh km" first
  const lakhMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:lakh|lac)\s*(?:km|kms|kilometers)?/i);
  if (lakhMatch) {
    const val = parseFloat(lakhMatch[1]) * 100000;
    if (!isNaN(val) && val >= 0) {
      extracted.kilometersDriven = Math.round(val);
    }
  } else {
    const kmMatch = text.match(/(\d+[\d,.]*)\s*(?:k\b|k\s*kms?|kms?|kilometers?)/i) 
      || text.match(/(?:done|run|driven|odometer|odo)[:\s]*(\d+[\d,.]*)/i);
    if (kmMatch) {
      let numStr = kmMatch[1].replace(/,/g, '');
      let num = parseFloat(numStr);
      if (num < 500 && kmMatch[0].toLowerCase().includes('k')) {
        num = num * 1000; // e.g. "46k" -> 46000
      }
      if (!isNaN(num) && num >= 0) {
        extracted.kilometersDriven = Math.round(num);
      }
    }
  }

  // 7. RTO / Location
  const rtoMatch = text.match(/\b([a-zA-Z]{2}[-\s]?\d{1,2})\b/);
  if (rtoMatch) {
    const rawCode = rtoMatch[1].toUpperCase().replace(/\s/, '-');
    const matchedRto = RTO_LIST.find(r => r.code.replace('-', '') === rawCode.replace('-', ''));
    if (matchedRto) {
      extracted.rtoLocation = matchedRto.name;
    }
  }

  if (!extracted.rtoLocation) {
    if (lower.includes('bangalore') || lower.includes('bengaluru')) {
      extracted.rtoLocation = 'KA-03 (Bengaluru East / Indiranagar)';
    } else if (lower.includes('delhi') || lower.includes('ncr')) {
      extracted.rtoLocation = 'DL-01 (North Delhi / Mall Road)';
    } else if (lower.includes('gurgaon') || lower.includes('gurugram')) {
      extracted.rtoLocation = 'HR-26 (Gurugram NCR)';
    } else if (lower.includes('noida')) {
      extracted.rtoLocation = 'UP-16 (Noida / Gautam Buddha Nagar)';
    } else if (lower.includes('mumbai') || lower.includes('bombay')) {
      extracted.rtoLocation = 'MH-02 (Mumbai West / Andheri)';
    } else if (lower.includes('pune')) {
      extracted.rtoLocation = 'MH-12 (Pune City)';
    } else if (lower.includes('hyderabad')) {
      extracted.rtoLocation = 'TS-09 (Hyderabad Central / Khairatabad)';
    } else if (lower.includes('chennai') || lower.includes('madras')) {
      extracted.rtoLocation = 'TN-09 (Chennai South / K.K. Nagar)';
    } else if (lower.includes('kochi') || lower.includes('ernakulam') || lower.includes('kerala')) {
      extracted.rtoLocation = 'KL-07 (Ernakulam / Kochi)';
    } else if (lower.includes('ahmedabad')) {
      extracted.rtoLocation = 'GJ-01 (Ahmedabad)';
    } else if (lower.includes('kolkata')) {
      extracted.rtoLocation = 'WB-01 (Kolkata Beltala)';
    } else if (lower.includes('chandigarh')) {
      extracted.rtoLocation = 'CH-01 (Chandigarh)';
    }
  }

  // 8. Owners
  if (lower.includes('single owner') || lower.includes('1st owner') || lower.includes('first owner') || lower.includes('one owner')) {
    extracted.owners = '1st';
  } else if (lower.includes('2nd owner') || lower.includes('second owner')) {
    extracted.owners = '2nd';
  } else if (lower.includes('3rd owner') || lower.includes('third owner')) {
    extracted.owners = '3rd';
  } else if (lower.includes('4th') || lower.includes('fourth')) {
    extracted.owners = '4th+';
  }

  // 9. Insurance
  if (lower.includes('zero dep') || lower.includes('zero-dep') || lower.includes('bumper to bumper') || lower.includes('b2b')) {
    extracted.insuranceStatus = 'Zero Depreciation';
  } else if (lower.includes('comprehensive') || lower.includes('comp insurance')) {
    extracted.insuranceStatus = 'Comprehensive';
  } else if (lower.includes('third party') || lower.includes('third-party') || lower.includes('tp')) {
    extracted.insuranceStatus = 'Third-Party';
  } else if (lower.includes('expired') || lower.includes('no insurance')) {
    extracted.insuranceStatus = 'Expired';
  }

  // 10. Service history
  if (lower.includes('dealer') || lower.includes('company service') || lower.includes('authorized') || lower.includes('showroom tracked')) {
    extracted.serviceHistory = 'Authorized Dealer Full History';
  } else if (lower.includes('independent') || lower.includes('local garage')) {
    extracted.serviceHistory = 'Independent Garage';
  }

  // 11. Accidental history
  if (lower.includes('flood') || lower.includes('structural') || lower.includes('chassis')) {
    extracted.accidentalHistory = 'Structural Repairs';
  } else if (lower.includes('minor bodywork')) {
    extracted.accidentalHistory = 'Minor Bodywork';
  } else if (lower.includes('clean') || lower.includes('non accidental') || lower.includes('non-accidental') || lower.includes('immaculate')) {
    extracted.accidentalHistory = 'Clean';
  }

  // 12. Exterior Damage & Maintenance Analysis
  let damageSeverity: DamageSeverity = 'None';
  const affectedPanels: DamagePanel[] = [];
  let scratchDepth: ScratchDepth = 'None';
  let repaintedPanelsCount = 0;

  // Panel detection
  if (lower.includes('front bumper')) affectedPanels.push('Front Bumper');
  if (lower.includes('rear bumper')) affectedPanels.push('Rear Bumper');
  if (lower.includes('bonnet') || lower.includes('hood')) affectedPanels.push('Bonnet/Hood');
  if (lower.includes('left front door')) affectedPanels.push('Left Front Door');
  if (lower.includes('right front door')) affectedPanels.push('Right Front Door');
  if (lower.includes('left rear door')) affectedPanels.push('Left Rear Door');
  if (lower.includes('right rear door')) affectedPanels.push('Right Rear Door');
  if (lower.includes('roof')) affectedPanels.push('Roof');
  if (lower.includes('tailgate') || lower.includes('boot')) affectedPanels.push('Tailgate/Boot');
  if (lower.includes('quarter panel')) affectedPanels.push('Quarter Panels');
  if (affectedPanels.length === 0 && lower.includes('door')) {
    affectedPanels.push('Left Front Door');
  }
  if (affectedPanels.length === 0 && (lower.includes('bumper') || lower.includes('scuff'))) {
    affectedPanels.push('Front Bumper');
  }

  // Scratch depth
  if (lower.includes('deep scratch') || lower.includes('primer') || lower.includes('bare metal')) {
    scratchDepth = 'Deep (Down to Primer)';
  } else if (lower.includes('swirl') || lower.includes('hairline') || lower.includes('light scratch')) {
    scratchDepth = 'Surface Swirls';
  } else if (lower.includes('scratch') || lower.includes('scuff')) {
    scratchDepth = 'Clearcoat Cut';
  }

  // Repaint mention
  if (lower.includes('repainted') || lower.includes('repaint')) {
    repaintedPanelsCount = 1;
    const repaintMatch = lower.match(/(\d+)\s*panels?\s*repainted/);
    if (repaintMatch) repaintedPanelsCount = parseInt(repaintMatch[1], 10);
  }

  // Severity evaluation
  const hasPristineKeywords = lower.includes('excellent exterior') || 
    lower.includes('showroom condition') || 
    lower.includes('mint exterior') || 
    lower.includes('mint condition') || 
    lower.includes('scratchless') || 
    lower.includes('ceramic coated') || 
    lower.includes('flawless') || 
    lower.includes('zero scratches') ||
    lower.includes('no scratches');

  const hasModerateKeywords = lower.includes('moderate dent') || 
    lower.includes('dent') || 
    lower.includes('deep dent') || 
    lower.includes('repainted') || 
    lower.includes('scrapes') ||
    lower.includes('scraped');

  const hasSevereKeywords = lower.includes('severe damage') || 
    lower.includes('heavy dent') || 
    lower.includes('multiple dents') || 
    lower.includes('damaged panel');

  const hasMinorKeywords = lower.includes('minor scratch') || 
    lower.includes('minor scratches') || 
    lower.includes('scratches') || 
    lower.includes('stone chips') || 
    lower.includes('swirl marks');

  if (hasSevereKeywords) {
    damageSeverity = 'Severe';
  } else if (hasModerateKeywords) {
    damageSeverity = 'Moderate';
  } else if (hasMinorKeywords) {
    damageSeverity = 'Minor';
  } else if (hasPristineKeywords) {
    damageSeverity = 'None';
  } else if (affectedPanels.length > 0) {
    damageSeverity = 'Minor';
  }

  // Compute damage costs & delta text
  if (damageSeverity === 'None') {
    extracted.damageReport = {
      severity: 'None',
      affectedPanels: [],
      scratchDepth: 'None',
      repaintedPanelsCount: 0,
      estimatedRepairCostInr: 0,
      damageDeductionInr: 0,
      maintenanceConditionText: '+ ₹12,000 for excellent showroom exterior condition (flawless original paint & zero panel damage)',
      maintenanceConditionDeltaInr: 12000,
    };
  } else {
    let baseSeverityDeduction = 0;
    if (damageSeverity === 'Minor') baseSeverityDeduction = 8500;
    else if (damageSeverity === 'Moderate') baseSeverityDeduction = 22000;
    else if (damageSeverity === 'Severe') baseSeverityDeduction = 48000;
    else if (damageSeverity === 'Critical') baseSeverityDeduction = 95000;

    const panelCount = Math.max(1, affectedPanels.length);
    const panelDeduction = (panelCount - 1) * 4200;
    let scratchDeduction = 0;
    if (scratchDepth === 'Surface Swirls') scratchDeduction = 3000;
    else if (scratchDepth === 'Clearcoat Cut') scratchDeduction = 7500;
    else if (scratchDepth === 'Deep (Down to Primer)') scratchDeduction = 15000;
    const repaintDeduction = repaintedPanelsCount * 4000;

    const totalDamageCost = baseSeverityDeduction + panelDeduction + scratchDeduction + repaintDeduction;
    const panelsDesc = affectedPanels.length > 0 ? `(${affectedPanels.join(', ')})` : '';

    extracted.damageReport = {
      severity: damageSeverity,
      affectedPanels: affectedPanels.length > 0 ? affectedPanels : ['Front Bumper'],
      scratchDepth,
      repaintedPanelsCount,
      estimatedRepairCostInr: totalDamageCost,
      damageDeductionInr: totalDamageCost,
      maintenanceConditionText: `- ₹${totalDamageCost.toLocaleString('en-IN')} for ${damageSeverity.toLowerCase()} exterior damage ${panelsDesc} and paint repair`,
      maintenanceConditionDeltaInr: -totalDamageCost,
    };
  }

  return extracted;
}
