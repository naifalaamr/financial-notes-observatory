# مرصد الملاحظات المالية · الدفعة 47

موقع ثابت مبني بـ Astro (نفس إعداد دليل الجهات المانحة) من بيانات `src/data/observatory.json` و`src/data/framework.json`.

## التشغيل على جهازك
```bash
cd site
npm install   # مرة واحدة إن لزم
npm run dev
```
ثم افتح http://localhost:4321

## الصفحات
- `/` التقرير التجميعي · `/orgs/` ملخصات المنظمات · `/patterns/` الأنماط · `/framework/` إطار التقييم · `/method/` المنهجية
- `/data/notes.csv` الملاحظات للتنزيل

## النشر
ارفع هذا المجلد إلى المستودع naifalaamr/financial-notes-observatory (الفرع main)، ومن إعدادات المستودع: Pages ← Source: GitHub Actions. يبني `.github/workflows/deploy.yml` الموقع وينشره تلقائياً مع كل دفع.

## قواعد
- لا أسماء جمعيات ولا أسماء طلاب ولا أرقام جامعية في `src/data/`.
