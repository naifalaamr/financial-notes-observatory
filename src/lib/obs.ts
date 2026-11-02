import DATA from '../data/observatory.json';

export type Note = { id: string; a: string; e: string; sev: 'c' | 'm' | 'l' | 'p' | 'u'; cat: string; pat: string; t: string; r: string };
export type Analysis = {
  file: string; preparer: string; org: string; named: boolean; size?: string; region?: string; years?: string; about: string; field?: string;
  m: Record<string, number | string>; notes?: Note[]; recs: string[]; partial: string; scheme: string; entity: string;
  sources: { years: string; score: number | null; n: number; c: number }[];
};
export type Pattern = { code: string; cat: string; name: string; rec: string; pri: 'u' | 'y' | 'm' | 'c' };

export const ANALYSES = (DATA.analyses as unknown as Analysis[]).slice().sort((a, b) => a.file.localeCompare(b.file));
export const NOTES = DATA.notes as unknown as Note[];
export const PATTERNS = DATA.patterns as unknown as Pattern[];
export const CATS = (DATA.cats as { code: string; name: string }[]).filter((c) => c.code !== 'pos');
export const CAT: Record<string, string> = Object.fromEntries((DATA.cats as { code: string; name: string }[]).map((c) => [c.code, c.name]));
export const CAT_SHORT: Record<string, string> = { disc: 'الإفصاح', tb: 'ميزان المراجعة', rst: 'المقيدة والزكاة', waqf: 'الأوقاف والأصول', liq: 'السيولة', exp: 'الإنفاق', rev: 'الإيرادات', gov: 'الحوكمة', res: 'النتائج' };
export const PAT: Record<string, Pattern> = Object.fromEntries(PATTERNS.map((p) => [p.code, p]));

export const SEV = {
  c: { label: 'جوهرية', cls: 'c' },
  m: { label: 'متوسطة', cls: 'm' },
  l: { label: 'منخفضة', cls: 'l' },
  u: { label: 'غير مصنّفة', cls: 'u' },
  p: { label: 'إيجابية', cls: 'p' },
} as const;
export const SEV_ORDER = ['c', 'm', 'l', 'u', 'p'] as const;
export const PRI = { u: 'عاجلة', y: 'خلال السنة', m: 'من سنة إلى ثلاث', c: 'للاستمرار' } as const;
// Category accent colours (brand blue/navy/green and the guide's type tints)
export const CAT_COLOR: Record<string, string> = {
  disc: '--t-found', tb: '--t-other', rst: '--t-csr', waqf: '--t-waqf', liq: '--t-gov', exp: '--t-fund', rev: '--brand-blue', gov: '--deep', res: '--bad', pos: '--ok',
};

export const withBase = (p: string) => (import.meta.env.BASE_URL.replace(/\/$/, '') + '/' + p.replace(/^\//, ''));
export const idOf = (a: Analysis) => a.file.replace('f', 'a');
export const codeOf = (a: Analysis) => '#' + a.file.slice(1);
export const fmt = (n: unknown) => (typeof n === 'number' ? n.toLocaleString('en-US', { maximumFractionDigits: 2 }) : '');
export const money = (n: unknown) => {
  if (typeof n !== 'number') return '';
  const s = n < 0 ? '−' : '';
  const v = Math.abs(n);
  if (v >= 1e6) return s + (v / 1e6).toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' مليون';
  if (v >= 1e3) return s + Math.round(v / 1e3).toLocaleString('en-US') + ' ألف';
  return s + v.toLocaleString('en-US');
};
export const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);

export const notesOf = (fid: string) => NOTES.filter((n) => n.a === fid);
export const issues = NOTES.filter((n) => n.sev !== 'p');
export const ENTITIES = new Set(ANALYSES.map((a) => a.entity));

export function patternStats() {
  const m = new Map<string, { notes: Note[]; analyses: Set<string>; entities: Set<string>; crit: number }>();
  for (const n of NOTES) {
    const s = m.get(n.pat) ?? { notes: [], analyses: new Set(), entities: new Set(), crit: 0 };
    s.notes.push(n); s.analyses.add(n.a); s.entities.add(n.e); if (n.sev === 'c') s.crit++;
    m.set(n.pat, s);
  }
  return PATTERNS.filter((p) => p.code !== 'P').map((p) => {
    const s = m.get(p.code) ?? { notes: [], analyses: new Set(), entities: new Set(), crit: 0 };
    return { ...p, n: s.notes.length, orgs: s.entities.size, analyses: s.analyses.size, crit: s.crit, notes: s.notes };
  }).sort((a, b) => b.orgs - a.orgs || b.n - a.n);
}
export const tierOf = (orgs: number) => (orgs >= 15 ? 'common' : orgs >= 8 ? 'recurring' : 'specific');
export const TIER = { common: 'مشتركة (15 منظمة فأكثر)', recurring: 'متكررة (8–14 منظمة)', specific: 'خاصة بعدد محدود (أقل من 8)' } as const;
export const TIER_SHORT = { common: 'مشتركة', recurring: 'متكررة', specific: 'خاصة' } as const;

export function sevCounts(list: Note[]) {
  const c = { c: 0, m: 0, l: 0, u: 0, p: 0 } as Record<string, number>;
  list.forEach((n) => c[n.sev]++);
  return c;
}
export const byFile: Record<string, Analysis> = Object.fromEntries(ANALYSES.map((a) => [a.file, a]));

// ---- Dr. Al-Fozan's framework (references of the nonprofit-financial-analysis skill) ----
import FW from '../data/framework.json';
export type Indicator = { code: string; name: string; w: number; target: string };
export const FRAME = FW as unknown as {
  source: string; indicators: Indicator[]; questions: { n: number; t: string; g: number }[]; groups: string[];
  supporting: { n: number; name: string }[]; map: Record<string, { ind: string[]; q: number[]; sup: number[] }>;
};
export const IND: Record<string, Indicator> = Object.fromEntries(FRAME.indicators.map((i) => [i.code, i]));
export const SUP: Record<number, string> = Object.fromEntries(FRAME.supporting.map((s) => [s.n, s.name]));
export const indLabel = (c: string) => (c === 'I0' ? IND[c].name : `المؤشر ${c.slice(1)}: ${IND[c].name} (${IND[c].w}%)`);
/** where a pattern sits relative to the weighted score: inside one of the five indicators, on the auditor-opinion factor, or outside */
export const scope = (pat: string) => {
  const ind = FRAME.map[pat]?.ind ?? [];
  if (ind.some((c) => c !== 'I0')) return 'in';
  if (ind.includes('I0')) return 'factor';
  return 'out';
};
