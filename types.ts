export type ScanMode = 'unified' | 'crop' | 'plant';

export type AnalysisSource = 
  | '⚡ On-Device TFLite Edge Model (Offline)'
  | '⚡ On-Device TFLite Edge Model'
  | '📚 Offline Agronomy Database'
  | '🔄 Hybrid AI: Edge TFLite + Gemini Cloud'
  | '⚡ Offline Edge TFLite Model (Zero Data)'
  | '⚡ On-Device Edge AI'
  | '🔄 Hybrid AI: Edge TFLite ID'
  | '🔄 Hybrid (Edge ID + Cloud Care)'
  | '☁️ Google Gemini Cloud Vision'
  | '☁️ Gemini Agricultural Intelligence'
  | 'Local Model (Edge)'
  | 'Gemini Cloud Vision'
  | string;

export interface PlantCareInfo {
  watering: string;
  sunlight: string;
  soil: string;
  fertilizer: string;
}

export interface EcoImpact {
  stubbleBurningRisk?: 'High' | 'Medium' | 'Low' | 'None';
  bioAlternative?: string;
  waterSavedLiters?: number;
  carbonOffsetKg?: number;
  smokeAvoidedKg?: number;
}

export interface PlantInfo {
  plantName: string;
  scientificName: string;
  confidence: number;
  isWeedOrInvasive: boolean;
  care: PlantCareInfo;
  needs: string[];
  benefits: string[];
}

export interface FarmingGuide {
  soil: string;
  season: string;
  guide: string;
}

export interface PriceAnalysis {
  pricePerMaund: number;
  yieldPerAcre: number;
  costPerAcre: number;
}

export interface Disease {
  name: string;
  solution: string;
}

export interface CropAnalysis {
  cropName: string;
  farmingGuide: FarmingGuide;
  marketTrend: string;
  acreage: string;
  diseases: Disease[];
  priceAnalysis: PriceAnalysis;
  currentMandiPrice?: {
    price: string;
    unit: string;
    city: string;
    date: string;
  };
  isRealtime?: boolean;
  scanMode?: ScanMode;
  analysisSource?: AnalysisSource;
  plantInfo?: PlantInfo;
  ecoImpact?: EcoImpact;
  isFirestoreSynced?: boolean;
  isImageScan?: boolean;
  inferenceTimeMs?: number;
  tfliteLabel?: string;
  isUnlistedOffline?: boolean;
  pendingRefetch?: boolean;
  base64Image?: string;
}

export interface SupplierInfo {
  category: string;
  description: string;
  examples: string;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  analysis: CropAnalysis;
  imageUrl: string;
  collectionId?: string;
  isFirestoreSynced?: boolean;
}

export interface Collection {
  id: string;
  name: string;
  createdAt: string;
}

export interface SmogPledge {
  id: string;
  farmerName: string;
  phone?: string;
  email?: string;
  occupation?: string;
  city: string;
  crop?: string;
  acres?: number;
  burnAvoided: boolean;
  chosenAlternative?: string;
  co2SavedKg: number;
  timestamp: string;
  isFirestoreSynced?: boolean;
}

export interface SupportTicket {
  id: string;
  issueType: 'Crop Scan Feedback' | 'AQI Station Discrepancy' | 'General Support';
  message: string;
  contactEmailOrPhone?: string;
  city?: string;
  createdAt: string;
  status: 'Open' | 'In Review' | 'Resolved';
  isFirestoreSynced?: boolean;
}

