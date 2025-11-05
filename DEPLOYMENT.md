# Production Deployment Rehberi

## 🔧 Environment Variables

Production'da mutlaka şu environment variable'ları ayarlayın:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
```

**ÖNEMLİ:** `NEXT_PUBLIC_SITE_URL` mutlaka production URL'iniz olmalı. **Trailing slash (`/`) kullanmayın!** Örnek:
- ✅ `https://btt-brainstorm.vercel.app`
- ❌ `https://btt-brainstorm.vercel.app/` (trailing slash ile)
- ❌ `http://localhost:3000`

## 🔐 Supabase Ayarları

### 1. Site URL Ayarlama

1. Supabase Dashboard → **Settings** → **API**
2. **Site URL** bölümüne production URL'inizi ekleyin:
   ```
   https://your-production-domain.com
   ```
3. **Additional Redirect URLs** bölümüne ekleyin:
   ```
   https://your-production-domain.com/**
   ```

### 2. Google OAuth Callback URL

Supabase Dashboard → **Authentication** → **Providers** → **Google** sayfasında gösterilen **Callback URL**'i Google Cloud Console'a ekleyin.

## 🌐 Google Cloud Console Ayarları

### Authorized Redirect URIs

1. Google Cloud Console → **APIs & Services** → **Credentials**
2. OAuth 2.0 Client ID'nizi seçin
3. **Authorized redirect URIs** bölümüne şunu ekleyin:
   ```
   https://[PROJECT_REF].supabase.co/auth/v1/callback
   ```
   (Bu Supabase Dashboard'dan alacağınız URL)

**NOT:** Production callback URL'i (`https://your-domain.com/auth/callback`) eklemenize gerek yok. Supabase kendi callback'ini kullanır, sonra uygulamanıza yönlendirir.

### Authorized JavaScript origins

Production URL'inizi ekleyin:
```
https://your-production-domain.com
```

## 🚀 Vercel Deployment

Vercel'de deploy ederken:

1. **Environment Variables** sekmesine gidin
2. Şu variable'ları ekleyin:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` = `https://your-vercel-app.vercel.app`

## ✅ Kontrol Listesi

- [ ] `NEXT_PUBLIC_SITE_URL` production URL ile ayarlandı
- [ ] Supabase Site URL production URL ile ayarlandı
- [ ] Supabase Additional Redirect URLs'e production URL eklendi
- [ ] Google Cloud Console'da Supabase callback URL eklendi
- [ ] Google Cloud Console'da production URL JavaScript origins'e eklendi

## 🐛 Sorun Giderme

### Hala localhost'a yönlendiriliyor

1. **Environment Variable Kontrolü:**
   ```bash
   # Vercel'de
   vercel env ls
   
   # Kontrol edin: NEXT_PUBLIC_SITE_URL doğru mu?
   ```

2. **Browser Console Kontrolü:**
   - Production'da browser console'u açın
   - "ERROR: Running in production but detected localhost" hatası görüyorsanız, `NEXT_PUBLIC_SITE_URL` ayarlanmamış demektir

3. **Supabase Logs Kontrolü:**
   - Supabase Dashboard → Logs
   - Authentication loglarına bakın

### Redirect URI mismatch hatası

- Google Cloud Console'daki Authorized redirect URIs'de Supabase callback URL'inin olduğundan emin olun
- URL'lerin tam olarak eşleştiğinden emin olun (http vs https, trailing slash vs)

