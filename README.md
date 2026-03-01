# Shift Chat — Landing Page

صفحة تعريفية لـ **Shift Chat** مبنية لـ GitHub Pages (Static).

## هيكل المشروع

```
shift-chat-landing/
├─ index.html
├─ assets/
│  ├─ css/style.css
│  ├─ js/main.js
│  └─ img/
│     ├─ logo.svg
│     ├─ hero/hero-mockup.png     ← placeholder
│     ├─ before/before.png        ← placeholder
│     ├─ after/after.png          ← placeholder
│     └─ og/og-image-1200x630.jpg ← placeholder
├─ locales/
│  ├─ ar.json   (Arabic translations)
│  └─ en.json   (English translations)
└─ README.md
```

## الرفع على GitHub Pages

1. أنشئ repository جديد باسم: `shift-chat-landing`
2. ارفع جميع الملفات
3. اذهب إلى **Settings → Pages**
4. اختر **Branch: main / root**
5. الموقع سيكون متاحاً على: `https://USERNAME.github.io/shift-chat-landing/`

## التخصيص

### إضافة فيديو الديمو
في `index.html` ابحث عن `id="demoVideo"` وضع رابط يوتيوب/فيميو:
```html
<iframe id="demoVideo" src="https://www.youtube.com/embed/VIDEO_ID" ...>
```

### تغيير رقم واتساب
في `assets/js/main.js` السطر الأول:
```js
const WHATSAPP_NUMBER = "966537311886";
```

### إضافة الصور
- `assets/img/hero/hero-mockup.png` — صورة واجهة النظام
- `assets/img/before/before.png` — صورة قبل
- `assets/img/after/after.png` — صورة بعد
- `assets/img/og/og-image-1200x630.jpg` — صورة مشاركة سوشيال

## الميزات
- ✅ عربي افتراضي + تبديل للإنجليزي
- ✅ Dark Gradient + Glass + Glow UI
- ✅ روابط واتساب مع رسائل مخصصة لكل باقة
- ✅ Modal تسجيل دخول (Admin / Agent)
- ✅ Sticky CTA أسفل الشاشة
- ✅ Scroll reveal animations
- ✅ Stats counter animation
- ✅ Before/After tabs
- ✅ Mobile responsive
- ✅ IBM Plex Sans Arabic
