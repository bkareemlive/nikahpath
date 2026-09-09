"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  completeOnboarding,
  type ProfileFormState,
} from "@/lib/actions/profile";
import {
  COUNTRIES,
  PRACTICE_PRAYER_OPTIONS,
  SECT_OPTIONS,
  MARITAL_OPTIONS,
  BUILD_OPTIONS,
  TIMELINE_OPTIONS,
  RELOCATE_OPTIONS,
  WANTS_CHILDREN_OPTIONS,
  WALI_TYPE_OPTIONS,
} from "@/lib/profile-options";

type WaliOption = {
  id: string;
  name: string;
  role: string;
  location: string;
  availability: "available" | "limited" | "full";
};

type Data = Record<string, string>;

const field =
  "w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20";
const labelCls = "grid gap-1 text-sm font-medium text-ink";
const hintCls = "text-xs font-normal text-muted";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-11 rounded-md bg-primary px-6 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
    >
      {pending ? "Saving…" : "Finish and publish"}
    </button>
  );
}

const STEP_TITLES = [
  "Basics",
  "Your situation",
  "Your deen",
  "About you",
  "Your guardian",
];

export function OnboardingWizard({ walis }: { walis: WaliOption[] }) {
  const [serverState, action] = useActionState<ProfileFormState, FormData>(
    completeOnboarding,
    {},
  );
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Data>({});
  const [stepError, setStepError] = useState<string | null>(null);

  const g = data.gender ?? "";
  const total = g === "brother" ? 4 : 5;

  const set =
    (key: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      const v = e.target.value;
      setData((d) => ({ ...d, [key]: v }));
      setStepError(null);
    };

  function validateStep(i: number): string | null {
    const d = data;
    if (i === 0) {
      if (!d.gender) return "Let us know if you are a sister or a brother.";
      if (!d.date_of_birth) return "Add your date of birth.";
      const age = ageFrom(d.date_of_birth);
      if (age === null || age < 18) return "You must be at least 18.";
      if (age > 100) return "Please check your date of birth.";
      if (!d.ethnicity?.trim()) return "Tell us your ethnic background.";
      if (!d.location_country) return "Choose your country of residence.";
      if (!d.location_city?.trim()) return "Which city or area?";
    }
    if (i === 1) {
      if (!d.marital_status) return "Choose your marital status.";
      if (!d.has_children) return "Do you have children?";
      if (!d.timeline) return "How soon are you hoping to marry?";
      if (!d.relocate) return "Would you relocate for marriage?";
      if (!d.wants_children) return "Choose an option for children in the marriage.";
    }
    if (i === 2) {
      if (!d.practice_prayer) return "Choose an option for prayer.";
      if (!d.sect) return "Choose how you would describe your understanding.";
    }
    if (i === 3) {
      if ((d.about?.trim().length ?? 0) < 120)
        return "Please write at least a short paragraph about yourself (120+ characters).";
      if ((d.looking_for?.trim().length ?? 0) < 60)
        return "Add a sentence or two about what you are looking for.";
    }
    if (i === 4 && g === "sister") {
      if (!d.wali_type) return "Choose how your guardian is arranged.";
      if (d.wali_type === "family" && (!d.wali_name?.trim() || !d.wali_relationship?.trim()))
        return "Add your guardian's name and relationship.";
      if (d.wali_type === "independent" && !d.independent_wali_id)
        return "Pick a Wali from the register.";
    }
    return null;
  }

  function next() {
    const err = validateStep(step);
    if (err) {
      setStepError(err);
      return;
    }
    setStepError(null);
    setStep((s) => Math.min(s + 1, total - 1));
  }

  const isLast = step === total - 1;
  const steps = useMemo(() => STEP_TITLES.slice(0, total), [total]);

  return (
    <form action={action} className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8">
      {/* keep every value in the submitted FormData regardless of the visible step */}
      {Object.entries(data).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}

      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Step {step + 1} of {total} · {steps[step]}
        </p>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-cream-deep">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${((step + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 0 — Basics */}
      {step === 0 && (
        <div className="grid gap-4">
          <div className="grid gap-1 text-sm font-medium text-ink">
            I am a
            <div className="mt-1 grid grid-cols-2 gap-3">
              {(["sister", "brother"] as const).map((val) => (
                <label
                  key={val}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-md border px-3 py-2.5 capitalize ${
                    g === val ? "border-primary bg-primary-light text-primary" : "border-line text-body"
                  }`}
                >
                  <input
                    type="radio"
                    name="_gender"
                    value={val}
                    checked={g === val}
                    onChange={set("gender")}
                  />
                  {val}
                </label>
              ))}
            </div>
          </div>

          <label className={labelCls}>
            Display name <span className={hintCls}>(optional — a first name or kunya)</span>
            <input
              value={data.alias ?? ""}
              onChange={set("alias")}
              maxLength={40}
              className={field}
              placeholder="e.g. Khadijah"
            />
          </label>

          <label className={labelCls}>
            Date of birth
            <input
              type="date"
              value={data.date_of_birth ?? ""}
              onChange={set("date_of_birth")}
              className={field}
            />
          </label>

          <label className={labelCls}>
            Ethnic background
            <input
              value={data.ethnicity ?? ""}
              onChange={set("ethnicity")}
              maxLength={60}
              className={field}
              placeholder="e.g. Somali, or Pakistani + Turkish"
            />
          </label>

          <label className={labelCls}>
            Country of residence
            <select value={data.location_country ?? ""} onChange={set("location_country")} className={field}>
              <option value="">Choose…</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label className={labelCls}>
            City or area
            <input
              value={data.location_city ?? ""}
              onChange={set("location_city")}
              maxLength={80}
              className={field}
              placeholder="e.g. London"
            />
          </label>
        </div>
      )}

      {/* STEP 1 — Situation */}
      {step === 1 && (
        <div className="grid gap-4">
          <label className={labelCls}>
            Marital status
            <select value={data.marital_status ?? ""} onChange={set("marital_status")} className={field}>
              <option value="">Choose…</option>
              {MARITAL_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-1 text-sm font-medium text-ink">
            Do you have children?
            <div className="mt-1 flex gap-3">
              {(["no", "yes"] as const).map((val) => (
                <label
                  key={val}
                  className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border px-3 py-2 capitalize ${
                    data.has_children === val
                      ? "border-primary bg-primary-light text-primary"
                      : "border-line text-body"
                  }`}
                >
                  <input
                    type="radio"
                    name="_has_children"
                    value={val}
                    checked={data.has_children === val}
                    onChange={set("has_children")}
                  />
                  {val}
                </label>
              ))}
            </div>
          </div>

          {data.has_children === "yes" && (
            <label className={labelCls}>
              A note about your children <span className={hintCls}>(ages, who they live with)</span>
              <textarea
                value={data.children_note ?? ""}
                onChange={set("children_note")}
                maxLength={300}
                rows={2}
                className={field}
              />
            </label>
          )}

          <label className={labelCls}>
            How soon are you hoping to marry?
            <select value={data.timeline ?? ""} onChange={set("timeline")} className={field}>
              <option value="">Choose…</option>
              {TIMELINE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className={labelCls}>
            Would you relocate for marriage?
            <select value={data.relocate ?? ""} onChange={set("relocate")} className={field}>
              <option value="">Choose…</option>
              {RELOCATE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className={labelCls}>
            Children in the marriage
            <select value={data.wants_children ?? ""} onChange={set("wants_children")} className={field}>
              <option value="">Choose…</option>
              {WANTS_CHILDREN_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {/* STEP 2 — Deen */}
      {step === 2 && (
        <div className="grid gap-4">
          <label className={labelCls}>
            Prayer
            <select value={data.practice_prayer ?? ""} onChange={set("practice_prayer")} className={field}>
              <option value="">Choose…</option>
              {PRACTICE_PRAYER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>

          <label className={labelCls}>
            How would you describe your understanding?
            <select value={data.sect ?? ""} onChange={set("sect")} className={field}>
              <option value="">Choose…</option>
              {SECT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {/* STEP 3 — About you */}
      {step === 3 && (
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <label className={labelCls}>
              Height (cm) <span className={hintCls}>optional</span>
              <input
                type="number"
                min={120}
                max={230}
                value={data.height_cm ?? ""}
                onChange={set("height_cm")}
                className={field}
              />
            </label>
            <label className={labelCls}>
              Build <span className={hintCls}>optional</span>
              <select value={data.build ?? ""} onChange={set("build")} className={field}>
                <option value="">No preference</option>
                {BUILD_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className={labelCls}>
            About you
            <span className={hintCls}>
              Your practice, your family, your character, how you spend your time. This is
              what members read first. ({(data.about ?? "").trim().length}/120 min)
            </span>
            <textarea
              value={data.about ?? ""}
              onChange={set("about")}
              maxLength={4000}
              rows={6}
              className={field}
            />
          </label>

          <label className={labelCls}>
            What you are looking for in a spouse
            <textarea
              value={data.looking_for ?? ""}
              onChange={set("looking_for")}
              maxLength={2000}
              rows={4}
              className={field}
            />
          </label>
        </div>
      )}

      {/* STEP 4 — Guardian (sisters only) */}
      {step === 4 && g === "sister" && (
        <div className="grid gap-4">
          <div className="grid gap-2 text-sm font-medium text-ink">
            How is your guardian arranged?
            {WALI_TYPE_OPTIONS.map((o) => (
              <label
                key={o.value}
                className={`flex cursor-pointer items-start gap-2.5 rounded-md border p-3 ${
                  data.wali_type === o.value ? "border-primary bg-primary-light" : "border-line"
                }`}
              >
                <input
                  type="radio"
                  name="_wali_type"
                  value={o.value}
                  checked={data.wali_type === o.value}
                  onChange={set("wali_type")}
                  className="mt-1"
                />
                <span>
                  <span className="block text-ink">{o.label}</span>
                  <span className="block text-xs font-normal text-muted">{o.hint}</span>
                </span>
              </label>
            ))}
          </div>

          {data.wali_type === "family" && (
            <div className="grid grid-cols-2 gap-3">
              <label className={labelCls}>
                Guardian&apos;s name
                <input
                  value={data.wali_name ?? ""}
                  onChange={set("wali_name")}
                  maxLength={80}
                  className={field}
                />
              </label>
              <label className={labelCls}>
                Relationship to you
                <input
                  value={data.wali_relationship ?? ""}
                  onChange={set("wali_relationship")}
                  maxLength={40}
                  className={field}
                  placeholder="e.g. Father, Brother"
                />
              </label>
            </div>
          )}

          {data.wali_type === "independent" && (
            <div className="grid gap-2 text-sm font-medium text-ink">
              Choose a Wali from the register
              {walis.map((w) => {
                const full = w.availability === "full";
                return (
                  <label
                    key={w.id}
                    className={`flex items-start gap-2.5 rounded-md border p-3 ${
                      full
                        ? "border-line opacity-60"
                        : `cursor-pointer ${
                            data.independent_wali_id === w.id
                              ? "border-primary bg-primary-light"
                              : "border-line"
                          }`
                    }`}
                  >
                    <input
                      type="radio"
                      name="_independent_wali_id"
                      value={w.id}
                      checked={data.independent_wali_id === w.id}
                      disabled={full}
                      onChange={set("independent_wali_id")}
                      className="mt-1"
                    />
                    <span>
                      <span className="block text-ink">{w.name}</span>
                      <span className="block text-xs font-normal text-muted">
                        {w.role} · {w.location} ·{" "}
                        {full ? "not taking requests" : w.availability}
                      </span>
                    </span>
                  </label>
                );
              })}
              <p className="text-xs font-normal text-muted">
                We will send your request to the Wali you choose. He reviews it under the
                guided rules and accepts or declines.
              </p>
            </div>
          )}
        </div>
      )}

      {(stepError || serverState.error) && (
        <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {stepError ?? serverState.error}
        </p>
      )}

      <div className="mt-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="text-sm font-medium text-muted hover:text-primary disabled:invisible"
        >
          ← Back
        </button>
        {isLast ? (
          <SubmitButton />
        ) : (
          <button
            type="button"
            onClick={next}
            className="h-11 rounded-md bg-primary px-6 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Next
          </button>
        )}
      </div>
    </form>
  );
}

function ageFrom(dob: string): number | null {
  const d = new Date(dob + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getUTCFullYear() - d.getUTCFullYear();
  const m = now.getUTCMonth() - d.getUTCMonth();
  if (m < 0 || (m === 0 && now.getUTCDate() < d.getUTCDate())) age--;
  return age;
}
