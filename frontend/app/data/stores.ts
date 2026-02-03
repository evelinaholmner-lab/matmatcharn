// Butikslokationer med koordinater (mockad data)
export interface StoreLocation {
  name: string;
  address: string;
  lat: number;
  lng: number;
  category: 'ICA' | 'Coop' | 'Willys' | 'Lidl';
}

export const storeLocations: StoreLocation[] = [
  // ========== ICA Butiker ==========
  {
    name: 'ICA Maxi Supermarket Umeå',
    address: 'Strömpilsplatsen 41, 907 43 Umeå',
    lat: 63.8160,
    lng: 20.2820,
    category: 'ICA'
  },
  {
    name: 'ICA Supermarket City',
    address: 'Renmarkstorget 5 A, 903 26 Umeå',
    lat: 63.8258,
    lng: 20.2630,
    category: 'ICA'
  },
  {
    name: 'ICA Supermarket Ålidhem',
    address: 'Ålidhems Centrum/Examensvägen, 907 30 Umeå',
    lat: 63.8100,
    lng: 20.3150,
    category: 'ICA'
  },
  {
    name: 'ICA Supermarket Teg',
    address: 'Verkstadsgatan 1, 904 32 Umeå',
    lat: 63.8050,
    lng: 20.2400,
    category: 'ICA'
  },
  {
    name: 'ICA Supermarket Böleäng',
    address: 'Fruktvägen 1, 904 36 Umeå',
    lat: 63.8020,
    lng: 20.2180,
    category: 'ICA'
  },
  {
    name: 'ICA Kvantum Mariehem',
    address: 'Mariehemsvägen 8A, 906 54 Umeå',
    lat: 63.8320,
    lng: 20.2420,
    category: 'ICA'
  },
  {
    name: 'ICA Kvantum Kronoparken',
    address: 'Kronoskogsvägen 18, 903 61 Umeå',
    lat: 63.8380,
    lng: 20.2300,
    category: 'ICA'
  },
  
  // ========== ICA Nära (Närlivs) ==========
  {
    name: 'ICA Nära Bågen',
    address: 'Järnvägstorget, 903 28 Umeå',
    lat: 63.8245,
    lng: 20.2610,
    category: 'ICA'
  },
  {
    name: 'ICA Nära Berghem',
    address: 'Axtorpsvägen 30, 903 37 Umeå',
    lat: 63.8350,
    lng: 20.2500,
    category: 'ICA'
  },
  
  // ========== Coop Butiker ==========
  {
    name: 'Coop City Umeå',
    address: 'Kungsgatan 54, 903 26 Umeå',
    lat: 63.8260,
    lng: 20.2610,
    category: 'Coop'
  },
  {
    name: 'Stora Coop Tomtebo',
    address: 'Mineralvägen 7, 907 50 Umeå',
    lat: 63.8080,
    lng: 20.2900,
    category: 'Coop'
  },
  {
    name: 'Stora Coop Ersboda',
    address: 'Formvägen 4, 906 21 Umeå',
    lat: 63.8400,
    lng: 20.2650,
    category: 'Coop'
  },
  {
    name: 'Coop Nära Haga',
    address: 'Östra Kyrkogatan 70, 903 43 Umeå',
    lat: 63.8290,
    lng: 20.2550,
    category: 'Coop'
  },
  {
    name: 'Coop Nära Tegsborg',
    address: 'Tegsplan 3A, 904 20 Umeå',
    lat: 63.8100,
    lng: 20.2350,
    category: 'Coop'
  },
  {
    name: 'Coop Grisbacka',
    address: 'Tallparksvägen 2A, 903 54 Umeå',
    lat: 63.8360,
    lng: 20.2380,
    category: 'Coop'
  },
  
  // ========== Willys Butiker ==========
  {
    name: 'Willys Umeå Syd',
    address: 'Marknadsgatan 5, 904 22 Umeå',
    lat: 63.8030,
    lng: 20.2420,
    category: 'Willys'
  },
  {
    name: 'Willys Ersboda',
    address: 'Gräddvägen 1, 906 21 Umeå',
    lat: 63.8410,
    lng: 20.2680,
    category: 'Willys'
  },
  
  // ========== Lidl Butiker ==========
  {
    name: 'Lidl Umeå',
    address: 'Examensvägen 1, 907 30 Umeå',
    lat: 63.8095,
    lng: 20.3140,
    category: 'Lidl'
  },
];

