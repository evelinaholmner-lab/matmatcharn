import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  FlatList,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from './utils/colors';
import { useAppStore } from './store';
import { Store, IngredientCategory } from './types';

interface FlyerOffer {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  unit?: string;
  category: IngredientCategory;
}

interface StoreFlyer {
  store: Store;
  storeName: string;
  color: string;
  validFrom: string;
  validTo: string;
  weekNumber: number;
  offers: FlyerOffer[];
}

// Erbjudanden per butik - Vecka 7 (9-15 februari 2025)
const storeFlyers: StoreFlyer[] = [
  {
    store: 'ICA',
    storeName: 'ICA Maxi Umeå',
    color: '#E3000F',
    validFrom: '9/2',
    validTo: '15/2',
    weekNumber: 7,
    offers: [
      // Bröd & kakor
      { id: 'ica-o1', name: 'Kex Ballerina/Brago/Singoalla', price: '2 för 30 kr', originalPrice: '22 kr/st', discount: '-35%', unit: '175-225g', category: 'Bröd' },
      { id: 'ica-o2', name: 'Skogaholmslimpa skivad', price: '2 för 45 kr', originalPrice: '30 kr/st', discount: '-25%', unit: '775g', category: 'Bröd' },
      // Chark & delikatessen
      { id: 'ica-o3', name: 'Bacon skivat Rydbergs', price: '99 kr/kg', originalPrice: '149 kr/kg', discount: '-35%', unit: 'ca 600g', category: 'Kött & Fågel' },
      { id: 'ica-o4', name: 'Porchetta Dalsjöfors', price: '95 kr/kg', originalPrice: '139 kr/kg', discount: '-30%', unit: 'ca 1,4kg', category: 'Kött & Fågel' },
      // Drycker
      { id: 'ica-o5', name: 'Dryck Kiviks Musteri', price: '2 för 30 kr', originalPrice: '22 kr/st', discount: '-35%', unit: '1,5L', category: 'Drycker' },
      { id: 'ica-o6', name: 'Red Bull Energidryck', price: '4 för 50 kr', originalPrice: '15 kr/st', discount: '-40%', unit: '25cl', category: 'Drycker' },
      { id: 'ica-o7', name: 'Kaffe Arvid Nordquist', price: '2 för 135 kr', originalPrice: '89 kr/st', discount: '-25%', unit: '500g', category: 'Drycker' },
      { id: 'ica-o8', name: 'Läsk 7UP/Pepsi/Pommac/Zingo', price: '3 för 39 kr', originalPrice: '18 kr/st', discount: '-30%', unit: '1,4-1,5L', category: 'Drycker' },
      { id: 'ica-o9', name: 'Läsk Coca-Cola/Fanta', price: '2 för 26 kr', originalPrice: '17 kr/st', discount: '-25%', unit: '50cl', category: 'Drycker' },
      // Fisk & skaldjur
      { id: 'ica-o10', name: 'Lax portionsbit Lindströms', price: '2 för 99 kr', originalPrice: '69 kr/st', discount: '-30%', unit: '400g', category: 'Fisk & Skaldjur' },
      // Frukt & bär
      { id: 'ica-o11', name: 'Blodapelsin i nät', price: '25 kr', originalPrice: '35 kr', discount: '-30%', unit: '1kg', category: 'Frukt & Grönt' },
      { id: 'ica-o12', name: 'Äpple Pink Lady', price: '30 kr/kg', originalPrice: '45 kr/kg', discount: '-35%', unit: 'kg', category: 'Frukt & Grönt' },
      // Färdigmat
      { id: 'ica-o13', name: 'Färdigrätt Thai Cube Kitchen Joy', price: '3 för 99 kr', originalPrice: '45 kr/st', discount: '-30%', unit: '320-350g', category: 'Övrigt' },
      { id: 'ica-o14', name: 'Kycklingburgare/nuggets Kronfågel', price: '55 kr', originalPrice: '79 kr', discount: '-30%', unit: '440g', category: 'Kött & Fågel' },
      { id: 'ica-o15', name: 'Pastasås Barilla', price: '2 för 39 kr', originalPrice: '29 kr/st', discount: '-35%', unit: '400g', category: 'Torrvaror' },
      { id: 'ica-o16', name: 'Pizza Grandiosa', price: '3 för 99 kr', originalPrice: '45 kr/st', discount: '-30%', unit: '310-350g', category: 'Övrigt' },
      { id: 'ica-o17', name: 'Pulled Chicken/Pork Coop', price: '55 kr', originalPrice: '79 kr', discount: '-30%', unit: '350-400g', category: 'Kött & Fågel' },
      // Grönsaker
      { id: 'ica-o18', name: 'Broccoli/Morot påse', price: '2 för 18 kr', originalPrice: '15 kr/st', discount: '-40%', unit: '0,25-1kg', category: 'Frukt & Grönt' },
      { id: 'ica-o19', name: 'Champinjoner i ask', price: '2 för 30 kr', originalPrice: '22 kr/st', discount: '-35%', unit: '250g', category: 'Frukt & Grönt' },
      { id: 'ica-o20', name: 'Lök röd/gul/vit eko Änglamark', price: '20 kr', originalPrice: '29 kr', discount: '-30%', unit: '500g', category: 'Frukt & Grönt' },
      { id: 'ica-o21', name: 'Sötpotatis', price: '25 kr/kg', originalPrice: '39 kr/kg', discount: '-35%', unit: 'kg', category: 'Frukt & Grönt' },
      // Kött
      { id: 'ica-o22', name: 'Blandfärs 50/50 John\'s', price: '49,90 kr', originalPrice: '79 kr', discount: '-35%', unit: '500g', category: 'Kött & Fågel' },
      { id: 'ica-o23', name: 'Entrecôte skivad John\'s Selection', price: '64,90 kr', originalPrice: '89 kr', discount: '-30%', unit: '180g', category: 'Kött & Fågel' },
      { id: 'ica-o24', name: 'Fläskschnitzel Nyhagens', price: '99 kr/kg', originalPrice: '149 kr/kg', discount: '-35%', unit: 'ca 800g', category: 'Kött & Fågel' },
      { id: 'ica-o25', name: 'Fläskfilé Dalsjöfors', price: '69 kr/kg', originalPrice: '109 kr/kg', discount: '-35%', unit: 'ca 900g', category: 'Kött & Fågel' },
      // Mejeri
      { id: 'ica-o26', name: 'Kvarg Lindahls', price: '2 för 40 kr', originalPrice: '29 kr/st', discount: '-30%', unit: '500g', category: 'Mejeri' },
      { id: 'ica-o27', name: 'ProFeel Protein Pudding Valio', price: '3 för 40 kr', originalPrice: '18 kr/st', discount: '-25%', unit: '150-180g', category: 'Mejeri' },
      { id: 'ica-o28', name: 'Yoghurt Arla', price: '25 kr', originalPrice: '39 kr', discount: '-35%', unit: '1,5kg', category: 'Mejeri' },
      { id: 'ica-o29', name: 'Ägg Coop 24-pack', price: '49 kr', originalPrice: '69 kr', discount: '-30%', unit: '24-p', category: 'Mejeri' },
      // Ost
      { id: 'ica-o30', name: 'Herrgårdsost/Hushållsost/Prästost skivad', price: '2 för 48 kr', originalPrice: '35 kr/st', discount: '-30%', unit: '150g', category: 'Mejeri' },
      { id: 'ica-o31', name: 'Ost Arla Ko', price: '99 kr/kg', originalPrice: '149 kr/kg', discount: '-35%', unit: '0,6-1,5kg', category: 'Mejeri' },
      // Skafferi
      { id: 'ica-o32', name: 'Flingor/Puffar Kellogg\'s', price: '37,90 kr', originalPrice: '55 kr', discount: '-30%', unit: '330-410g', category: 'Torrvaror' },
      { id: 'ica-o33', name: 'Havregryn eko Sätt', price: '22,90 kr', originalPrice: '35 kr', discount: '-35%', unit: '650g', category: 'Torrvaror' },
      { id: 'ica-o34', name: 'Pasta korta former Barilla', price: '2 för 25 kr', originalPrice: '18 kr/st', discount: '-30%', unit: '500g', category: 'Torrvaror' },
      { id: 'ica-o35', name: 'Ris Basmati/Jasmin Lido', price: '44,90 kr', originalPrice: '65 kr', discount: '-30%', unit: '1kg', category: 'Torrvaror' },
      { id: 'ica-o36', name: 'Tortilla Soft Santa Maria', price: '2 för 25 kr', originalPrice: '18 kr/st', discount: '-30%', unit: '8-p 320g', category: 'Torrvaror' },
      // Snacks & godis
      { id: 'ica-o37', name: 'Gelehjärtan Aroma', price: '2 för 50 kr', originalPrice: '35 kr/st', discount: '-30%', unit: '385g', category: 'Övrigt' },
      { id: 'ica-o38', name: 'Lösviktsgodis', price: '69,90 kr/kg', originalPrice: '99 kr/kg', discount: '-30%', unit: 'kg', category: 'Övrigt' },
      { id: 'ica-o39', name: 'Snacks OLW', price: '2 för 50 kr', originalPrice: '35 kr/st', discount: '-30%', unit: '85-450g', category: 'Övrigt' },
    ]
  },
  {
    store: 'Coop',
    storeName: 'Stora Coop Tomtebo',
    color: '#00A94F',
    validFrom: '9/2',
    validTo: '15/2',
    weekNumber: 7,
    offers: [
      // Bröd & kakor
      { id: 'coop-o1', name: 'Kex Ballerina/Brago/Singoalla Göteborgs', price: '2 för 30 kr', originalPrice: '22 kr/st', discount: '-35%', unit: '175-225g', category: 'Bröd' },
      { id: 'coop-o2', name: 'Skogaholmslimpa skivad', price: '2 för 45 kr', originalPrice: '30 kr/st', discount: '-25%', unit: '775g', category: 'Bröd' },
      // Chark & delikatessen
      { id: 'coop-o3', name: 'Bacon skivat Rydbergs', price: '99 kr/kg', originalPrice: '149 kr/kg', discount: '-35%', unit: 'ca 600g', category: 'Kött & Fågel' },
      { id: 'coop-o4', name: 'Porchetta Dalsjöfors', price: '95 kr/kg', originalPrice: '139 kr/kg', discount: '-30%', unit: 'ca 1,4kg', category: 'Kött & Fågel' },
      // Drycker
      { id: 'coop-o5', name: 'Dryck Kiviks Musteri', price: '2 för 30 kr', originalPrice: '22 kr/st', discount: '-35%', unit: '1,5L', category: 'Drycker' },
      { id: 'coop-o6', name: 'Red Bull Energidryck', price: '4 för 50 kr', originalPrice: '15 kr/st', discount: '-40%', unit: '25cl', category: 'Drycker' },
      { id: 'coop-o7', name: 'Kaffe Arvid Nordquist', price: '2 för 135 kr', originalPrice: '89 kr/st', discount: '-25%', unit: '500g', category: 'Drycker' },
      { id: 'coop-o8', name: 'Läsk 7UP/Pepsi/Pommac/Zingo', price: '3 för 39 kr', originalPrice: '18 kr/st', discount: '-30%', unit: '1,4-1,5L', category: 'Drycker' },
      { id: 'coop-o9', name: 'Läsk Coca-Cola/Fanta', price: '2 för 26 kr', originalPrice: '17 kr/st', discount: '-25%', unit: '50cl', category: 'Drycker' },
      // Fisk & skaldjur
      { id: 'coop-o10', name: 'Lax portionsbit Lindströms', price: '2 för 99 kr', originalPrice: '69 kr/st', discount: '-30%', unit: '400g', category: 'Fisk & Skaldjur' },
      // Frukt & bär
      { id: 'coop-o11', name: 'Blodapelsin i nät Coop', price: '25 kr', originalPrice: '35 kr', discount: '-30%', unit: '1kg', category: 'Frukt & Grönt' },
      { id: 'coop-o12', name: 'Äpple Pink Lady', price: '30 kr/kg', originalPrice: '45 kr/kg', discount: '-35%', unit: 'kg', category: 'Frukt & Grönt' },
      // Färdigmat
      { id: 'coop-o13', name: 'Färdigrätt Thai Cube Kitchen Joy', price: '3 för 99 kr', originalPrice: '45 kr/st', discount: '-30%', unit: '320-350g', category: 'Övrigt' },
      { id: 'coop-o14', name: 'Kycklingburgare/nuggets Kronfågel', price: '55 kr', originalPrice: '79 kr', discount: '-30%', unit: '440g', category: 'Kött & Fågel' },
      { id: 'coop-o15', name: 'Pastasås Barilla', price: '2 för 39 kr', originalPrice: '29 kr/st', discount: '-35%', unit: '400g', category: 'Torrvaror' },
      { id: 'coop-o16', name: 'Pizza Grandiosa', price: '3 för 99 kr', originalPrice: '45 kr/st', discount: '-30%', unit: '310-350g', category: 'Övrigt' },
      { id: 'coop-o17', name: 'Pulled Chicken/Pork Coop', price: '55 kr', originalPrice: '79 kr', discount: '-30%', unit: '350-400g', category: 'Kött & Fågel' },
      { id: 'coop-o18', name: 'Schnitzel/Ost panerad Scan', price: '59,90 kr', originalPrice: '85 kr', discount: '-30%', unit: '600g', category: 'Kött & Fågel' },
      // Glass
      { id: 'coop-o19', name: 'Glass Sia Glass', price: '2 för 79 kr', originalPrice: '55 kr/st', discount: '-30%', unit: '5-6-p', category: 'Övrigt' },
      // Grönsaker
      { id: 'coop-o20', name: 'Broccoli/Morot påse Coop', price: '2 för 18 kr', originalPrice: '15 kr/st', discount: '-40%', unit: '0,25-1kg', category: 'Frukt & Grönt' },
      { id: 'coop-o21', name: 'Champinjoner i ask Coop', price: '2 för 30 kr', originalPrice: '22 kr/st', discount: '-35%', unit: '250g', category: 'Frukt & Grönt' },
      { id: 'coop-o22', name: 'Lök röd/gul/vit eko Änglamark', price: '20 kr', originalPrice: '29 kr', discount: '-30%', unit: '500g', category: 'Frukt & Grönt' },
      { id: 'coop-o23', name: 'Sötpotatis', price: '25 kr/kg', originalPrice: '39 kr/kg', discount: '-35%', unit: 'kg', category: 'Frukt & Grönt' },
      // Korv & pålägg
      { id: 'coop-o24', name: 'Kryddkorv Scan', price: '29,90 kr', originalPrice: '45 kr', discount: '-35%', unit: '200-300g', category: 'Kött & Fågel' },
      { id: 'coop-o25', name: 'Pålägg skivat Brödernas', price: '2 för 50 kr', originalPrice: '35 kr/st', discount: '-30%', unit: '90-105g', category: 'Kött & Fågel' },
      { id: 'coop-o26', name: 'Varmkorv Nyhagens Hugosson', price: '35,90 kr', originalPrice: '55 kr', discount: '-35%', unit: '360-450g', category: 'Kött & Fågel' },
      // Kött
      { id: 'coop-o27', name: 'Blandfärs 50/50 John\'s', price: '49,90 kr', originalPrice: '79 kr', discount: '-35%', unit: '500g', category: 'Kött & Fågel' },
      { id: 'coop-o28', name: 'Entrecôte skivad John\'s Selection', price: '64,90 kr', originalPrice: '89 kr', discount: '-30%', unit: '180g', category: 'Kött & Fågel' },
      { id: 'coop-o29', name: 'Fläskschnitzel Nyhagens', price: '99 kr/kg', originalPrice: '149 kr/kg', discount: '-35%', unit: 'ca 800g', category: 'Kött & Fågel' },
      { id: 'coop-o30', name: 'Fläskfilé Dalsjöfors', price: '69 kr/kg', originalPrice: '109 kr/kg', discount: '-35%', unit: 'ca 900g', category: 'Kött & Fågel' },
      // Mejeri
      { id: 'coop-o31', name: 'Kvarg Lindahls', price: '2 för 40 kr', originalPrice: '29 kr/st', discount: '-30%', unit: '500g', category: 'Mejeri' },
      { id: 'coop-o32', name: 'ProFeel Protein Pudding Valio', price: '3 för 40 kr', originalPrice: '18 kr/st', discount: '-25%', unit: '150-180g', category: 'Mejeri' },
      { id: 'coop-o33', name: 'Yoghurt Arla', price: '25 kr', originalPrice: '39 kr', discount: '-35%', unit: '1,5kg', category: 'Mejeri' },
      { id: 'coop-o34', name: 'Ägg Coop 24-pack', price: '49 kr', originalPrice: '69 kr', discount: '-30%', unit: '24-p', category: 'Mejeri' },
      // Ost
      { id: 'coop-o35', name: 'Herrgårdsost/Hushållsost/Prästost skivad', price: '2 för 48 kr', originalPrice: '35 kr/st', discount: '-30%', unit: '150g', category: 'Mejeri' },
      { id: 'coop-o36', name: 'Ost Arla Ko', price: '99 kr/kg', originalPrice: '149 kr/kg', discount: '-35%', unit: '0,6-1,5kg', category: 'Mejeri' },
      // Skafferi
      { id: 'coop-o37', name: 'Flingor/Puffar Kellogg\'s', price: '37,90 kr', originalPrice: '55 kr', discount: '-30%', unit: '330-410g', category: 'Torrvaror' },
      { id: 'coop-o38', name: 'Havregryn eko Sätt', price: '22,90 kr', originalPrice: '35 kr', discount: '-35%', unit: '650g', category: 'Torrvaror' },
      { id: 'coop-o39', name: 'Pasta korta former Barilla', price: '2 för 25 kr', originalPrice: '18 kr/st', discount: '-30%', unit: '500g', category: 'Torrvaror' },
      { id: 'coop-o40', name: 'Ris Basmati/Jasmin Lido', price: '44,90 kr', originalPrice: '65 kr', discount: '-30%', unit: '1kg', category: 'Torrvaror' },
      { id: 'coop-o41', name: 'Tortilla Soft Santa Maria', price: '2 för 25 kr', originalPrice: '18 kr/st', discount: '-30%', unit: '8-p 320g', category: 'Torrvaror' },
      // Snacks & godis
      { id: 'coop-o42', name: 'Gelehjärtan Aroma', price: '2 för 50 kr', originalPrice: '35 kr/st', discount: '-30%', unit: '385g', category: 'Övrigt' },
      { id: 'coop-o43', name: 'Lösviktsgodis', price: '69,90 kr/kg', originalPrice: '99 kr/kg', discount: '-30%', unit: 'kg', category: 'Övrigt' },
      { id: 'coop-o44', name: 'Snacks OLW', price: '2 för 50 kr', originalPrice: '35 kr/st', discount: '-30%', unit: '85-450g', category: 'Övrigt' },
    ]
  },
  {
    store: 'Willys',
    storeName: 'Willys Umeå',
    color: '#FF6B00',
    validFrom: '9/2',
    validTo: '15/2',
    weekNumber: 7,
    offers: [
      // Bröd & kakor
      { id: 'willys-o1', name: 'Kex Ballerina/Brago/Singoalla', price: '2 för 30 kr', originalPrice: '22 kr/st', discount: '-35%', unit: '175-225g', category: 'Bröd' },
      { id: 'willys-o2', name: 'Skogaholmslimpa skivad', price: '2 för 45 kr', originalPrice: '30 kr/st', discount: '-25%', unit: '775g', category: 'Bröd' },
      // Chark & delikatessen
      { id: 'willys-o3', name: 'Bacon skivat Rydbergs', price: '99 kr/kg', originalPrice: '149 kr/kg', discount: '-35%', unit: 'ca 600g', category: 'Kött & Fågel' },
      { id: 'willys-o4', name: 'Porchetta Dalsjöfors', price: '95 kr/kg', originalPrice: '139 kr/kg', discount: '-30%', unit: 'ca 1,4kg', category: 'Kött & Fågel' },
      // Drycker
      { id: 'willys-o5', name: 'Dryck Kiviks Musteri', price: '2 för 30 kr', originalPrice: '22 kr/st', discount: '-35%', unit: '1,5L', category: 'Drycker' },
      { id: 'willys-o6', name: 'Red Bull Energidryck', price: '4 för 50 kr', originalPrice: '15 kr/st', discount: '-40%', unit: '25cl', category: 'Drycker' },
      { id: 'willys-o7', name: 'Kaffe Arvid Nordquist', price: '2 för 135 kr', originalPrice: '89 kr/st', discount: '-25%', unit: '500g', category: 'Drycker' },
      { id: 'willys-o8', name: 'Kaffekapslar Dolce Gusto Nescafé', price: '2 för 119 kr', originalPrice: '79 kr/st', discount: '-25%', unit: '16-p', category: 'Drycker' },
      { id: 'willys-o9', name: 'Läsk 7UP/Pepsi/Pommac/Zingo', price: '3 för 39 kr', originalPrice: '18 kr/st', discount: '-30%', unit: '1,4-1,5L', category: 'Drycker' },
      { id: 'willys-o10', name: 'Läsk Coca-Cola/Fanta', price: '2 för 26 kr', originalPrice: '17 kr/st', discount: '-25%', unit: '50cl', category: 'Drycker' },
      // Fisk & skaldjur
      { id: 'willys-o11', name: 'Lax portionsbit Lindströms', price: '2 för 99 kr', originalPrice: '69 kr/st', discount: '-30%', unit: '400g', category: 'Fisk & Skaldjur' },
      // Frukt & bär
      { id: 'willys-o12', name: 'Blodapelsin i nät Coop', price: '25 kr', originalPrice: '35 kr', discount: '-30%', unit: '1kg', category: 'Frukt & Grönt' },
      { id: 'willys-o13', name: 'Äpple Pink Lady', price: '30 kr/kg', originalPrice: '45 kr/kg', discount: '-35%', unit: 'kg', category: 'Frukt & Grönt' },
      // Färdigmat
      { id: 'willys-o14', name: 'Färdigrätt Thai Cube Kitchen Joy', price: '3 för 99 kr', originalPrice: '45 kr/st', discount: '-30%', unit: '320-350g', category: 'Övrigt' },
      { id: 'willys-o15', name: 'Kycklingburgare/nuggets Kronfågel', price: '55 kr', originalPrice: '79 kr', discount: '-30%', unit: '440g', category: 'Kött & Fågel' },
      { id: 'willys-o16', name: 'Pastasås Barilla', price: '2 för 39 kr', originalPrice: '29 kr/st', discount: '-35%', unit: '400g', category: 'Torrvaror' },
      { id: 'willys-o17', name: 'Pizza Grandiosa', price: '3 för 99 kr', originalPrice: '45 kr/st', discount: '-30%', unit: '310-350g', category: 'Övrigt' },
      { id: 'willys-o18', name: 'Pulled Chicken/Pork Coop', price: '55 kr', originalPrice: '79 kr', discount: '-30%', unit: '350-400g', category: 'Kött & Fågel' },
      { id: 'willys-o19', name: 'Schnitzel/Ost panerad Scan', price: '59,90 kr', originalPrice: '85 kr', discount: '-30%', unit: '600g', category: 'Kött & Fågel' },
      { id: 'willys-o20', name: 'Snack Noodle/Snack Pot Knorr', price: '2 för 30 kr', originalPrice: '22 kr/st', discount: '-35%', unit: '51-65g', category: 'Övrigt' },
      { id: 'willys-o21', name: 'Soppa konserv Heinz', price: '3 för 50 kr', originalPrice: '25 kr/st', discount: '-35%', unit: '400g', category: 'Övrigt' },
      // Glass
      { id: 'willys-o22', name: 'Glass Sia Glass', price: '2 för 79 kr', originalPrice: '55 kr/st', discount: '-30%', unit: '5-6-p', category: 'Övrigt' },
      // Grönsaker
      { id: 'willys-o23', name: 'Broccoli/Morot påse Coop', price: '2 för 18 kr', originalPrice: '15 kr/st', discount: '-40%', unit: '0,25-1kg', category: 'Frukt & Grönt' },
      { id: 'willys-o24', name: 'Champinjoner i ask Coop', price: '2 för 30 kr', originalPrice: '22 kr/st', discount: '-35%', unit: '250g', category: 'Frukt & Grönt' },
      { id: 'willys-o25', name: 'Lök röd/gul/vit eko Änglamark', price: '20 kr', originalPrice: '29 kr', discount: '-30%', unit: '500g', category: 'Frukt & Grönt' },
      { id: 'willys-o26', name: 'Sötpotatis', price: '25 kr/kg', originalPrice: '39 kr/kg', discount: '-35%', unit: 'kg', category: 'Frukt & Grönt' },
      // Hälsa
      { id: 'willys-o27', name: 'Vätskeersättning Resorb', price: '45 kr', originalPrice: '65 kr', discount: '-30%', unit: '20-p', category: 'Övrigt' },
      // Korv & pålägg
      { id: 'willys-o28', name: 'Kryddkorv Scan', price: '29,90 kr', originalPrice: '45 kr', discount: '-35%', unit: '200-300g', category: 'Kött & Fågel' },
      { id: 'willys-o29', name: 'Pålägg skivat Brödernas', price: '2 för 50 kr', originalPrice: '35 kr/st', discount: '-30%', unit: '90-105g', category: 'Kött & Fågel' },
      { id: 'willys-o30', name: 'Varmkorv Nyhagens Hugosson', price: '35,90 kr', originalPrice: '55 kr', discount: '-35%', unit: '360-450g', category: 'Kött & Fågel' },
      // Kött
      { id: 'willys-o31', name: 'Blandfärs 50/50 John\'s', price: '49,90 kr', originalPrice: '79 kr', discount: '-35%', unit: '500g', category: 'Kött & Fågel' },
      { id: 'willys-o32', name: 'Entrecôte skivad John\'s Selection', price: '64,90 kr', originalPrice: '89 kr', discount: '-30%', unit: '180g', category: 'Kött & Fågel' },
      { id: 'willys-o33', name: 'Fläskschnitzel Nyhagens', price: '99 kr/kg', originalPrice: '149 kr/kg', discount: '-35%', unit: 'ca 800g', category: 'Kött & Fågel' },
      { id: 'willys-o34', name: 'Fläskfilé Dalsjöfors', price: '69 kr/kg', originalPrice: '109 kr/kg', discount: '-35%', unit: 'ca 900g', category: 'Kött & Fågel' },
      // Mejeri
      { id: 'willys-o35', name: 'Kvarg Lindahls', price: '2 för 40 kr', originalPrice: '29 kr/st', discount: '-30%', unit: '500g', category: 'Mejeri' },
      { id: 'willys-o36', name: 'ProFeel Protein Pudding Valio', price: '3 för 40 kr', originalPrice: '18 kr/st', discount: '-25%', unit: '150-180g', category: 'Mejeri' },
      { id: 'willys-o37', name: 'Yoghurt Arla', price: '25 kr', originalPrice: '39 kr', discount: '-35%', unit: '1,5kg', category: 'Mejeri' },
      { id: 'willys-o38', name: 'Ägg Coop 24-pack', price: '49 kr', originalPrice: '69 kr', discount: '-30%', unit: '24-p', category: 'Mejeri' },
      // Ost
      { id: 'willys-o39', name: 'Herrgårdsost/Hushållsost/Prästost skivad', price: '2 för 48 kr', originalPrice: '35 kr/st', discount: '-30%', unit: '150g', category: 'Mejeri' },
      { id: 'willys-o40', name: 'Ost Arla Ko', price: '99 kr/kg', originalPrice: '149 kr/kg', discount: '-35%', unit: '0,6-1,5kg', category: 'Mejeri' },
      // Skafferi
      { id: 'willys-o41', name: 'Flingor/Puffar Kellogg\'s', price: '37,90 kr', originalPrice: '55 kr', discount: '-30%', unit: '330-410g', category: 'Torrvaror' },
      { id: 'willys-o42', name: 'Havregryn eko Sätt', price: '22,90 kr', originalPrice: '35 kr', discount: '-35%', unit: '650g', category: 'Torrvaror' },
      { id: 'willys-o43', name: 'Pasta korta former Barilla', price: '2 för 25 kr', originalPrice: '18 kr/st', discount: '-30%', unit: '500g', category: 'Torrvaror' },
      { id: 'willys-o44', name: 'Ris Basmati/Jasmin Lido', price: '44,90 kr', originalPrice: '65 kr', discount: '-30%', unit: '1kg', category: 'Torrvaror' },
      { id: 'willys-o45', name: 'Tortilla Soft Santa Maria', price: '2 för 25 kr', originalPrice: '18 kr/st', discount: '-30%', unit: '8-p 320g', category: 'Torrvaror' },
      // Snacks & godis
      { id: 'willys-o46', name: 'Gelehjärtan Aroma', price: '2 för 50 kr', originalPrice: '35 kr/st', discount: '-30%', unit: '385g', category: 'Övrigt' },
      { id: 'willys-o47', name: 'Lösviktsgodis', price: '69,90 kr/kg', originalPrice: '99 kr/kg', discount: '-30%', unit: 'kg', category: 'Övrigt' },
      { id: 'willys-o48', name: 'Snacks OLW', price: '2 för 50 kr', originalPrice: '35 kr/st', discount: '-30%', unit: '85-450g', category: 'Övrigt' },
      // Vegetariskt
      { id: 'willys-o49', name: 'Filé panerad vegetarisk Nothing Fishy', price: '2 för 69 kr', originalPrice: '49 kr/st', discount: '-30%', unit: '250g', category: 'Övrigt' },
    ]
  },
  {
    store: 'Lidl',
    storeName: 'Lidl Älshem',
    color: '#0050AA',
    validFrom: '9/2',
    validTo: '15/2',
    weekNumber: 7,
    offers: [
      // Bröd & kakor
      { id: 'lidl-o1', name: 'Bagels 6-pack', price: '29,90 kr', originalPrice: '39 kr', discount: '-25%', unit: '6-p', category: 'Bröd' },
      { id: 'lidl-o2', name: 'Frukostbullar Hajkaka/Havrekak', price: '27,90 kr', originalPrice: '35 kr', discount: '-20%', unit: '400g', category: 'Bröd' },
      { id: 'lidl-o3', name: 'Wienerbröd 4-pack', price: '39,90 kr', originalPrice: '55 kr', discount: '-30%', unit: '4-p', category: 'Bröd' },
      // Chark & delikatessen
      { id: 'lidl-o4', name: 'Kassler', price: '2 för 69,90 kr', originalPrice: '45 kr/st', discount: '-25%', unit: '300g', category: 'Kött & Fågel' },
      { id: 'lidl-o5', name: 'Skinka', price: '2 för 39,90 kr', originalPrice: '25 kr/st', discount: '-20%', unit: '100g', category: 'Kött & Fågel' },
      // Drycker
      { id: 'lidl-o6', name: 'Nocco Energidryck', price: '15,90 kr', originalPrice: '20 kr', discount: '-20%', unit: '33cl', category: 'Drycker' },
      { id: 'lidl-o7', name: 'Red Bull Energidryck', price: '10 för 85 kr', originalPrice: '12 kr/st', discount: '-30%', unit: '25cl', category: 'Drycker' },
      { id: 'lidl-o8', name: 'Kaffekapslar Dolce Gusto Nescafé', price: '2 för 105 kr', originalPrice: '69 kr/st', discount: '-25%', unit: '16-p', category: 'Drycker' },
      { id: 'lidl-o9', name: 'Läsk 7UP/Pepsi/Zingo', price: '3 för 39 kr', originalPrice: '18 kr/st', discount: '-30%', unit: '1,5L', category: 'Drycker' },
      { id: 'lidl-o10', name: 'Läsk Coca-Cola/Fanta', price: '2 för 26 kr', originalPrice: '17 kr/st', discount: '-25%', unit: '50cl', category: 'Drycker' },
      { id: 'lidl-o11', name: 'Ice Coffee Nescafé 8-pack', price: '23,90 kr', originalPrice: '35 kr', discount: '-30%', unit: '8-p', category: 'Drycker' },
      { id: 'lidl-o12', name: 'Capri-Sun stilldrik 10-pack', price: '32,90 kr', originalPrice: '45 kr', discount: '-25%', unit: '10-p', category: 'Drycker' },
      // Fisk & skaldjur
      { id: 'lidl-o13', name: 'Lax Varmrökt portionsbit', price: '119 kr/kg', originalPrice: '169 kr/kg', discount: '-30%', unit: 'ca 1,2kg', category: 'Fisk & Skaldjur' },
      { id: 'lidl-o14', name: 'Rökt makrill', price: '49,90 kr', originalPrice: '69 kr', discount: '-30%', unit: '300g', category: 'Fisk & Skaldjur' },
      // Frukt & bär
      { id: 'lidl-o15', name: 'Blåbär', price: '34,90 kr', originalPrice: '49 kr', discount: '-30%', unit: 'ca 250g', category: 'Frukt & Grönt' },
      { id: 'lidl-o16', name: 'Citron i nät', price: '19,90 kr/kg', originalPrice: '29 kr/kg', discount: '-30%', unit: '1kg', category: 'Frukt & Grönt' },
      { id: 'lidl-o17', name: 'Clementin/Tango/Nadorcott', price: '19,90 kr/kg', originalPrice: '29 kr/kg', discount: '-30%', unit: '1kg', category: 'Frukt & Grönt' },
      { id: 'lidl-o18', name: 'Dadlar Majan/Madan', price: '34,90 kr', originalPrice: '49 kr', discount: '-30%', unit: '600g', category: 'Frukt & Grönt' },
      { id: 'lidl-o19', name: 'Vindruvor röda i ask', price: '24,90 kr', originalPrice: '39 kr', discount: '-35%', unit: '500g', category: 'Frukt & Grönt' },
      // Glass
      { id: 'lidl-o20', name: 'Glass GB Glace 4-pack', price: '36,90 kr', originalPrice: '55 kr', discount: '-35%', unit: '4-p', category: 'Övrigt' },
      { id: 'lidl-o21', name: 'Glass Mochie Deluxe 6-pack', price: '44,90 kr', originalPrice: '65 kr', discount: '-30%', unit: '6-p', category: 'Övrigt' },
      // Grönsaker
      { id: 'lidl-o22', name: 'Morötter Matriket', price: '8,90 kr', originalPrice: '15 kr', discount: '-40%', unit: '1kg', category: 'Frukt & Grönt' },
      { id: 'lidl-o23', name: 'Paprikamix', price: '24,90 kr', originalPrice: '39 kr', discount: '-35%', unit: '1kg', category: 'Frukt & Grönt' },
      { id: 'lidl-o24', name: 'Plommontomat', price: '19,90 kr', originalPrice: '29 kr', discount: '-30%', unit: '500g', category: 'Frukt & Grönt' },
      // Kött
      { id: 'lidl-o25', name: 'Bladfärs Butcher\'s', price: '34,90 kr', originalPrice: '55 kr', discount: '-35%', unit: '500g', category: 'Kött & Fågel' },
      { id: 'lidl-o26', name: 'Chorizosalsiccia Matriket', price: '42,90 kr', originalPrice: '59 kr', discount: '-25%', unit: '500g', category: 'Kött & Fågel' },
      { id: 'lidl-o27', name: 'Fläskkarré marmorerad', price: '74,90 kr/kg', originalPrice: '109 kr/kg', discount: '-30%', unit: 'ca 1kg', category: 'Kött & Fågel' },
      { id: 'lidl-o28', name: 'Fläskfilé skivad Butcher\'s', price: '52,90 kr', originalPrice: '75 kr', discount: '-30%', unit: '700g', category: 'Kött & Fågel' },
      { id: 'lidl-o29', name: 'Fläskkarré skivad med ben', price: '39,90 kr', originalPrice: '59 kr', discount: '-35%', unit: '700g', category: 'Kött & Fågel' },
      { id: 'lidl-o30', name: 'Kycklingfilé Matriket', price: '79,90 kr/kg', originalPrice: '119 kr/kg', discount: '-35%', unit: 'ca 1kg', category: 'Kött & Fågel' },
      { id: 'lidl-o31', name: 'Kycklinglår marinerade', price: '57,90 kr', originalPrice: '79 kr', discount: '-25%', unit: '800g', category: 'Kött & Fågel' },
      { id: 'lidl-o32', name: 'Kycklingfilé djupfryst', price: '64,90 kr', originalPrice: '89 kr', discount: '-25%', unit: '800g', category: 'Kött & Fågel' },
      { id: 'lidl-o33', name: 'Kycklingkebab 1001 Delights', price: '79,90 kr', originalPrice: '109 kr', discount: '-25%', unit: '750g', category: 'Kött & Fågel' },
      { id: 'lidl-o34', name: 'Lammfärs Proud Farmer', price: '89,90 kr/kg', originalPrice: '129 kr/kg', discount: '-30%', unit: 'ca 2kg', category: 'Kött & Fågel' },
      // Mejeri
      { id: 'lidl-o35', name: 'Filmjölk Verum', price: '21,90 kr', originalPrice: '29 kr', discount: '-25%', unit: '1L', category: 'Mejeri' },
      { id: 'lidl-o36', name: 'Keso Lindahls', price: '3 för 28 kr', originalPrice: '15 kr/st', discount: '-40%', unit: '100g', category: 'Mejeri' },
      { id: 'lidl-o37', name: 'Smör svenskt', price: '49,90 kr', originalPrice: '65 kr', discount: '-25%', unit: '500g', category: 'Mejeri' },
      { id: 'lidl-o38', name: 'Fruktyoghurt Valio', price: '3 för 40 kr', originalPrice: '18 kr/st', discount: '-25%', unit: '1kg', category: 'Mejeri' },
      { id: 'lidl-o39', name: 'Yoghurt Safari 6-pack', price: '26,90 kr', originalPrice: '39 kr', discount: '-30%', unit: '6-p', category: 'Mejeri' },
      // Ost
      { id: 'lidl-o40', name: 'Cheddarost Deluxe', price: '44,90 kr', originalPrice: '59 kr', discount: '-25%', unit: '250g', category: 'Mejeri' },
      { id: 'lidl-o41', name: 'Goudaost skivad Symbole', price: '39,90 kr', originalPrice: '55 kr', discount: '-25%', unit: '400g', category: 'Mejeri' },
      { id: 'lidl-o42', name: 'Grana Padano PDO Mild', price: '59,90 kr', originalPrice: '79 kr', discount: '-25%', unit: '200g', category: 'Mejeri' },
      // Skafferi
      { id: 'lidl-o43', name: 'Honung Maruka Deluxe', price: '99 kr', originalPrice: '129 kr', discount: '-25%', unit: '250g', category: 'Torrvaror' },
      { id: 'lidl-o44', name: 'Ris basmati Abu Kass', price: '139 kr', originalPrice: '179 kr', discount: '-25%', unit: '4,5kg', category: 'Torrvaror' },
      { id: 'lidl-o45', name: 'Oliver skivad', price: '24,90 kr', originalPrice: '35 kr', discount: '-30%', unit: '200g', category: 'Torrvaror' },
      { id: 'lidl-o46', name: 'Pesto med pistagenötter Deluxe', price: '44,90 kr', originalPrice: '59 kr', discount: '-25%', unit: '190g', category: 'Torrvaror' },
      { id: 'lidl-o47', name: 'Tomatsås Deluxe', price: '21,90 kr', originalPrice: '29 kr', discount: '-25%', unit: '350g', category: 'Torrvaror' },
      { id: 'lidl-o48', name: 'Solrosolja 1001 Delights', price: '129 kr', originalPrice: '169 kr', discount: '-25%', unit: '5L', category: 'Torrvaror' },
      // Snacks & godis
      { id: 'lidl-o49', name: 'Chips Deluxe', price: '11,90 kr', originalPrice: '19 kr', discount: '-40%', unit: '150g', category: 'Övrigt' },
      { id: 'lidl-o50', name: 'Choco Crunch/Smash OLW', price: '24,90 kr', originalPrice: '35 kr', discount: '-30%', unit: '90-100g', category: 'Övrigt' },
      { id: 'lidl-o51', name: 'Chokladask Guldhjärta Anthon Berg', price: '69,90 kr', originalPrice: '99 kr', discount: '-30%', unit: '155g', category: 'Övrigt' },
      { id: 'lidl-o52', name: 'Godis Ahlgrens bilar', price: '2 för 25 kr', originalPrice: '17 kr/st', discount: '-25%', unit: '130-160g', category: 'Övrigt' },
      { id: 'lidl-o53', name: 'Gelehjärtan Aroma', price: '32,90 kr', originalPrice: '45 kr', discount: '-25%', unit: '385g', category: 'Övrigt' },
      { id: 'lidl-o54', name: 'Solrosfrön rostade saltade XXL', price: '29,90 kr', originalPrice: '45 kr', discount: '-35%', unit: '500g', category: 'Övrigt' },
    ]
  },
];

