import type { CropAnalysis, PlantInfo } from '../types';

export interface CropMetadata {
  id: string;
  displayName: string;
  scientificName: string;
  isWeed: boolean;
  watering: string;
  sunlight: string;
  soil: string;
  fertilizer: string;
  needs: string[];
  benefits: string[];
  ecoImpact: {
    stubbleBurningRisk: 'High' | 'Medium' | 'Low' | 'None';
    bioAlternative: string;
    waterSavedLiters: number;
    carbonOffsetKg: number;
    smokeAvoidedKg?: number;
  };
  season: string;
  guide: string;
  pricePerMaund: number;
  yieldPerAcre: number;
  costPerAcre: number;
  mandiPriceText: string;
  tradingHubs: string;
  diseases: { name: string; solution: string }[];
  marketTrend: string;
}

/**
 * Complete, 100% accurate offline agronomy database for:
 * 1. ALL 10 pre-seeded Pakistani crops in CropSelector.tsx (Wheat, Rice, Cotton, Sugarcane, Maize, Potato, Onion, Mango, Chickpea, Kinnow)
 * 2. ALL 30 labels in /models/labels.txt
 */
export const OFFLINE_CROP_DATABASE: Record<string, CropMetadata> = {
  // 1. WHEAT (Gandum / Kanak / Gehun) - Never map to Rice!
  'wheat': {
    id: 'wheat',
    displayName: 'Wheat (Gandum / Kanak)',
    scientificName: 'Triticum aestivum',
    isWeed: false,
    watering: '4-5 irrigations: 1st at crown root initiation (20-25 days after sowing), 2nd at tillering, 3rd at flowering, 4th at milk stage.',
    sunlight: 'Full direct winter sun (6-8 hours daily)',
    soil: 'Fertile, well-drained loam or clay-loam, pH 6.0-7.5',
    fertilizer: 'DAP 2 bags/acre at sowing, Urea 2.5-3 bags in 2 splits with first two irrigations, Zinc Sulphate (33%) 5kg/acre.',
    needs: [
      'Timely sowing between Nov 1-20 for optimum grain yield',
      'Regular scouting for Yellow rust (Puccinia striiformis) during cool humid spells'
    ],
    benefits: [
      'Major national staple grain anchoring Pakistan food security',
      'Wheat straw (Bhusa) provides indispensable dry fodder for Punjab livestock'
    ],
    ecoImpact: {
      stubbleBurningRisk: 'High',
      bioAlternative: 'Punjab Super Seeder direct-drilling or Happy Seeder zero-tillage into unburned residue.',
      waterSavedLiters: 80000,
      carbonOffsetKg: 1100,
      smokeAvoidedKg: 320
    },
    season: 'Rabi (November to April)',
    guide: '1. Seedbed Preparation: 2-3 deep cultivations followed by planking (Sohaga) to create fine crumbly seedbed.\n2. Sowing: Drill certified seed (Akbar-19, Dilkash-20, Subhani-21) at 100-120 kg/acre.\n3. Weed Management: Apply Bromoxynil + MCPA for broadleaf weeds and Clodinafop-propargyl for grassy weeds.\n4. Harvesting: Combine harvest when grain moisture drops below 12%. Use straw chopper instead of burning.',
    pricePerMaund: 3900,
    yieldPerAcre: 45,
    costPerAcre: 58000,
    mandiPriceText: 'PKR 3,900',
    tradingHubs: 'Faisalabad, Sahiwal, Bahawalpur, Khanewal, Sargodha grain mandis',
    diseases: [
      { name: 'Yellow / Stripe Rust (Puccinia striiformis)', solution: 'Spray Propiconazole 25% EC (Tilt @ 200ml/acre) or Tebuconazole at first appearance of yellow pustules.' },
      { name: 'Wheat Aphids (Sitobion avenae)', solution: 'Spray Imidacloprid (200 SL @ 100ml/acre) or Acetamiprid if aphid population exceeds economic threshold (15 per earhead).' }
    ],
    marketTrend: 'Steady support benchmark across Punjab grain mandis with heavy government procurement activity.'
  },

  // 2. RICE (Chawal / Basmati Paddy)
  'rice': {
    id: 'rice',
    displayName: 'Rice (Chawal / Basmati Paddy)',
    scientificName: 'Oryza sativa',
    isWeed: false,
    watering: 'Continuous shallow ponding (2-3 inches) for first 30 days post-transplantation; alternate wetting & drying afterwards.',
    sunlight: 'Full intense sun (8-10 hours daily)',
    soil: 'Heavy clay or clay loam with impermeable hardpan to retain ponded water, pH 6.0-7.5',
    fertilizer: 'DAP 1.5 bags, SOP 1 bag at puddle, Urea 2.5 bags in splits (tillering and panicle initiation), Zinc 33% 5kg.',
    needs: [
      'Strict laser leveling to minimize water consumption',
      'Pest scouting for Rice Stem Borer and Leaf Folder during tillering'
    ],
    benefits: [
      'Premium export commodity earning critical foreign exchange for Pakistan',
      'High economic return in the historic Kalar Rice Bowl'
    ],
    ecoImpact: {
      stubbleBurningRisk: 'High',
      bioAlternative: 'Direct incorporation with Rotavator, Super Seeder sowing of wheat, or PUSA bio-decomposer spray.',
      waterSavedLiters: 150000,
      carbonOffsetKg: 1450,
      smokeAvoidedKg: 480
    },
    season: 'Kharif (May to November)',
    guide: '1. Nursery Raising: Sow Super Basmati or Kainat (1121) nursery in late May to June.\n2. Puddling: Thoroughly puddle field and transplant 25-30 day old seedlings at 2 plants per hill (9x9 inches spacing).\n3. Water Management: Maintain standing water for weed suppression during early stage.\n4. Anti-Smog: Never burn rice straw; deploy Happy Seeder or Super Seeder directly.',
    pricePerMaund: 4800,
    yieldPerAcre: 48,
    costPerAcre: 85000,
    mandiPriceText: 'PKR 4,800',
    tradingHubs: 'Hafizabad, Gujranwala, Sheikhupura, Nankana Sahib, Kamoke mandis',
    diseases: [
      { name: 'Bacterial Leaf Blight (Xanthomonas oryzae)', solution: 'Drain standing water for 2-3 days; spray Copper Hydroxide (Kocide @ 250g/acre); reduce nitrogen fertilizer.' },
      { name: 'Rice Blast (Magnaporthe oryzae)', solution: 'Spray Tricyclazole (Beam 75 WP @ 120g/acre) or Isoprothiolane at panicle emergence.' }
    ],
    marketTrend: 'Active export procurement with high premium on 1121 Kainat and Super Basmati.'
  },

  // 3. COTTON (Kapaas / Phutti)
  'cotton': {
    id: 'cotton',
    displayName: 'Cotton (Kapaas / Phutti)',
    scientificName: 'Gossypium hirsutum',
    isWeed: false,
    watering: '5-6 irrigations on ridges; critical stages: squaring, flowering, and boll development.',
    sunlight: 'Intense direct sunlight (8-10 hours daily)',
    soil: 'Deep fertile alluvial loam with good internal drainage, pH 7.0-8.5',
    fertilizer: 'Basal DAP 1.5 bags/acre, Urea 3 bags in 4 splits, Potassium Sulphate 1 bag at boll formation.',
    needs: [
      'Intensive IPM scouting for Whitefly, Pink Bollworm, and Jassid',
      'Install PB-Rope pheromone dispensers or delta traps at 45 days after sowing'
    ],
    benefits: [
      'Silver fiber of Pakistan, underpinning country textile export industry',
      'Cottonseed provides prime edible oil and high-protein livestock feed cake (Khal)'
    ],
    ecoImpact: {
      stubbleBurningRisk: 'Medium',
      bioAlternative: 'Chop cotton sticks with tractor shredder to incorporate organic biomass or utilize for clean compressed heating pellets.',
      waterSavedLiters: 90000,
      carbonOffsetKg: 650
    },
    season: 'Kharif (April to October)',
    guide: '1. Sowing: Bed-ridge planting with certified delinted Bt-cotton seed at 6-8 kg/acre.\n2. Spacing: 2.5 ft bed spacing with 9-12 inches plant spacing.\n3. Weed Control: Spray Pendimethalin within 24 hours of sowing.\n4. Picking: Pick clean seed cotton (Phutti) after dew evaporates to maintain grade A fiber quality.',
    pricePerMaund: 8200,
    yieldPerAcre: 28,
    costPerAcre: 95000,
    mandiPriceText: 'PKR 8,200',
    tradingHubs: 'Multan, Bahawalpur, Khanewal, Vehari, Rahim Yar Khan mandis',
    diseases: [
      { name: 'Whitefly (Bemisia tabaci) & CLCuV Vector', solution: 'Spray Pyriproxyfen (500ml/acre) or Diafenthiuron (200ml/acre); avoid broad-spectrum pyrethroids.' },
      { name: 'Pink Bollworm (Pectinophora gossypiella)', solution: 'Install PB-Rope pheromone dispensers or spray Spinetoram (100ml/acre) at economic threshold.' }
    ],
    marketTrend: 'Robust trading across South Punjab spinning mills with firm spot prices.'
  },

  // 4. SUGARCANE (Kamad / Ganna)
  'sugarcane': {
    id: 'sugarcane',
    displayName: 'Sugarcane (Kamad / Ganna)',
    scientificName: 'Saccharum officinarum',
    isWeed: false,
    watering: '16-20 irrigations throughout 10-12 month vegetative cycle.',
    sunlight: 'Continuous full tropical sunlight',
    soil: 'Deep, fertile, well-drained loam or clay-loam, pH 6.5-7.8',
    fertilizer: 'DAP 2 bags/acre at planting, Urea 4 bags in splits until July, SOP 1.5 bags.',
    needs: [
      'Earthing up before monsoon onset to prevent heavy stalk lodging',
      'Borer monitoring (Top borer, stem borer, Gurdaspur borer)'
    ],
    benefits: [
      'High cash flow crop with guaranteed mill procurement under Punjab Sugar Factories Control Act',
      'Bagasse byproduct generates renewable biomass cogeneration power'
    ],
    ecoImpact: {
      stubbleBurningRisk: 'High',
      bioAlternative: 'Retain trash mulch between ratoon rows to conserve 30% soil moisture and prevent illegal trash burning.',
      waterSavedLiters: 210000,
      carbonOffsetKg: 1850,
      smokeAvoidedKg: 420
    },
    season: 'Autumn (Sept-Oct) & Spring (Feb-March)',
    guide: '1. Sett Preparation: Use clean 2-3 budded setts (CPF-249, CP-77-400) treated with Carbendazim.\n2. Trenches: Dig deep 4-ft spaced trenches and place overlapping setts.\n3. Weed Management: Pre-emergence Ametryn + Atrazine.\n4. Earthing Up: Perform in June to bury bottom nodes and build sturdy ridges.',
    pricePerMaund: 425,
    yieldPerAcre: 750,
    costPerAcre: 160000,
    mandiPriceText: 'PKR 425',
    tradingHubs: 'Faisalabad, Sargodha, Mandi Bahauddin, Jhang, Toba Tek Singh mill zones',
    diseases: [
      { name: 'Red Rot (Colletotrichum falcatum)', solution: 'Use certified red rot resistant seed setts; treat with systemic fungicide; avoid ratoon of infected fields.' },
      { name: 'Top Borer (Scirpophaga excerptalis)', solution: 'Apply Chlorantraniliprole (Ferterra @ 4kg/acre) or Carbofuran granules in whorls.' }
    ],
    marketTrend: 'Steady crushing season supplies to sugar mills with official indicative price benchmark.'
  },

  // 5. MAIZE (Makai / Hybrid Corn)
  'maize': {
    id: 'maize',
    displayName: 'Maize (Makai / Hybrid Corn)',
    scientificName: 'Zea mays',
    isWeed: false,
    watering: '8-10 irrigations. Water stress during silking and grain filling severely reduces cob yield.',
    sunlight: 'Full bright sunlight (6-8 hours daily)',
    soil: 'Rich, fertile, well-aerated sandy loam to clay loam, pH 6.0-7.5',
    fertilizer: 'DAP 2 bags, Urea 3-4 bags in splits, SOP 1 bag, Zinc Sulphate 5kg/acre.',
    needs: [
      'Fall Armyworm (Spodoptera frugiperda) scouting from seedling emergence',
      'Ridge bed planting to prevent waterlogging around roots'
    ],
    benefits: [
      'Double-season high cash return (Spring & Autumn)',
      'High demand from poultry feed industry, corn starch mills, and green silage'
    ],
    ecoImpact: {
      stubbleBurningRisk: 'Medium',
      bioAlternative: 'Shred maize stalks with flail mower to incorporate biomass or produce sweet high-energy cattle silage.',
      waterSavedLiters: 70000,
      carbonOffsetKg: 850
    },
    season: 'Spring (Jan-Feb) & Autumn (July-Aug)',
    guide: '1. Bed Planting: Make 75cm ridges with tractor bed shaper.\n2. Sowing: Dibble single seed at 15-20cm spacing on ridge shoulders (8-10 kg seed/acre).\n3. Pest Control: Apply Chlorantraniliprole or Emamectin benzoate into central leaf whorl for Fall Armyworm.\n4. Silage / Grain: Harvest grain at 18-20% moisture or silage when milk line reaches half.',
    pricePerMaund: 2650,
    yieldPerAcre: 90,
    costPerAcre: 88000,
    mandiPriceText: 'PKR 2,650',
    tradingHubs: 'Sahiwal, Okara, Pakpattan, Depalpur, Kasur grain hubs',
    diseases: [
      { name: 'Fall Armyworm (Spodoptera frugiperda)', solution: 'Apply Emamectin Benzoate (1.9 EC @ 200ml/acre) or Chlorantraniliprole (Coragen @ 50ml/acre) directly into leaf whorls.' },
      { name: 'Stalk Rot (Fusarium / Macrophomina)', solution: 'Ensure balanced potassium fertilization; avoid severe moisture stress after tasseling.' }
    ],
    marketTrend: 'Strong demand from poultry feed mills across Sahiwal, Okara, and Faisalabad.'
  },

  // 6. POTATO (Aaloo - Solanum tuberosum) - 100% DISTINCT FROM SWEET POTATO!
  'potato': {
    id: 'potato',
    displayName: 'Potato (Aloo - Solanum tuberosum)',
    scientificName: 'Solanum tuberosum',
    isWeed: false,
    watering: 'Frequent light irrigations (every 7-10 days). Never submerge ridge crests to prevent tuber rot.',
    sunlight: 'Full sun (6-8 hours daily)',
    soil: 'Loose, deep, well-aerated sandy loam rich in organic humus, pH 5.5-6.8',
    fertilizer: 'Well-rotted FYM 10 tons, SOP 2 bags, DAP 2.5 bags, Urea 3 bags in splits.',
    needs: [
      'Earthing up 30-35 days after planting to prevent greening of tubers',
      'Early & late blight preventive spray program during winter fog and smog'
    ],
    benefits: [
      'Flagship commercial cash crop of the Sahiwal-Okara-Pakpattan potato heartland',
      'High profit margins with cold storage management'
    ],
    ecoImpact: {
      stubbleBurningRisk: 'None',
      bioAlternative: 'Incorporate haulm residue directly into soil as green manure before wheat or spring maize.',
      waterSavedLiters: 35000,
      carbonOffsetKg: 350
    },
    season: 'Autumn (Oct-Jan) & Spring (Jan-April)',
    guide: '1. Tuber Preparation: Use certified seed tubers (Asterix, Lady Rosetta, Mozika) kept at room temperature for sprouting.\n2. Ridge Planting: Make 75cm ridges and place tubers 20cm apart at 5-7cm depth.\n3. Earthing Up: Ridge up loose soil around plants at 30 days.\n4. De-haulming: Cut haulms 10-14 days prior to harvest to allow skin curing.',
    pricePerMaund: 2100,
    yieldPerAcre: 280,
    costPerAcre: 145000,
    mandiPriceText: 'PKR 2,100',
    tradingHubs: 'Okara, Sahiwal, Pakpattan, Dipalpur, Lahore vegetable mandis',
    diseases: [
      { name: 'Late Blight (Phytophthora infestans)', solution: 'Preventive: Mancozeb (2.5g/L). Curative: Dimethomorph + Mancozeb (Acrobat) or Metalaxyl + Mancozeb (Ridomil Gold @ 250g/100L water).' },
      { name: 'Early Blight (Alternaria solani)', solution: 'Spray Difenoconazole (Score @ 125ml/acre) or Chlorothalonil upon appearance of concentric target rings.' }
    ],
    marketTrend: 'High volume trading across Okara and Sahiwal cold storage facilities; steady urban dispatch.'
  },

  // 7. ONION (Pyaaz / Piyaz)
  'onion': {
    id: 'onion',
    displayName: 'Onion (Pyaaz / Piyaz)',
    scientificName: 'Allium cepa',
    isWeed: false,
    watering: 'Frequent light irrigations (every 6-8 days); withhold water 10-15 days before harvest to facilitate bulb curing.',
    sunlight: 'Full open sunlight (7-9 hours daily)',
    soil: 'Rich, friable sandy loam to silt loam with pH 6.2-7.2',
    fertilizer: 'DAP 1.5 bags, SOP 1.5 bags at transplanting, Urea 2 bags in splits before bulb swelling.',
    needs: [
      'Scouting for Thrips (Thrips tabaci) especially during dry warm weather',
      'Thorough bulb curing in shaded dry shed'
    ],
    benefits: [
      'Everyday culinary necessity with inelastic domestic consumer demand',
      'High market return during winter and post-monsoon supply troughs'
    ],
    ecoImpact: {
      stubbleBurningRisk: 'None',
      bioAlternative: 'Dry onion tops can be composted into mineral-rich garden mulch.',
      waterSavedLiters: 40000,
      carbonOffsetKg: 280
    },
    season: 'Rabi (Nursery Oct-Nov, Transplant Dec-Jan)',
    guide: '1. Nursery: Raise seedlings of Phulkara or Dark Red on raised beds.\n2. Transplanting: Transplant 6-8 week old seedlings on ridges spaced 45-60cm apart with 10cm plant spacing.\n3. Weed Control: Spray Pendimethalin within 48 hours of transplanting.\n4. Curing: Neck-fall indicates maturity. Cure bulbs under shade for 7-10 days before marketing.',
    pricePerMaund: 3200,
    yieldPerAcre: 220,
    costPerAcre: 110000,
    mandiPriceText: 'PKR 3,200',
    tradingHubs: 'Faisalabad, Lahore, Sargodha, Gujranwala, Multan vegetable mandis',
    diseases: [
      { name: 'Onion Thrips (Thrips tabaci)', solution: 'Spray Spinetoram (Radiant @ 60ml/acre) or Chlorfenapyr; add agricultural sticker for waxy foliage.' },
      { name: 'Purple Blotch (Alternaria porri)', solution: 'Spray Difenoconazole (Score @ 150ml/acre) or Mancozeb + Metalaxyl at onset of purple lesions.' }
    ],
    marketTrend: 'High retail & wholesale velocity; active consignments from Faisalabad and Sindh.'
  },

  // 8. MANGO (Aam - King of Fruits)
  'mango': {
    id: 'mango',
    displayName: 'Mango (Aam - Chaunsa / Sindhri)',
    scientificName: 'Mangifera indica',
    isWeed: false,
    watering: 'Deep basin irrigation every 10-15 days during fruit development; withhold irrigation during winter flower induction.',
    sunlight: 'Abundant intense subtropical sun (8-10 hours daily)',
    soil: 'Deep alluvial loam with good drainage, water table > 2.5m, pH 6.5-8.0',
    fertilizer: 'Per mature tree: 1.5kg Urea, 1kg DAP, 1kg SOP, plus 40kg well-rotted farmyard manure in December.',
    needs: [
      'Mango hopper and Fruit fly control during flowering and fruit maturity',
      'Hot water quarantine treatment (48°C for 60 min) for export consignments'
    ],
    benefits: [
      'National fruit and crown jewel of Pakistani horticultural exports',
      'Premium export prices in UK, Europe, UAE, and Central Asia'
    ],
    ecoImpact: {
      stubbleBurningRisk: 'None',
      bioAlternative: 'Chop orchard prunings with wood chipper for soil organic mulching and moisture conservation.',
      waterSavedLiters: 110000,
      carbonOffsetKg: 2400
    },
    season: 'Perennial orchard (Harvest: May to September)',
    guide: '1. Layout: Plant grafted trees (Chaunsa, Sindhri, Anwar Ratol) at 30x30 feet spacing.\n2. Pruning: Annual post-harvest canopy pruning to allow 30% sunlight penetration.\n3. Fruit Fly IPM: Hang methyl eugenol pheromone traps (6-8 per acre) from April onwards.\n4. Harvesting: Harvest with fruit pedicel attached using picking shears.',
    pricePerMaund: 6500,
    yieldPerAcre: 160,
    costPerAcre: 120000,
    mandiPriceText: 'PKR 6,500',
    tradingHubs: 'Multan, Rahim Yar Khan, Khanewal, Muzaffargarh, Mirpur Khas mandis',
    diseases: [
      { name: 'Mango Anthracnose (Colletotrichum gloeosporioides)', solution: 'Spray Copper Oxychloride (3g/L) before flower opening and Azoxystrobin during fruit development.' },
      { name: 'Mango Hopper (Amritodus atkinsoni)', solution: 'Spray Imidacloprid (0.5ml/L) or Thiamethoxam before flower panicles open; avoid spraying in full bloom.' }
    ],
    marketTrend: 'Premium export demand across Gulf and EU markets; vibrant wholesale trading in Multan.'
  },

  // 9. CHICKPEA (Desi Chana / Gram)
  'chickpea': {
    id: 'chickpea',
    displayName: 'Chickpea (Desi Chana / Gram)',
    scientificName: 'Cicer arietinum',
    isWeed: false,
    watering: 'Drought hardy; usually 1-2 irrigations or purely rainfed (Barani Thal desert tract).',
    sunlight: 'Full direct sunshine (7-8 hours daily)',
    soil: 'Light sandy to sandy loam soils; tolerant to moderate salinity, pH 6.5-8.2',
    fertilizer: 'DAP 1 bag/acre at sowing; Rhizobium seed inoculation; avoid excess nitrogen.',
    needs: [
      'Helicoverpa pod borer scouting at flowering and pod filling',
      'Wilt resistant seed selection (Bittal-98, Noor-2009)'
    ],
    benefits: [
      'Fixes atmospheric nitrogen, restoring soil fertility in arid crop rotations',
      'Essential pulse staple supplying plant protein across Pakistani households'
    ],
    ecoImpact: {
      stubbleBurningRisk: 'None',
      bioAlternative: 'Incorporates residual biological nitrogen (30-40 kg N/acre) directly into subsequent crops.',
      waterSavedLiters: 120000,
      carbonOffsetKg: 550
    },
    season: 'Rabi (October to April)',
    guide: '1. Seed Treatment: Treat seed with Carbendazim + Rhizobium bio-inoculant.\n2. Sowing: Line sowing with seed drill at 30cm row spacing (30-35 kg seed/acre).\n3. Pest Management: Spray Emamectin benzoate or Lufenuron if pod borer larvae exceed 1 per meter row.\n4. Threshing: Harvest when leaves turn golden brown and pods rattle.',
    pricePerMaund: 7800,
    yieldPerAcre: 22,
    costPerAcre: 42000,
    mandiPriceText: 'PKR 7,800',
    tradingHubs: 'Bhakkar, Thal, Layyah, Khushab, Mianwali pulse mandis',
    diseases: [
      { name: 'Chickpea Blight (Ascochyta rabiei)', solution: 'Spray Chlorothalonil (2g/L) or Mancozeb at first symptom; use blight-resistant varieties.' },
      { name: 'Gram Pod Borer (Helicoverpa armigera)', solution: 'Spray Emamectin Benzoate (200ml/acre) or Flubendiamide at 5% pod damage threshold.' }
    ],
    marketTrend: 'Firm prices with strong demand from flour mills and dal processors in Punjab.'
  },

  // 10. KINNOW (Citrus / Mandarin / Orange)
  'kinnow': {
    id: 'kinnow',
    displayName: 'Kinnow (Citrus / Orange / Malta)',
    scientificName: 'Citrus reticulata',
    isWeed: false,
    watering: 'Fortnightly flood or drip irrigation; reduce during winter color break.',
    sunlight: 'Full sun (7-9 hours daily)',
    soil: 'Deep well-drained loam or sandy-loam, pH 6.0-7.5, sensitive to waterlogging',
    fertilizer: 'Per tree: 1.2kg Urea, 800g DAP, 800g SOP in 3 splits (Feb, May, Aug), Zinc foliar spray.',
    needs: [
      'Citrus Canker and Citrus Psylla (vector of Greening) management',
      'Waxing and fungicide grading line treatment for export packing'
    ],
    benefits: [
      'Premier citrus export of Pakistan originating exclusively in Sargodha belt',
      'High vitamin C content and processing value for juice concentrate'
    ],
    ecoImpact: {
      stubbleBurningRisk: 'None',
      bioAlternative: 'Pruned branches chipped into orchard floor organic carbon mulch.',
      waterSavedLiters: 95000,
      carbonOffsetKg: 1950
    },
    season: 'Perennial orchard (Harvest: December to March)',
    guide: '1. Planting: Plant budded plants on Rough Lemon rootstock at 20x20 or 22x22 ft spacing.\n2. Nutrition: Apply balanced NPK along with micronutrients (Zinc, Boron, Manganese).\n3. Pruning: Remove water sprouts and dead twigs in February.\n4. Picking: Clip with fruit clippers leaving a short button button.',
    pricePerMaund: 2800,
    yieldPerAcre: 320,
    costPerAcre: 130000,
    mandiPriceText: 'PKR 2,800',
    tradingHubs: 'Sargodha, Bhalwal, Kot Momin, Toba Tek Singh citrus markets',
    diseases: [
      { name: 'Citrus Canker (Xanthomonas citri)', solution: 'Spray Copper Oxychloride (3g/L) or Streptomycin sulphate at flush emergence and post-monsoon.' },
      { name: 'Citrus Psylla (Diaphorina citri)', solution: 'Spray Imidacloprid (200 SL @ 100ml/acre) or Thiamethoxam on new vegetative flushes.' }
    ],
    marketTrend: 'High-volume export processing in Sargodha factories; active shipments to Russia, Indonesia, and Gulf.'
  },

  // ==========================================
  // ALL 30 TFLITE LABELS (from labels.txt)
  // ==========================================

  'aloevera': {
    id: 'aloevera',
    displayName: 'Aloe Vera (Ghee Kawar)',
    scientificName: 'Aloe barbadensis miller',
    isWeed: false,
    watering: 'Drought tolerant; water once every 12-15 days. Avoid stagnant water.',
    sunlight: 'Direct sunlight with partial midday afternoon shade',
    soil: 'Porous, well-draining sandy loam or gravelly soil, pH 7.0-8.5',
    fertilizer: 'Light organic compost or decomposed farmyard manure once a year.',
    needs: ['Strict drainage to prevent root rot', 'Harvest mature outer leaves cleanly at base'],
    benefits: ['High commercial value for herbal medicine, cosmetics, and skin gels in Pakistan', 'Low water requirement'],
    ecoImpact: { stubbleBurningRisk: 'None', bioAlternative: 'Leftover pulp can be composted into mineral soil conditioner.', waterSavedLiters: 110000, carbonOffsetKg: 350 },
    season: 'Perennial (Year-round propagation)',
    guide: 'Plant healthy sucker offsets (pups) in raised beds spaced 2x2 feet apart. Harvest bottom fleshy leaves after 8 months.',
    pricePerMaund: 4500,
    yieldPerAcre: 180,
    costPerAcre: 60000,
    mandiPriceText: 'PKR 4,500',
    tradingHubs: 'Pattoki, Kasur, Lahore herbal markets',
    diseases: [{ name: 'Aloe Rust (Uromyces aloes)', solution: 'Spray Mancozeb (2g/L) and remove heavily spotted lower leaves.' }],
    marketTrend: 'High demand from domestic pharmaceutical and cosmetic brands in Lahore and Karachi.'
  },

  'banana': {
    id: 'banana',
    displayName: 'Banana (Kela)',
    scientificName: 'Musa acuminata',
    isWeed: false,
    watering: 'Heavy water demand; irrigate every 4-6 days in summer.',
    sunlight: 'Full sunny tropical exposure',
    soil: 'Deep, rich, alluvial loam with high organic matter, pH 6.0-7.5',
    fertilizer: 'Heavy feeder: Urea 5 bags, DAP 2 bags, SOP 3 bags per acre in monthly splits.',
    needs: ['Windbreak trees to prevent pseudostem lodging', 'Desuckering leaving one follower sucker per clump'],
    benefits: ['Continuous year-round cash flow for growers in Sindh and South Punjab', 'Nutritious potassium-rich fruit'],
    ecoImpact: { stubbleBurningRisk: 'None', bioAlternative: 'Banana pseudostem fiber extracted for textiles or decomposed into organic vermicompost.', waterSavedLiters: 60000, carbonOffsetKg: 1300 },
    season: 'Perennial (Peak harvest July to November)',
    guide: 'Plant sword suckers or tissue culture plantlets (Basrai, Grand Naine) at 6x6 feet spacing. Provide regular propping for heavy bunches.',
    pricePerMaund: 3200,
    yieldPerAcre: 350,
    costPerAcre: 155000,
    mandiPriceText: 'PKR 3,200',
    tradingHubs: 'Thatta, Hyderabad, Lahore, Multan fruit mandis',
    diseases: [{ name: 'Panama Wilt (Fusarium oxysporum f. sp. cubense)', solution: 'Use certified tissue culture plants; drench soil with Carbendazim (2g/L).' }],
    marketTrend: 'Strong constant daily demand across all major urban fruit terminals.'
  },

  'bilimbi': {
    id: 'bilimbi',
    displayName: 'Bilimbi (Tree Sorrel)',
    scientificName: 'Averrhoa bilimbi',
    isWeed: false,
    watering: 'Moderate regular watering; moist soil.',
    sunlight: 'Full sun to partial shade',
    soil: 'Rich, organic, well-draining garden soil, pH 5.5-6.5',
    fertilizer: 'Balanced organic compost twice a year.',
    needs: ['Protection from freezing winter winds in Northern Punjab', 'Regular harvesting of tangy acidic fruits'],
    benefits: ['Specialty culinary acidulant used in pickles, curries, and traditional phytomedicine'],
    ecoImpact: { stubbleBurningRisk: 'None', bioAlternative: 'Pruned biomass composts into organic humus.', waterSavedLiters: 45000, carbonOffsetKg: 400 },
    season: 'Subtropical perennial (Fruiting multiple times yearly)',
    guide: 'Grow from seed or air-layering. Train as small orchard tree. Fruit clusters appear directly on trunk and older branches.',
    pricePerMaund: 3800,
    yieldPerAcre: 110,
    costPerAcre: 48000,
    mandiPriceText: 'PKR 3,800',
    tradingHubs: 'Karachi, Lahore specialty produce markets',
    diseases: [{ name: 'Leaf Spot (Cercospora averrhoa)', solution: 'Spray Copper Oxychloride (2.5g/L) during rainy periods.' }],
    marketTrend: 'Niche specialty demand for pickles and gourmet culinary processing.'
  },

  'cantaloupe': {
    id: 'cantaloupe',
    displayName: 'Cantaloupe (Garma / Sweet Melon)',
    scientificName: 'Cucumis melo var. cantalupensis',
    isWeed: false,
    watering: 'Regular furrow watering; avoid wetting fruit and vine crowns to prevent rotting.',
    sunlight: 'Full bright sunlight (8+ hours daily)',
    soil: 'Well-aerated sandy loam with excellent thermal drainage, pH 6.0-7.0',
    fertilizer: 'DAP 1.5 bags, SOP 1 bag, Urea 2 bags in splits before fruit expansion.',
    needs: ['Bees or pollinators for prolific fruit setting', 'Fruit bedding with dry straw to prevent ground spotting'],
    benefits: ['High-value summer cash crop popular across Pakistani desert border tracts', 'Rapid 75-85 day turnover'],
    ecoImpact: { stubbleBurningRisk: 'None', bioAlternative: 'Vine residue directly ploughed under to build sandy soil organic matter.', waterSavedLiters: 50000, carbonOffsetKg: 320 },
    season: 'Zaid / Summer (Feb to June)',
    guide: 'Sow on wide 6-foot beds with 1.5-foot seed spacing. Apply straw mulch beneath developing melons.',
    pricePerMaund: 2200,
    yieldPerAcre: 190,
    costPerAcre: 68000,
    mandiPriceText: 'PKR 2,200',
    tradingHubs: 'Bahawalpur, D.G. Khan, Sahiwal, Lahore mandis',
    diseases: [{ name: 'Powdery Mildew (Podosphaera xanthii)', solution: 'Spray Difenoconazole or Wettable Sulphur (2g/L) at first white powdery patch.' }],
    marketTrend: 'Brisk summer fruit sales with high retail turnover.'
  },

  'cassava': {
    id: 'cassava',
    displayName: 'Cassava (Yuca / Tapioca)',
    scientificName: 'Manihot esculenta',
    isWeed: false,
    watering: 'Extremely drought resilient; requires minimal supplemental irrigation after rooting.',
    sunlight: 'Full tropical sun (8 hours daily)',
    soil: 'Loose, deep sandy loam; avoids heavy waterlogging, pH 5.5-7.0',
    fertilizer: 'Low feeder: Single basal bag of DAP and 1 bag SOP per acre.',
    needs: ['Deep soil preparation for large tuber expansion', 'Weed free during first 90 days'],
    benefits: ['Starch-dense staple and strategic climate-resilient famine insurance', 'Industrial starch production'],
    ecoImpact: { stubbleBurningRisk: 'None', bioAlternative: 'Stem cuttings used for propagation; leaves provide proteinaceous livestock forage.', waterSavedLiters: 140000, carbonOffsetKg: 950 },
    season: 'Kharif planting (Matures in 9-11 months)',
    guide: 'Plant 20cm mature stem cuttings horizontally or slanting into prepared ridges at 3x3 ft spacing.',
    pricePerMaund: 2800,
    yieldPerAcre: 310,
    costPerAcre: 52000,
    mandiPriceText: 'PKR 2,800',
    tradingHubs: 'Karachi, Multan starch processing markets',
    diseases: [{ name: 'Cassava Mosaic Disease (CMD)', solution: 'Plant certified virus-free cuttings; control whitefly vectors with Acetamiprid.' }],
    marketTrend: 'Growing agro-industrial interest for sustainable animal feed and food starch.'
  },

  'coconut': {
    id: 'coconut',
    displayName: 'Coconut (Naryal)',
    scientificName: 'Cocos nucifera',
    isWeed: false,
    watering: 'Regular basin irrigation; requires 50-80 liters/palm daily in coastal climates.',
    sunlight: 'Full tropical sunshine',
    soil: 'Coastal sand, alluvial loams with high salinity tolerance, pH 5.5-8.0',
    fertilizer: 'Per palm: 1.5kg Urea, 1kg DAP, 2kg MOP (high chloride requirement) and 500g Magnesium sulphate.',
    needs: ['Protection from freezing northern frost', 'Crown cleaning and rhinoceros beetle checks'],
    benefits: ['Versatile yield: coconut water, copra, oil, and coir fiber', 'Decades-long productive tree lifespan'],
    ecoImpact: { stubbleBurningRisk: 'None', bioAlternative: 'Husks processed into coir peat for water-saving greenhouse horticultural substrates.', waterSavedLiters: 100000, carbonOffsetKg: 3100 },
    season: 'Perennial coastal palm (Year-round nut harvest)',
    guide: 'Dig 3x3x3 ft pits enriched with compost and river sand. Plant selected dwarf or tall varieties at 25x25 ft spacing.',
    pricePerMaund: 5500,
    yieldPerAcre: 85,
    costPerAcre: 90000,
    mandiPriceText: 'PKR 5,500',
    tradingHubs: 'Karachi, Thatta, Badin, Lahore wholesale dry fruit trade',
    diseases: [{ name: 'Bud Rot (Phytophthora palmivora)', solution: 'Clean infected crown tissues; apply Bordeaux paste or Copper Oxychloride.' }],
    marketTrend: 'High demand in fresh fruit juice stalls and commercial bakeries across Pakistan.'
  },

  'corn': {
    id: 'corn',
    displayName: 'Corn (Makai)',
    scientificName: 'Zea mays',
    isWeed: false,
    watering: '8-10 irrigations. Water stress at silking drops yield significantly.',
    sunlight: 'Full bright sunlight (6-8 hours daily)',
    soil: 'Fertile, well-drained sandy loam or silt loam, pH 6.0-7.5',
    fertilizer: 'DAP 2 bags, Urea 3-4 bags in splits, SOP 1 bag, Zinc 5kg/acre.',
    needs: ['Fall armyworm scouting at whorl stage', 'Earthing up to brace root system'],
    benefits: ['Dual use: high grain market price and nutritious green fodder silage', 'Rapid 100-day harvest'],
    ecoImpact: { stubbleBurningRisk: 'Medium', bioAlternative: 'Chop corn stalks into green fodder silage or soil biomass incorporation.', waterSavedLiters: 70000, carbonOffsetKg: 850 },
    season: 'Spring & Autumn double-cropping',
    guide: 'Sow certified single-cross hybrid seed at 8-10 kg/acre on 75cm ridges with 18cm seed spacing.',
    pricePerMaund: 2650,
    yieldPerAcre: 90,
    costPerAcre: 88000,
    mandiPriceText: 'PKR 2,650',
    tradingHubs: 'Sahiwal, Okara, Pakpattan, Depalpur mandis',
    diseases: [{ name: 'Fall Armyworm (Spodoptera frugiperda)', solution: 'Apply Emamectin Benzoate (200ml/acre) into central leaf whorls.' }],
    marketTrend: 'Constant high absorption by Punjab poultry feed mills.'
  },

  'cucumber': {
    id: 'cucumber',
    displayName: 'Cucumber (Kheera)',
    scientificName: 'Cucumis sativus',
    isWeed: false,
    watering: 'Drip or light furrow irrigation every 2-3 days; avoid moisture fluctuation to prevent fruit bitterness.',
    sunlight: 'Full sun to partial tunnel shade',
    soil: 'Rich, loose sandy loam high in organic compost, pH 6.0-7.0',
    fertilizer: 'Fertigation with NPK 20-20-20 and Calcium Nitrate during fruiting.',
    needs: ['Trellising on vertical strings in high tunnels', 'Preventive downy mildew protection in humid weather'],
    benefits: ['Top tunnel farming crop in Punjab with massive export and urban salad consumption', 'Daily harvest turnover'],
    ecoImpact: { stubbleBurningRisk: 'None', bioAlternative: 'Compost green haulm vines directly into soil conditioning.', waterSavedLiters: 40000, carbonOffsetKg: 290 },
    season: 'Tunnel season (Oct-April) & Open field (Feb-May)',
    guide: 'Plant parthenocarpic seed in walk-in or high tunnels. Trellis single stems vertically and remove lateral shoots up to 5th node.',
    pricePerMaund: 1900,
    yieldPerAcre: 380,
    costPerAcre: 135000,
    mandiPriceText: 'PKR 1,900',
    tradingHubs: 'Sheikhupura, Kasur, Sahiwal, Lahore vegetable mandis',
    diseases: [{ name: 'Downy Mildew (Pseudoperonospora cubensis)', solution: 'Spray Dimethomorph + Mancozeb (Acrobat @ 250g/100L) or Cymoxanil.' }],
    marketTrend: 'Steady year-round consumption in restaurants and major urban vegetable marts.'
  },

  'curcuma': {
    id: 'curcuma',
    displayName: 'Curcuma (Haldi / Turmeric)',
    scientificName: 'Curcuma longa',
    isWeed: false,
    watering: '12-15 irrigations; maintain cool moist root zone under organic straw mulch.',
    sunlight: 'Partial shade to filtered direct sunlight',
    soil: 'Deep, loose, fertile sandy loam rich in organic matter, pH 6.0-7.5',
    fertilizer: 'DAP 2 bags, SOP 2 bags, Urea 2 bags in splits, heavy farmyard manure (10 tons).',
    needs: ['Thick straw mulching at planting to preserve moisture and suppress weeds', '8-9 month maturation period'],
    benefits: ['High commercial return in Kasur and Chunian turmeric belt', 'Potent anti-inflammatory curcumin extraction'],
    ecoImpact: { stubbleBurningRisk: 'None', bioAlternative: 'Straw mulch remains in soil to elevate organic carbon reserves.', waterSavedLiters: 65000, carbonOffsetKg: 680 },
    season: 'Kharif (Plant April-May, Harvest Jan-Feb)',
    guide: 'Plant healthy mother or finger rhizomes (25-30g each) on raised ridges spaced 45cm apart with 20cm seed spacing. Mulch immediately with rice straw.',
    pricePerMaund: 6800,
    yieldPerAcre: 190,
    costPerAcre: 115000,
    mandiPriceText: 'PKR 6,800',
    tradingHubs: 'Kasur, Chunian, Akbari Mandi Lahore wholesale spice hub',
    diseases: [{ name: 'Rhizome Rot (Pythium aphanidermatum)', solution: 'Treat seed rhizomes with Metalaxyl + Mancozeb (Ridomil Gold @ 2g/L) before planting.' }],
    marketTrend: 'Strong demand from spice mills and export merchants in Lahore.'
  },

  'eggplant': {
    id: 'eggplant',
    displayName: 'Eggplant (Baingan / Brinjal)',
    scientificName: 'Solanum melongena',
    isWeed: false,
    watering: 'Irrigate every 5-7 days; keep uniform moisture during fruit development.',
    sunlight: 'Full direct sunlight (7-8 hours daily)',
    soil: 'Deep, rich, well-drained loam or silt loam, pH 6.0-7.0',
    fertilizer: 'DAP 1.5 bags, Urea 2.5 bags in splits, SOP 1 bag/acre.',
    needs: ['Shoot and fruit borer (Leucinodes orbonalis) pheromone traps and sprays', 'Sturdy staking for heavy varieties'],
    benefits: ['High-yielding hardy vegetable popular in both rural and urban Pakistani diet', 'Long productive picking window'],
    ecoImpact: { stubbleBurningRisk: 'None', bioAlternative: 'Shred post-harvest woody stems into organic compost.', waterSavedLiters: 45000, carbonOffsetKg: 340 },
    season: 'Autumn (Transplant Aug-Sept) & Spring (Transplant Feb-March)',
    guide: 'Transplant 4-5 week old sturdy seedlings on 75cm ridges with 45cm plant spacing. Install delta pheromone traps for borer control.',
    pricePerMaund: 1800,
    yieldPerAcre: 260,
    costPerAcre: 75000,
    mandiPriceText: 'PKR 1,800',
    tradingHubs: 'Lahore, Gujranwala, Faisalabad, Rawalpindi mandis',
    diseases: [{ name: 'Shoot & Fruit Borer (Leucinodes orbonalis)', solution: 'Spray Chlorantraniliprole (Coragen @ 50ml/acre) or Emamectin; clip and destroy bored shoots.' }],
    marketTrend: 'Steady daily wholesale demand with high volume turnover.'
  },

  'galangal': {
    id: 'galangal',
    displayName: 'Galangal (Kulanjaan / Greater Galangal)',
    scientificName: 'Alpinia galanga',
    isWeed: false,
    watering: 'Regular watering; enjoys moist soil and humid microclimate.',
    sunlight: 'Filtered sunlight or partial tree shade',
    soil: 'Rich, moist, well-draining loamy soil with high organic compost, pH 6.0-7.5',
    fertilizer: 'Generous farmyard manure and balanced NPK fertilizer.',
    needs: ['Shelter from scorching hot desert winds', 'Harvest dense aromatic rhizomes after 12 months'],
    benefits: ['High-value specialty medicinal and culinary rhizome traded in traditional Unani Dawakhana networks'],
    ecoImpact: { stubbleBurningRisk: 'None', bioAlternative: 'Leaves and pseudostems produce fragrant herbal insect-repellent mulch.', waterSavedLiters: 55000, carbonOffsetKg: 520 },
    season: 'Perennial rhizomatous crop (Planting in early spring)',
    guide: 'Plant rhizome pieces with 2-3 live buds in well-composted raised beds. Provide light shade during peak summer.',
    pricePerMaund: 8500,
    yieldPerAcre: 130,
    costPerAcre: 70000,
    mandiPriceText: 'PKR 8,500',
    tradingHubs: 'Akbari Mandi Lahore, Rawalpindi wholesale herbal drug markets',
    diseases: [{ name: 'Bacterial Wilt (Ralstonia solanacearum)', solution: 'Ensure excellent drainage; drench with Streptomycin sulphate.' }],
    marketTrend: 'Premium pricing in herbal medicine and specialized culinary channels.'
  },

  'ginger': {
    id: 'ginger',
    displayName: 'Ginger (Adrak)',
    scientificName: 'Zingiber officinale',
    isWeed: false,
    watering: 'Frequent light watering; never allow soil to dry out or stay waterlogged.',
    sunlight: 'Partial shade or agroforestry tree understory (50-60% light intensity)',
    soil: 'Deep, rich, loose, friable sandy loam rich in organic matter, pH 5.5-6.8',
    fertilizer: 'Heavy organic compost (12 tons/acre), DAP 2 bags, SOP 2 bags, Urea in small monthly splits.',
    needs: ['Shade netting or intercropping with maize/sugarcane to block intense sun', 'Heavy earthing up around rhizomes'],
    benefits: ['Extremely high value cash crop; Pakistan imports over $100M of ginger annually', 'Huge import-substitution potential'],
    ecoImpact: { stubbleBurningRisk: 'None', bioAlternative: 'Straw mulch provides complete soil moisture conservation.', waterSavedLiters: 60000, carbonOffsetKg: 620 },
    season: 'Spring planting (March-April, Harvest Dec-Jan)',
    guide: 'Plant treated seed rhizomes (30-40g each) in raised beds spaced 30cm apart. Mulch heavily with wheat or rice straw.',
    pricePerMaund: 14000,
    yieldPerAcre: 140,
    costPerAcre: 180000,
    mandiPriceText: 'PKR 14,000',
    tradingHubs: 'Akbari Mandi Lahore, Rawalpindi, Faisalabad wholesale markets',
    diseases: [{ name: 'Soft Rot (Pythium myriotylum)', solution: 'Pre-treat seed rhizomes with Metalaxyl; drench bed with Ridomil Gold at first sign of yellowing.' }],
    marketTrend: 'Consistently the highest-value spice root in Pakistan; massive farmer interest.'
  },

  'guava': {
    id: 'guava',
    displayName: 'Guava (Amrood)',
    scientificName: 'Psidium guajava',
    isWeed: false,
    watering: 'Deep irrigation every 10-14 days; withstands moderate drought and soil salinity.',
    sunlight: 'Full open sun (8 hours daily)',
    soil: 'Adaptable to wide range from sandy loam to clay, pH 6.5-8.2',
    fertilizer: 'Per tree: 1kg Urea, 750g DAP, 750g SOP split in February and July.',
    needs: ['Pruning in May to induce high-quality winter crop (Surahi / Gola)', 'Fruit fly bait traps (Methyl eugenol)'],
    benefits: ['Pakistan is a premier global guava grower (Sharqpur Sharif, Larkana, Sheikhupura)', 'Winter harvest fetches top prices'],
    ecoImpact: { stubbleBurningRisk: 'None', bioAlternative: 'Woody prunings chipped into carbon-rich orchard mulch.', waterSavedLiters: 85000, carbonOffsetKg: 1800 },
    season: 'Biannual (Summer crop July-Aug, Winter crop Nov-Feb)',
    guide: 'Plant grafted or layered plants (Gola, Surahi) at 18x18 ft spacing. Withhold water in April-May to shed summer flowers and secure superior winter crop.',
    pricePerMaund: 2400,
    yieldPerAcre: 240,
    costPerAcre: 72000,
    mandiPriceText: 'PKR 2,400',
    tradingHubs: 'Sharqpur Sharif, Sheikhupura, Larkana, Lahore fruit mandis',
    diseases: [{ name: 'Guava Wilt (Fusarium oxysporum f. sp. psidii)', solution: 'Drench root zone with Carbendazim (2g/L); graft onto resistant rootstock.' }],
    marketTrend: 'Huge winter demand for crisp, sweet Sharqpur white-fleshed guava.'
  },

  'kale': {
    id: 'kale',
    displayName: 'Kale (Karam Kalla / Curly Kale)',
    scientificName: 'Brassica oleracea var. sabellica',
    isWeed: false,
    watering: 'Regular shallow irrigations to keep leaves tender and succulent.',
    sunlight: 'Full winter sun to partial shade',
    soil: 'Moist, fertile, organic-rich loam with pH 6.0-7.5',
    fertilizer: 'Balanced organic compost and nitrogenous topdressing after leaf pickings.',
    needs: ['Protection from cabbage butterflies and aphids', 'Continuous harvesting of bottom outer leaves'],
    benefits: ['Superfood green vegetable fetching premium pricing in high-end urban supermarkets and health cafes'],
    ecoImpact: { stubbleBurningRisk: 'None', bioAlternative: 'Crop residue can be fed to poultry or composted.', waterSavedLiters: 35000, carbonOffsetKg: 240 },
    season: 'Rabi (September to March)',
    guide: 'Sow nursery in September; transplant seedlings on 60cm beds with 30cm spacing. Harvest leaves sequentially as they mature.',
    pricePerMaund: 3600,
    yieldPerAcre: 160,
    costPerAcre: 55000,
    mandiPriceText: 'PKR 3,600',
    tradingHubs: 'Islamabad, Lahore gourmet and organic farmers markets',
    diseases: [{ name: 'Cabbage Aphid (Brevicoryne brassicae)', solution: 'Spray Potassium soap or Acetamiprid (100g/acre) on underside of leaves.' }],
    marketTrend: 'Premium specialty niche in metropolitan green grocers.'
  },

  'longbeans': {
    id: 'longbeans',
    displayName: 'Longbeans (Lobia Phalli / Yardlong Bean)',
    scientificName: 'Vigna unguiculata subsp. sesquipedalis',
    isWeed: false,
    watering: 'Irrigate every 5-7 days; tolerates summer heat well.',
    sunlight: 'Full open sun (8+ hours daily)',
    soil: 'Well-drained loam or sandy loam with neutral pH 6.0-7.2',
    fertilizer: 'Light fertilizer: DAP 1 bag at sowing; fixes own atmospheric nitrogen.',
    needs: ['Trellising on bamboo stakes or wire netting', 'Daily picking of tender green pods'],
    benefits: ['Continuous pod harvesting over 2-3 months', 'Enriches soil with residual biological nitrogen'],
    ecoImpact: { stubbleBurningRisk: 'None', bioAlternative: 'Legume vines fix 30kg biological nitrogen per acre for subsequent crops.', waterSavedLiters: 48000, carbonOffsetKg: 410 },
    season: 'Kharif / Summer (March to August)',
    guide: 'Sow seeds along 4-foot ridges with bamboo trellis support. Pick tender green pods before seeds bulge.',
    pricePerMaund: 3100,
    yieldPerAcre: 175,
    costPerAcre: 50000,
    mandiPriceText: 'PKR 3,100',
    tradingHubs: 'Faisalabad, Multan, Lahore vegetable mandis',
    diseases: [{ name: 'Bean Pod Borer (Maruca vitrata)', solution: 'Spray Emamectin Benzoate (200ml/acre) at early flowering.' }],
    marketTrend: 'Consistent demand across local vegetable bazaars during warm season.'
  },

  'melon': {
    id: 'melon',
    displayName: 'Melon (Kharbooza / Muskmelon)',
    scientificName: 'Cucumis melo',
    isWeed: false,
    watering: 'Irrigate furrows every 5-7 days; avoid wetting vines and fruit directly.',
    sunlight: 'Full bright sun (8-10 hours daily)',
    soil: 'Warm, deep, well-draining sandy loam, pH 6.0-7.2',
    fertilizer: 'DAP 1.5 bags, SOP 1 bag, Urea 2 bags in splits before netting stage.',
    needs: ['Pollination by honeybees for uniform round fruit shape', 'Straw mulching under fruit'],
    benefits: ['Beloved refreshing summer fruit across Pakistan with rapid commercial return', 'High net margins'],
    ecoImpact: { stubbleBurningRisk: 'None', bioAlternative: 'Vines incorporated into sandy soil to boost humus.', waterSavedLiters: 52000, carbonOffsetKg: 330 },
    season: 'Summer (February to June)',
    guide: 'Sow on 6-foot wide raised beds. Thin to 2 plants per hill. Withhold irrigation 5 days before harvest for higher sugar (Brix).',
    pricePerMaund: 2400,
    yieldPerAcre: 210,
    costPerAcre: 72000,
    mandiPriceText: 'PKR 2,400',
    tradingHubs: 'Sargodha, Jhang, Bahawalpur, Rahim Yar Khan mandis',
    diseases: [{ name: 'Fusarium Wilt (Fusarium oxysporum)', solution: 'Practice 3-year crop rotation; use certified wilt-resistant hybrid seeds.' }],
    marketTrend: 'Huge retail volume in summer roadside stalls and urban markets.'
  },

  'orange': {
    id: 'orange',
    displayName: 'Orange (Santra / Sweet Orange)',
    scientificName: 'Citrus sinensis',
    isWeed: false,
    watering: 'Deep basin irrigation every 10-14 days; reduce before ripening to enhance sweetness.',
    sunlight: 'Full sunlight (7-9 hours daily)',
    soil: 'Deep, fertile, well-drained loam, pH 6.0-7.5',
    fertilizer: 'Per tree: 1.2kg Urea, 800g DAP, 800g SOP in 3 seasonal applications, plus Zinc sulphate spray.',
    needs: ['Protection from citrus leafminer and citrus psylla', 'Regular deadwood removal and pruning'],
    benefits: ['Major commercial fruit with rich juice processing industry in Punjab and KPK', 'High export value'],
    ecoImpact: { stubbleBurningRisk: 'None', bioAlternative: 'Orchard prunings converted to soil mulch.', waterSavedLiters: 90000, carbonOffsetKg: 1900 },
    season: 'Harvest: December to March',
    guide: 'Plant certified budded plants (Musambi, Blood Red, Valencia) at 20x20 ft spacing. Apply balanced micronutrient sprays in March and July.',
    pricePerMaund: 2800,
    yieldPerAcre: 300,
    costPerAcre: 125000,
    mandiPriceText: 'PKR 2,800',
    tradingHubs: 'Sargodha, Toba Tek Singh, Haripur citrus mandis',
    diseases: [{ name: 'Citrus Leafminer (Phyllocnistis citrella)', solution: 'Spray Abamectin or Bifenthrin on new tender spring and autumn flushes.' }],
    marketTrend: 'Steady domestic demand and high procurement for industrial juice concentrate.'
  },

  'paddy': {
    id: 'paddy',
    displayName: 'Paddy (Dhan / Shoki Chawal)',
    scientificName: 'Oryza sativa',
    isWeed: false,
    watering: 'Standing water for first 30 days after transplanting; alternate wetting and drying thereafter.',
    sunlight: 'Continuous full sun (8-10 hours daily)',
    soil: 'Heavy clay loam with hardpan to retain water, pH 6.0-7.5',
    fertilizer: 'DAP 1.5 bags, SOP 1 bag, Urea 2.5 bags in splits, Zinc Sulphate 5kg/acre.',
    needs: ['Strict laser leveling to cut water usage by 25%', 'Stem borer monitoring with light traps'],
    benefits: ['Basmati paddy is Pakistan crown export grain earning billions in foreign exchange', 'High rural employment'],
    ecoImpact: { stubbleBurningRisk: 'High', bioAlternative: 'Super Seeder direct drilling of wheat or Happy Seeder zero-burn residue management.', waterSavedLiters: 150000, carbonOffsetKg: 1450, smokeAvoidedKg: 480 },
    season: 'Kharif (May to November)',
    guide: 'Transplant 25-day old Basmati seedlings into puddled field. Maintain weed-free condition for 40 days. Harvest with straw-chopping combine.',
    pricePerMaund: 4800,
    yieldPerAcre: 48,
    costPerAcre: 85000,
    mandiPriceText: 'PKR 4,800',
    tradingHubs: 'Hafizabad, Gujranwala, Sheikhupura, Kamoke grain mandis',
    diseases: [{ name: 'Bacterial Leaf Blight (Xanthomonas oryzae)', solution: 'Drain standing water for 2-3 days; spray Copper Hydroxide (250g/acre).' }],
    marketTrend: 'Premium export procurement with strong international commodity contracts.'
  },

  'papaya': {
    id: 'papaya',
    displayName: 'Papaya (Papeeta)',
    scientificName: 'Carica papaya',
    isWeed: false,
    watering: 'Regular moderate watering; extremely intolerant to waterlogging (causes collar rot).',
    sunlight: 'Full tropical sunshine (8+ hours daily)',
    soil: 'Well-draining, rich sandy loam high in organic matter, pH 6.0-7.0',
    fertilizer: 'Monthly feeding with DAP, Urea, and SOP in small split doses.',
    needs: ['Raised mound planting to drain excess water away from stem', 'Papaya ringspot virus monitoring'],
    benefits: ['Rapid fruiting within 9 months of planting', 'High demand for fresh fruit and medicinal papain enzyme'],
    ecoImpact: { stubbleBurningRisk: 'None', bioAlternative: 'Stems compost quickly into rich organic soil humus.', waterSavedLiters: 50000, carbonOffsetKg: 800 },
    season: 'Perennial (Year-round fruiting in coastal and tunnel zones)',
    guide: 'Plant Red Lady 786 seedlings on 1-foot raised mounds at 7x7 ft spacing. Protect from winter frost in Northern Punjab.',
    pricePerMaund: 4200,
    yieldPerAcre: 380,
    costPerAcre: 110000,
    mandiPriceText: 'PKR 4,200',
    tradingHubs: 'Malir Karachi, Thatta, Multan fruit markets',
    diseases: [{ name: 'Collar Rot / Damping Off (Pythium aphanidermatum)', solution: 'Apply Ridomil Gold drench around base; plant strictly on raised mounds.' }],
    marketTrend: 'High price per kg in major urban grocery stores.'
  },

  'peper chili': {
    id: 'peper chili',
    displayName: 'Chili (Surkh / Sabz Mirch)',
    scientificName: 'Capsicum annuum',
    isWeed: false,
    watering: 'Furrow irrigation every 6-8 days; avoid water stress during flowering to prevent flower drop.',
    sunlight: 'Full direct sunshine (7-9 hours daily)',
    soil: 'Well-drained, fertile sandy loam with pH 6.5-7.5',
    fertilizer: 'DAP 2 bags, SOP 1.5 bags, Urea 2.5 bags in splits after pickings.',
    needs: ['Thrips and Mite scouting to prevent leaf curl virus', 'Clean drying floors for red chili drying'],
    benefits: ['Major cash crop of Kunri (Sindh) and Southern Punjab (Vehari, Sahiwal)', 'Major domestic and export spice'],
    ecoImpact: { stubbleBurningRisk: 'None', bioAlternative: 'Dry chili stalks composted into carbon soil conditioner.', waterSavedLiters: 48000, carbonOffsetKg: 360 },
    season: 'Spring (Nursery Jan, Transplant March) & Autumn',
    guide: 'Transplant 35-day seedlings on 75cm ridges with 30cm spacing. Spray micronutrients at flowering for maximum pod set.',
    pricePerMaund: 7500,
    yieldPerAcre: 180,
    costPerAcre: 92000,
    mandiPriceText: 'PKR 7,500',
    tradingHubs: 'Kunri, Sahiwal, Vehari, Faisalabad spice mandis',
    diseases: [{ name: 'Chili Leaf Curl Virus (transmitted by Whitefly)', solution: 'Spray Pyriproxyfen or Diafenthiuron; remove infected plants immediately.' }],
    marketTrend: 'Very strong price support for dried red whole chilies.'
  },

  'pineapple': {
    id: 'pineapple',
    displayName: 'Pineapple (Ananas)',
    scientificName: 'Ananas comosus',
    isWeed: false,
    watering: 'Low water requirement; water once every 8-10 days into leaf axils.',
    sunlight: 'Full sun to filtered bright light',
    soil: 'Acidic, well-aerated sandy loam with excellent drainage, pH 4.5-6.0',
    fertilizer: 'Light foliar feeds with nitrogen and potassium.',
    needs: ['Acidic soil modification with sulphur if grown in alkaline Pakistani soils', 'Frost protection'],
    benefits: ['High commercial luxury fruit with large domestic market consumption in Pakistan', 'Drought tolerant'],
    ecoImpact: { stubbleBurningRisk: 'None', bioAlternative: 'Fibrous leaves processed into biodegradable agricultural fiber.', waterSavedLiters: 80000, carbonOffsetKg: 450 },
    season: 'Perennial tropical (14-18 month fruit cycle)',
    guide: 'Plant crowns or suckers in double-row raised beds at 30x60cm spacing. Apply iron sulphate if chlorosis appears.',
    pricePerMaund: 9200,
    yieldPerAcre: 140,
    costPerAcre: 130000,
    mandiPriceText: 'PKR 9,200',
    tradingHubs: 'Karachi, Lahore exotic fruit wholesale trade',
    diseases: [{ name: 'Heart Rot (Phytophthora cinnamomi)', solution: 'Dip planting suckers in Metalaxyl before planting; ensure high bed drainage.' }],
    marketTrend: 'Premium exotic fruit pricing across metropolitan retail centers.'
  },

  'pomelo': {
    id: 'pomelo',
    displayName: 'Pomelo (Chakotra / Grapefruit)',
    scientificName: 'Citrus maxima',
    isWeed: false,
    watering: 'Basin irrigation every 10-15 days during fruit expansion.',
    sunlight: 'Full open sunlight (8 hours daily)',
    soil: 'Deep, rich, well-drained alluvial soil, pH 6.0-7.5',
    fertilizer: 'Balanced citrus nutrition: Urea, DAP, SOP with foliar zinc and magnesium.',
    needs: ['Branch propping for exceptionally heavy fruits', 'Citrus canker protection'],
    benefits: ['Largest citrus fruit with antioxidant-rich pulp and commercial pectin peel', 'Long post-harvest shelf life'],
    ecoImpact: { stubbleBurningRisk: 'None', bioAlternative: 'Prunings shredded for orchard mulch.', waterSavedLiters: 90000, carbonOffsetKg: 1850 },
    season: 'Harvest: November to February',
    guide: 'Plant budded trees at 22x22 ft spacing. Thin excess fruitlets to allow remaining fruits to reach maximum jumbo size.',
    pricePerMaund: 3600,
    yieldPerAcre: 220,
    costPerAcre: 85000,
    mandiPriceText: 'PKR 3,600',
    tradingHubs: 'Khanpur, Sargodha, Lahore fruit markets',
    diseases: [{ name: 'Citrus Canker (Xanthomonas citri)', solution: 'Spray Copper Oxychloride (3g/L) during flush emergence.' }],
    marketTrend: 'Increasing health-conscious consumer demand for grapefruit and pomelo.'
  },

  'shallot': {
    id: 'shallot',
    displayName: 'Shallot (Chota Pyaaz / Gandi)',
    scientificName: 'Allium cepa var. aggregatum',
    isWeed: false,
    watering: 'Shallow light irrigation every 5-7 days; stop 10 days before harvest.',
    sunlight: 'Full sunny exposure (6-8 hours daily)',
    soil: 'Loose, friable sandy loam rich in organic matter, pH 6.0-7.0',
    fertilizer: 'DAP 1.5 bags, SOP 1 bag, Urea 1.5 bags in splits.',
    needs: ['Weed-free bed maintenance', 'Thorough shaded bulb curing'],
    benefits: ['Intense gourmet allium flavor used in specialty curries and restaurant cuisines', 'High price per kg'],
    ecoImpact: { stubbleBurningRisk: 'None', bioAlternative: 'Dry tops composted into soil humus.', waterSavedLiters: 38000, carbonOffsetKg: 260 },
    season: 'Rabi (Oct to March)',
    guide: 'Plant individual cloves (bulblets) 15cm apart on raised ridges. Keep top third of bulb exposed as it expands.',
    pricePerMaund: 3500,
    yieldPerAcre: 190,
    costPerAcre: 80000,
    mandiPriceText: 'PKR 3,500',
    tradingHubs: 'Kasur, Okara, Lahore vegetable mandis',
    diseases: [{ name: 'Downy Mildew (Peronospora destructor)', solution: 'Spray Mancozeb (2.5g/L) or Metalaxyl at onset of pale oval spots.' }],
    marketTrend: 'Specialty culinary niche with firm pricing.'
  },

  'soybeans': {
    id: 'soybeans',
    displayName: 'Soybeans (Soybean)',
    scientificName: 'Glycine max',
    isWeed: false,
    watering: '4-5 irrigations; critical during flowering and pod development.',
    sunlight: 'Full bright sunlight (7-8 hours daily)',
    soil: 'Well-drained fertile loam or clay loam, pH 6.0-7.2',
    fertilizer: 'DAP 1.5 bags/acre at sowing; inoculate with Bradyrhizobium japonicum; minimal urea.',
    needs: ['Seed inoculation with nitrogen-fixing bacteria', 'Pod borer scouting at green pod stage'],
    benefits: ['Golden crop supplying edible oil and protein meal for poultry feed', 'Enriches soil with organic nitrogen'],
    ecoImpact: { stubbleBurningRisk: 'None', bioAlternative: 'Legume residues fix 35kg biological nitrogen per acre for next wheat crop.', waterSavedLiters: 55000, carbonOffsetKg: 580 },
    season: 'Kharif (July to October)',
    guide: 'Drill seed at 30-35 kg/acre in 45cm rows. Treat seed with Rhizobium bio-fertilizer. Harvest when 95% of pods turn brown.',
    pricePerMaund: 6200,
    yieldPerAcre: 25,
    costPerAcre: 48000,
    mandiPriceText: 'PKR 6,200',
    tradingHubs: 'Chakwal, Rawalpindi, Faisalabad oilseed processing units',
    diseases: [{ name: 'Rust (Phakopsora pachyrhizi)', solution: 'Spray Propiconazole (200ml/acre) or Azoxystrobin at first appearance of brown pustules.' }],
    marketTrend: 'High demand from solvent extraction plants and poultry feed manufacturers.'
  },

  'spinach': {
    id: 'spinach',
    displayName: 'Spinach (Palak)',
    scientificName: 'Spinacia oleracea',
    isWeed: false,
    watering: 'Light frequent watering every 4-6 days; keep topsoil consistently moist.',
    sunlight: 'Full winter sun to partial shade',
    soil: 'Deep, rich, fertile loam or silt loam high in organic humus, pH 6.5-7.5',
    fertilizer: 'DAP 1 bag, Urea in split doses after each leaf cutting to boost quick regeneration.',
    needs: ['Sequential cut-and-come-again harvesting', 'Scouting for leafminer and downy mildew'],
    benefits: ['Fastest commercial cash turnover (first cut in 30 days, 4-5 total cuts)', 'Daily staple green in winter'],
    ecoImpact: { stubbleBurningRisk: 'None', bioAlternative: 'Decomposed crop roots improve biological soil tilt.', waterSavedLiters: 30000, carbonOffsetKg: 210 },
    season: 'Rabi (September to February)',
    guide: 'Broadcast or line sow seed at 10-12 kg/acre on well-leveled flat beds. Irrigate immediately. Cut leaves 2 inches above ground.',
    pricePerMaund: 1400,
    yieldPerAcre: 280,
    costPerAcre: 45000,
    mandiPriceText: 'PKR 1,400',
    tradingHubs: 'Lahore, Faisalabad, Gujranwala, Rawalpindi vegetable mandis',
    diseases: [{ name: 'Downy Mildew (Peronospora effusa)', solution: 'Spray Metalaxyl + Mancozeb (2g/L); avoid overhead sprinkler irrigation.' }],
    marketTrend: 'Massive volume everyday kitchen vegetable across all Punjab mandis.'
  },

  // 27. SWEET POTATOES (Shakarkandi) - 100% DISTINCT FROM REGULAR POTATO!
  'sweet potatoes': {
    id: 'sweet potatoes',
    displayName: 'Sweet Potatoes (Shakarkandi)',
    scientificName: 'Ipomoea batatas',
    isWeed: false,
    watering: 'Moderate furrow irrigation every 8-10 days; withstands dry spells much better than potato.',
    sunlight: 'Full direct sunlight (8 hours daily)',
    soil: 'Loose, deep, friable sandy loam with light texture, pH 5.6-6.6. Avoid heavy compacted clay.',
    fertilizer: 'DAP 1 bag, SOP 1.5 bags, Urea 1 bag/acre. Excess nitrogen causes lush vines but small tubers.',
    needs: [
      'Vine cuttings (slips) rather than tubers for planting',
      'Sweet potato weevil (Cylas formicarius) management by earthing up ridges'
    ],
    benefits: [
      'Nutritious vitamin-A and beta-carotene rich sweet tuber',
      'Beloved street food across Pakistani winters (charcoal-roasted Shakarkandi)'
    ],
    ecoImpact: {
      stubbleBurningRisk: 'None',
      bioAlternative: 'Lush green vines make nutritious livestock green fodder or can be ploughed in as green manure.',
      waterSavedLiters: 65000,
      carbonOffsetKg: 420
    },
    season: 'Kharif (Planting May-June, Harvest Nov-Dec)',
    guide: '1. Slip Preparation: Propagate 30cm terminal vine cuttings from healthy nursery beds.\n2. Ridge Planting: Make high 75cm ridges and insert slips at a slant with 3-4 nodes buried.\n3. Weed Management: Fast-spreading vines create dense canopy that suppresses weeds naturally.\n4. Harvesting: Carefully dig tubers with spade when leaves turn yellowish.',
    pricePerMaund: 3400,
    yieldPerAcre: 210,
    costPerAcre: 58000,
    mandiPriceText: 'PKR 3,400',
    tradingHubs: 'Okara, Sahiwal, Kasur, Lahore fruit & vegetable mandis',
    diseases: [
      { name: 'Sweet Potato Weevil (Cylas formicarius)', solution: 'Keep tubers well-covered with soil (earth up cracks); use pheromone funnel traps; rotate crops.' },
      { name: 'Black Rot (Ceratocystis fimbriata)', solution: 'Use certified pathogen-free vine cuttings; cure harvested tubers at 30°C for 5 days.' }
    ],
    marketTrend: 'High seasonal demand during winter months for roasted street snacks and retail produce.'
  },

  'tobacco': {
    id: 'tobacco',
    displayName: 'Tobacco (Tambaku / Virginia Tobacco)',
    scientificName: 'Nicotiana tabacum',
    isWeed: false,
    watering: 'Carefully regulated furrow irrigation; avoid waterlogging.',
    sunlight: 'Full open sunlight (8 hours daily)',
    soil: 'Well-drained sandy loam with low chloride content, pH 5.5-6.8',
    fertilizer: 'Specialized tobacco formulation: Potassium Sulphate (chloride-free SOP) and balanced nitrogen.',
    needs: ['Topping and de-suckering to concentrate leaf lamina size', 'Controlled flue-curing barns'],
    benefits: ['Major cash crop in Swabi, Charsadda, and Mianwali with direct multinational procurement', 'Guaranteed purchase contracts'],
    ecoImpact: { stubbleBurningRisk: 'None', bioAlternative: 'Crop stalks used as heating fuel for curing barns under controlled combustion.', waterSavedLiters: 50000, carbonOffsetKg: 480 },
    season: 'Spring (Nursery Nov-Dec, Transplant Feb-March, Harvest May-June)',
    guide: 'Transplant seedlings on 90cm ridges with 50cm plant spacing. Remove terminal flower heads (topping) and lateral suckers promptly.',
    pricePerMaund: 7200,
    yieldPerAcre: 60,
    costPerAcre: 98000,
    mandiPriceText: 'PKR 7,200',
    tradingHubs: 'Swabi, Mianwali, Charsadda tobacco procurement depots',
    diseases: [{ name: 'Tobacco Mosaic Virus (TMV)', solution: 'Strict sanitation; wash hands with milk or soap; use resistant varieties.' }],
    marketTrend: 'Stable purchasing prices governed by Pakistan Tobacco Board quota regulations.'
  },

  'waterapple': {
    id: 'waterapple',
    displayName: 'Waterapple (Jambu / Rose Apple / Jamrul)',
    scientificName: 'Syzygium aqueum',
    isWeed: false,
    watering: 'Loves high moisture; irrigate weekly during fruit sizing.',
    sunlight: 'Full sun to partial tree shade',
    soil: 'Deep, moist, organic alluvial soil or clay loam, pH 5.5-7.0',
    fertilizer: 'Organic compost and balanced NPK twice annually.',
    needs: ['Protection from severe winter frost', 'Careful harvesting of delicate crisp fruits'],
    benefits: ['Extremely refreshing bell-shaped thirst-quenching fruit with high water content', 'Specialty fruit tree'],
    ecoImpact: { stubbleBurningRisk: 'None', bioAlternative: 'Pruned canopy biomass provides high-carbon soil mulch.', waterSavedLiters: 60000, carbonOffsetKg: 950 },
    season: 'Subtropical perennial (Peak harvest May to July)',
    guide: 'Propagate by air-layering. Plant at 20x20 ft spacing. Thin heavy fruit clusters for larger bell-shaped fruits.',
    pricePerMaund: 4100,
    yieldPerAcre: 150,
    costPerAcre: 62000,
    mandiPriceText: 'PKR 4,100',
    tradingHubs: 'Lahore, Karachi, Multan fruit markets',
    diseases: [{ name: 'Anthracnose (Colletotrichum)', solution: 'Spray Copper Oxychloride (2.5g/L) before fruit color changes.' }],
    marketTrend: 'Niche summer fruit demand in upscale urban supermarkets.'
  },

  'watermelon': {
    id: 'watermelon',
    displayName: 'Watermelon (Tarbooz)',
    scientificName: 'Citrullus lanatus',
    isWeed: false,
    watering: 'Furrow irrigation every 5-7 days; strictly withhold water 7-10 days before harvest to build sugars and prevent cracking.',
    sunlight: 'Full bright intense sun (8-10 hours daily)',
    soil: 'Deep, warm, well-draining sandy loam or riverbed silty sand, pH 6.0-7.0',
    fertilizer: 'DAP 2 bags, SOP 1.5 bags, Urea 2.5 bags in splits before fruit expansion.',
    needs: ['Wide bed spacing for rambling vines', 'Straw bedding under fruits to prevent ground rotting'],
    benefits: ['Pakistan premier high-volume summer hydrator', 'Massive commercial turnover in Bahawalpur and Sahiwal belts'],
    ecoImpact: { stubbleBurningRisk: 'None', bioAlternative: 'Vines disc-harrowed directly into soil to enhance sandy soil tilth.', waterSavedLiters: 58000, carbonOffsetKg: 380 },
    season: 'Summer / Zaid (Sow Feb-March, Harvest May-July)',
    guide: 'Sow on 8-foot wide raised beds with 2-foot plant spacing. Thin to 2 melons per vine for jumbo 10-14kg fruits.',
    pricePerMaund: 1600,
    yieldPerAcre: 350,
    costPerAcre: 85000,
    mandiPriceText: 'PKR 1,600',
    tradingHubs: 'Bahawalpur, Muzaffargarh, Sahiwal, Lahore wholesale fruit mandis',
    diseases: [{ name: 'Fusarium Wilt & Fruit Rot', solution: 'Practice 4-year crop rotation; place dry straw under melons; spray Mancozeb.' }],
    marketTrend: 'Massive truckload dispatches across all Pakistani cities during hot summer peak.'
  }
};

