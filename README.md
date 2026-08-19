# ⭐ GoStars Academy | أكاديمية GoStars التعليمية
> **«آفاق واسعة.. لعلم لا ينتهي»**

المنصة التعليمية المتكاملة لأكاديمية **GoStars** لتدريس القرآن الكريم، اللغة العربية، والمناهج الدراسية الوطنية والدولية، مع بوابات مخصصة لأولياء الأمور والمعلمين والإدارة ونظام إشعارات واتساب السحابي.

---

## 🚀 طريقة الربط والرفع على GitHub (Connect to GitHub)

### الطريقة المباشرة (عبر واجهة Google AI Studio):
1. من الزاوية العلوية اليمنى في شاشة **Google AI Studio**، اضغط على زر القائمة أو **Share / Export**.
2. اختر **Export to GitHub** (أو **Push to GitHub**).
3. اختر حسابك على GitHub واكتب اسم المستودع: `GoStars-Academy` أو `gostars-academy`.
4. اضغط **Export / Sync** وسيتم إنشاء المستودع ورفع كافة الملفات تلقائياً مع المزامنة المستمرة لأي تحديثات قادمة.

---

### الطريقة اليدوية (عبر موجه الأوامر Git CLI):
إذا قمت بتحميل المشروع كملف ZIP أو أردت رفعه يدوياً:

```bash
# 1. تهيئة المستودع
git init

# 2. إضافة كافة الملفات
git add .

# 3. حفظ الالتزام الأول
git commit -m "Initial commit: GoStars Academy Platform"

# 4. تعيين الفرع الرئيسي
git branch -M main

# 5. ربط المستودع باسم GoStars-Academy على حسابك
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/GoStars-Academy.git

# 6. الرفع إلى GitHub
git push -u origin main
```

---

## 💻 التشغيل والتطوير المحلي (Local Development)

```bash
# 1. تثبيت الحزم والمكتبات
npm install

# 2. إعداد ملف المتغيرات البيئية
cp .env.example .env

# 3. تشغيل خادم التطوير
npm run dev
```

التطبيق سيعمل محلياً على: `http://localhost:3000`

---

## 📦 البناء والإنتاج (Production Build)

```bash
# فحص الأنواع
npm run lint

# بناء ملفات الإنتاج (Client + Server Bundle)
npm run build

# تشغيل خادم الإنتاج
npm start
```

---

## 📁 هيكلية المشروع (Project Architecture)

- `/src`: الواجهة الأمامية الكاملة (React 19 + Tailwind CSS + Lucide Icons + Motion)
  - `/src/components/portal`: بوابة ولي الأمر ومتابعة الطلاب
  - `/src/components/teacher`: منصة المعلم وإدخال التقارير
  - `/src/components/admin`: لوحة الإدارة المركزية والنسخ الاحتياطي
  - `/src/lib/whatsappMessageFormatter.ts`: منسق رسائل وإشعارات الواتساب
  - `/src/lib/cmsDataEngine.ts`: محرك إدارة المحتوى المباشر
- `/server.ts`: خادم Express مع تكامل Vite وAPI Routes
- `/firestore.rules`: قواعد الأمان وحماية البيانات في Firestore
- `metadata.json`: بيانات وهوية المنصة الرسمية

