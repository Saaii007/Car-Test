import { TransmissionType, ExteriorDamageReport } from '../types/car';

export interface SampleCarPreset {
  id: string;
  title: string;
  badge: string;
  make: string;
  model: string;
  generation: string;
  variant: string;
  registrationYear: number;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'CNG';
  transmission: TransmissionType;
  kilometersDriven: number;
  rtoLocation: string;
  color: string;
  conditionScore: number; // 0 - 100
  confidenceScore: number; // 0 - 100
  dentsScratchReport: string;
  previewSvg: string;
  damageReport?: ExteriorDamageReport;
}

export const SAMPLE_CARS: SampleCarPreset[] = [
  {
    id: 'sample-creta-2018',
    title: '2018 Hyundai Creta 1.6 SX CRDi',
    badge: 'Popular Compact SUV',
    make: 'Hyundai',
    model: 'Creta',
    generation: '1st Gen Facelift (2018 – 2020)',
    variant: 'SX',
    registrationYear: 2018,
    fuelType: 'Diesel',
    transmission: 'Manual',
    kilometersDriven: 46000,
    rtoLocation: 'KA-03 (Bengaluru East / Indiranagar)',
    color: 'Polar White',
    conditionScore: 89,
    confidenceScore: 94,
    dentsScratchReport: 'Minor stone chips on front bumper lip. Zero panel repaints detected; original factory paint thickness 110-125 μm.',
    damageReport: {
      severity: 'Minor',
      affectedPanels: ['Front Bumper'],
      scratchDepth: 'Clearcoat Cut',
      repaintedPanelsCount: 0,
      estimatedRepairCostInr: 8500,
      damageDeductionInr: 8500,
      maintenanceConditionText: '- ₹8,500 for minor exterior damage (Front Bumper) and paint repair',
      maintenanceConditionDeltaInr: -8500,
    },
    previewSvg: `<svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
      <defs>
        <linearGradient id="bgG" x1="0" y1="0" x2="320" y2="180" gradientUnits="userSpaceOnUse">
          <stop stop-color="#0f172a"/>
          <stop offset="1" stop-color="#020617"/>
        </linearGradient>
        <linearGradient id="carBody" x1="50" y1="60" x2="270" y2="140" gradientUnits="userSpaceOnUse">
          <stop stop-color="#f8fafc"/>
          <stop offset="1" stop-color="#cbd5e1"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#bgG)"/>
      <path d="M40 145 H280" stroke="#334155" stroke-width="2"/>
      <path d="M45 125 C45 110 55 105 70 102 L95 100 L130 65 C140 57 155 55 185 55 L215 55 C230 55 240 60 250 78 L265 100 C275 102 280 110 280 125 L275 135 C270 140 260 140 250 140 H60 C50 140 45 135 45 125 Z" fill="url(#carBody)"/>
      <path d="M135 68 L105 98 H175 V66 H145 Z" fill="#090d16"/>
      <path d="M185 66 V98 H238 L228 72 C222 67 210 66 195 66 Z" fill="#090d16"/>
      <circle cx="95" cy="135" r="20" fill="#020617" stroke="#475569" stroke-width="6"/>
      <circle cx="95" cy="135" r="9" fill="#94a3b8"/>
      <circle cx="230" cy="135" r="20" fill="#020617" stroke="#475569" stroke-width="6"/>
      <circle cx="230" cy="135" r="9" fill="#94a3b8"/>
      <text x="160" y="168" fill="#94a3b8" font-size="10" font-family="system-ui" text-anchor="middle" font-weight="600">CRETA 1.6 SX · POLAR WHITE</text>
    </svg>`,
  },
  {
    id: 'sample-carens-2022',
    title: '2022 Kia Carens Luxury Plus AT',
    badge: 'Premium 6/7-Seater MPV',
    make: 'Kia',
    model: 'Carens',
    generation: '1st Gen (2022 – Present)',
    variant: 'Luxury Plus',
    registrationYear: 2022,
    fuelType: 'Diesel',
    transmission: 'Torque Converter AT',
    kilometersDriven: 36000,
    rtoLocation: 'TS-09 (Hyderabad Central / Khairatabad)',
    color: 'Imperial Blue',
    conditionScore: 96,
    confidenceScore: 97,
    dentsScratchReport: 'Showroom grade condition. Pristine factory ceramic coating, zero panel dents, flawless chrome garnish.',
    damageReport: {
      severity: 'None',
      affectedPanels: [],
      scratchDepth: 'None',
      repaintedPanelsCount: 0,
      estimatedRepairCostInr: 0,
      damageDeductionInr: 0,
      maintenanceConditionText: '+ ₹14,500 for excellent showroom exterior condition (flawless original paint & zero panel damage)',
      maintenanceConditionDeltaInr: 14500,
    },
    previewSvg: `<svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
      <defs>
        <linearGradient id="bgCarens" x1="0" y1="0" x2="320" y2="180" gradientUnits="userSpaceOnUse">
          <stop stop-color="#020617"/>
          <stop offset="1" stop-color="#0f172a"/>
        </linearGradient>
        <linearGradient id="carensBody" x1="40" y1="50" x2="280" y2="140" gradientUnits="userSpaceOnUse">
          <stop stop-color="#1e3a8a"/>
          <stop offset="1" stop-color="#172554"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#bgCarens)"/>
      <path d="M35 145 H285" stroke="#1e293b" stroke-width="2"/>
      <path d="M42 125 C42 110 52 102 70 100 L95 98 L128 60 C138 52 155 52 205 52 L240 55 C250 58 260 68 268 85 L278 100 C284 106 284 116 280 126 L274 136 C266 140 256 140 245 140 H58 C46 140 42 134 42 125 Z" fill="url(#carensBody)"/>
      <path d="M132 60 L102 96 H185 V56 H142 Z" fill="#020617"/>
      <path d="M195 56 V96 H255 L245 64 C238 58 220 56 205 56 Z" fill="#020617"/>
      <circle cx="92" cy="135" r="21" fill="#020617" stroke="#3b82f6" stroke-width="4"/>
      <circle cx="92" cy="135" r="10" fill="#93c5fd"/>
      <circle cx="236" cy="135" r="21" fill="#020617" stroke="#3b82f6" stroke-width="4"/>
      <circle cx="236" cy="135" r="10" fill="#93c5fd"/>
      <text x="160" y="168" fill="#dfb76c" font-size="10" font-family="system-ui" text-anchor="middle" font-weight="600">KIA CARENS · IMPERIAL BLUE (+₹14.5k)</text>
    </svg>`,
  },
  {
    id: 'sample-swift-2021',
    title: '2021 Maruti Suzuki Swift ZXi+',
    badge: 'Top Resale Urban Hatch',
    make: 'Maruti Suzuki',
    model: 'Swift',
    generation: '3rd Gen Facelift (2021 – 2024)',
    variant: 'ZXi+',
    registrationYear: 2021,
    fuelType: 'Petrol',
    transmission: 'Manual',
    kilometersDriven: 28500,
    rtoLocation: 'DL-01 (North Delhi / Mall Road)',
    color: 'Solid Fire Red',
    conditionScore: 88,
    confidenceScore: 95,
    dentsScratchReport: 'Surface clearcoat scratches on front bumper and left front door lower lip. Structure 100% original.',
    damageReport: {
      severity: 'Minor',
      affectedPanels: ['Front Bumper', 'Left Front Door'],
      scratchDepth: 'Surface Swirls',
      repaintedPanelsCount: 0,
      estimatedRepairCostInr: 11500,
      damageDeductionInr: 11500,
      maintenanceConditionText: '- ₹11,500 for minor exterior damage (Front Bumper, Left Front Door) and paint repair',
      maintenanceConditionDeltaInr: -11500,
    },
    previewSvg: `<svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
      <defs>
        <linearGradient id="bgSwift" x1="0" y1="0" x2="320" y2="180" gradientUnits="userSpaceOnUse">
          <stop stop-color="#0f172a"/>
          <stop offset="1" stop-color="#020617"/>
        </linearGradient>
        <linearGradient id="swiftBody" x1="50" y1="60" x2="270" y2="140" gradientUnits="userSpaceOnUse">
          <stop stop-color="#ef4444"/>
          <stop offset="1" stop-color="#b91c1c"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#bgSwift)"/>
      <path d="M40 145 H280" stroke="#334155" stroke-width="2"/>
      <path d="M50 128 C50 114 62 108 78 106 L100 104 L130 70 C140 60 155 58 185 58 L210 60 C222 62 232 72 242 88 L255 106 C262 110 266 118 266 128 L262 136 C255 140 245 140 235 140 H65 C55 140 50 136 50 128 Z" fill="url(#swiftBody)"/>
      <circle cx="95" cy="135" r="19" fill="#020617" stroke="#475569" stroke-width="5"/>
      <circle cx="95" cy="135" r="8" fill="#cbd5e1"/>
      <circle cx="225" cy="135" r="19" fill="#020617" stroke="#475569" stroke-width="5"/>
      <circle cx="225" cy="135" r="8" fill="#cbd5e1"/>
      <text x="160" y="168" fill="#f87171" font-size="10" font-family="system-ui" text-anchor="middle" font-weight="600">MARUTI SWIFT ZXi+ · SOLID FIRE RED</text>
    </svg>`,
  },
  {
    id: 'sample-carnival-2021',
    title: '2021 Kia Carnival Limousine AT',
    badge: 'Luxury Executive MPV',
    make: 'Kia',
    model: 'Carnival',
    generation: '3rd Gen (2020 – 2023)',
    variant: 'Limousine',
    registrationYear: 2021,
    fuelType: 'Diesel',
    transmission: 'Torque Converter AT',
    kilometersDriven: 52000,
    rtoLocation: 'MH-02 (Mumbai West / Andheri)',
    color: 'Aurora Black Pearl',
    conditionScore: 94,
    confidenceScore: 96,
    dentsScratchReport: 'Immaculate high-gloss exterior. Dual electric sliding doors fully operational, zero panel dents.',
    damageReport: {
      severity: 'None',
      affectedPanels: [],
      scratchDepth: 'None',
      repaintedPanelsCount: 0,
      estimatedRepairCostInr: 0,
      damageDeductionInr: 0,
      maintenanceConditionText: '+ ₹18,000 for excellent showroom exterior condition (flawless original paint & zero panel damage)',
      maintenanceConditionDeltaInr: 18000,
    },
    previewSvg: `<svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
      <defs>
        <linearGradient id="bgCarnival" x1="0" y1="0" x2="320" y2="180" gradientUnits="userSpaceOnUse">
          <stop stop-color="#020617"/>
          <stop offset="1" stop-color="#090d16"/>
        </linearGradient>
        <linearGradient id="carnivalBody" x1="30" y1="50" x2="290" y2="140" gradientUnits="userSpaceOnUse">
          <stop stop-color="#18181b"/>
          <stop offset="1" stop-color="#09090b"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#bgCarnival)"/>
      <path d="M30 145 H290" stroke="#27272a" stroke-width="2"/>
      <path d="M38 126 C38 112 48 106 66 104 L92 102 L125 58 C135 50 152 48 215 48 L255 52 C265 56 274 66 280 84 L288 104 C292 110 292 118 288 126 L282 136 C274 140 264 140 252 140 H55 C44 140 38 136 38 126 Z" fill="url(#carnivalBody)"/>
      <circle cx="90" cy="135" r="21" fill="#09090b" stroke="#52525b" stroke-width="5"/>
      <circle cx="90" cy="135" r="10" fill="#a1a1aa"/>
      <circle cx="245" cy="135" r="21" fill="#09090b" stroke="#52525b" stroke-width="5"/>
      <circle cx="245" cy="135" r="10" fill="#a1a1aa"/>
      <text x="160" y="168" fill="#a1a1aa" font-size="10" font-family="system-ui" text-anchor="middle" font-weight="600">KIA CARNIVAL LIMOUSINE · AURORA BLACK</text>
    </svg>`,
  },
  {
    id: 'sample-wagonr-2020',
    title: '2020 Maruti Suzuki Wagon R 1.2 ZXi',
    badge: 'Tall Boy Family Hatch',
    make: 'Maruti Suzuki',
    model: 'Wagon R',
    generation: '3rd Gen (2019 – Present)',
    variant: 'ZXi',
    registrationYear: 2020,
    fuelType: 'Petrol',
    transmission: 'Manual',
    kilometersDriven: 39000,
    rtoLocation: 'MH-12 (Pune City)',
    color: 'Magma Grey',
    conditionScore: 82,
    confidenceScore: 93,
    dentsScratchReport: 'Moderate dent and horizontal scuff on left front door panel requiring dent pulling and panel blend.',
    damageReport: {
      severity: 'Moderate',
      affectedPanels: ['Left Front Door'],
      scratchDepth: 'Clearcoat Cut',
      repaintedPanelsCount: 0,
      estimatedRepairCostInr: 22000,
      damageDeductionInr: 22000,
      maintenanceConditionText: '- ₹22,000 for moderate exterior damage (Left Front Door) and paint repair',
      maintenanceConditionDeltaInr: -22000,
    },
    previewSvg: `<svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
      <defs>
        <linearGradient id="bgWagon" x1="0" y1="0" x2="320" y2="180" gradientUnits="userSpaceOnUse">
          <stop stop-color="#0f172a"/>
          <stop offset="1" stop-color="#020617"/>
        </linearGradient>
        <linearGradient id="wagonBody" x1="50" y1="50" x2="270" y2="140" gradientUnits="userSpaceOnUse">
          <stop stop-color="#64748b"/>
          <stop offset="1" stop-color="#475569"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#bgWagon)"/>
      <path d="M40 145 H280" stroke="#334155" stroke-width="2"/>
      <path d="M52 126 C52 112 60 106 72 104 L95 102 L118 56 C124 48 135 46 160 46 L225 46 C235 48 242 54 246 68 L254 98 C260 104 262 112 262 124 L258 136 C252 140 242 140 232 140 H68 C58 140 52 136 52 126 Z" fill="url(#wagonBody)"/>
      <circle cx="95" cy="135" r="19" fill="#020617" stroke="#334155" stroke-width="5"/>
      <circle cx="95" cy="135" r="8" fill="#cbd5e1"/>
      <circle cx="225" cy="135" r="19" fill="#020617" stroke="#334155" stroke-width="5"/>
      <circle cx="225" cy="135" r="8" fill="#cbd5e1"/>
      <text x="160" y="168" fill="#94a3b8" font-size="10" font-family="system-ui" text-anchor="middle" font-weight="600">MARUTI WAGON R · MAGMA GREY (-₹22k)</text>
    </svg>`,
  },
  {
    id: 'sample-nexon-2023',
    title: '2023 Tata Nexon Fearless+ DCA',
    badge: '5-Star Bharat NCAP SUV',
    make: 'Tata',
    model: 'Nexon',
    generation: '2nd Gen Facelift (2023 – Present)',
    variant: 'Fearless+',
    registrationYear: 2023,
    fuelType: 'Petrol',
    transmission: 'DCT/DSG',
    kilometersDriven: 18500,
    rtoLocation: 'DL-01 (North Delhi / Mall Road)',
    color: 'Daytona Grey',
    conditionScore: 94,
    confidenceScore: 96,
    dentsScratchReport: 'Pristine condition. Flawless bi-tone roof, zero scratch depth, front ADAS sensor array aligned.',
    damageReport: {
      severity: 'None',
      affectedPanels: [],
      scratchDepth: 'None',
      repaintedPanelsCount: 0,
      estimatedRepairCostInr: 0,
      damageDeductionInr: 0,
      maintenanceConditionText: '+ ₹13,200 for excellent showroom exterior condition (flawless original paint & zero panel damage)',
      maintenanceConditionDeltaInr: 13200,
    },
    previewSvg: `<svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
      <defs>
        <linearGradient id="bgG2" x1="0" y1="0" x2="320" y2="180" gradientUnits="userSpaceOnUse">
          <stop stop-color="#090d16"/>
          <stop offset="1" stop-color="#020617"/>
        </linearGradient>
        <linearGradient id="nexonBody" x1="50" y1="60" x2="270" y2="140" gradientUnits="userSpaceOnUse">
          <stop stop-color="#475569"/>
          <stop offset="1" stop-color="#1e293b"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#bgG2)"/>
      <path d="M40 145 H280" stroke="#1e293b" stroke-width="2"/>
      <path d="M45 122 C45 106 58 100 75 98 L100 96 L135 60 C148 52 165 50 195 52 L225 56 C240 62 250 72 260 90 L275 98 C282 104 282 114 278 126 L272 136 C265 140 255 140 245 140 H60 C48 140 45 132 45 122 Z" fill="url(#nexonBody)"/>
      <circle cx="95" cy="135" r="21" fill="#020617" stroke="#334155" stroke-width="5"/>
      <circle cx="95" cy="135" r="10" fill="#e2e8f0"/>
      <circle cx="235" cy="135" r="21" fill="#020617" stroke="#334155" stroke-width="5"/>
      <circle cx="235" cy="135" r="10" fill="#e2e8f0"/>
      <text x="160" y="168" fill="#10b981" font-size="10" font-family="system-ui" text-anchor="middle" font-weight="600">NEXON FEARLESS+ · DAYTONA GREY</text>
    </svg>`,
  },
  {
    id: 'sample-xuv700-2022',
    title: '2022 Mahindra XUV700 AX7L Diesel AT',
    badge: 'Flagship 7-Seater AWD',
    make: 'Mahindra',
    model: 'XUV700',
    generation: '1st Gen (2021 – Present)',
    variant: 'AX7L',
    registrationYear: 2022,
    fuelType: 'Diesel',
    transmission: 'Torque Converter AT',
    kilometersDriven: 34000,
    rtoLocation: 'MH-02 (Mumbai West / Andheri)',
    color: 'Midnight Black',
    conditionScore: 92,
    confidenceScore: 95,
    dentsScratchReport: 'Single light surface hairline buffing needed on rear right door. Flush motorized handles operating flawlessly.',
    damageReport: {
      severity: 'Minor',
      affectedPanels: ['Right Rear Door'],
      scratchDepth: 'Surface Swirls',
      repaintedPanelsCount: 0,
      estimatedRepairCostInr: 8500,
      damageDeductionInr: 8500,
      maintenanceConditionText: '- ₹8,500 for minor exterior damage (Right Rear Door) and paint repair',
      maintenanceConditionDeltaInr: -8500,
    },
    previewSvg: `<svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
      <defs>
        <linearGradient id="bgG3" x1="0" y1="0" x2="320" y2="180" gradientUnits="userSpaceOnUse">
          <stop stop-color="#090d16"/>
          <stop offset="1" stop-color="#030712"/>
        </linearGradient>
        <linearGradient id="xuvBody" x1="40" y1="50" x2="280" y2="140" gradientUnits="userSpaceOnUse">
          <stop stop-color="#1e1b4b"/>
          <stop offset="1" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#bgG3)"/>
      <path d="M35 145 H285" stroke="#1e293b" stroke-width="2"/>
      <path d="M42 124 C42 108 52 102 70 100 L95 98 L130 55 C142 48 160 48 200 48 L235 52 C248 56 258 66 266 84 L276 98 C282 104 282 114 278 124 L272 136 C265 140 255 140 245 140 H58 C46 140 42 134 42 124 Z" fill="url(#xuvBody)"/>
      <circle cx="92" cy="135" r="21" fill="#020617" stroke="#4338ca" stroke-width="4"/>
      <circle cx="92" cy="135" r="10" fill="#a5b4fc"/>
      <circle cx="236" cy="135" r="21" fill="#020617" stroke="#4338ca" stroke-width="4"/>
      <circle cx="236" cy="135" r="10" fill="#a5b4fc"/>
      <text x="160" y="168" fill="#818cf8" font-size="10" font-family="system-ui" text-anchor="middle" font-weight="600">XUV700 AX7L · MIDNIGHT BLACK</text>
    </svg>`,
  },
  {
    id: 'sample-city-2020',
    title: '2020 Honda City 5th Gen ZX CVT',
    badge: 'Executive D-Segment Sedan',
    make: 'Honda',
    model: 'City',
    generation: '5th Gen (2020 – Present)',
    variant: 'ZX',
    registrationYear: 2020,
    fuelType: 'Petrol',
    transmission: 'CVT',
    kilometersDriven: 39000,
    rtoLocation: 'TS-09 (Hyderabad Central / Khairatabad)',
    color: 'Platinum White Pearl',
    conditionScore: 91,
    confidenceScore: 93,
    dentsScratchReport: 'Clean bodywork. Minor underbody air dam scuff on high speed-breaker, verified non-structural.',
    damageReport: {
      severity: 'Minor',
      affectedPanels: ['Front Bumper'],
      scratchDepth: 'Surface Swirls',
      repaintedPanelsCount: 0,
      estimatedRepairCostInr: 8500,
      damageDeductionInr: 8500,
      maintenanceConditionText: '- ₹8,500 for minor exterior damage (Front Bumper) and paint repair',
      maintenanceConditionDeltaInr: -8500,
    },
    previewSvg: `<svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full object-cover">
      <defs>
        <linearGradient id="bgG4" x1="0" y1="0" x2="320" y2="180" gradientUnits="userSpaceOnUse">
          <stop stop-color="#0f172a"/>
          <stop offset="1" stop-color="#020617"/>
        </linearGradient>
        <linearGradient id="cityBody" x1="40" y1="60" x2="280" y2="135" gradientUnits="userSpaceOnUse">
          <stop stop-color="#f1f5f9"/>
          <stop offset="1" stop-color="#94a3b8"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#bgG4)"/>
      <path d="M30 145 H290" stroke="#334155" stroke-width="2"/>
      <path d="M38 128 C38 116 48 112 65 110 L92 108 L125 76 C138 65 155 64 190 64 L225 65 C235 68 244 76 250 88 L272 110 C282 112 288 118 288 128 L284 136 C276 140 268 140 255 140 H55 C44 140 38 136 38 128 Z" fill="url(#cityBody)"/>
      <circle cx="88" cy="135" r="19" fill="#020617" stroke="#cbd5e1" stroke-width="4"/>
      <circle cx="88" cy="135" r="8" fill="#64748b"/>
      <circle cx="238" cy="135" r="19" fill="#020617" stroke="#cbd5e1" stroke-width="4"/>
      <circle cx="238" cy="135" r="8" fill="#64748b"/>
      <text x="160" y="168" fill="#cbd5e1" font-size="10" font-family="system-ui" text-anchor="middle" font-weight="600">HONDA CITY ZX CVT · PLATINUM WHITE</text>
    </svg>`,
  },
];