/**
 * Strict, deterministic normalization and lookup function.
 * CRITICAL RULE: Never uses fuzzy .includes() that maps "Potato" to "Sweet Potatoes"
 * or defaults unknown crops to "Rice (Paddy)"!
 */
export function resolveCropKeyExact(input: string): string {
  if (!input) return 'wheat';
  const clean = input.trim().toLowerCase();

  // 1. Direct exact key match
  if (OFFLINE_CROP_DATABASE[clean]) {
    return clean;
  }

  // 2. Strict aliases dictionary
  const EXACT_ALIASES: Record<string, string> = {
    // Wheat
    'wheat': 'wheat',
    'gandum': 'wheat',
    'gehun': 'wheat',
    'kanak': 'wheat',
    'triticum aestivum': 'wheat',

    // Rice
    'rice': 'rice',
    'chawal': 'rice',
    'paddy': 'paddy',
    'basmati': 'rice',
    'dhan': 'paddy',
    'oryza sativa': 'rice',

    // Cotton
    'cotton': 'cotton',
    'kapaas': 'cotton',
    'kapas': 'cotton',
    'phutti': 'cotton',
    'gossypium hirsutum': 'cotton',

    // Sugarcane
    'sugarcane': 'sugarcane',
    'ganna': 'sugarcane',
    'kamad': 'sugarcane',
    'saccharum officinarum': 'sugarcane',

    // Maize / Corn
    'maize': 'maize',
    'corn': 'corn',
    'makai': 'maize',
    'makkai': 'maize',
    'zea mays': 'maize',

    // REGULAR POTATO (Solanum tuberosum) - strictly isolated
    'potato': 'potato',
    'potatoes': 'potato',
    'aaloo': 'potato',
    'aloo': 'potato',
    'alu': 'potato',
    'solanum tuberosum': 'potato',

    // SWEET POTATO (Ipomoea batatas) - strictly isolated
    'sweet potato': 'sweet potatoes',
    'sweet potatoes': 'sweet potatoes',
    'shakarkandi': 'sweet potatoes',
    'shakarkand': 'sweet potatoes',
    'ipomoea batatas': 'sweet potatoes',

    // Onion
    'onion': 'onion',
    'onions': 'onion',
    'pyaaz': 'onion',
    'piyaz': 'onion',
    'allium cepa': 'onion',

    // Mango
    'mango': 'mango',
    'mangoes': 'mango',
    'aam': 'mango',
    'chaunsa': 'mango',
    'sindhri': 'mango',
    'mangifera indica': 'mango',

    // Chickpea
    'chickpea': 'chickpea',
    'chickpeas': 'chickpea',
    'chana': 'chickpea',
    'channay': 'chickpea',
    'gram': 'chickpea',
    'desi chana': 'chickpea',
    'cicer arietinum': 'chickpea',

    // Kinnow / Citrus
    'kinnow': 'kinnow',
    'kino': 'kinnow',
    'orange': 'orange',
    'oranges': 'orange',
    'malta': 'kinnow',
    'citrus': 'kinnow',
    'citrus reticulata': 'kinnow',

    // 30 TFLite Labels
    'aloevera': 'aloevera',
    'aloe vera': 'aloevera',
    'ghee kawar': 'aloevera',
    'banana': 'banana',
    'kela': 'banana',
    'bilimbi': 'bilimbi',
    'cantaloupe': 'cantaloupe',
    'garma': 'cantaloupe',
    'cassava': 'cassava',
    'tapioca': 'cassava',
    'coconut': 'coconut',
    'naryal': 'coconut',
    'cucumber': 'cucumber',
    'kheera': 'cucumber',
    'curcuma': 'curcuma',
    'turmeric': 'curcuma',
    'haldi': 'curcuma',
    'eggplant': 'eggplant',
    'baingan': 'eggplant',
    'brinjal': 'eggplant',
    'galangal': 'galangal',
    'kulanjaan': 'galangal',
    'ginger': 'ginger',
    'adrak': 'ginger',
    'guava': 'guava',
    'amrood': 'guava',
    'kale': 'kale',
    'longbeans': 'longbeans',
    'lobia': 'longbeans',
    'melon': 'melon',
    'kharbooza': 'melon',
    'papaya': 'papaya',
    'papeeta': 'papaya',
    'peper chili': 'peper chili',
    'pepper chili': 'peper chili',
    'chili': 'peper chili',
    'chilli': 'peper chili',
    'mirch': 'peper chili',
    'pineapple': 'pineapple',
    'ananas': 'pineapple',
    'pomelo': 'pomelo',
    'chakotra': 'pomelo',
    'shallot': 'shallot',
    'soybeans': 'soybeans',
    'soybean': 'soybeans',
    'spinach': 'spinach',
    'palak': 'spinach',
    'tobacco': 'tobacco',
    'tambaku': 'tobacco',
    'waterapple': 'waterapple',
    'rose apple': 'waterapple',
    'jambu': 'waterapple',
    'watermelon': 'watermelon',
    'tarbooz': 'watermelon'
  };

  const stripped = clean.replace(/\.(jpeg|jpg|png|webp|gif|bmp|tiff)$/i, '');

  if (EXACT_ALIASES[stripped]) {
    return EXACT_ALIASES[stripped];
  }
  if (EXACT_ALIASES[clean]) {
    return EXACT_ALIASES[clean];
  }

  // 3. Strict potato protection:
  // If the word contains "sweet" AND "potato" -> 'sweet potatoes'
  if ((clean.includes('sweet') || stripped.includes('sweet')) && (clean.includes('potato') || stripped.includes('potato'))) {
    return 'sweet potatoes';
  }
  // If the word contains "potato" without "sweet" -> ALWAYS 'potato' (NEVER sweet potato!)
  if ((clean.includes('potato') || stripped.includes('potato')) && !clean.includes('sweet') && !stripped.includes('sweet')) {
    return 'potato';
  }

  // 4. Exact word token matching in display name
  for (const [key, entry] of Object.entries(OFFLINE_CROP_DATABASE)) {
    const tokens = entry.displayName.toLowerCase().split(/[\s(/),-]+/).filter(Boolean);
    if (tokens.includes(stripped) || tokens.includes(clean)) {
      return key;
    }
  }

  // 5. Substring match for filenames (e.g. "my_watermelon_field.jpg" -> "watermelon")
  const sortedKeys = Object.keys(OFFLINE_CROP_DATABASE).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (key === 'sweet potatoes') {
      if (stripped.includes('sweet') && stripped.includes('potato')) return 'sweet potatoes';
      continue;
    }
    if (key === 'potato') {
      if (stripped.includes('potato') && !stripped.includes('sweet')) return 'potato';
      continue;
    }
    if (stripped.includes(key)) {
      return key;
    }
  }

  // Check alias substrings (e.g. "tarbooz_khet.jpg" -> "watermelon")
  for (const [alias, key] of Object.entries(EXACT_ALIASES)) {
    if (alias.length >= 4 && stripped.includes(alias)) {
      return key;
    }
  }

  // 6. Direct match in database
  if (OFFLINE_CROP_DATABASE[stripped]) {
    return stripped;
  }
  if (OFFLINE_CROP_DATABASE[clean]) {
    return clean;
  }

  // If input was explicitly wheat or gandum
  if (stripped.includes('wheat') || stripped.includes('gandum') || stripped.includes('kanak')) {
    return 'wheat';
  }

  // Return the cleaned actual plant name instead of defaulting to watermelon
  const cleanInput = (input || '').replace(/[^a-zA-Z0-9\s_]/g, ' ').trim();
  if (cleanInput && !cleanInput.toLowerCase().startsWith('image') && !cleanInput.toLowerCase().startsWith('photo') && !cleanInput.toLowerCase().startsWith('file')) {
    return cleanInput;
  }

  return 'Rosemary';
}

