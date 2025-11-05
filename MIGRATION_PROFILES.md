# Profiles Tablosu Migration Kurulumu

Bu migration, kullanıcı bilgilerini (isim, email, avatar) saklamak için bir `profiles` tablosu oluşturur ve Google OAuth ile giriş yapan kullanıcılar için otomatik olarak profil oluşturur.

## Migration'ı Çalıştırma

1. Supabase Dashboard'a gidin: https://app.supabase.com/
2. Projenizi seçin
3. Sol menüden **SQL Editor**'a tıklayın
4. Yeni bir query oluşturun
5. `supabase/migrations/002_profiles_table.sql` dosyasındaki tüm SQL kodunu kopyalayın
6. SQL Editor'a yapıştırın
7. **Run** butonuna tıklayın

## Migration Ne Yapıyor?

1. **Profiles Tablosu Oluşturur**: User bilgilerini saklamak için
2. **RLS Politikaları Ekler**: Herkes profil görebilir, kullanıcılar sadece kendi profilini güncelleyebilir
3. **Otomatik Profil Oluşturma**: Google OAuth ile giriş yapan kullanıcılar için otomatik profil oluşturur
4. **Mevcut Kullanıcıları Günceller**: Eğer zaten kullanıcılar varsa, onlar için de profil oluşturur

## Önemli Notlar

- Bu migration'ı çalıştırdıktan sonra, yeni giriş yapan kullanıcılar için otomatik olarak profil oluşturulacak
- Mevcut kullanıcılar için de profil oluşturulacak
- Artık topic, idea ve comment'lerde user bilgileri görünecek

