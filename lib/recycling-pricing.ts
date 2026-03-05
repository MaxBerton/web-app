/** Tarification recyclage — fonctions pures, utilisables côté client */

/** Config tarification recyclage (prix en CHF). Utilisable côté client quand passée en props. */
export type RecyclingPricingConfig = {
  pass1Chf: number
  pass2Chf: number
  pass3Chf: number
  pass4Chf: number
  extraBinsPer2Chf: number
  largeBinChf: number
}

export const DEFAULT_RECYCLING_PRICING: RecyclingPricingConfig = {
  pass1Chf: 20,
  pass2Chf: 35,
  pass3Chf: 48,
  pass4Chf: 60,
  extraBinsPer2Chf: 3,
  largeBinChf: 2,
}

export type PassOption = { value: number; label: string; priceCents: number }

export const PASSES_OPTIONS: PassOption[] = [
  { value: 1, label: "1 passage / mois", priceCents: DEFAULT_RECYCLING_PRICING.pass1Chf * 100 },
  { value: 2, label: "2 passages / mois", priceCents: DEFAULT_RECYCLING_PRICING.pass2Chf * 100 },
  { value: 3, label: "3 passages / mois", priceCents: DEFAULT_RECYCLING_PRICING.pass3Chf * 100 },
  { value: 4, label: "4 passages / mois", priceCents: DEFAULT_RECYCLING_PRICING.pass4Chf * 100 },
]

export function getPassesOptions(): PassOption[] {
  return [...PASSES_OPTIONS]
}

export function getPassesOptionsFromConfig(config: RecyclingPricingConfig): PassOption[] {
  return [
    { value: 1, label: "1 passage / mois", priceCents: config.pass1Chf * 100 },
    { value: 2, label: "2 passages / mois", priceCents: config.pass2Chf * 100 },
    { value: 3, label: "3 passages / mois", priceCents: config.pass3Chf * 100 },
    { value: 4, label: "4 passages / mois", priceCents: config.pass4Chf * 100 },
  ]
}

export function computePriceCents(
  passesPerMonth: number,
  binsCount: number,
  largeBinsCount: number
): number {
  return computePriceCentsFromConfig(DEFAULT_RECYCLING_PRICING, passesPerMonth, binsCount, largeBinsCount)
}

export function computePriceCentsFromConfig(
  config: RecyclingPricingConfig,
  passesPerMonth: number,
  binsCount: number,
  largeBinsCount: number
): number {
  const passChf =
    passesPerMonth === 1
      ? config.pass1Chf
      : passesPerMonth === 2
        ? config.pass2Chf
        : passesPerMonth === 3
          ? config.pass3Chf
          : config.pass4Chf
  const baseCents = passChf * 100
  const binsPart = Math.ceil(Math.max(0, binsCount - 6) / 2) * config.extraBinsPer2Chf * 100
  const largePart = largeBinsCount * config.largeBinChf * 100
  return baseCents + binsPart + largePart
}
