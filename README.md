# eylul

Tek kullanıcılı kişisel blog. Yazılar veritabanında saklanır, ileride kitaba dönüştürülmek üzere bir araya getirilir.

## Yığın

- Next.js 16 (App Router) + TypeScript
- TailwindCSS v4
- MySQL + Prisma ORM
- iron-session ile cookie tabanlı oturum
- Tiptap zengin metin editörü
- bcrypt + zod + sanitize-html

## Kurulum

```bash
npm install
cp .env.example .env
# .env içinde AUTH_USERNAME, AUTH_PASSWORD_HASH ve SESSION_PASSWORD'ü doldurun.
# Parola hash'i için:
node scripts/hash.js <parola>
# Session anahtarı için:
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

## Veritabanı

```bash
# MySQL'de veritabanı oluşturun:
# CREATE DATABASE eylul_blog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

npx prisma migrate deploy   # Üretim
npx prisma migrate dev      # Geliştirme
```

## Çalıştırma

```bash
npm run dev      # http://localhost:3000
npm run build
npm run start    # Üretim
```

## Üretim (PM2 + Nginx)

```bash
npm ci
npx prisma migrate deploy
npm run build
pm2 start npm --name eylul -- start
pm2 save
```

Nginx reverse proxy `localhost:3000` adresine yönlendirilir; SSL için certbot kullanın.

## Notlar

- Tüm sayfalar yetki gerektirir. Yetkisiz istekler `/login`'e döner.
- Silme işlemi yumuşaktır: `posts.deleted = 1`. Kayıt veritabanından çıkmaz, listede görünmez.
- "Çöp kutusu" sayfasından silinen yazılar geri yüklenebilir.
- HTML içerikler kaydetmeden önce `sanitize-html` ile temizlenir.
- Login denemeleri IP bazlı sınırlandırılır (5 deneme / 5 dakika).
