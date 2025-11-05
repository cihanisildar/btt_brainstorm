# Google OAuth Provider Kurulum Rehberi

## 1. Google Cloud Console'da OAuth Credentials Oluşturma

### Adım 1: Google Cloud Console'a Giriş
1. [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
2. Yeni bir proje oluşturun veya mevcut bir projeyi seçin

### Adım 2: OAuth Consent Screen Yapılandırma
1. Sol menüden **"APIs & Services"** > **"OAuth consent screen"** seçin
2. User Type olarak **"External"** seçin (test için)
3. Gerekli bilgileri doldurun:
   - App name: "Beyin Fırtınası" (veya istediğiniz isim)
   - User support email: E-posta adresiniz
   - Developer contact information: E-posta adresiniz
4. **"Save and Continue"** butonuna tıklayın
5. Scopes adımında **"Save and Continue"** (varsayılan scopes yeterli)
6. Test users adımında **"Save and Continue"** (opsiyonel)
7. Summary sayfasında **"Back to Dashboard"** tıklayın

### Adım 3: OAuth 2.0 Client ID Oluşturma
1. **"APIs & Services"** > **"Credentials"** seçin
2. Üstteki **"+ CREATE CREDENTIALS"** butonuna tıklayın
3. **"OAuth client ID"** seçin
4. Application type olarak **"Web application"** seçin
5. Name: "Beyin Fırtınası Web Client" (veya istediğiniz isim)
6. **Authorized redirect URIs** bölümüne şu URL'yi ekleyin:
   ```
   https://[PROJECT_REF].supabase.co/auth/v1/callback
   ```
   - `[PROJECT_REF]` yerine Supabase projenizin referansını yazın
   - Örnek: `https://abcdefghijklmnop.supabase.co/auth/v1/callback`
   - Bu URL'yi Supabase Dashboard > Authentication > Providers > Google sayfasında bulabilirsiniz
7. **"CREATE"** butonuna tıklayın
8. Oluşturulan **Client ID** ve **Client Secret**'ı kopyalayın (bir daha gösterilmeyecek!)

## 2. Supabase Dashboard'da Google Provider'ı Etkinleştirme

1. [Supabase Dashboard](https://app.supabase.com/) adresine gidin
2. Projenizi seçin
3. Sol menüden **"Authentication"** > **"Providers"** seçin
4. Provider listesinden **"Google"** seçin
5. **"Enable Google provider"** toggle'ını açın
6. Google Cloud Console'dan aldığınız bilgileri girin:
   - **Client ID (for OAuth)**: Google Cloud Console'dan aldığınız Client ID
   - **Client Secret (for OAuth)**: Google Cloud Console'dan aldığınız Client Secret
7. **"Save"** butonuna tıklayın

## 3. Callback URL'i Kontrol Etme

Supabase Dashboard > Authentication > Providers > Google sayfasında **"Callback URL"** bölümünde gösterilen URL'yi Google Cloud Console'daki Authorized redirect URIs'e eklediğinizden emin olun.

Callback URL formatı:
```
https://[PROJECT_REF].supabase.co/auth/v1/callback
```

## 4. Test Etme

1. Uygulamanızda "Google ile Giriş Yap" butonuna tıklayın
2. Google hesabınızla giriş yapın
3. Başarılı bir şekilde yönlendirilmelisiniz

## Sorun Giderme

### "Unsupported provider" Hatası
- Supabase Dashboard'da Google provider'ının enable edildiğinden emin olun
- Client ID ve Client Secret'ın doğru girildiğini kontrol edin

### "Redirect URI mismatch" Hatası
- Google Cloud Console'daki Authorized redirect URIs'de Supabase callback URL'inin olduğundan emin olun
- URL'lerin tam olarak eşleştiğinden emin olun (http vs https, trailing slash vs)

### OAuth Consent Screen Hatası
- OAuth consent screen'in yapılandırıldığından emin olun
- Test users eklediyseniz, giriş yaparken kullandığınız e-postanın listede olduğundan emin olun

