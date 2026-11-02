import { NOTES, byFile, CAT, PAT, SEV, FRAME, indLabel } from '../../lib/obs';
export function GET() {
  const q = (s: unknown) => '"' + String(s ?? '').replace(/"/g, '""') + '"';
  const head = ['رقم الملاحظة', 'المنظمة', 'المنطقة', 'المحور', 'النمط', 'الخطورة', 'الملاحظة', 'توصية المعد', 'التوصية العامة للنمط', 'مؤشر الأداء المالي', 'الأسئلة التحليلية'];
  const rows = NOTES.map((n) => { const a = byFile[n.a]; return [n.id, a.org, a.region, CAT[n.cat], n.pat === 'P' ? 'ممارسة إيجابية' : PAT[n.pat].name, SEV[n.sev].label, n.t, n.r, PAT[n.pat].rec, (FRAME.map[n.pat]?.ind ?? []).map(indLabel).join(' | ') || (n.pat === 'P' ? '' : 'خارج معادلة الدرجة'), (FRAME.map[n.pat]?.q ?? []).map((x) => 'س' + x).join(' ')]; });
  const body = '﻿' + [head, ...rows].map((r) => r.map(q).join(',')).join('\r\n');
  return new Response(body, { headers: { 'Content-Type': 'text/csv; charset=utf-8' } });
}
