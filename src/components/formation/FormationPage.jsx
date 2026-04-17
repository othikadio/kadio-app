import { useState } from 'react'
import { OR, CREME, NOIR, CARD, formatDate } from '@/lib/utils'

// ── Illustrations SVG pour chaque type d'étape ──
const ILLUS = {
  mission: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill="rgba(184,146,42,0.1)" />
      <circle cx="40" cy="40" r="22" fill="rgba(184,146,42,0.15)" />
      <circle cx="40" cy="40" r="10" fill="#B8922A" />
      <path d="M40 18v-6M40 68v-6M18 40h-6M68 40h-6" stroke="#B8922A" strokeWidth="2" strokeLinecap="round" />
      <path d="M28 28l-3-3M55 55l-3-3M28 52l-3 3M55 25l-3 3" stroke="rgba(184,146,42,0.5)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  piliers: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="56" width="60" height="6" rx="3" fill="#B8922A" />
      <rect x="16" y="26" width="10" height="30" rx="3" fill="rgba(184,146,42,0.6)" />
      <rect x="35" y="26" width="10" height="30" rx="3" fill="rgba(184,146,42,0.8)" />
      <rect x="54" y="26" width="10" height="30" rx="3" fill="#B8922A" />
      <rect x="10" y="20" width="60" height="6" rx="3" fill="#B8922A" />
      <path d="M40 12l4 8H36l4-8z" fill="#B8922A" />
    </svg>
  ),
  notation: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 16l6.9 14 15.4 2.2-11.2 10.9 2.6 15.3L40 51l-13.7 7.4 2.6-15.3L17.7 32.2l15.4-2.2L40 16z" fill="rgba(184,146,42,0.15)" stroke="#B8922A" strokeWidth="2" />
      <path d="M40 22l4.8 9.7 10.7 1.6-7.8 7.5 1.8 10.6L40 46l-9.5 5.4 1.8-10.6-7.8-7.5 10.7-1.6L40 22z" fill="#B8922A" opacity="0.7" />
    </svg>
  ),
  niveaux: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="52" width="14" height="16" rx="3" fill="rgba(184,146,42,0.3)" />
      <rect x="25" y="40" width="14" height="28" rx="3" fill="rgba(184,146,42,0.5)" />
      <rect x="42" y="28" width="14" height="40" rx="3" fill="rgba(184,146,42,0.75)" />
      <rect x="59" y="16" width="14" height="52" rx="3" fill="#B8922A" />
      <circle cx="66" cy="12" r="4" fill="#B8922A" />
      <path d="M64 8l2 3 2-3" stroke="#fff" strokeWidth="1" />
    </svg>
  ),
  qr: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="14" width="52" height="52" rx="8" fill="rgba(184,146,42,0.08)" stroke="#B8922A" strokeWidth="2" />
      <rect x="22" y="22" width="14" height="14" rx="2" fill="#B8922A" />
      <rect x="44" y="22" width="14" height="14" rx="2" fill="#B8922A" />
      <rect x="22" y="44" width="14" height="14" rx="2" fill="#B8922A" />
      <rect x="44" y="44" width="6" height="6" rx="1" fill="#B8922A" />
      <rect x="52" y="44" width="6" height="6" rx="1" fill="rgba(184,146,42,0.5)" />
      <rect x="44" y="52" width="6" height="6" rx="1" fill="rgba(184,146,42,0.5)" />
      <rect x="52" y="52" width="6" height="6" rx="1" fill="#B8922A" />
      <rect x="25" y="25" width="8" height="8" rx="1" fill="#fff" />
      <rect x="47" y="25" width="8" height="8" rx="1" fill="#fff" />
      <rect x="25" y="47" width="8" height="8" rx="1" fill="#fff" />
    </svg>
  ),
  identite: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="20" width="56" height="40" rx="6" fill="rgba(184,146,42,0.08)" stroke="#B8922A" strokeWidth="2" />
      <circle cx="30" cy="38" r="8" fill="rgba(184,146,42,0.3)" />
      <circle cx="30" cy="36" r="4" fill="#B8922A" />
      <path d="M22 46c0-4 3.6-7 8-7s8 3 8 7" stroke="#B8922A" strokeWidth="1.5" />
      <rect x="46" y="32" width="16" height="2.5" rx="1.25" fill="rgba(184,146,42,0.4)" />
      <rect x="46" y="38" width="12" height="2.5" rx="1.25" fill="rgba(184,146,42,0.3)" />
      <rect x="46" y="44" width="14" height="2.5" rx="1.25" fill="rgba(184,146,42,0.3)" />
      <circle cx="58" cy="26" r="5" fill="#10B981" opacity="0.9" />
      <path d="M55.5 26l1.8 1.8 3.2-3.2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  conditions: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="14" width="48" height="56" rx="6" fill="rgba(184,146,42,0.08)" stroke="#B8922A" strokeWidth="2" />
      <rect x="30" y="10" width="20" height="8" rx="4" fill="#B8922A" />
      <rect x="24" y="28" width="6" height="6" rx="1.5" fill="#10B981" />
      <path d="M25.5 31l1.2 1.2 2.4-2.4" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="34" y="29" width="18" height="3" rx="1.5" fill="rgba(14,12,9,0.15)" />
      <rect x="24" y="40" width="6" height="6" rx="1.5" fill="#10B981" />
      <path d="M25.5 43l1.2 1.2 2.4-2.4" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="34" y="41" width="18" height="3" rx="1.5" fill="rgba(14,12,9,0.15)" />
      <rect x="24" y="52" width="6" height="6" rx="1.5" fill="rgba(184,146,42,0.3)" />
      <rect x="34" y="53" width="18" height="3" rx="1.5" fill="rgba(14,12,9,0.1)" />
    </svg>
  ),
  start: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="32" r="10" fill="rgba(184,146,42,0.2)" />
      <circle cx="30" cy="30" r="5" fill="#B8922A" opacity="0.7" />
      <path d="M22 42c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#B8922A" strokeWidth="2" />
      <circle cx="52" cy="32" r="10" fill="rgba(16,185,129,0.15)" />
      <circle cx="52" cy="30" r="5" fill="#10B981" opacity="0.7" />
      <path d="M44 42c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#10B981" strokeWidth="2" />
      <path d="M34 54h12" stroke="#B8922A" strokeWidth="2" strokeLinecap="round" />
      <path d="M37 51l-3 3 3 3M43 51l3 3-3 3" stroke="#B8922A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="28" y="60" width="24" height="8" rx="4" fill="#B8922A" />
      <text x="40" y="66" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="700" fontFamily="sans-serif">START</text>
    </svg>
  ),
  rappel: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="26" fill="rgba(184,146,42,0.08)" stroke="#B8922A" strokeWidth="2" />
      <circle cx="40" cy="40" r="3" fill="#B8922A" />
      <path d="M40 24v16l10 10" stroke="#B8922A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="58" cy="20" r="9" fill="#EF4444" opacity="0.9" />
      <text x="58" y="23.5" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="700" fontFamily="sans-serif">1h</text>
    </svg>
  ),
  fin: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="38" r="26" fill="rgba(16,185,129,0.08)" stroke="#10B981" strokeWidth="2" />
      <path d="M28 38l8 8 16-16" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="22" y="66" width="36" height="6" rx="3" fill="#10B981" opacity="0.3" />
      <text x="40" y="71" textAnchor="middle" fill="#10B981" fontSize="5" fontWeight="700" fontFamily="sans-serif">TERMINÉ</text>
    </svg>
  ),
  carte: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="14" width="60" height="52" rx="6" fill="rgba(184,146,42,0.06)" stroke="rgba(184,146,42,0.3)" strokeWidth="1.5" />
      <path d="M10 30h60M10 46h60" stroke="rgba(184,146,42,0.2)" strokeWidth="1" />
      <path d="M30 14v52M50 14v52" stroke="rgba(184,146,42,0.2)" strokeWidth="1" />
      <circle cx="42" cy="34" r="6" fill="#EF4444" opacity="0.85" />
      <circle cx="42" cy="33" r="2.5" fill="#fff" />
      <path d="M42 40l-4-7h8l-4 7z" fill="#EF4444" opacity="0.85" />
      <circle cx="26" cy="50" r="4" fill="#B8922A" opacity="0.5" />
      <circle cx="56" cy="24" r="4" fill="#B8922A" opacity="0.5" />
    </svg>
  ),
  notification: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 16c-11 0-20 8-20 18v10l-4 6h48l-4-6V34c0-10-9-18-20-18z" fill="rgba(184,146,42,0.15)" stroke="#B8922A" strokeWidth="2" />
      <path d="M34 52c0 3.3 2.7 6 6 6s6-2.7 6-6" stroke="#B8922A" strokeWidth="2" />
      <circle cx="56" cy="22" r="8" fill="#EF4444" opacity="0.9" />
      <text x="56" y="25.5" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="700" fontFamily="sans-serif">1</text>
    </svg>
  ),
  deplacement: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 58c8-4 16-20 20-30s12-12 20-8" stroke="#B8922A" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 3" />
      <circle cx="20" cy="58" r="6" fill="rgba(16,185,129,0.2)" stroke="#10B981" strokeWidth="1.5" />
      <circle cx="20" cy="58" r="2.5" fill="#10B981" />
      <path d="M60 20c0 5-6 12-6 12s-6-7-6-12a6 6 0 0112 0z" fill="#EF4444" opacity="0.85" />
      <circle cx="60" cy="19" r="2.5" fill="#fff" />
    </svg>
  ),
  etoiles: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 24l3.5 7 7.7 1.1-5.6 5.5 1.3 7.6L24 41l-6.9 4.2 1.3-7.6-5.6-5.5 7.7-1.1L24 24z" fill="#B8922A" />
      <path d="M56 24l3.5 7 7.7 1.1-5.6 5.5 1.3 7.6L56 41l-6.9 4.2 1.3-7.6-5.6-5.5 7.7-1.1L56 24z" fill="#B8922A" />
      <path d="M28 56h24" stroke="#B8922A" strokeWidth="2" strokeLinecap="round" />
      <path d="M32 52l-4 4 4 4M48 52l4 4-4 4" stroke="#B8922A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  paiement: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="24" width="36" height="32" rx="4" fill="rgba(184,146,42,0.08)" stroke="#B8922A" strokeWidth="1.5" />
      <rect x="12" y="32" width="36" height="6" fill="rgba(184,146,42,0.15)" />
      <rect x="16" y="44" width="12" height="3" rx="1.5" fill="rgba(184,146,42,0.3)" />
      <rect x="16" y="50" width="8" height="3" rx="1.5" fill="rgba(184,146,42,0.2)" />
      <circle cx="58" cy="28" r="10" fill="rgba(184,146,42,0.15)" stroke="#B8922A" strokeWidth="1.5" />
      <text x="58" y="32" textAnchor="middle" fill="#B8922A" fontSize="12" fontWeight="700" fontFamily="sans-serif">$</text>
    </svg>
  ),
  desinfection: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="18" width="20" height="44" rx="6" fill="rgba(59,130,246,0.08)" stroke="#3B82F6" strokeWidth="2" />
      <rect x="34" y="14" width="12" height="8" rx="3" fill="#3B82F6" opacity="0.7" />
      <path d="M36 36h8M40 32v8" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
      <circle cx="24" cy="30" r="3" fill="rgba(59,130,246,0.3)" />
      <circle cx="56" cy="34" r="2" fill="rgba(59,130,246,0.3)" />
      <circle cx="22" cy="42" r="2" fill="rgba(59,130,246,0.2)" />
      <circle cx="58" cy="26" r="3" fill="rgba(59,130,246,0.2)" />
    </svg>
  ),
  tenue: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 28l-12 6v26h8V38l4-4" fill="rgba(184,146,42,0.15)" stroke="#B8922A" strokeWidth="1.5" />
      <path d="M50 28l12 6v26h-8V38l-4-4" fill="rgba(184,146,42,0.15)" stroke="#B8922A" strokeWidth="1.5" />
      <path d="M30 28c0-6 4.5-12 10-12s10 6 10 12v32H30V28z" fill="rgba(184,146,42,0.1)" stroke="#B8922A" strokeWidth="2" />
      <path d="M36 28l4 6 4-6" stroke="#B8922A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="36" y="40" width="8" height="10" rx="2" fill="#B8922A" opacity="0.2" />
      <text x="40" y="47" textAnchor="middle" fill="#B8922A" fontSize="5" fontWeight="700" fontFamily="sans-serif">K</text>
    </svg>
  ),
  kit: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="28" width="52" height="34" rx="6" fill="rgba(184,146,42,0.08)" stroke="#B8922A" strokeWidth="2" />
      <rect x="28" y="22" width="24" height="10" rx="3" fill="rgba(184,146,42,0.15)" stroke="#B8922A" strokeWidth="1.5" />
      <path d="M40 22v-4" stroke="#B8922A" strokeWidth="2" strokeLinecap="round" />
      <rect x="34" y="38" width="12" height="12" rx="3" fill="#B8922A" opacity="0.2" />
      <path d="M37 44h6M40 41v6" stroke="#B8922A" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="24" cy="42" r="3" fill="rgba(184,146,42,0.3)" />
      <circle cx="56" cy="42" r="3" fill="rgba(184,146,42,0.3)" />
    </svg>
  ),
  domicile: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 14L14 34v30h52V34L40 14z" fill="rgba(184,146,42,0.06)" stroke="#B8922A" strokeWidth="2" strokeLinejoin="round" />
      <rect x="32" y="44" width="16" height="20" rx="2" fill="rgba(184,146,42,0.15)" stroke="#B8922A" strokeWidth="1.5" />
      <circle cx="44" cy="54" r="1.5" fill="#B8922A" />
      <rect x="20" y="36" width="10" height="8" rx="1" fill="rgba(184,146,42,0.1)" stroke="#B8922A" strokeWidth="1" />
      <rect x="50" y="36" width="10" height="8" rx="1" fill="rgba(184,146,42,0.1)" stroke="#B8922A" strokeWidth="1" />
    </svg>
  ),
  // ── Nouvelles illustrations pour partenaire/fournisseur ──
  app_profil: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="10" width="40" height="60" rx="8" fill="rgba(184,146,42,0.08)" stroke="#B8922A" strokeWidth="2" />
      <circle cx="40" cy="34" r="10" fill="rgba(184,146,42,0.2)" />
      <circle cx="40" cy="32" r="5" fill="#B8922A" opacity="0.7" />
      <path d="M32 44c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#B8922A" strokeWidth="1.5" />
      <rect x="30" y="50" width="20" height="2.5" rx="1.25" fill="rgba(184,146,42,0.3)" />
      <rect x="33" y="55" width="14" height="2.5" rx="1.25" fill="rgba(184,146,42,0.2)" />
      <circle cx="40" cy="18" r="2" fill="#B8922A" opacity="0.3" />
    </svg>
  ),
  app_dispo: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="16" width="48" height="48" rx="8" fill="rgba(184,146,42,0.06)" stroke="#B8922A" strokeWidth="2" />
      <rect x="16" y="16" width="48" height="12" rx="0" fill="rgba(184,146,42,0.1)" />
      <circle cx="28" cy="42" r="5" fill="#10B981" opacity="0.3" />
      <circle cx="40" cy="42" r="5" fill="#10B981" opacity="0.3" />
      <circle cx="52" cy="42" r="5" fill="rgba(184,146,42,0.2)" />
      <circle cx="28" cy="54" r="5" fill="#10B981" opacity="0.3" />
      <circle cx="40" cy="54" r="5" fill="rgba(184,146,42,0.2)" />
      <circle cx="52" cy="54" r="5" fill="rgba(184,146,42,0.2)" />
      <path d="M26 41l1.5 1.5 3-3" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M38 41l1.5 1.5 3-3" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M26 53l1.5 1.5 3-3" stroke="#10B981" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  ),
  app_wallet: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="22" width="56" height="36" rx="6" fill="rgba(184,146,42,0.08)" stroke="#B8922A" strokeWidth="2" />
      <rect x="12" y="22" width="56" height="10" fill="rgba(184,146,42,0.12)" />
      <rect x="48" y="38" width="16" height="12" rx="3" fill="rgba(184,146,42,0.15)" stroke="#B8922A" strokeWidth="1.5" />
      <circle cx="56" cy="44" r="3" fill="#B8922A" />
      <text x="30" y="46" textAnchor="middle" fill="#B8922A" fontSize="14" fontWeight="700" fontFamily="sans-serif">$</text>
    </svg>
  ),
  commission_salon: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="24" width="52" height="36" rx="6" fill="rgba(184,146,42,0.06)" stroke="#B8922A" strokeWidth="1.5" />
      <path d="M14 36h52" stroke="rgba(184,146,42,0.2)" strokeWidth="1" />
      <text x="40" y="52" textAnchor="middle" fill="#B8922A" fontSize="18" fontWeight="700" fontFamily="sans-serif">50%</text>
      <rect x="24" y="14" width="32" height="10" rx="5" fill="#B8922A" />
      <text x="40" y="21" textAnchor="middle" fill="#fff" fontSize="6" fontWeight="700" fontFamily="sans-serif">SALON</text>
    </svg>
  ),
  commission_autre: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="24" width="52" height="36" rx="6" fill="rgba(184,146,42,0.06)" stroke="#B8922A" strokeWidth="1.5" />
      <path d="M14 36h52" stroke="rgba(184,146,42,0.2)" strokeWidth="1" />
      <text x="40" y="52" textAnchor="middle" fill="#B8922A" fontSize="18" fontWeight="700" fontFamily="sans-serif">75%</text>
      <rect x="20" y="14" width="40" height="10" rx="5" fill="#10B981" />
      <text x="40" y="21" textAnchor="middle" fill="#fff" fontSize="5.5" fontWeight="700" fontFamily="sans-serif">DOMICILE</text>
    </svg>
  ),
  progression: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 60L30 44l14 8 12-16 10-12" stroke="#B8922A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="16" cy="60" r="3" fill="#B8922A" />
      <circle cx="30" cy="44" r="3" fill="#B8922A" />
      <circle cx="44" cy="52" r="3" fill="#B8922A" />
      <circle cx="56" cy="36" r="3" fill="#B8922A" />
      <circle cx="66" cy="24" r="4" fill="#10B981" />
      <path d="M64 24l1.5 1.5 3-3" stroke="#fff" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  catalogue_ajout: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="14" width="52" height="52" rx="8" fill="rgba(184,146,42,0.06)" stroke="#B8922A" strokeWidth="2" />
      <rect x="22" y="22" width="16" height="16" rx="4" fill="rgba(184,146,42,0.15)" stroke="#B8922A" strokeWidth="1" />
      <rect x="42" y="22" width="16" height="16" rx="4" fill="rgba(184,146,42,0.15)" stroke="#B8922A" strokeWidth="1" />
      <rect x="22" y="42" width="16" height="16" rx="4" fill="rgba(184,146,42,0.15)" stroke="#B8922A" strokeWidth="1" />
      <rect x="42" y="42" width="16" height="16" rx="4" fill="rgba(184,146,42,0.08)" stroke="#B8922A" strokeWidth="1" strokeDasharray="3 2" />
      <path d="M47 50h6M50 47v6" stroke="#B8922A" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  catalogue_photo: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="20" width="52" height="40" rx="6" fill="rgba(184,146,42,0.06)" stroke="#B8922A" strokeWidth="2" />
      <circle cx="28" cy="34" r="6" fill="rgba(184,146,42,0.2)" />
      <path d="M14 50l14-10 10 8 12-14 16 16v10H14V50z" fill="rgba(184,146,42,0.15)" />
      <circle cx="56" cy="28" r="4" fill="#FBBC04" opacity="0.6" />
    </svg>
  ),
  catalogue_prix: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 12L14 40l26 28 26-28L40 12z" fill="rgba(184,146,42,0.08)" stroke="#B8922A" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="40" cy="38" r="12" fill="rgba(184,146,42,0.1)" />
      <text x="40" y="43" textAnchor="middle" fill="#B8922A" fontSize="14" fontWeight="700" fontFamily="sans-serif">$</text>
      <circle cx="30" cy="26" r="3" fill="#B8922A" opacity="0.5" />
    </svg>
  ),
  catalogue_stock: (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="18" y="40" width="44" height="24" rx="4" fill="rgba(184,146,42,0.08)" stroke="#B8922A" strokeWidth="1.5" />
      <rect x="18" y="24" width="44" height="20" rx="4" fill="rgba(184,146,42,0.12)" stroke="#B8922A" strokeWidth="1.5" />
      <rect x="18" y="12" width="44" height="16" rx="4" fill="rgba(184,146,42,0.18)" stroke="#B8922A" strokeWidth="2" />
      <path d="M30 20h20M30 34h20M30 52h20" stroke="rgba(184,146,42,0.3)" strokeWidth="1" strokeLinecap="round" />
      <circle cx="56" cy="16" r="6" fill="#10B981" opacity="0.9" />
      <text x="56" y="19" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="700" fontFamily="sans-serif">3</text>
    </svg>
  ),
}

