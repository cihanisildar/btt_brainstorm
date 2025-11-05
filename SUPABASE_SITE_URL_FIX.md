# Supabase Site URL Ayarı - Çözüm Adımları

## 🔴 Sorun

Production'da giriş yaptıktan sonra `http://localhost:3000/auth/login?code=...` şeklinde localhost'a yönlendiriliyor.

## ✅ Çözüm: Supabase Site URL'ini Güncelleyin

### Adım 1: Supabase Dashboard'a Gidin

1. Supabase Dashboard'u açın: https://supabase.com/dashboard
2. Projenizi seçin

### Adım 2: Settings → API Bölümüne Gidin

1. Sol menüden **Settings** (⚙️) ikonuna tıklayın
2. **API** sekmesine tıklayın
3. **URL Configuration** bölümünü bulun

### Adım 3: Site URL'i Güncelleyin

**Site URL** alanını bulun ve şu şekilde güncelleyin:

```
https://btt-brainstorm.vercel.app
```

**ÖNEMLİ:**
- ❌ `http://localhost:3000` (ESKİ - YANLIŞ)
- ✅ `https://btt-brainstorm.vercel.app` (YENİ - DOĞRU)
- ❌ Trailing slash (`/`) kullanmayın!

### Adım 4: Additional Redirect URLs Ekle

Aynı sayfada **Additional Redirect URLs** bölümünü bulun ve şu URL'leri ekleyin:

```
https://btt-brainstorm.vercel.app/**
https://btt-brainstorm.vercel.app/auth/callback
```

Her birini ayrı satır olarak ekleyin.

### Adım 5: Kaydedin

Sayfanın altındaki **Save** veya **Update** butonuna tıklayın.

## 🔍 Nasıl Kontrol Edebilirsiniz?

1. Supabase Dashboard → Settings → API
2. **Site URL** bölümünde şunu görmelisiniz:
   ```
   https://btt-brainstorm.vercel.app
   ```
3. Eğer `http://localhost:3000` görüyorsanız, yukarıdaki adımları tekrar uygulayın.

## ⚠️ Neden Bu Önemli?

Supabase OAuth flow'u şöyle çalışır:

1. ✅ Google, Supabase callback URL'ine code gönderir: `https://xxx.supabase.co/auth/v1/callback?code=...`
2. ✅ Supabase, code'u işler ve session oluşturur
3. ❌ **SORUN:** Supabase, kullanıcıyı yönlendirirken kendi **Site URL** ayarını kullanır
4. ❌ Eğer Site URL `localhost:3000` ise, her zaman localhost'a yönlendirir

## 🧪 Test

1. Site URL'i güncelledikten sonra
2. Production'da tekrar giriş yapın
3. Artık `https://btt-brainstorm.vercel.app` adresine yönlendirmeli
4. Localhost'a gitmemeli

## 📸 Görsel Yardım

Eğer Site URL alanını bulamıyorsanız:
- Sol menüden **Settings** → **API**
- Sayfanın üst kısmında **URL Configuration** veya **Site URL** bölümünü arayın
- Bu bölüm, Google OAuth provider ayarlarından **farklı bir yerde** (Settings → API altında)