// Mockad geocoding - konvertera adress till koordinater
export const geocodeAddress = (address: string): { lat: number; lng: number; city: string } | null => {
  const lowerAddress = address.toLowerCase();
  
  // Specifika områden i Umeå med bättre koordinater
  if (lowerAddress.includes('ålidhem') || lowerAddress.includes('alidhem')) {
    return { lat: 63.8100, lng: 20.3150, city: 'Umeå' };
  }
  if (lowerAddress.includes('ersboda')) {
    return { lat: 63.8400, lng: 20.2650, city: 'Umeå' };
  }
  if (lowerAddress.includes('mariehem')) {
    return { lat: 63.8320, lng: 20.2420, city: 'Umeå' };
  }
  if (lowerAddress.includes('teg')) {
    return { lat: 63.8050, lng: 20.2400, city: 'Umeå' };
  }
  if (lowerAddress.includes('böleäng') || lowerAddress.includes('boleang')) {
    return { lat: 63.8020, lng: 20.2180, city: 'Umeå' };
  }
  if (lowerAddress.includes('haga')) {
    return { lat: 63.8290, lng: 20.2550, city: 'Umeå' };
  }
  if (lowerAddress.includes('tomtebo')) {
    return { lat: 63.8080, lng: 20.2900, city: 'Umeå' };
  }
  if (lowerAddress.includes('kronopark')) {
    return { lat: 63.8380, lng: 20.2300, city: 'Umeå' };
  }
  if (lowerAddress.includes('grisbacka')) {
    return { lat: 63.8360, lng: 20.2380, city: 'Umeå' };
  }
  if (lowerAddress.includes('berghem')) {
    return { lat: 63.8350, lng: 20.2500, city: 'Umeå' };
  }
  
  // Umeå-området generellt
  if (lowerAddress.includes('umeå') || 
      lowerAddress.includes('umea') ||
      lowerAddress.includes('renmarkstorget') ||
      lowerAddress.includes('kungsgatan') ||
      lowerAddress.includes('järnvägstorget') ||
      lowerAddress.includes('vasaplan') ||
      lowerAddress.includes('centrum')) {
    return { lat: 63.8258, lng: 20.2630, city: 'Umeå' };
  }
  
  // Bygdeå
  if (lowerAddress.includes('bygdeå') || lowerAddress.includes('bygdea')) {
    return { lat: 63.9500, lng: 19.9700, city: 'Bygdeå' };
  }
  
  // Om ingen matchning, defaulta till Umeå centrum
  return { lat: 63.8258, lng: 20.2630, city: 'Umeå' };
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
  'ICA Maxi Supermarket Umeå': 'ICA',
  'ICA Supermarket City': 'ICA',
  'ICA Supermarket Ålidhem': 'ICA',
  'ICA Supermarket Teg': 'ICA',
  'ICA Supermarket Böleäng': 'ICA',
  'ICA Kvantum Mariehem': 'ICA',
  'ICA Kvantum Kronoparken': 'ICA',
  'ICA Nära Bågen': 'ICA',
  'ICA Nära Berghem': 'ICA',
  
  // Coop butiker
  'Coop City Umeå': 'Coop',
  'Stora Coop Tomtebo': 'Coop',
  'Stora Coop Ersboda': 'Coop',
  'Coop Nära Haga': 'Coop',
  'Coop Nära Tegsborg': 'Coop',
  'Coop Grisbacka': 'Coop',
  
  // Willys butiker
  'Willys Umeå Syd': 'Willys',
  
  // Lidl butiker
  'Lidl Umeå': 'Lidl',
};
