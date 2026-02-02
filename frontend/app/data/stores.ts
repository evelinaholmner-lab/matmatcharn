// Butiker per geografisk plats
export const storesByLocation: Record<string, string[]> = {
  'Umeå': ['ICA Maxi Umeå', 'Coop Forum Umeå', 'Willys Vasaplan', 'ICA Kvantum Ersboda'],
  'Bygdeå': ['ICA Nära Bygdeå', 'Coop Bygdeå'],
};

// Mapping från specifika butiker till butikskategori för kampanjer
export const storeToCategory: Record<string, 'ICA' | 'Coop' | 'Willys'> = {
  'ICA Maxi Umeå': 'ICA',
  'ICA Kvantum Ersboda': 'ICA',
  'ICA Nära Bygdeå': 'ICA',
  'ICA Maxi Skellefteå': 'ICA',
  'ICA Maxi Lycksele': 'ICA',
  'Coop Forum Umeå': 'Coop',
  'Coop Bygdeå': 'Coop',
  'Coop Forum Skellefteå': 'Coop',
  'Coop Lycksele': 'Coop',
  'Willys Vasaplan': 'Willys',
  'Willys Skellefteå': 'Willys',
  'Willys Lycksele': 'Willys',
};