export type RepairTier = "light" | "medium" | "heavy" | "custom";

export interface DealInputs {
  address: string;
  arv: number;
  listPrice: number;
  sqft: number;
  tier: RepairTier;
  customRepairs: number;
}

export interface DealResults {
  repairs: number;
  repairRate: number;
  repairLabel: string;
  mao: number;
  openingOffer: number;
  emd: number;
  gap: number;
  round1: number;
  round2: number;
  round3: number;
  verdict: "DEAL" | "PASS";
  verdictNote: string;
  offerToListPct: number | null;
}

export interface WaterfallStep {
  name: string;
  base: number;
  delta: number;
  kind: "total" | "deduction" | "result";
}

export const TIER_RATES: Record<Exclude<RepairTier, "custom">, number> = {
  light: 25,
  medium: 45,
  heavy: 75,
};

export const TIER_LABELS: Record<RepairTier, string> = {
  light: "Light cosmetic",
  medium: "Medium rehab",
  heavy: "Heavy / gut",
  custom: "Custom amount",
};

export function round100(n: number): number {
  return Math.round(n / 100) * 100;
}

export function analyzeDeal(inputs: DealInputs): DealResults {
  const repairRate = inputs.tier === "custom" ? 0 : TIER_RATES[inputs.tier];
  const repairs =
    inputs.tier === "custom"
      ? Math.max(0, inputs.customRepairs)
      : Math.max(0, repairRate * inputs.sqft);

  const mao = Math.round(inputs.arv * 0.7 - repairs - 10000);
  const openingOffer = round100(mao * 0.9);
  const emd = Math.round(openingOffer * 0.01);
  const gap = mao - openingOffer;
  const round1 = round100(openingOffer + gap / 3);
  const round2 = round100(openingOffer + (2 * gap) / 3);
  const round3 = mao;

  let verdict: "DEAL" | "PASS" = "PASS";
  let verdictNote = "Enter an ARV above $0 to analyze this deal.";
  let offerToListPct: number | null = null;

  if (inputs.arv > 0 && mao > 0) {
    if (inputs.listPrice > 0) {
      offerToListPct = openingOffer / inputs.listPrice;
      if (offerToListPct >= 0.75) {
        verdict = "DEAL";
        verdictNote = `Opening offer is ${Math.round(
          offerToListPct * 100
        )}% of list price — close enough to start a real conversation.`;
      } else {
        verdict = "PASS";
        verdictNote = `Opening offer is only ${Math.round(
          offerToListPct * 100
        )}% of list price — too far apart unless the seller is deeply motivated.`;
      }
    } else {
      verdict = "DEAL";
      verdictNote =
        "Numbers pencil at this ARV. Add a list price to check offer credibility.";
    }
  } else if (inputs.arv > 0) {
    verdict = "PASS";
    verdictNote =
      "MAO is at or below $0 — the numbers do not pencil for this property.";
  }

  return {
    repairs,
    repairRate,
    repairLabel: TIER_LABELS[inputs.tier],
    mao,
    openingOffer,
    emd,
    gap,
    round1,
    round2,
    round3,
    verdict,
    verdictNote,
    offerToListPct,
  };
}

export function waterfallSteps(inputs: DealInputs, results: DealResults): WaterfallStep[] {
  const investorCut = inputs.arv * 0.3;
  return [
    { name: "ARV", base: 0, delta: inputs.arv, kind: "total" },
    { name: "Repairs", base: inputs.arv - results.repairs, delta: results.repairs, kind: "deduction" },
    { name: "30% margin", base: inputs.arv - results.repairs - investorCut, delta: investorCut, kind: "deduction" },
    { name: "$10K fee", base: Math.max(0, results.mao), delta: 10000, kind: "deduction" },
    { name: "MAO", base: 0, delta: Math.max(0, results.mao), kind: "result" },
    { name: "Opening", base: 0, delta: Math.max(0, results.openingOffer), kind: "result" },
  ];
}
