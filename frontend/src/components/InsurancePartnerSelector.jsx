import React, { useMemo, useState, useCallback } from 'react';
import { Search, Shield, Check, Building2, Landmark, Phone } from 'lucide-react';

/** Codes for public schemes, military, university, and major mutual / CBHI-style coverage */
const SCHEME_CODES = new Set(['RSSB', 'MMI', 'MSUR', 'UMR', 'UBWIYUNGE']);

function groupProviders(providers) {
  const schemes = [];
  const commercial = [];
  for (const p of providers) {
    const c = (p.code || '').toUpperCase();
    if (SCHEME_CODES.has(c)) schemes.push(p);
    else commercial.push(p);
  }
  const byName = (a, b) => a.name.localeCompare(b.name);
  schemes.sort(byName);
  commercial.sort(byName);
  return { schemes, commercial };
}

function matchesQuery(p, q) {
  if (!q) return true;
  const n = p.name?.toLowerCase() ?? '';
  const c = (p.code || '').toLowerCase();
  const d = (p.description || '').toLowerCase();
  return n.includes(q) || c.includes(q) || d.includes(q);
}

/**
 * Professional multi-select for insurance partners (registration + dashboard).
 */
export default function InsurancePartnerSelector({
  providers,
  selectedIds,
  onSelectedIdsChange,
  className = '',
  /** When true, omit the inner “Accepted insurance” hero (registration already has a section title). */
  embedded = false,
}) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const normalizedSelected = useMemo(
    () => new Set((selectedIds || []).map(Number)),
    [selectedIds]
  );

  const { schemes, commercial } = useMemo(() => groupProviders(providers || []), [providers]);

  const filteredSchemes = useMemo(
    () => schemes.filter((p) => matchesQuery(p, q)),
    [schemes, q]
  );
  const filteredCommercial = useMemo(
    () => commercial.filter((p) => matchesQuery(p, q)),
    [commercial, q]
  );

  const visibleIds = useMemo(
    () => [...filteredSchemes, ...filteredCommercial].map((p) => p.id),
    [filteredSchemes, filteredCommercial]
  );

  const toggle = useCallback(
    (id) => {
      const n = Number(id);
      const next = new Set(normalizedSelected);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      onSelectedIdsChange([...next].sort((a, b) => a - b));
    },
    [normalizedSelected, onSelectedIdsChange]
  );

  const selectAllVisible = useCallback(() => {
    const next = new Set(normalizedSelected);
    visibleIds.forEach((id) => next.add(id));
    onSelectedIdsChange([...next].sort((a, b) => a - b));
  }, [normalizedSelected, visibleIds, onSelectedIdsChange]);

  const clearVisible = useCallback(() => {
    const vis = new Set(visibleIds);
    const next = [...normalizedSelected].filter((id) => !vis.has(id));
    onSelectedIdsChange(next);
  }, [normalizedSelected, visibleIds, onSelectedIdsChange]);

  const ProviderCard = ({ p }) => {
    const isSel = normalizedSelected.has(p.id);
    return (
      <button
        type="button"
        onClick={() => toggle(p.id)}
        className={`w-full rounded-xl border-2 p-4 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2 ${
          isSel
            ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-white shadow-sm'
            : 'border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-sm'
        }`}
      >
        <div className="flex gap-3">
          <span
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
              isSel ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300 bg-white'
            }`}
            aria-hidden
          >
            {isSel && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-semibold text-slate-900">{p.name}</span>
              {p.code && (
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  {p.code}
                </span>
              )}
            </div>
            {p.description && (
              <p className="mt-1.5 text-sm leading-snug text-slate-600 line-clamp-3">{p.description}</p>
            )}
            {p.contact_phone && (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span>{p.contact_phone}</span>
              </p>
            )}
          </div>
        </div>
      </button>
    );
  };

  const Section = ({ title, subtitle, icon: Icon, items }) => {
    if (items.length === 0) return null;
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-2 border-b border-slate-200 pb-2">
          <Icon className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-800">{title}</h3>
            <p className="text-xs text-slate-500">{subtitle}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {items.map((p) => (
            <ProviderCard key={p.id} p={p} />
          ))}
        </div>
      </div>
    );
  };

  if (!providers?.length) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-900">
        No insurance providers are configured yet. Please contact support or try again later.
      </div>
    );
  }

  return (
    <div className={`space-y-5 ${className}`}>
      <div className="rounded-xl border border-slate-200/90 bg-slate-50/80 p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, code, or keyword…"
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              autoComplete="off"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={selectAllVisible}
              disabled={visibleIds.length === 0}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Select all shown
            </button>
            <button
              type="button"
              onClick={clearVisible}
              disabled={visibleIds.length === 0}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear shown
            </button>
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-600">
          <span className="font-semibold text-emerald-700">{normalizedSelected.size}</span> of{' '}
          {providers.length} providers selected
          {q ? (
            <>
              {' '}
              · <span className="text-slate-500">{visibleIds.length} match your search</span>
            </>
          ) : null}
        </p>
      </div>

      <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-sm">
        {!embedded && (
          <div className="mb-6 flex items-center gap-2 text-slate-900">
            <Shield className="h-6 w-6 text-emerald-600" aria-hidden />
            <div>
              <h2 className="text-lg font-bold">Accepted insurance</h2>
              <p className="text-sm text-slate-600">
                Choose every scheme and insurer you contract with or accept at the counter.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-8">
          <Section
            title="Public schemes & mutuals"
            subtitle="Government, military, university, and community-based coverage"
            icon={Landmark}
            items={filteredSchemes}
          />
          <Section
            title="Private insurers"
            subtitle="Licensed commercial health and general insurers operating in Rwanda"
            icon={Building2}
            items={filteredCommercial}
          />
        </div>

        {filteredSchemes.length === 0 && filteredCommercial.length === 0 && (
          <p className="py-8 text-center text-sm text-slate-500">No providers match your search.</p>
        )}
      </div>
    </div>
  );
}
