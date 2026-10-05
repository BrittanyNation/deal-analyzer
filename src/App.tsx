import { useMemo, useState } from "react";
import DealForm, { type FormState } from "./components/DealForm";
import ResultsPanel from "./components/ResultsPanel";
import WaterfallChart from "./components/WaterfallChart";
import { analyzeDeal, waterfallSteps, type DealInputs } from "./lib/deal";
import { parseNum } from "./lib/format";

const INITIAL: FormState = {
  address: "",
  arv: "",
  listPrice: "",
  sqft: "",
  tier: "medium",
  customRepairs: "",
};

export default function App() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const patch = (p: Partial<FormState>) => setForm((f) => ({ ...f, ...p }));

  const inputs: DealInputs = useMemo(
    () => ({
      address: form.address.trim(),
      arv: parseNum(form.arv),
      listPrice: parseNum(form.listPrice),
      sqft: parseNum(form.sqft),
      tier: form.tier,
      customRepairs: parseNum(form.customRepairs),
    }),
    [form]
  );

  const results = useMemo(() => analyzeDeal(inputs), [inputs]);
  const steps = useMemo(() => waterfallSteps(inputs, results), [inputs, results]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-400 text-lg font-black text-zinc-950">
              D
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Deal Analyzer</h1>
          </div>
          <p className="text-sm text-zinc-400">
            Wholesale deal underwriting for Deva Gana LLC — MAO, opening offer, and
            negotiation ladder, computed live.
          </p>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-5">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-300">
            Property inputs
          </h2>
          <DealForm form={form} onChange={patch} />
        </section>

        <section className="space-y-6 lg:col-span-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-300">
              {inputs.address ? `Analysis — ${inputs.address}` : "Analysis"}
            </h2>
            <ResultsPanel results={results} />
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-wider text-zinc-300">
              How the MAO is built
            </h2>
            <p className="mb-4 text-xs text-zinc-500">
              ARV minus repairs, minus the 30% investor margin, minus the $10K assignment
              fee.
            </p>
            <WaterfallChart steps={steps} />
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-zinc-300">
              Formula reference
            </h2>
            <ul className="space-y-1.5 text-sm text-zinc-400">
              <li>
                <span className="font-mono text-teal-300">MAO</span> = round(ARV x 0.70 -
                repairs - $10,000)
              </li>
              <li>
                <span className="font-mono text-teal-300">Opening</span> = round(MAO x 0.90)
                to nearest $100
              </li>
              <li>
                <span className="font-mono text-teal-300">EMD</span> = 1% of opening offer
              </li>
              <li className="text-zinc-500">
                Repair tiers: Light $25/sqft, Medium $45/sqft, Heavy $75/sqft
              </li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
          <p className="text-xs text-zinc-600">
            Built by Brittany Nation, Deva Gana LLC. Estimates only — verify comps and
            repair costs before making offers.
          </p>
        </div>
      </footer>
    </div>
  );
}