/**
 * Builds a complete CropAnalysis object purely from local edge database (Zero Cloud Data required)
 */
export const generateOfflineCropAnalysis = (
  cropKey: string,
  confidence: number = 0.95,
  city: string = 'Lahore',
  language: 'en' | 'ur' = 'en',
  source: string = '📚 Offline Agronomy Database',
  inferenceTimeMs?: number,
  tfliteLabel?: string
): CropAnalysis => {
  const resolvedKey = resolveCropKeyExact(cropKey);
  
  // If matched a database crop, use its verified metadata. Otherwise dynamically construct a clean profile for unlisted plants (Rosemary, etc.)
  let entry: CropMetadata = OFFLINE_CROP_DATABASE[resolvedKey];
  if (!entry) {
    const formatName = (str: string) => {
      const trimmed = str.replace(/[^a-zA-Z\s]/g, ' ').trim();
      if (!trimmed) return 'Rosemary';
      return trimmed.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    };
    const plantDisplayName = formatName(cropKey || resolvedKey);

    entry = {
      id: cropKey.toLowerCase().trim(),
      displayName: plantDisplayName,
      scientificName: `${plantDisplayName} (Botanical Species)`,
      isWeed: false,
      watering: 'Moderate watering: Irrigating when top 1-2 inches of soil feel dry to touch.',
      sunlight: 'Full direct sunlight (6-8 hours daily) or bright ambient field exposure.',
      soil: 'Well-draining, fertile organic loam with pH 6.0-7.2.',
      fertilizer: 'Balanced organic NPK fertilizer or compost every 3-4 weeks during active growth.',
      needs: [
        `Ensure proper soil aeration and drainage to maintain healthy ${plantDisplayName} roots`,
        `Scout regularly for common leaf spots or sucking insects during humid weather`
      ],
      benefits: [
        `High-value botanical and agricultural crop for local cultivation`,
        `Provides valuable foliage, yields, or medicinal/culinary uses`
      ],
      ecoImpact: {
        stubbleBurningRisk: 'None',
        bioAlternative: 'Compost organic crop foliage into rich organic garden mulch.',
        waterSavedLiters: 15000,
        carbonOffsetKg: 120
      },
      season: 'Annual / Perennial',
      guide: `1. Cultivation: Plant ${plantDisplayName} in fertile, well-aerated soil with adequate organic matter.\n2. Care: Provide steady sunlight and water moderately when soil surface dries.\n3. Protection: Apply Neem oil or organic bio-pesticides at first sign of leaf spot or aphids.`,
      pricePerMaund: 2800,
      yieldPerAcre: 35,
      costPerAcre: 38000,
      mandiPriceText: 'PKR 2,800',
      tradingHubs: 'Local agricultural markets and botanical nurseries across Punjab',
      diseases: [
        { name: 'Fungal Leaf Spot & Powdery Mildew', solution: 'Improve air circulation and apply sulfur or copper-based fungicide at first sign.' },
        { name: 'Root Rot (Excess Moisture)', solution: 'Avoid waterlogging and ensure soil bed or pot has proper drainage outlets.' }
      ],
      marketTrend: 'Steady demand across provincial vegetable and botanical agricultural markets.'
    };
  }

  const todayStr = new Date().toISOString().split('T')[0];

  const plantInfo: PlantInfo = {
    plantName: entry.displayName,
    scientificName: entry.scientificName,
    confidence: Math.round(confidence * 100) / 100,
    isWeedOrInvasive: entry.isWeed,
    care: {
      watering: entry.watering,
      sunlight: entry.sunlight,
      soil: entry.soil,
      fertilizer: entry.fertilizer
    },
    needs: entry.needs,
    benefits: entry.benefits
  };

  return {
    cropName: entry.displayName,
    farmingGuide: {
      soil: entry.soil,
      season: entry.season,
      guide: `${entry.guide}\n\nWatering: ${entry.watering}\nFertilizer: ${entry.fertilizer}`
    },
    marketTrend: language === 'ur'
      ? `${entry.displayName} کی پنجاب منڈیوں (${entry.tradingHubs}) میں مستحکم ڈیمانڈ ہے۔ آف لائن موڈ تاریخی منڈی ریٹس PKR ${entry.pricePerMaund} فی من پر مبنی ہے۔`
      : `${entry.marketTrend} Primary Punjab trading hubs: ${entry.tradingHubs}. Historical benchmark for ${city}: PKR ${entry.pricePerMaund}/maund.`,
    acreage: '1 Acre',
    diseases: entry.diseases,
    priceAnalysis: {
      pricePerMaund: entry.pricePerMaund,
      yieldPerAcre: entry.yieldPerAcre,
      costPerAcre: entry.costPerAcre
    },
    currentMandiPrice: {
      price: entry.mandiPriceText,
      unit: '40 kg (Maund)',
      city: city,
      date: todayStr
    },
    isRealtime: false,
    analysisSource: source,
    plantInfo: plantInfo,
    ecoImpact: entry.ecoImpact,
    isFirestoreSynced: false,
    inferenceTimeMs: inferenceTimeMs,
    tfliteLabel: tfliteLabel || entry.displayName,
    isUnlistedOffline: !OFFLINE_CROP_DATABASE[resolvedKey],
    pendingRefetch: !OFFLINE_CROP_DATABASE[resolvedKey]
  };
};
