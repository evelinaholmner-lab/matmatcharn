// Mappning av recept till riktiga matbilder från Unsplash/Pexels
// Bilder kategoriserade efter måltidstyp och maträtt

export const recipeImages: Record<string, string> = {
  // ==================== FRUKOST ====================
  // Gröt och müsli
  'Havregrynsgröt med banan': 'https://images.unsplash.com/photo-1702648982253-8b851013e81f?w=400',
  'Overnight oats med bär': 'https://images.unsplash.com/photo-1678651535326-0aa4d7e4c0d4?w=400',
  'Chiapudding med mango': 'https://images.unsplash.com/photo-1610450622351-340b283813b9?w=400',
  'Kvargbowl med müsli': 'https://images.unsplash.com/photo-1702648982253-8b851013e81f?w=400',
  'Gröt med lingon': 'https://images.unsplash.com/photo-1610450622351-340b283813b9?w=400',
  'Risgrynsgröt med kanel': 'https://images.unsplash.com/photo-1678651535326-0aa4d7e4c0d4?w=400',
  'Overnight oats med äpple': 'https://images.unsplash.com/photo-1702648982253-8b851013e81f?w=400',
  'Filmjölk med knäckebröd': 'https://images.unsplash.com/photo-1678651535326-0aa4d7e4c0d4?w=400',
  
  // Smoothie bowls
  'Smoothie bowl med granola': 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?w=400',
  'Acai bowl': 'https://images.unsplash.com/photo-1590301157284-ab2f8707bdc1?w=400',
  'Smoothie bowl med acai': 'https://images.unsplash.com/photo-1590301157284-ab2f8707bdc1?w=400',
  'Kokosyoghurt med chia': 'https://images.unsplash.com/photo-1557568951-a691f75c810f?w=400',
  'Proteinfrukost med cottage cheese': 'https://images.unsplash.com/photo-1590301157411-8686d4a34f10?w=400',
  
  // Ägg
  'Äggröra på fullkornsbröd': 'https://images.unsplash.com/photo-1691480184494-d9f822edd4d1?w=400',
  'Omelett med ost och skinka': 'https://images.unsplash.com/photo-1518476381266-33596bddffc0?w=400',
  'Stekt ägg med avokado': 'https://images.unsplash.com/photo-1583927136633-7ecde5b23ac5?w=400',
  'Äggröra med räkor': 'https://images.unsplash.com/photo-1612487439139-c2d7bac13577?w=400',
  'Shakshuka': 'https://images.unsplash.com/photo-1518476381266-33596bddffc0?w=400',
  
  // Pannkakor och våfflor
  'Amerikanska pannkakor': 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400',
  'Havrepannkakor': 'https://images.unsplash.com/photo-1612182062633-9ff3b3598e96?w=400',
  'Pannkakor med sylt': 'https://images.unsplash.com/photo-1587339144367-f1cacbecac82?w=400',
  'Bananpannkaka i ugn': 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400',
  'Våfflor med sylt och grädde': 'https://images.pexels.com/photos/2516025/pexels-photo-2516025.jpeg?w=400',
  
  // Smörgåsar
  'Avokadotoast med ägg': 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400',
  'Ostmacka deluxe': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400',
  'Toast Skagen': 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400',
  'Tunnbrödsrulle med ägg': 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=400',
  'Svensk frukostbricka': 'https://images.pexels.com/photos/2402503/pexels-photo-2402503.jpeg?w=400',
  
  // Övrig frukost
  'Frukostquesadilla': 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400',
  'Frukostburrito': 'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=400',
  'Västerbottenpaj': 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400',
  'Äppelmos med vanilj': 'https://images.unsplash.com/photo-1557568951-a691f75c810f?w=400',
  
  // ==================== LUNCH ====================
  // Svenska klassiker
  'Köttbullar med potatismos': 'https://images.unsplash.com/photo-1600688685721-852c38f6e8a6?w=400',
  'Köttbullar med mos': 'https://images.unsplash.com/photo-1712594533988-13a401974b44?w=400',
  'Pannbiff med lök': 'https://images.unsplash.com/photo-1625147541750-dfecb0a624a5?w=400',
  'Pytt i panna': 'https://images.unsplash.com/photo-1600688685721-852c38f6e8a6?w=400',
  'Falukorv med stuvade makaroner': 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400',
  'Isterband med stuvade makaroner': 'https://images.unsplash.com/photo-1611270629569-8b357cb88da9?w=400',
  'Wallenbergare': 'https://images.unsplash.com/photo-1625147541750-dfecb0a624a5?w=400',
  'Biff Lindström': 'https://images.unsplash.com/photo-1712594533988-13a401974b44?w=400',
  
  // Fläskrätter
  'Fläskpannkaka med lingon': 'https://images.unsplash.com/photo-1587339144367-f1cacbecac82?w=400',
  'Raggmunk med fläsk': 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400',
  'Rotmos med fläsk': 'https://images.unsplash.com/photo-1604908177453-7462950a6a3b?w=400',
  'Bruna bönor med fläsk': 'https://images.unsplash.com/photo-1608500218861-01091cdc501e?w=400',
  
  // Grytor och stuvningar
  'Ärtsoppa med fläsk': 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400',
  'Kalops': 'https://images.unsplash.com/photo-1664741662725-bd131742b7b7?w=400',
  'Spenatsoppa med ägg': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
  'Dillkött': 'https://images.unsplash.com/photo-1608500219063-e5164085cd6f?w=400',
  
  // Fisk
  'Stekt strömming': 'https://images.unsplash.com/photo-1600699899970-b1c9fadd8f9e?w=400',
  'Laxpudding': 'https://images.unsplash.com/photo-1560717845-968823efbee1?w=400',
  'Gravlaxsallad': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
  'Sillsallad': 'https://images.unsplash.com/photo-1702827677392-b19529fcf262?w=400',
  'Färskpotatis med matjessill': 'https://images.unsplash.com/photo-1556814901-18c866c057da?w=400',
  'Gubbröra': 'https://images.unsplash.com/photo-1600175074394-f2f4c500f7ea?w=400',
  
  // Potatis och gratänger
  'Janssons frestelse': 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400',
  'Makaronipudding': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
  'Kroppkakor': 'https://images.unsplash.com/photo-1604908177453-7462950a6a3b?w=400',
  'Potatisbullar': 'https://images.unsplash.com/photo-1608500218861-01091cdc501e?w=400',
  
  // Speciella rätter
  'Flygande Jakob': 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400',
  'Kåldolmar': 'https://images.unsplash.com/photo-1664741662725-bd131742b7b7?w=400',
  'Smörgåstårta': 'https://images.unsplash.com/photo-1560717845-968823efbee1?w=400',
  'Oxrullader': 'https://images.unsplash.com/photo-1608500219063-e5164085cd6f?w=400',
  'Blodpudding med lingon': 'https://images.unsplash.com/photo-1625147541750-dfecb0a624a5?w=400',
  'Pölsa': 'https://images.unsplash.com/photo-1712594533988-13a401974b44?w=400',
  'SOS (Smör, Ost, Sill)': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400',
  
  // ==================== MIDDAG ====================
  // Kyckling
  'Kycklinggryta med curry': 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400',
  'Kycklingwok med grönsaker': 'https://images.unsplash.com/photo-1708782344490-9026aaa5eec7?w=400',
  'Thai green curry': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
  'Kycklingspett med jordnötssås': 'https://images.unsplash.com/photo-1627366422957-3efa9c6df0fc?w=400',
  'Ugnsrostad kyckling med rotfrukter': 'https://images.pexels.com/photos/34159112/pexels-photo-34159112.jpeg?w=400',
  'Caesarsallad med kyckling': 'https://images.unsplash.com/photo-1634234497940-b4098e3c227d?w=400',
  'Kycklingschnitzel': 'https://images.unsplash.com/photo-1625147541750-dfecb0a624a5?w=400',
  
  // Kött och fläsk
  'Köttfärssås med pasta': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
  'Spaghetti och köttfärssås': 'https://images.unsplash.com/photo-1611270629569-8b357cb88da9?w=400',
  'Tacos med nötfärs': 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400',
  'Chili con carne': 'https://images.unsplash.com/photo-1664741662725-bd131742b7b7?w=400',
  'Biffar med bearnaisesås': 'https://images.unsplash.com/photo-1608500219063-e5164085cd6f?w=400',
  'Oxfilé med rödvinssky': 'https://images.unsplash.com/photo-1608500218861-01091cdc501e?w=400',
  'Fläskfilé med äppelcidersky': 'https://images.unsplash.com/photo-1604908177453-7462950a6a3b?w=400',
  'Korvstroganoff': 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400',
  'Tacopaj': 'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=400',
  'Pulled pork tacos': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
  'Lammracks med rosmarin': 'https://images.unsplash.com/photo-1608500219063-e5164085cd6f?w=400',
  
  // Fisk och skaldjur
  'Laxfile med citronsås': 'https://images.unsplash.com/photo-1560717845-968823efbee1?w=400',
  'Ugnsbakad lax med örter': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
  'Fiskgratäng': 'https://images.unsplash.com/photo-1702827677392-b19529fcf262?w=400',
  'Torskrygg med brynt smör': 'https://images.unsplash.com/photo-1600699899970-b1c9fadd8f9e?w=400',
  'Räkpasta med vitlök': 'https://images.unsplash.com/photo-1556814901-18c866c057da?w=400',
  'Ugnsbakad sej med pesto': 'https://images.unsplash.com/photo-1641898378716-1f38ec04bb0f?w=400',
  
  // Pasta
  'Pasta carbonara': 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400',
  'Pasta med räkor': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
  'Lasagne': 'https://images.unsplash.com/photo-1611270629569-8b357cb88da9?w=400',
  'Vegetarisk lasagne': 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400',
  'Pestopasta med körsbärstomater': 'https://images.pexels.com/photos/31109620/pexels-photo-31109620.jpeg?w=400',
  
  // Vegetariskt
  'Vegetarisk burrito bowl': 'https://images.unsplash.com/photo-1634234497940-b4098e3c227d?w=400',
  'Halloumisallad med mango': 'https://images.unsplash.com/photo-1634234497284-6b6a7b0fde15?w=400',
  'Indisk dhal': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400',
  'Falafel med hummus': 'https://images.unsplash.com/photo-1606757819934-d61a9f7279d5?w=400',
  'Vegetarisk tikka masala': 'https://images.unsplash.com/photo-1708782344490-9026aaa5eec7?w=400',
  'Kikärtsgryta': 'https://images.pexels.com/photos/6065181/pexels-photo-6065181.jpeg?w=400',
  
  // Asiatiskt
  'Asiatisk wok med nudlar': 'https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=400',
  'Ramensoppa': 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=400',
  
  // Övrigt middag
  'Korv med bröd': 'https://images.unsplash.com/photo-1619096252214-ef06c45683e3?w=400',
  
  // ==================== MELLANMÅL ====================
  // Bakverk
  'Kanelbullar': 'https://images.unsplash.com/photo-1584966164218-42b0c3225e41?w=400',
  'Kardemummabullar': 'https://images.unsplash.com/photo-1602077812176-1bd3ff433d74?w=400',
  'Chokladbollar': 'https://images.unsplash.com/photo-1639158924965-7be3bb57506b?w=400',
  'Semlor': 'https://images.unsplash.com/photo-1694632288834-17d86b340745?w=400',
  'Lussebullar': 'https://images.unsplash.com/photo-1523198205441-99fac53d157f?w=400',
  'Kladdkaka': 'https://images.unsplash.com/photo-1639158924965-7be3bb57506b?w=400',
  'Sockerkaka': 'https://images.unsplash.com/photo-1602077812176-1bd3ff433d74?w=400',
  'Mazariner': 'https://images.unsplash.com/photo-1584966164218-42b0c3225e41?w=400',
  'Prinsesstårta': 'https://images.unsplash.com/photo-1694632288834-17d86b340745?w=400',
  'Morotskaka': 'https://images.unsplash.com/photo-1602077812176-1bd3ff433d74?w=400',
  'Havrekakor': 'https://images.unsplash.com/photo-1523198205441-99fac53d157f?w=400',
  'Bananmuffins': 'https://images.unsplash.com/photo-1584966164218-42b0c3225e41?w=400',
  'Rabarberpaj': 'https://images.unsplash.com/photo-1694632288834-17d86b340745?w=400',
  'Ostkaka med sylt': 'https://images.unsplash.com/photo-1602077812176-1bd3ff433d74?w=400',
  'Filmjölksbröd': 'https://images.unsplash.com/photo-1523198205441-99fac53d157f?w=400',
  
  // Nyttiga mellanmål
  'Energibollar': 'https://images.unsplash.com/photo-1639158924965-7be3bb57506b?w=400',
  'Fruktspett med chokladdipp': 'https://images.pexels.com/photos/566564/pexels-photo-566564.jpeg?w=400',
  'Nötsmör med selleri': 'https://images.unsplash.com/photo-1606757819934-d61a9f7279d5?w=400',
  'Yoghurt med granola': 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?w=400',
  
  // Övriga mellanmål
  'Äppelmust och pepparkakor': 'https://images.unsplash.com/photo-1523198205441-99fac53d157f?w=400',
};