export default function FlyersScreen() {
  const router = useRouter();
  const { addManualItem } = useAppStore();
  const [selectedStoreIndex, setSelectedStoreIndex] = useState(0);

  const currentFlyer = storeFlyers[selectedStoreIndex];

  const handleAddToList = useCallback((offer: FlyerOffer) => {
    addManualItem({
      ingredient: offer.name,
      amount: 1,
      unit: offer.unit || 'st',
      category: offer.category
    });
    Alert.alert(
      '✓ Tillagd i listan',
      `${offer.name} har lagts till i din inköpslista.`,
      [{ text: 'OK' }]
    );
  }, [addManualItem]);

  const renderOfferItem = useCallback(({ item }: { item: FlyerOffer }) => (
    <TouchableOpacity
      style={styles.offerItem}
      onPress={() => handleAddToList(item)}
    >
      <View style={styles.offerLeft}>
        {item.discount && (
          <View style={[styles.offerBadge, { backgroundColor: currentFlyer.color }]}>
            <Text style={styles.offerBadgeText}>{item.discount}</Text>
          </View>
        )}
        <View style={styles.offerTextContainer}>
          <Text style={styles.offerName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.offerUnit}>{item.unit}</Text>
        </View>
      </View>
      <View style={styles.offerRight}>
        <Text style={[styles.offerPrice, { color: currentFlyer.color }]}>{item.price}</Text>
        {item.originalPrice && (
          <Text style={styles.offerOriginalPrice}>{item.originalPrice}</Text>
        )}
      </View>
      <View style={[styles.addButton, { backgroundColor: currentFlyer.color }]}>
        <Ionicons name="add" size={20} color="#fff" />
      </View>
    </TouchableOpacity>
  ), [currentFlyer.color, handleAddToList]);

  // Gruppera erbjudanden efter kategori
  const groupedOffers = currentFlyer.offers.reduce((acc, offer) => {
    if (!acc[offer.category]) {
      acc[offer.category] = [];
    }
    acc[offer.category].push(offer);
    return acc;
  }, {} as Record<string, FlyerOffer[]>);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Veckans Erbjudanden</Text>
          <Text style={styles.headerWeek}>Vecka {currentFlyer.weekNumber}</Text>
        </View>

        <View style={styles.headerButton} />
      </View>

      {/* Store Selector */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.storeSelector}
        contentContainerStyle={styles.storeSelectorContent}
      >
        {storeFlyers.map((flyer, index) => (
          <TouchableOpacity
            key={flyer.store}
            style={[
              styles.storeButton,
              selectedStoreIndex === index && { 
                backgroundColor: flyer.color + '15',
                borderColor: flyer.color 
              }
            ]}
            onPress={() => setSelectedStoreIndex(index)}
          >
            <View style={[styles.storeIcon, { backgroundColor: flyer.color }]}>
              <Ionicons name="storefront" size={16} color="#fff" />
            </View>
            <Text style={[
              styles.storeButtonText,
              selectedStoreIndex === index && { color: flyer.color, fontWeight: '700' }
            ]}>
              {flyer.store}
            </Text>
            <Text style={styles.storeOfferCount}>
              {flyer.offers.length} erbjudanden
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Validity Banner */}
      <View style={[styles.validityBanner, { backgroundColor: currentFlyer.color }]}>
        <Ionicons name="calendar-outline" size={16} color="#fff" />
        <Text style={styles.validityText}>
          Gäller {currentFlyer.validFrom} - {currentFlyer.validTo}
        </Text>
      </View>

      {/* Hint */}
      <View style={styles.hintContainer}>
        <Ionicons name="information-circle" size={18} color={colors.textLight} />
        <Text style={styles.hintText}>
          Tryck på ett erbjudande för att lägga till i inköpslistan
        </Text>
      </View>

      {/* Offers List grouped by category */}
      <ScrollView style={styles.offersContainer} contentContainerStyle={styles.offersContent}>
        {Object.entries(groupedOffers).map(([category, offers]) => (
          <View key={category} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryTitle}>{category}</Text>
              <Text style={styles.categoryCount}>{offers.length} produkter</Text>
            </View>
            {offers.map((offer) => (
              <TouchableOpacity
                key={offer.id}
                style={styles.offerItem}
                onPress={() => handleAddToList(offer)}
              >
                <View style={styles.offerLeft}>
                  {offer.discount && (
                    <View style={[styles.offerBadge, { backgroundColor: currentFlyer.color }]}>
                      <Text style={styles.offerBadgeText}>{offer.discount}</Text>
                    </View>
                  )}
                  <View style={styles.offerTextContainer}>
                    <Text style={styles.offerName} numberOfLines={2}>{offer.name}</Text>
                    <Text style={styles.offerUnit}>{offer.unit}</Text>
                  </View>
                </View>
                <View style={styles.offerRight}>
                  <Text style={[styles.offerPrice, { color: currentFlyer.color }]}>{offer.price}</Text>
                  {offer.originalPrice && (
                    <Text style={styles.offerOriginalPrice}>{offer.originalPrice}</Text>
                  )}
                </View>
                <View style={[styles.addButton, { backgroundColor: currentFlyer.color }]}>
                  <Ionicons name="add" size={20} color="#fff" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  headerWeek: {
    fontSize: 12,
    color: colors.textLight,
  },
  storeSelector: {
    backgroundColor: colors.cardBackground,
    maxHeight: 90,
  },
  storeSelectorContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  storeButton: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginRight: 10,
    backgroundColor: colors.cardBackground,
    minWidth: 100,
  },
  storeIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  storeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  storeOfferCount: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
  },
  validityBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  validityText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  hintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.cardBackground,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  hintText: {
    fontSize: 13,
    color: colors.textLight,
  },
  offersContainer: {
    flex: 1,
  },
  offersContent: {
    padding: 16,
    paddingBottom: 32,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  categoryCount: {
    fontSize: 12,
    color: colors.textLight,
  },
  offerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },
  offerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  offerBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 50,
    alignItems: 'center',
  },
  offerBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  offerTextContainer: {
    flex: 1,
  },
  offerName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  offerUnit: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  offerRight: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  offerPrice: {
    fontSize: 16,
    fontWeight: '700',
  },
  offerOriginalPrice: {
    fontSize: 12,
    color: colors.textLight,
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