function StepIllustration({ type }) {
  const svg = ILLUS[type]
  if (!svg) {
    return (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(184,146,42,0.08)', borderRadius: '12px',
        fontSize: '28px',
      }}>
        📋
      </div>
    )
  }
  return <div style={{ width: '100%', height: '100%' }}>{svg}</div>
}

function GuideIllustre({ module }) {
  const [currentStep, setCurrentStep] = useState(0)
  const etapes = module.etapes || []
  if (etapes.length === 0) return null
  const etape = etapes[currentStep]

  return (
    <div style={{ background: '#fff', border: '1px solid rgba(184,146,42,0.2)', borderRadius: '14px', overflow: 'hidden', marginBottom: '14px' }}>
      {module.guide && (
        <div style={{ background: 'rgba(184,146,42,0.06)', padding: '12px 16px', borderBottom: '1px solid rgba(184,146,42,0.1)' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: NOIR }}>{module.guide.titre}</div>
          <div style={{ fontSize: '11px', color: 'rgba(14,12,9,0.45)', marginTop: '2px' }}>{module.guide.description}</div>
        </div>
      )}
      <div style={{ padding: '24px 20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: '120px', height: '120px', marginBottom: '16px' }}>
          <StepIllustration type={etape.icon} />
        </div>
        <div style={{ background: OR, color: '#fff', borderRadius: '20px', padding: '3px 14px', fontSize: '11px', fontWeight: '700', marginBottom: '10px' }}>
          {`Étape ${currentStep + 1} / ${etapes.length}`}
        </div>
        <div style={{ fontSize: '16px', fontWeight: '700', color: NOIR, textAlign: 'center', marginBottom: '8px' }}>{etape.titre}</div>
        <div style={{ fontSize: '13px', color: 'rgba(14,12,9,0.6)', lineHeight: 1.6, textAlign: 'center', maxWidth: '320px' }}>{etape.description}</div>
      </div>
      <div style={{ padding: '0 16px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0}
          style={{ background: 'transparent', border: '1px solid rgba(14,12,9,0.1)', borderRadius: '10px', padding: '8px 14px', fontSize: '13px', fontWeight: 600, cursor: currentStep === 0 ? 'default' : 'pointer', opacity: currentStep === 0 ? 0.3 : 1, color: NOIR, fontFamily: `'DM Sans', sans-serif` }}>
          ← Préc.
        </button>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {etapes.map((_, i) => (
            <div key={i} onClick={() => setCurrentStep(i)}
              style={{ width: i === currentStep ? '18px' : '7px', height: '7px', borderRadius: '4px', background: i === currentStep ? OR : 'rgba(14,12,9,0.12)', cursor: 'pointer', transition: 'all 0.2s ease' }} />
          ))}
        </div>
        <button onClick={() => setCurrentStep(Math.min(etapes.length - 1, currentStep + 1))} disabled={currentStep === etapes.length - 1}
          style={{ background: currentStep === etapes.length - 1 ? 'transparent' : OR, border: currentStep === etapes.length - 1 ? '1px solid rgba(14,12,9,0.1)' : 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '13px', fontWeight: 700, cursor: currentStep === etapes.length - 1 ? 'default' : 'pointer', opacity: currentStep === etapes.length - 1 ? 0.3 : 1, color: currentStep === etapes.length - 1 ? NOIR : '#fff', fontFamily: `'DM Sans', sans-serif` }}>
          Suiv. →
        </button>
      </div>
      <div style={{ height: '3px', background: 'rgba(184,146,42,0.1)' }}>
        <div style={{ height: '100%', width: `${((currentStep + 1) / etapes.length) * 100}%`, background: OR, borderRadius: '0 2px 2px 0', transition: 'width 0.3s ease' }} />
      </div>
    </div>
  )
}

function ModuleCard({ module, quizPath, expanded, onToggle }) {
  const isVerrouille = module.statut === 'verrouille'
  const isComplete = module.statut === 'complete'
  const isActif = module.statut === 'en_cours' || module.statut === 'disponible'

  return (
    <div style={{
      background: CARD,
      border: isComplete ? '1px solid rgba(16,185,129,0.4)' : isActif ? `1px solid ${OR}` : '1px solid rgba(255,255,255,0.07)',
      borderRadius: '14px', padding: '20px', opacity: isVerrouille ? 0.5 : 1, marginBottom: '12px', position: 'relative', overflow: 'hidden',
    }}>
      {isComplete && <div style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: '700', color: '#10B981' }}>{`✓ Complété`}</div>}
      {isVerrouille && <div style={{ position: 'absolute', top: '14px', right: '14px', fontSize: '18px' }}>🔒</div>}
      {isActif && <div style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(14,12,9,0.08)', border: `1px solid rgba(184,146,42,0.4)`, borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: '700', color: OR }}>{`En cours`}</div>}

      <div onClick={() => !isVerrouille && onToggle && onToggle(module.id)}
        style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', paddingRight: '90px', cursor: isVerrouille ? 'default' : 'pointer' }}>
        <div style={{ fontSize: '24px', width: '44px', height: '44px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>{module.icon}</div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: NOIR }}>{`Module ${module.id} — ${module.titre}`}</div>
          <div style={{ fontSize: '12px', color: 'rgba(14,12,9,0.45)', marginTop: '1px' }}>{`${module.duree_minutes} min · ${(module.etapes || []).length} étapes illustrées`}</div>
        </div>
      </div>

      <div style={{ fontSize: '13px', color: 'rgba(14,12,9,0.6)', lineHeight: '1.5', marginBottom: '14px' }}>{module.description}</div>

      {expanded && !isVerrouille && <GuideIllustre module={module} />}

      {!isVerrouille && !expanded && (module.etapes || []).length > 0 && (
        <button onClick={() => onToggle && onToggle(module.id)}
          style={{ background: 'transparent', border: '1px solid rgba(14,12,9,0.1)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', color: 'rgba(14,12,9,0.5)', cursor: 'pointer', marginBottom: '10px', fontFamily: `'DM Sans', sans-serif`, fontWeight: 600 }}>
          🖼️ Voir le guide illustré
        </button>
      )}

      {isComplete && (
        <div style={{ display: 'flex', gap: '16px', marginBottom: '14px' }}>
          <div style={{ fontSize: '13px', color: '#10B981', fontWeight: '600' }}>{`Score : ${module.score}%`}</div>
          {module.date_complete && <div style={{ fontSize: '13px', color: 'rgba(14,12,9,0.45)' }}>{formatDate(module.date_complete)}</div>}
        </div>
      )}

      {isVerrouille && <div style={{ fontSize: '12px', color: 'rgba(14,12,9,0.4)', marginBottom: '10px' }}>{`Complétez le module précédent pour déverrouiller`}</div>}

      {isActif && quizPath && (
        <a href={quizPath(module.id)} style={{ display: 'block', background: OR, color: NOIR, border: 'none', borderRadius: '10px', padding: '11px 20px', width: '100%', fontSize: '14px', fontWeight: '700', cursor: 'pointer', fontFamily: `'DM Sans', sans-serif`, textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box' }}>
          {`Passer l'examen →`}
        </a>
      )}
      {isComplete && quizPath && (
        <a href={quizPath(module.id)} style={{ display: 'block', background: 'transparent', border: '1px solid rgba(14,12,9,0.2)', color: 'rgba(14,12,9,0.6)', borderRadius: '10px', padding: '10px 20px', width: '100%', fontSize: '14px', fontWeight: '600', cursor: 'pointer', fontFamily: `'DM Sans', sans-serif`, textAlign: 'center', textDecoration: 'none', boxSizing: 'border-box' }}>
          {`Revoir l'examen`}
        </a>
      )}
    </div>
  )
}

export default function FormationPage({ titre, modules, loading, footerText, quizPath }) {
  const [expandedId, setExpandedId] = useState(null)
  const completed = modules.filter(m => m.statut === 'complete').length
  const total = modules.length
  const pct = total > 0 ? (completed / total) * 100 : 0

  if (loading) {
    return <div className="p-8 text-center text-zinc-400">Chargement...</div>
  }

  return (
    <div style={{ fontFamily: `'DM Sans', sans-serif`, background: CREME, minHeight: '100vh', color: NOIR, paddingBottom: '100px' }}>
      <div style={{ padding: '24px 20px 0' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: NOIR }}>{titre}</h1>
      </div>

      <div style={{ padding: '20px', maxWidth: '520px', margin: '0 auto' }}>
        <div style={{ background: CARD, borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: NOIR }}>{`Progression`}</div>
            <div style={{ fontSize: '14px', fontWeight: '700', color: OR }}>{`${completed} / ${total} modules complétés`}</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '99px', height: '10px', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '99px', background: OR, width: `${pct}%`, transition: 'width 0.6s ease' }} />
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(14,12,9,0.45)', marginTop: '8px' }}>
            {pct < 100 ? `${Math.round(100 - pct)}% restant pour compléter la formation` : `Tous les modules sont complétés !`}
          </div>
        </div>

        {modules.map(module => (
          <ModuleCard
            key={module.id}
            module={module}
            quizPath={quizPath}
            expanded={expandedId === module.id}
            onToggle={(id) => setExpandedId(prev => prev === id ? null : id)}
          />
        ))}

        <div style={{ background: 'rgba(184,146,42,0.07)', border: '1px solid rgba(14,12,9,0.08)', borderRadius: '12px', padding: '14px 16px', marginTop: '8px' }}>
          <div style={{ fontSize: '13px', color: 'rgba(14,12,9,0.7)', marginBottom: '4px' }}>
            {`📋 Score minimum requis : 80% pour valider chaque module`}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(14,12,9,0.45)' }}>
            {footerText || `En cas d'échec, réessai disponible après 7 jours`}
          </div>
        </div>
      </div>
    </div>
  )
}