// Fallback bilder för kategorier
export const categoryFallbackImages: Record<string, string> = {
  'frukost': 'https://images.unsplash.com/photo-1702648982253-8b851013e81f?w=400',
  'lunch': 'https://images.unsplash.com/photo-1600688685721-852c38f6e8a6?w=400',
  'middag': 'https://images.unsplash.com/photo-1560717845-968823efbee1?w=400',
  'mellanmål': 'https://images.unsplash.com/photo-1584966164218-42b0c3225e41?w=400',
};

// Hjälpfunktion för att hämta bild för ett recept
export const getRecipeImage = (recipeName: string, mealType: string): string => {
  // Exakt matchning
  if (recipeImages[recipeName]) {
    return recipeImages[recipeName];
  }
  
  // Partiell matchning
  const lowerName = recipeName.toLowerCase();
  for (const [key, url] of Object.entries(recipeImages)) {
    if (lowerName.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerName)) {
      return url;
    }
  }
  
  // Keyword-baserad matchning
  if (lowerName.includes('kyckling') || lowerName.includes('chicken')) {
    return 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=400';
  }
  if (lowerName.includes('lax') || lowerName.includes('salmon')) {
    return 'https://images.unsplash.com/photo-1560717845-968823efbee1?w=400';
  }
  if (lowerName.includes('pasta') || lowerName.includes('spaghetti')) {
    return 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400';
  }
  if (lowerName.includes('köttbullar') || lowerName.includes('meatball')) {
    return 'https://images.unsplash.com/photo-1600688685721-852c38f6e8a6?w=400';
  }
  if (lowerName.includes('soppa') || lowerName.includes('soup')) {
    return 'https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400';
  }
  if (lowerName.includes('sallad') || lowerName.includes('salad')) {
    return 'https://images.unsplash.com/photo-1634234497940-b4098e3c227d?w=400';
  }
  if (lowerName.includes('taco') || lowerName.includes('burrito')) {
    return 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=400';
  }
  if (lowerName.includes('ägg') || lowerName.includes('egg')) {
    return 'https://images.unsplash.com/photo-1691480184494-d9f822edd4d1?w=400';
  }
  if (lowerName.includes('pannkak') || lowerName.includes('pancake')) {
    return 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400';
  }
  if (lowerName.includes('gröt') || lowerName.includes('porridge')) {
    return 'https://images.unsplash.com/photo-1702648982253-8b851013e81f?w=400';
  }
  if (lowerName.includes('bulle') || lowerName.includes('bun')) {
    return 'https://images.unsplash.com/photo-1584966164218-42b0c3225e41?w=400';
  }
  if (lowerName.includes('fisk') || lowerName.includes('fish') || lowerName.includes('torsk')) {
    return 'https://images.unsplash.com/photo-1600699899970-b1c9fadd8f9e?w=400';
  }
  if (lowerName.includes('gryta') || lowerName.includes('stew')) {
    return 'https://images.unsplash.com/photo-1664741662725-bd131742b7b7?w=400';
  }
  if (lowerName.includes('smoothie') || lowerName.includes('bowl')) {
    return 'https://images.unsplash.com/photo-1627308594190-a057cd4bfac8?w=400';
  }
  if (lowerName.includes('wok') || lowerName.includes('nudlar')) {
    return 'https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=400';
  }
  if (lowerName.includes('curry')) {
    return 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400';
  }
  if (lowerName.includes('vegetar') || lowerName.includes('vegan')) {
    return 'https://images.unsplash.com/photo-1634234497284-6b6a7b0fde15?w=400';
  }
  
  // Fallback till kategori
  return categoryFallbackImages[mealType] || categoryFallbackImages['middag'];
};
