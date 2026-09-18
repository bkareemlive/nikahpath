"use client";

import { useActionState, useState } from "react";
import { saveProfile, type ProfileFormState } from "@/lib/actions/profile";
import type { ProfileRow } from "@/lib/supabase/types";
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
const sectionCls = "rounded-2xl border border-line bg-white p-6 shadow-card";
const h2 = "font-display text-lg font-semibold text-ink";

function seedFrom(p: ProfileRow): Data {
  return {
    alias: p.alias ?? "",
    date_of_birth: p.date_of_birth ?? "",
    ethnicity: p.ethnicity ?? "",
    location_country: p.location_country ?? "",
    location_city: p.location_city ?? "",
    marital_status: p.marital_status ?? "",
    has_children: p.has_children ? "yes" : "no",
    children_note: p.children_note ?? "",
    timeline: p.timeline ?? "",
    relocate: p.relocate ?? "",
    wants_children: p.wants_children ?? "",
    practice_prayer: p.practice_prayer ?? "",
    sect: p.sect ?? "",
    height_cm: p.height_cm != null ? String(p.height_cm) : "",
    build: p.build ?? "",
    about: p.about ?? "",
    looking_for: p.looking_for ?? "",
    wali_type: p.wali_type ?? "",
    wali_name: p.wali_name ?? "",
    wali_relationship: p.wali_relationship ?? "",
    independent_wali_id: p.independent_wali_id ?? "",
    status: p.status === "paused" ? "paused" : "active",
  };
}

