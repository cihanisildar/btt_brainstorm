# Supabase Redirect Sorunu Çözümü

## 🔴 Sorun

Production'da giriş yaptıktan sonra `http://localhost:3000/auth/login?code=...` şeklinde localhost'a yönlendiriliyor.

## 🔍 Neden Oluyor?

Supabase OAuth flow'unda şöyle çalışır:

1. Kullanıcı Google ile giriş yapar
2. Google, Supabase callback URL'ine code gönderir: `https://xxx.supabase.co/auth/v1/callback?code=...`
3. Supabase, bizim `redirectTo` parametresindeki URL'e yönlendirir: `https://btt-brainstorm.vercel.app/auth/callback?code=...`
4. **AMA** eğer Supabase Dashboard'da Site URL localhost olarak ayarlıysa, Supabase kendi Site URL'ini kullanarak redirect eder

## ✅ Çözüm

### 1. Supabase Dashboard → Settings → API

**Site URL** bölümünü production URL'iniz ile güncelleyin:

```
https://btt-brainstorm.vercel.app
```

**ÖNEMLİ:** Trailing slash (`/`) kullanmayın!

### 2. Additional Redirect URLs

Aşağıdaki URL'leri ekleyin:

```
https://btt-brainstorm.vercel.app/**
https://btt-brainstorm.vercel.app/auth/callback
```

### 3. Vercel Environment Variable

Vercel Dashboard'da `NEXT_PUBLIC_SITE_URL` değişkeninin doğru olduğundan emin olun:

```
NEXT_PUBLIC_SITE_URL=https://btt-brainstorm.vercel.app
```

(Trailing slash olmadan!)

### 4. Deploy'u Yenileyin

Environment variable veya Supabase ayarları değiştiğinde, Vercel'de yeni bir deploy yapın.

## 🧪 Test

1. Production'da giriş yapın
2. Browser console'u açın (F12)
3. `[Callback] Site URL: https://btt-brainstorm.vercel.app` mesajını görmelisiniz
4. Artık localhost'a yönlendirmemeli

## ⚠️ Önemli Notlar

- Supabase Site URL, OAuth callback'ten sonra redirect için kullanılır
- Eğer Site URL localhost ise, her zaman localhost'a yönlendirir
- `NEXT_PUBLIC_SITE_URL` sadece bizim kodumuzda kullanılır, Supabase bunu kullanmaz
- Her iki ayarı da (Supabase Site URL ve `NEXT_PUBLIC_SITE_URL`) production URL ile güncellemek gerekir

