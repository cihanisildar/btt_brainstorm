# Migration Kurulum Talimatları

## Yöntem 1: Supabase Dashboard SQL Editor (Önerilen)

1. [Supabase Dashboard](https://app.supabase.com/) adresine gidin
2. Projenizi seçin
3. Sol menüden **"SQL Editor"** seçin
4. **"New query"** butonuna tıklayın
5. `supabase/migrations/001_initial_schema.sql` dosyasının içeriğini kopyalayın
6. SQL Editor'e yapıştırın
7. **"Run"** butonuna tıklayın (veya Ctrl+Enter)
8. Başarılı mesajını görmelisiniz

## Yöntem 2: Supabase CLI ile (Gelişmiş)

Eğer Supabase CLI kuruluysa:

```bash
# Supabase CLI ile giriş yapın
supabase login

# Projenizi link edin
supabase link --project-ref YOUR_PROJECT_REF

# Migration'ı çalıştırın
supabase db push
```

## Kontrol

Migration başarılı olduktan sonra:

1. Supabase Dashboard > **Table Editor**'a gidin
2. Şu tabloları görmelisiniz:
   - `topics`
   - `ideas`
   - `likes`
   - `comments`

## Sorun Giderme

### "relation already exists" Hatası
- Tablolar zaten oluşturulmuş demektir
- Migration'ın sadece eksik kısımlarını çalıştırın veya tabloları silip yeniden oluşturun

### "permission denied" Hatası
- Supabase Dashboard'da admin yetkileriniz olduğundan emin olun
- SQL Editor'den çalıştırdığınızdan emin olun (bazı komutlar CLI'dan çalışmayabilir)

