import type { DealResults } from "../lib/deal";
import { usd } from "../lib/format";

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
      <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</div>
      <div className={`mt-1 text-2xl font-bold tabular-nums ${accent ? "text-teal-300" : "text-zinc-100"}`}>
        {value}
      </div>
    </div>
  );
}

function LadderRow({ label, value, final }: { label: string; value: number; final?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2.5">
      <span className="text-sm text-zinc-400">{label}</span>
      <span className={`text-sm font-bold tabular-nums ${final ? "text-teal-300" : "text-zinc-100"}`}>
        {usd(value)}
      </span>
    </div>
  );
}

export default function ResultsPanel({ results }: { results: DealResults }) {
  const isDeal = results.verdict === "DEAL";
  return (
    <div className="space-y-5">
      <div
        className={`rounded-xl border p-4 ${
          isDeal ? "border-teal-500/40 bg-teal-500/10" : "border-red-500/40 bg-red-500/10"
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`rounded-md px-3 py-1 text-sm font-bold tracking-widest ${
              isDeal ? "bg-teal-400 text-zinc-950" : "bg-red-400 text-zinc-950"
            }`}
          >
            {isDeal ? "DEAL" : "PASS"}
          </span>
          <p className="text-sm text-zinc-300">{results.verdictNote}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Max offer (MAO)" value={usd(results.mao)} accent />
        <Stat label="Opening offer" value={usd(results.openingOffer)} accent />
        <Stat label="Repair estimate" value={usd(results.repairs)} />
        <Stat label="EMD (1%)" value={usd(results.emd)} />
      </div>

      <div>
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-zinc-400">
          Negotiation ladder
        </h3>
        <div className="space-y-2">
          <LadderRow label="Round 1 — opening + 1/3 gap" value={results.round1} />
          <LadderRow label="Round 2 — opening + 2/3 gap" value={results.round2} />
          <LadderRow label="Round 3 — final (MAO)" value={results.round3} final />
        </div>
        <p className="mt-2 text-xs leading-relaxed text-zinc-500">
          Never offer above MAO. The $10,000 assignment fee is already baked into the MAO
          formula.
        </p>
      </div>
    </div>
  );
}
