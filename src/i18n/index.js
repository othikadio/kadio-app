import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import fr     from './fr.json'
import en     from './en.json'
import ht     from './ht.json'
import wo     from './wo.json'
import ln     from './ln.json'
import bm     from './bm.json'
import ff     from './ff.json'
import agni   from './agni.json'
import dioula from './dioula.json'
import bete   from './bete.json'
import baoule from './baoule.json'

export const LANGUAGES = [
  { code: 'fr',     label: 'Français',  flag: '🇫🇷' },
  { code: 'en',     label: 'English',   flag: '🇬🇧' },
  { code: 'ht',     label: 'Kreyòl',    flag: '🇭🇹' },
  { code: 'wo',     label: 'Wolof',     flag: '🇸🇳' },
  { code: 'ln',     label: 'Lingala',   flag: '🇨🇩' },
  { code: 'bm',     label: 'Bambara',   flag: '🇲🇱' },
  { code: 'ff',     label: 'Pulaar',    flag: '🌍' },
  { code: 'agni',   label: 'Agni',      flag: '🇨🇮' },
  { code: 'dioula', label: 'Dioula',    flag: '🇨🇮' },
  { code: 'bete',   label: 'Bété',      flag: '🇨🇮' },
  { code: 'baoule', label: 'Baoulé',    flag: '🇨🇮' },
]

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr:     { translation: fr },
      en:     { translation: en },
      ht:     { translation: ht },
      wo:     { translation: wo },
      ln:     { translation: ln },
      bm:     { translation: bm },
      ff:     { translation: ff },
      agni:   { translation: agni },
      dioula: { translation: dioula },
      bete:   { translation: bete },
      baoule: { translation: baoule },
    },
    fallbackLng: 'fr',
    lng: localStorage.getItem('kadio-lang') || 'fr',
    detection: { order: ['localStorage'], lookupLocalStorage: 'kadio-lang' },
    interpolation: { escapeValue: false },
  })

export default i18n
