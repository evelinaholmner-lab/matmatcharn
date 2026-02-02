// Butikslokationer med koordinater (mockad data)
export interface StoreLocation {
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: 'ICA' | 'Coop' | 'Willys';
}

export const storeLocations: StoreLocation[] = [
  // Umeå butiker
  {
    name: 'ICA Maxi Umeå',
    address: 'Ersboda Centrum, Umeå',
    lat: 63.8258,
    lng: 20.2630,
    category: 'ICA'
  },
  {
    name: 'ICA Kvantum Ersboda',
    address: 'Ersmarksgatan 20, Umeå',
    lat: 63.8280,
    lng: 20.2600,
    category: 'ICA'
  },
  {
    name: 'Coop Forum Umeå',
    address: 'Vasagatan 5, Umeå',
    lat: 63.8258,
    lng: 20.2630,
    category: 'Coop'
  },
  {
    name: 'Willys Vasaplan',
    address: 'Vasagatan 14, Umeå',
    lat: 63.8240,
    lng: 20.2650,
    category: 'Willys'
  },
  {
    name: 'ICA Supermarket Östra Ersboda',
    address: 'Järnvägsallén 32, Umeå',
    lat: 63.8300,
    lng: 20.2700,
    category: 'ICA'
  },
  {
    name: 'Coop Extra Böleäng',
    address: 'Böleängsgatan 2, Umeå',
    lat: 63.8150,
    lng: 20.2580,
    category: 'Coop'
  },
  
  // Bygdeå butiker
  {
    name: 'ICA Nära Bygdeå',
    address: 'Storgatan 12, Bygdeå',
    lat: 63.9500,
    lng: 19.9700,
    category: 'ICA'
  },
  {
    name: 'Coop Bygdeå',
    address: 'Centrumvägen 5, Bygdeå',
    lat: 63.9510,
    lng: 19.9720,
    category: 'Coop'
  },
];

// Mockad geocoding - konvertera adress till koordinater
export const geocodeAddress = (address: string): { lat: number; lng: number; city: string } | null => {
  const lowerAddress = address.toLowerCase();
  
  // Umeå-området (centrum och närområden)
  if (lowerAddress.includes('umeå') || 
      lowerAddress.includes('umea') ||
      lowerAddress.includes('ersboda') ||
      lowerAddress.includes('böleäng') ||
      lowerAddress.includes('vasaplan') ||
      lowerAddress.includes('östra')) {
    return {
      lat: 63.8258 + (Math.random() - 0.5) * 0.02, // Varierar lite
      lng: 20.2630 + (Math.random() - 0.5) * 0.02,
      city: 'Umeå'
    };
  }
  
  // Bygdeå
  if (lowerAddress.includes('bygdeå') || lowerAddress.includes('bygdea')) {
    return {
      lat: 63.9500 + (Math.random() - 0.5) * 0.01,
      lng: 19.9700 + (Math.random() - 0.5) * 0.01,
      city: 'Bygdeå'
    };
  }
  
  return null;
};

// Beräkna avstånd mellan två koordinater (Haversine formula)
const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Jordens radie i km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Hitta butiker inom ett visst avstånd (km) från en position
export const findNearbyStores = (
  userLat: number,
  userLng: number,
  maxDistance: number = 15 // km
): Array<StoreLocation & { distance: number }> => {
  return storeLocations
    .map(store => ({
      ...store,
      distance: calculateDistance(userLat, userLng, store.lat, store.lng)
    }))
    .filter(store => store.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
};

// Mapping från specifika butiker till butikskategori för kampanjer
export const storeToCategory: Record<string, 'ICA' | 'Coop' | 'Willys'> = {
  'ICA Maxi Umeå': 'ICA',
  'ICA Kvantum Ersboda': 'ICA',
  'ICA Nära Bygdeå': 'ICA',
  'ICA Supermarket Östra Ersboda': 'ICA',
  'Coop Forum Umeå': 'Coop',
  'Coop Bygdeå': 'Coop',
  'Coop Extra Böleäng': 'Coop',
  'Willys Vasaplan': 'Willys',
};