export const SAMPLE_NLP_PROMPTS = [
  "Selling my 2022 Kia Carens Luxury Plus diesel automatic in Hyderabad TS-09, done 36,000 km, single owner with zero-dep insurance and excellent showroom condition without any scratches",
  "2021 Maruti Suzuki Swift ZXi+ petrol manual in Delhi DL-01, done 28,500 km, 1st owner, minor bumper scratches and swirl marks",
  "Looking to valuate my 2021 Kia Carnival Limousine diesel AT in Bangalore KA-03, 52,000 km, single owner, mint showroom exterior condition",
  "2020 Maruti Suzuki Wagon R 1.2 ZXi petrol manual in Mumbai MH-12, 39,000 km, 1st owner, moderate dent on left front door",
  "2018 white Creta 1.6 SX diesel manual in Bangalore KA-03, done 46,000 km, single owner, minor stone chips on front bumper",
  "2023 Tata Nexon Fearless+ DCA in Delhi DL-01, 18,500 km, 1st owner, flawless showroom exterior condition",
  "2022 Mahindra XUV700 AX7L Diesel AT in Mumbai MH-02, 34,000 km, 1st owner, light scratch on right rear door",
  "2023 Maruti Suzuki Grand Vitara Alpha Strong Hybrid in Gurugram HR-26, 12,000 km, immaculate condition with zero scratches",
];
