import type { RepairTier } from "../lib/deal";
import { TIER_LABELS, TIER_RATES } from "../lib/deal";

export interface FormState {
  address: string;
  arv: string;
  listPrice: string;
  sqft: string;
  tier: RepairTier;
  customRepairs: string;
}

interface Props {
  form: FormState;
  onChange: (patch: Partial<FormState>) => void;
}

const TIERS: RepairTier[] = ["light", "medium", "heavy", "custom"];

function Field({
  label,
  value,
  onChange,
  prefix,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
        {label}
      </span>
      <div className="relative">
        {prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-500">
            {prefix}
          </span>
        )}
        <input
          type="text"
          inputMode="decimal"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-teal-400 focus:ring-1 focus:ring-teal-400 ${
            prefix ? "pl-7" : ""
          }`}
        />
      </div>
    </label>
  );
}

export default function DealForm({ form, onChange }: Props) {
  return (
    <div className="space-y-5">
      <Field
        label="Property address"
        value={form.address}
        onChange={(v) => onChange({ address: v })}
        placeholder="123 Main St, Tampa, FL 33601"
      />
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="ARV (after repair value)"
          value={form.arv}
          onChange={(v) => onChange({ arv: v })}
          prefix="$"
          placeholder="240,000"
        />
        <Field
          label="List price"
          value={form.listPrice}
          onChange={(v) => onChange({ listPrice: v })}
          prefix="$"
          placeholder="23,000"
        />
      </div>
      <Field
        label="Square footage"
        value={form.sqft}
        onChange={(v) => onChange({ sqft: v })}
        placeholder="880"
      />
      <div>
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-zinc-400">
          Repair tier
        </span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TIERS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onChange({ tier: t })}
              className={`rounded-lg border px-2 py-2.5 text-left text-xs transition ${
                form.tier === t
                  ? "border-teal-400 bg-teal-400/10 text-teal-200"
                  : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
              }`}
            >
              <span className="block font-semibold">{TIER_LABELS[t]}</span>
              <span className="mt-0.5 block text-zinc-500">
                {t === "custom" ? "Enter amount" : `$${TIER_RATES[t]}/sqft`}
              </span>
            </button>
          ))}
        </div>
      </div>
      {form.tier === "custom" && (
        <Field
          label="Custom repair estimate"
          value={form.customRepairs}
          onChange={(v) => onChange({ customRepairs: v })}
          prefix="$"
          placeholder="39,600"
        />
      )}
      <button
        type="button"
        onClick={() =>
          onChange({
            address: "",
            arv: "",
            listPrice: "",
            sqft: "",
            tier: "medium",
            customRepairs: "",
          })
        }
        className="text-xs font-medium text-zinc-500 underline-offset-4 hover:text-zinc-300 hover:underline"
      >
        Clear all inputs
      </button>
    </div>
  );
}
