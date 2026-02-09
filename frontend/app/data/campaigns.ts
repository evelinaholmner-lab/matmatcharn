import { Campaign, Store } from '../types';

// Dynamiskt beräkna veckodatum baserat på aktuell vecka
const getWeekDates = (weekOffset: number = 0) => {
  const now = new Date();
  const currentDay = now.getDay();
  const diff = currentDay === 0 ? -6 : 1 - currentDay; // Måndag som start
  
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() + diff + (weekOffset * 7));
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  
  return { start: weekStart, end: weekEnd };
};

// Denna vecka (vecka 7: 9-15 februari 2025)
const thisWeek = getWeekDates(0);
const week7End = thisWeek.end;

// Nästa vecka (vecka 8)
const nextWeek = getWeekDates(1);
const week8End = nextWeek.end;

export const campaigns: Campaign[] = [
  // ==================== VECKA 7 (9-15 februari 2025) ====================
  
  // ========== LIDL ÄLSHEM - Vecka 7 ==========
  // Bröd & kakor
  { store: 'Lidl', ingredient: 'Bagels', discount: 25, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Frukostbullar', discount: 20, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Wienerbröd', discount: 25, validUntil: week7End },
  
  // Chark & delikatessen
  { store: 'Lidl', ingredient: 'Kassler', discount: 30, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Skinka', discount: 30, validUntil: week7End },
  
  // Drycker
  { store: 'Lidl', ingredient: 'Energidryck', discount: 25, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Nocco', discount: 20, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Red Bull', discount: 30, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Läsk', discount: 35, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Coca-Cola', discount: 35, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Pepsi', discount: 35, validUntil: week7End },
  
  // Fisk & skaldjur
  { store: 'Lidl', ingredient: 'Lax', discount: 30, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Makrill', discount: 25, validUntil: week7End },
  
  // Frukt & bär
  { store: 'Lidl', ingredient: 'Blåbär', discount: 25, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Citron', discount: 30, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Clementin', discount: 30, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Dadlar', discount: 25, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Vindruvor', discount: 30, validUntil: week7End },
  
  // Glass
  { store: 'Lidl', ingredient: 'Glass', discount: 35, validUntil: week7End },
  
  // Grönsaker
  { store: 'Lidl', ingredient: 'Morötter', discount: 40, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Morot', discount: 40, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Paprika', discount: 30, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Tomat', discount: 25, validUntil: week7End },
  
  // Kött
  { store: 'Lidl', ingredient: 'Bladfärs', discount: 30, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Nötfärs', discount: 30, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Fläskkarré', discount: 35, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Fläskfilé', discount: 30, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Kycklingfilé', discount: 30, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Kyckling', discount: 30, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Kycklinglår', discount: 25, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Lammfärs', discount: 25, validUntil: week7End },
  
  // Mejeri
  { store: 'Lidl', ingredient: 'Filmjölk', discount: 20, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Keso', discount: 30, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Smör', discount: 25, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Yoghurt', discount: 35, validUntil: week7End },
  
  // Ost
  { store: 'Lidl', ingredient: 'Cheddar', discount: 25, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Gouda', discount: 25, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Grana Padano', discount: 20, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Ost', discount: 25, validUntil: week7End },
  
  // Skafferi
  { store: 'Lidl', ingredient: 'Honung', discount: 20, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Ris', discount: 25, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Basmatiris', discount: 25, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Oliver', discount: 25, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Pesto', discount: 20, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Tomatsås', discount: 25, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Solrosolja', discount: 20, validUntil: week7End },
  
  // Snacks & godis
  { store: 'Lidl', ingredient: 'Chips', discount: 40, validUntil: week7End },
  { store: 'Lidl', ingredient: 'Choklad', discount: 30, validUntil: week7End },
  
  // ========== WILLYS UMEÅ - Vecka 7 ==========
  // Bröd & kakor
  { store: 'Willys', ingredient: 'Kex', discount: 35, validUntil: week7End },
  { store: 'Willys', ingredient: 'Ballerina', discount: 35, validUntil: week7End },
  { store: 'Willys', ingredient: 'Singoalla', discount: 35, validUntil: week7End },
  { store: 'Willys', ingredient: 'Skogaholmslimpa', discount: 30, validUntil: week7End },
  { store: 'Willys', ingredient: 'Bröd', discount: 30, validUntil: week7End },
  
  // Chark & delikatessen
  { store: 'Willys', ingredient: 'Bacon', discount: 35, validUntil: week7End },
  { store: 'Willys', ingredient: 'Porchetta', discount: 30, validUntil: week7End },
  
  // Drycker
  { store: 'Willys', ingredient: 'Dryck', discount: 35, validUntil: week7End },
  { store: 'Willys', ingredient: 'Red Bull', discount: 40, validUntil: week7End },
  { store: 'Willys', ingredient: 'Energidryck', discount: 40, validUntil: week7End },
  { store: 'Willys', ingredient: 'Kaffe', discount: 25, validUntil: week7End },
  { store: 'Willys', ingredient: 'Läsk', discount: 35, validUntil: week7End },
  { store: 'Willys', ingredient: 'Coca-Cola', discount: 35, validUntil: week7End },
  { store: 'Willys', ingredient: 'Pepsi', discount: 35, validUntil: week7End },
  
  // Fisk & skaldjur
  { store: 'Willys', ingredient: 'Lax', discount: 40, validUntil: week7End },
  
  // Frukt & bär
  { store: 'Willys', ingredient: 'Blodapelsin', discount: 30, validUntil: week7End },
  { store: 'Willys', ingredient: 'Apelsin', discount: 30, validUntil: week7End },
  { store: 'Willys', ingredient: 'Äpple', discount: 25, validUntil: week7End },
  { store: 'Willys', ingredient: 'Pink Lady', discount: 25, validUntil: week7End },
  
  // Färdigmat
  { store: 'Willys', ingredient: 'Färdigrätt', discount: 35, validUntil: week7End },
  { store: 'Willys', ingredient: 'Kycklingnuggets', discount: 30, validUntil: week7End },
  { store: 'Willys', ingredient: 'Pastasås', discount: 40, validUntil: week7End },
  { store: 'Willys', ingredient: 'Pizza', discount: 35, validUntil: week7End },
  { store: 'Willys', ingredient: 'Pulled Pork', discount: 30, validUntil: week7End },
  { store: 'Willys', ingredient: 'Pulled Chicken', discount: 30, validUntil: week7End },
  { store: 'Willys', ingredient: 'Schnitzel', discount: 25, validUntil: week7End },
  
  // Glass
  { store: 'Willys', ingredient: 'Glass', discount: 40, validUntil: week7End },
  
  // Grönsaker
  { store: 'Willys', ingredient: 'Broccoli', discount: 45, validUntil: week7End },
  { store: 'Willys', ingredient: 'Morot', discount: 45, validUntil: week7End },
  { store: 'Willys', ingredient: 'Morötter', discount: 45, validUntil: week7End },
  { store: 'Willys', ingredient: 'Champinjoner', discount: 35, validUntil: week7End },
  { store: 'Willys', ingredient: 'Lök', discount: 30, validUntil: week7End },
  { store: 'Willys', ingredient: 'Sötpotatis', discount: 25, validUntil: week7End },
  
  // Korv & pålägg
  { store: 'Willys', ingredient: 'Korv', discount: 35, validUntil: week7End },
  { store: 'Willys', ingredient: 'Varmkorv', discount: 30, validUntil: week7End },
  { store: 'Willys', ingredient: 'Pålägg', discount: 35, validUntil: week7End },
  
  // Kött
  { store: 'Willys', ingredient: 'Blandfärs', discount: 30, validUntil: week7End },
  { store: 'Willys', ingredient: 'Nötfärs', discount: 30, validUntil: week7End },
  { store: 'Willys', ingredient: 'Entrecôte', discount: 25, validUntil: week7End },
  { store: 'Willys', ingredient: 'Fläskschnitzel', discount: 30, validUntil: week7End },
  { store: 'Willys', ingredient: 'Fläskfilé', discount: 35, validUntil: week7End },
  
  // Mejeri
  { store: 'Willys', ingredient: 'Kvarg', discount: 40, validUntil: week7End },
  { store: 'Willys', ingredient: 'Yoghurt', discount: 30, validUntil: week7End },
  { store: 'Willys', ingredient: 'Ägg', discount: 35, validUntil: week7End },
  { store: 'Willys', ingredient: 'Proteinpudding', discount: 35, validUntil: week7End },
  
  // Ost
  { store: 'Willys', ingredient: 'Ost', discount: 35, validUntil: week7End },
  { store: 'Willys', ingredient: 'Hushållsost', discount: 35, validUntil: week7End },
  { store: 'Willys', ingredient: 'Prästost', discount: 35, validUntil: week7End },
  
  // Skafferi
  { store: 'Willys', ingredient: 'Flingor', discount: 25, validUntil: week7End },
  { store: 'Willys', ingredient: 'Havregryn', discount: 30, validUntil: week7End },
  { store: 'Willys', ingredient: 'Pasta', discount: 40, validUntil: week7End },
  { store: 'Willys', ingredient: 'Ris', discount: 25, validUntil: week7End },
  { store: 'Willys', ingredient: 'Tortilla', discount: 40, validUntil: week7End },
  
  // Snacks & godis
  { store: 'Willys', ingredient: 'Godis', discount: 35, validUntil: week7End },
  { store: 'Willys', ingredient: 'Snacks', discount: 40, validUntil: week7End },
  { store: 'Willys', ingredient: 'Chips', discount: 40, validUntil: week7End },
  
  // ========== ICA MAXI UMEÅ - Vecka 7 ==========
  // Bröd & kakor
  { store: 'ICA', ingredient: 'Kex', discount: 35, validUntil: week7End },
  { store: 'ICA', ingredient: 'Ballerina', discount: 35, validUntil: week7End },
  { store: 'ICA', ingredient: 'Singoalla', discount: 35, validUntil: week7End },
  { store: 'ICA', ingredient: 'Skogaholmslimpa', discount: 30, validUntil: week7End },
  { store: 'ICA', ingredient: 'Bröd', discount: 30, validUntil: week7End },
  
  // Chark & delikatessen
  { store: 'ICA', ingredient: 'Bacon', discount: 35, validUntil: week7End },
  { store: 'ICA', ingredient: 'Porchetta', discount: 30, validUntil: week7End },
  
  // Drycker
  { store: 'ICA', ingredient: 'Dryck', discount: 35, validUntil: week7End },
  { store: 'ICA', ingredient: 'Red Bull', discount: 40, validUntil: week7End },
  { store: 'ICA', ingredient: 'Energidryck', discount: 40, validUntil: week7End },
  { store: 'ICA', ingredient: 'Kaffe', discount: 25, validUntil: week7End },
  { store: 'ICA', ingredient: 'Läsk', discount: 35, validUntil: week7End },
  { store: 'ICA', ingredient: 'Coca-Cola', discount: 35, validUntil: week7End },
  { store: 'ICA', ingredient: 'Pepsi', discount: 35, validUntil: week7End },
  
  // Fisk & skaldjur
  { store: 'ICA', ingredient: 'Lax', discount: 40, validUntil: week7End },
  
  // Frukt & bär
  { store: 'ICA', ingredient: 'Blodapelsin', discount: 30, validUntil: week7End },
  { store: 'ICA', ingredient: 'Apelsin', discount: 30, validUntil: week7End },
  { store: 'ICA', ingredient: 'Äpple', discount: 25, validUntil: week7End },
  { store: 'ICA', ingredient: 'Pink Lady', discount: 25, validUntil: week7End },
  
  // Färdigmat
  { store: 'ICA', ingredient: 'Färdigrätt', discount: 35, validUntil: week7End },
  { store: 'ICA', ingredient: 'Kycklingnuggets', discount: 30, validUntil: week7End },
  { store: 'ICA', ingredient: 'Pastasås', discount: 40, validUntil: week7End },
  { store: 'ICA', ingredient: 'Pizza', discount: 35, validUntil: week7End },
  { store: 'ICA', ingredient: 'Pulled Pork', discount: 30, validUntil: week7End },
  { store: 'ICA', ingredient: 'Pulled Chicken', discount: 30, validUntil: week7End },
  { store: 'ICA', ingredient: 'Schnitzel', discount: 25, validUntil: week7End },
  
  // Glass
  { store: 'ICA', ingredient: 'Glass', discount: 40, validUntil: week7End },
  
  // Grönsaker
  { store: 'ICA', ingredient: 'Broccoli', discount: 45, validUntil: week7End },
  { store: 'ICA', ingredient: 'Morot', discount: 45, validUntil: week7End },
  { store: 'ICA', ingredient: 'Morötter', discount: 45, validUntil: week7End },
  { store: 'ICA', ingredient: 'Champinjoner', discount: 35, validUntil: week7End },
  { store: 'ICA', ingredient: 'Lök', discount: 30, validUntil: week7End },
  { store: 'ICA', ingredient: 'Sötpotatis', discount: 25, validUntil: week7End },
  
  // Korv & pålägg
  { store: 'ICA', ingredient: 'Korv', discount: 35, validUntil: week7End },
  { store: 'ICA', ingredient: 'Varmkorv', discount: 30, validUntil: week7End },
  { store: 'ICA', ingredient: 'Pålägg', discount: 35, validUntil: week7End },
  
  // Kött
  { store: 'ICA', ingredient: 'Blandfärs', discount: 30, validUntil: week7End },
  { store: 'ICA', ingredient: 'Nötfärs', discount: 30, validUntil: week7End },
  { store: 'ICA', ingredient: 'Entrecôte', discount: 25, validUntil: week7End },
  { store: 'ICA', ingredient: 'Fläskschnitzel', discount: 30, validUntil: week7End },
  { store: 'ICA', ingredient: 'Fläskfilé', discount: 35, validUntil: week7End },
  
  // Mejeri
  { store: 'ICA', ingredient: 'Kvarg', discount: 40, validUntil: week7End },
  { store: 'ICA', ingredient: 'Yoghurt', discount: 30, validUntil: week7End },
  { store: 'ICA', ingredient: 'Ägg', discount: 35, validUntil: week7End },
  { store: 'ICA', ingredient: 'Proteinpudding', discount: 35, validUntil: week7End },
  
  // Ost
  { store: 'ICA', ingredient: 'Ost', discount: 35, validUntil: week7End },
  { store: 'ICA', ingredient: 'Hushållsost', discount: 35, validUntil: week7End },
  { store: 'ICA', ingredient: 'Prästost', discount: 35, validUntil: week7End },
  
  // Skafferi
  { store: 'ICA', ingredient: 'Flingor', discount: 25, validUntil: week7End },
  { store: 'ICA', ingredient: 'Havregryn', discount: 30, validUntil: week7End },
  { store: 'ICA', ingredient: 'Pasta', discount: 40, validUntil: week7End },
  { store: 'ICA', ingredient: 'Ris', discount: 25, validUntil: week7End },
  { store: 'ICA', ingredient: 'Tortilla', discount: 40, validUntil: week7End },
  
  // Snacks & godis
  { store: 'ICA', ingredient: 'Godis', discount: 35, validUntil: week7End },
  { store: 'ICA', ingredient: 'Snacks', discount: 40, validUntil: week7End },
  { store: 'ICA', ingredient: 'Chips', discount: 40, validUntil: week7End },
  
  // ========== STORA COOP TOMTEBO - Vecka 7 ==========
  // Bröd & kakor
  { store: 'Coop', ingredient: 'Kex', discount: 35, validUntil: week7End },
  { store: 'Coop', ingredient: 'Ballerina', discount: 35, validUntil: week7End },
  { store: 'Coop', ingredient: 'Singoalla', discount: 35, validUntil: week7End },
  { store: 'Coop', ingredient: 'Skogaholmslimpa', discount: 30, validUntil: week7End },
  { store: 'Coop', ingredient: 'Bröd', discount: 30, validUntil: week7End },
  
  // Chark & delikatessen
  { store: 'Coop', ingredient: 'Bacon', discount: 35, validUntil: week7End },
  { store: 'Coop', ingredient: 'Porchetta', discount: 30, validUntil: week7End },
  
  // Drycker
  { store: 'Coop', ingredient: 'Dryck', discount: 35, validUntil: week7End },
  { store: 'Coop', ingredient: 'Red Bull', discount: 40, validUntil: week7End },
  { store: 'Coop', ingredient: 'Energidryck', discount: 40, validUntil: week7End },
  { store: 'Coop', ingredient: 'Kaffe', discount: 25, validUntil: week7End },
  { store: 'Coop', ingredient: 'Läsk', discount: 35, validUntil: week7End },
  { store: 'Coop', ingredient: 'Coca-Cola', discount: 35, validUntil: week7End },
  { store: 'Coop', ingredient: 'Pepsi', discount: 35, validUntil: week7End },
  
  // Fisk & skaldjur
  { store: 'Coop', ingredient: 'Lax', discount: 40, validUntil: week7End },
  
  // Frukt & bär
  { store: 'Coop', ingredient: 'Blodapelsin', discount: 30, validUntil: week7End },
  { store: 'Coop', ingredient: 'Apelsin', discount: 30, validUntil: week7End },
  { store: 'Coop', ingredient: 'Äpple', discount: 25, validUntil: week7End },
  { store: 'Coop', ingredient: 'Pink Lady', discount: 25, validUntil: week7End },
  
  // Färdigmat
  { store: 'Coop', ingredient: 'Färdigrätt', discount: 35, validUntil: week7End },
  { store: 'Coop', ingredient: 'Kycklingnuggets', discount: 30, validUntil: week7End },
  { store: 'Coop', ingredient: 'Pastasås', discount: 40, validUntil: week7End },
  { store: 'Coop', ingredient: 'Pizza', discount: 35, validUntil: week7End },
  { store: 'Coop', ingredient: 'Pulled Pork', discount: 30, validUntil: week7End },
  { store: 'Coop', ingredient: 'Pulled Chicken', discount: 30, validUntil: week7End },
  { store: 'Coop', ingredient: 'Schnitzel', discount: 25, validUntil: week7End },
  
  // Glass
  { store: 'Coop', ingredient: 'Glass', discount: 40, validUntil: week7End },
  
  // Grönsaker
  { store: 'Coop', ingredient: 'Broccoli', discount: 45, validUntil: week7End },
  { store: 'Coop', ingredient: 'Morot', discount: 45, validUntil: week7End },
  { store: 'Coop', ingredient: 'Morötter', discount: 45, validUntil: week7End },
  { store: 'Coop', ingredient: 'Champinjoner', discount: 35, validUntil: week7End },
  { store: 'Coop', ingredient: 'Lök', discount: 30, validUntil: week7End },
  { store: 'Coop', ingredient: 'Sötpotatis', discount: 25, validUntil: week7End },
  
  // Korv & pålägg
  { store: 'Coop', ingredient: 'Korv', discount: 35, validUntil: week7End },
  { store: 'Coop', ingredient: 'Varmkorv', discount: 30, validUntil: week7End },
  { store: 'Coop', ingredient: 'Pålägg', discount: 35, validUntil: week7End },
  
  // Kött
  { store: 'Coop', ingredient: 'Blandfärs', discount: 30, validUntil: week7End },
  { store: 'Coop', ingredient: 'Nötfärs', discount: 30, validUntil: week7End },
  { store: 'Coop', ingredient: 'Entrecôte', discount: 25, validUntil: week7End },
  { store: 'Coop', ingredient: 'Fläskschnitzel', discount: 30, validUntil: week7End },
  { store: 'Coop', ingredient: 'Fläskfilé', discount: 35, validUntil: week7End },
  
  // Mejeri
  { store: 'Coop', ingredient: 'Kvarg', discount: 40, validUntil: week7End },
  { store: 'Coop', ingredient: 'Yoghurt', discount: 30, validUntil: week7End },
  { store: 'Coop', ingredient: 'Ägg', discount: 35, validUntil: week7End },
  { store: 'Coop', ingredient: 'Proteinpudding', discount: 35, validUntil: week7End },
  
  // Ost
  { store: 'Coop', ingredient: 'Ost', discount: 35, validUntil: week7End },
  { store: 'Coop', ingredient: 'Hushållsost', discount: 35, validUntil: week7End },
  { store: 'Coop', ingredient: 'Prästost', discount: 35, validUntil: week7End },
  
  // Skafferi
  { store: 'Coop', ingredient: 'Flingor', discount: 25, validUntil: week7End },
  { store: 'Coop', ingredient: 'Havregryn', discount: 30, validUntil: week7End },
  { store: 'Coop', ingredient: 'Pasta', discount: 40, validUntil: week7End },
  { store: 'Coop', ingredient: 'Ris', discount: 25, validUntil: week7End },
  { store: 'Coop', ingredient: 'Tortilla', discount: 40, validUntil: week7End },
  
  // Snacks & godis
  { store: 'Coop', ingredient: 'Godis', discount: 35, validUntil: week7End },
  { store: 'Coop', ingredient: 'Snacks', discount: 40, validUntil: week7End },
  { store: 'Coop', ingredient: 'Chips', discount: 40, validUntil: week7End },
];

// Hjälpfunktion för att hitta kampanjer för specifik ingrediens
export const getCampaignForIngredient = (ingredient: string, stores: Store[]): Campaign | null => {
  const now = new Date();
  
  // Hitta bästa kampanjen (högsta rabatten) för den specifika ingrediensen bland valda butiker
  // och som fortfarande är giltig
  const relevantCampaigns = campaigns.filter(
    c => stores.includes(c.store) && 
    c.validUntil >= now &&
    (ingredient.toLowerCase().includes(c.ingredient.toLowerCase()) ||
    c.ingredient.toLowerCase().includes(ingredient.toLowerCase()))
  );
  
  if (relevantCampaigns.length === 0) return null;
  
  // Returnera kampanjen med högst rabatt
  return relevantCampaigns.reduce((best, current) => 
    current.discount > best.discount ? current : best
  );
};

// Hjälpfunktion för att få alla giltiga kampanjer för denna vecka
export const getCurrentWeekCampaigns = (): Campaign[] => {
  const now = new Date();
  return campaigns.filter(c => c.validUntil >= now);
};

// Hjälpfunktion för att få alla giltiga kampanjer för en viss vecka
export const getCampaignsForWeek = (weekOffset: number = 0): Campaign[] => {
  const now = new Date();
  const weekStart = new Date(now.getTime() + weekOffset * 7 * 24 * 60 * 60 * 1000);
  const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return campaigns.filter(c => 
    c.validUntil >= weekStart && c.validUntil < weekEnd
  );
};
