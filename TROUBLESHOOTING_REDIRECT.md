# Redirect Sorunu Giderme Rehberi

## 🔍 Adım 1: Browser Console Kontrolü

Production'da giriş yaparken browser console'u açın (F12) ve şu logları kontrol edin:

1. **`[Login] Current origin:`** - Production URL'i olmalı (`https://btt-brainstorm.vercel.app`)
2. **`[Login] NEXT_PUBLIC_SITE_URL:`** - Production URL'i olmalı (undefined ise Vercel'de ayarlanmamış)
3. **`[Login] Using redirect URL:`** - `https://btt-brainstorm.vercel.app/auth/callback` olmalı
4. **`[Login] Supabase redirect URL:`** - Supabase'in oluşturduğu OAuth URL'i

## 🔍 Adım 2: Supabase Additional Redirect URLs Kontrolü

Supabase Dashboard → Settings → API → Additional Redirect URLs bölümünde şu URL'lerin olduğundan emin olun:

```
https://btt-brainstorm.vercel.app/**
https://btt-brainstorm.vercel.app/auth/callback
```

**ÖNEMLİ:** Supabase, `redirectTo` parametresindeki URL'in Additional Redirect URLs'de olmasını gerektirir. Yoksa Site URL'e geri döner.

## 🔍 Adım 3: Vercel Environment Variable Kontrolü

Vercel Dashboard → Project → Settings → Environment Variables:

1. `NEXT_PUBLIC_SITE_URL` değişkeninin olduğundan emin olun
2. Değeri: `https://btt-brainstorm.vercel.app` (trailing slash olmadan)
3. **Environment:** Production seçili olmalı

## 🔍 Adım 4: Supabase Site URL Kontrolü

Supabase Dashboard → Settings → API → Site URL:

- `https://btt-brainstorm.vercel.app` olmalı (localhost olmamalı)

## 🐛 Olası Sorunlar ve Çözümleri

### Sorun 1: Console'da "NEXT_PUBLIC_SITE_URL: undefined" görüyorsunuz

**Çözüm:**
- Vercel'de environment variable'ı ekleyin
- Deploy'u yenileyin (environment variable değişikliklerinden sonra)

### Sorun 2: Console'da "Using redirect URL: http://localhost:3000/auth/callback" görüyorsunuz

**Çözüm:**
- Vercel'de `NEXT_PUBLIC_SITE_URL` değişkenini kontrol edin
- Production environment'ı seçili olduğundan emin olun
- Deploy'u yenileyin

### Sorun 3: Supabase redirect URL'i localhost içeriyor

**Çözüm:**
- Supabase Dashboard → Settings → API → Additional Redirect URLs'e production URL'i ekleyin
- Supabase Site URL'inin production URL olduğundan emin olun

### Sorun 4: Hala localhost'a yönlendiriliyor

**Çözüm:**
1. Browser cache'i temizleyin
2. Vercel'de yeni bir deploy yapın
3. Supabase Dashboard'da tüm ayarları tekrar kontrol edin
4. Browser console loglarını kontrol edin

## 📝 Kontrol Listesi

- [ ] Vercel'de `NEXT_PUBLIC_SITE_URL` production URL ile ayarlandı
- [ ] Supabase Site URL production URL ile ayarlandı
- [ ] Supabase Additional Redirect URLs'e production URL eklendi
- [ ] Google Cloud Console'da Supabase callback URL eklendi
- [ ] Google Cloud Console'da production URL JavaScript origins'e eklendi
- [ ] Vercel'de yeni deploy yapıldı
- [ ] Browser console'da doğru URL'ler loglanıyor