export function ProfileForm({
  profile,
  walis,
}: {
  profile: ProfileRow;
  walis: WaliOption[];
}) {
  const [data, setData] = useState<Data>(() => seedFrom(profile));
  const [state, action, pending] = useActionState<ProfileFormState, FormData>(
    saveProfile,
    {},
  );
  const isSister = profile.gender === "sister";

  const set =
    (key: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setData((d) => ({ ...d, [key]: e.target.value }));

  const T = (key: string, props: Record<string, unknown> = {}) => (
    <input value={data[key] ?? ""} onChange={set(key)} className={field} {...props} />
  );
  const S = (key: string, opts: readonly { value: string; label: string }[], anyLabel = "Choose…") => (
    <select value={data[key] ?? ""} onChange={set(key)} className={field}>
      <option value="">{anyLabel}</option>
      {opts.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );

  return (
    <form action={action} className="space-y-6">
      {Object.entries(data).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}

      {/* Basics */}
      <section className={sectionCls}>
        <h2 className={h2}>Basics</h2>
        <div className="mt-4 grid gap-4">
          <p className="text-sm text-muted">
            You joined as a{" "}
            <span className="font-medium text-ink capitalize">{profile.gender}</span> ·
            reference <span className="font-medium text-ink">{profile.public_ref}</span>
          </p>
          <label className={labelCls}>
            Display name
            {T("alias", { maxLength: 40, placeholder: "e.g. Khadijah" })}
          </label>
          <label className={labelCls}>
            Date of birth
            {T("date_of_birth", { type: "date" })}
          </label>
          <label className={labelCls}>
            Ethnic background
            {T("ethnicity", { maxLength: 60 })}
          </label>
          <label className={labelCls}>
            Country of residence
            {S("location_country", COUNTRIES.map((c) => ({ value: c, label: c })))}
          </label>
          <label className={labelCls}>
            City or area
            {T("location_city", { maxLength: 80 })}
          </label>
        </div>
      </section>

      {/* Situation */}
      <section className={sectionCls}>
        <h2 className={h2}>Your situation</h2>
        <div className="mt-4 grid gap-4">
          <label className={labelCls}>
            Marital status
            {S("marital_status", MARITAL_OPTIONS)}
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
                    checked={data.has_children === val}
                    onChange={() => setData((d) => ({ ...d, has_children: val }))}
                  />
                  {val}
                </label>
              ))}
            </div>
          </div>
          {data.has_children === "yes" && (
            <label className={labelCls}>
              A note about your children
              <textarea
                value={data.children_note ?? ""}
                onChange={set("children_note")}
                rows={2}
                maxLength={300}
                className={field}
              />
            </label>
          )}
          <label className={labelCls}>
            How soon are you hoping to marry?
            {S("timeline", TIMELINE_OPTIONS)}
          </label>
          <label className={labelCls}>
            Would you relocate for marriage?
            {S("relocate", RELOCATE_OPTIONS)}
          </label>
          <label className={labelCls}>
            Children in the marriage
            {S("wants_children", WANTS_CHILDREN_OPTIONS)}
          </label>
        </div>
      </section>

      {/* Deen */}
      <section className={sectionCls}>
        <h2 className={h2}>Your deen</h2>
        <div className="mt-4 grid gap-4">
          <label className={labelCls}>
            Prayer
            {S("practice_prayer", PRACTICE_PRAYER_OPTIONS)}
          </label>
          <label className={labelCls}>
            How would you describe your understanding?
            {S("sect", SECT_OPTIONS)}
          </label>
        </div>
      </section>

      {/* About */}
      <section className={sectionCls}>
        <h2 className={h2}>About you</h2>
        <div className="mt-4 grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <label className={labelCls}>
              Height (cm)
              {T("height_cm", { type: "number", min: 120, max: 230 })}
            </label>
            <label className={labelCls}>
              Build
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
            About you{" "}
            <span className="text-xs font-normal text-muted">
              ({(data.about ?? "").trim().length}/120 min)
            </span>
            <textarea
              value={data.about ?? ""}
              onChange={set("about")}
              rows={6}
              maxLength={4000}
              className={field}
            />
          </label>
          <label className={labelCls}>
            What you are looking for in a spouse
            <textarea
              value={data.looking_for ?? ""}
              onChange={set("looking_for")}
              rows={4}
              maxLength={2000}
              className={field}
            />
          </label>
        </div>
      </section>

      {/* Guardian */}
      {isSister && (
        <section className={sectionCls}>
          <h2 className={h2}>Your guardian</h2>
          <div className="mt-4 grid gap-3">
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
                  checked={data.wali_type === o.value}
                  onChange={() => setData((d) => ({ ...d, wali_type: o.value }))}
                  className="mt-1"
                />
                <span>
                  <span className="block text-sm text-ink">{o.label}</span>
                  <span className="block text-xs text-muted">{o.hint}</span>
                </span>
              </label>
            ))}

            {data.wali_type === "family" && (
              <div className="grid grid-cols-2 gap-3">
                <label className={labelCls}>
                  Guardian&apos;s name
                  {T("wali_name", { maxLength: 80 })}
                </label>
                <label className={labelCls}>
                  Relationship to you
                  {T("wali_relationship", { maxLength: 40, placeholder: "e.g. Father" })}
                </label>
              </div>
            )}

            {data.wali_type === "independent" && (
              <div className="grid gap-2">
                {walis.map((w) => {
                  const full = w.availability === "full";
                  return (
                    <label
                      key={w.id}
                      className={`flex items-start gap-2.5 rounded-md border p-3 text-sm ${
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
                        checked={data.independent_wali_id === w.id}
                        disabled={full}
                        onChange={() =>
                          setData((d) => ({ ...d, independent_wali_id: w.id }))
                        }
                        className="mt-1"
                      />
                      <span>
                        <span className="block text-ink">{w.name}</span>
                        <span className="block text-xs text-muted">
                          {w.role} · {w.location} ·{" "}
                          {full ? "not taking requests" : w.availability}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Visibility */}
      <section className={sectionCls}>
        <h2 className={h2}>Visibility</h2>
        <label className="mt-4 flex items-start gap-3 text-sm text-body">
          <input
            type="checkbox"
            checked={data.status === "paused"}
            onChange={(e) =>
              setData((d) => ({
                ...d,
                status: e.target.checked ? "paused" : "active",
              }))
            }
            className="mt-0.5"
          />
          <span>
            <span className="font-medium text-ink">Pause my profile:</span> hide it
            from Browse and stop receiving new interest. Existing matches and
            conversations stay.
          </span>
        </label>
      </section>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-md bg-primary px-6 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
        {state.ok && <span className="text-sm text-primary">Profile saved.</span>}
        {state.error && <span className="text-sm text-red-700">{state.error}</span>}
      </div>
    </form>
  );
}
