# Broken Drone True 3D Website

نسخة مطورة من نشاط **إصلاح الدرون** مع:

- درون **ثلاثي الأبعاد حقيقي** باستخدام Three.js
- **Drag & Drop** للقطع
- 9 مستويات
- 3 مراحل صعوبة
- تلميحات وفحص
- نفس الطابع اللوني البنفسجي / التركواز المستوحى من العرض

## الملفات
- `index.html`
- `styles.css`
- `game.js`
- `assets/`

## التشغيل محلياً
شغّل داخل المجلد:

```bash
python -m http.server 8000
```

ثم افتح:

```text
http://localhost:8000
```

## النشر على GitHub Pages
1. أنشئ repo جديد مثلاً:
   `broken-drone-true-3d`
2. ارفع **كل ملفات هذا المجلد** إلى الجذر.
3. ادخل:
   **Settings → Pages**
4. اختر:
   **Deploy from a branch**
5. Branch = `main`
6. Folder = `/root`
7. احفظ.

الرابط سيكون غالباً:

```text
https://YOUR_USERNAME.github.io/broken-drone-true-3d/
```

## ملاحظة
الموقع يستخدم مكتبة Three.js من CDN، لذلك يحتاج اتصال إنترنت عند التشغيل من المتصفح.
