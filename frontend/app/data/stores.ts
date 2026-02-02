// Butikslokationer med koordinater (mockad data)
export interface StoreLocation {
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: 'ICA' | 'Coop' | 'Willys' | 'Lidl';
}

export const storeLocations: StoreLocation[] = [
  // Umeå butiker - ICA
  {
    name: 'ICA Maxi Strömpilen',
    address: 'Strömpilsplatsen 1, Umeå',
    lat: 63.8160,
    lng: 20.2820,
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
    name: 'ICA Supermarket Vasaplan',
    address: 'Vasagatan 16, Umeå',
    lat: 63.8258,
    lng: 20.2630,
    category: 'ICA'
  },
  {
    name: 'ICA Supermarket Östra Ersboda',
    address: 'Järnvägsallén 32, Umeå',
    lat: 63.8300,
    lng: 20.2700,
    category: 'ICA'
  },
  {
    name: 'ICA Nära Böleäng',
    address: 'Böleängsgatan 2, Umeå',
    lat: 63.8150,
    lng: 20.2580,
    category: 'ICA'
  },
  {
    name: 'ICA Nära Tomtebo',
    address: 'Tomtebovägen 10, Umeå',
    lat: 63.8120,
    lng: 20.2450,
    category: 'ICA'
  },
  {
    name: 'ICA Supermarket Teg',
    address: 'Tegsgatan 2, Umeå',
    lat: 63.8050,
    lng: 20.2350,
    category: 'ICA'
  },
  {
    name: 'ICA Nära Mariehem',
    address: 'Mariehemsgatan 5, Umeå',
    lat: 63.8200,
    lng: 20.2400,
    category: 'ICA'
  },
  {
    name: 'ICA Supermarket Hörnett',
    address: 'Universitetsområdet, Umeå',
    lat: 63.8200,
    lng: 20.3080,
    category: 'ICA'
  },
  
  // Umeå butiker - Coop
  {
    name: 'Coop Forum Strömpilen',
    address: 'Strömpilsgatan 15, Umeå',
    lat: 63.8170,
    lng: 20.2850,
    category: 'Coop'
  },
  {
    name: 'Coop Extra Böleäng',
    address: 'Böleängsgatan 2, Umeå',
    lat: 63.8150,
    lng: 20.2580,
    category: 'Coop'
  },
  {
    name: 'Coop Konsum Teg',
    address: 'Tegsbron 5, Umeå',
    lat: 63.8070,
    lng: 20.2380,
    category: 'Coop'
  },
  {
    name: 'Coop Konsum Ålidhem',
    address: 'Ålidhemsgatan 31, Umeå',
    lat: 63.8100,
    lng: 20.3200,
    category: 'Coop'
  },
  {
    name: 'Coop Konsum Haga',
    address: 'Hagagatan 8, Umeå',
    lat: 63.8280,
    lng: 20.2500,
    category: 'Coop'
  },
  {
    name: 'Coop Konsum Mariehem',
    address: 'Mariehemsgatan 10, Umeå',
    lat: 63.8210,
    lng: 20.2420,
    category: 'Coop'
  },
  {
    name: 'Coop Extra Sandbacka',
    address: 'Sandbackagatan 1, Umeå',
    lat: 63.8000,
    lng: 20.2200,
    category: 'Coop'
  },
  
  // Umeå butiker - Willys
  {
    name: 'Willys Vasaplan',
    address: 'Vasagatan 14, Umeå',
    lat: 63.8240,
    lng: 20.2650,
    category: 'Willys'
  },
  {
    name: 'Willys Ersboda',
    address: 'Ersbodavägen 10, Umeå',
    lat: 63.8270,
    lng: 20.2620,
    category: 'Willys'
  },
  {
    name: 'Willys Strömpilen',
    address: 'Strömpilsgatan 20, Umeå',
    lat: 63.8170,
    lng: 20.2850,
    category: 'Willys'
  },
  {
    name: 'Willys+ Avion',
    address: 'Flygfältsgatan 3, Umeå',
    lat: 63.7950,
    lng: 20.2850,
    category: 'Willys'
  },
  
  // Umeå butiker - Lidl
  {
    name: 'Lidl Strömpilen',
    address: 'Strömpilsgatan 25, Umeå',
    lat: 63.8165,
    lng: 20.2840,
    category: 'Lidl'
  },
  {
    name: 'Lidl Ersboda',
    address: 'Ersmarksgatan 15, Umeå',
    lat: 63.8275,
    lng: 20.2610,
    category: 'Lidl'
  },
  {
    name: 'Lidl Böleäng',
    address: 'Böleängsgatan 10, Umeå',
    lat: 63.8145,
    lng: 20.2590,
    category: 'Lidl'
  },
  
  // Hemköp Umeå
  {
    name: 'Hemköp Västra Esplanaden',
    address: 'Västra Esplanaden 5, Umeå',
    lat: 63.8250,
    lng: 20.2580,
    category: 'ICA'
  },
  
  // Bygdeå butiker - endast ICA
  {
    name: 'ICA Nära Bygdeå',
    address: 'Storgatan 12, Bygdeå',
    lat: 63.9500,
    lng: 19.9700,
    category: 'ICA'
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
      lowerAddress.includes('boleang') ||
      lowerAddress.includes('vasaplan') ||
      lowerAddress.includes('vasa') ||
      lowerAddress.includes('östra') ||
      lowerAddress.includes('ostra') ||
      lowerAddress.includes('strömpil') ||
      lowerAddress.includes('strompil') ||
      lowerAddress.includes('teg') ||
      lowerAddress.includes('tomtebo') ||
      lowerAddress.includes('mariehem') ||
      lowerAddress.includes('hörnett') ||
      lowerAddress.includes('hornett') ||
      lowerAddress.includes('ålidhem') ||
      lowerAddress.includes('alidhem') ||
      lowerAddress.includes('haga') ||
      lowerAddress.includes('sandbacka')) {
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
  
  // Om ingen matchning, defaulta till Umeå centrum
  return {
    lat: 63.8258,
    lng: 20.2630,
    city: 'Umeå'
  };
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
export const storeToCategory: Record<string, 'ICA' | 'Coop' | 'Willys' | 'Lidl'> = {
  // ICA butiker
  'ICA Maxi Strömpilen': 'ICA',
  'ICA Kvantum Ersboda': 'ICA',
  'ICA Supermarket Vasaplan': 'ICA',
  'ICA Supermarket Östra Ersboda': 'ICA',
  'ICA Nära Böleäng': 'ICA',
  'ICA Nära Tomtebo': 'ICA',
  'ICA Supermarket Teg': 'ICA',
  'ICA Nära Mariehem': 'ICA',
  'ICA Supermarket Hörnett': 'ICA',
  'ICA Nära Bygdeå': 'ICA',
  'Hemköp Västra Esplanaden': 'ICA',
  
  // Coop butiker
  'Coop Forum Strömpilen': 'Coop',
  'Coop Extra Böleäng': 'Coop',
  'Coop Konsum Teg': 'Coop',
  'Coop Konsum Ålidhem': 'Coop',
  'Coop Konsum Haga': 'Coop',
  'Coop Konsum Mariehem': 'Coop',
  'Coop Extra Sandbacka': 'Coop',
  
  // Willys butiker
  'Willys Vasaplan': 'Willys',
  'Willys Ersboda': 'Willys',
  'Willys Strömpilen': 'Willys',
  'Willys+ Avion': 'Willys',
  
  // Lidl butiker
  'Lidl Strömpilen': 'Lidl',
  'Lidl Ersboda': 'Lidl',
  'Lidl Böleäng': 'Lidl',
};
