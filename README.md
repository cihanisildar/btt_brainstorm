# Beyin Fırtınası 🧠✨

Modern, minimalist ve Japon estetiğiyle tasarlanmış bir beyin fırtınası platformu. Kullanıcılar konular oluşturup, fikirler paylaşabilir, yorum yapabilir ve beğenebilir.

## 🚀 Özellikler

- ✅ Google OAuth ile giriş
- ✅ Topic (Konu) oluşturma, düzenleme ve silme
- ✅ Idea (Fikir) ekleme, düzenleme ve silme
- ✅ Comment (Yorum) ekleme, düzenleme ve silme
- ✅ Like (Beğeni) sistemi
- ✅ Fikirleri sıralama (En yeni, En çok beğenilen, En çok yorumlanan)
- ✅ Modern, minimalist UI/UX
- ✅ Framer Motion ile animasyonlar
- ✅ Type-safe kod (TypeScript)
- ✅ Responsive tasarım

## 🛠️ Teknolojiler

- **Next.js 15** (Turbopack)
- **Supabase** (Database, Authentication)
- **TanStack Query** (Data fetching)
- **Axios** (HTTP client)
- **Shadcn/ui** (UI components)
- **Framer Motion** (Animations)
- **TypeScript** (Type safety)
- **Tailwind CSS** (Styling)

## 📋 Kurulum

### 1. Repository'yi klonlayın

```bash
git clone https://github.com/cihanisildar/btt_brainstorm.git
cd btt_brainstorm
```

### 2. Bağımlılıkları yükleyin

```bash
npm install
```

### 3. Environment Variables

`.env.local` dosyası oluşturun:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Development için
# Production için: NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### 4. Supabase Kurulumu

1. **Migration'ları çalıştırın:**
   - Supabase Dashboard > SQL Editor
   - `supabase/migrations/001_initial_schema.sql` dosyasını çalıştırın
   - `supabase/migrations/002_profiles_table.sql` dosyasını çalıştırın

2. **Google OAuth Kurulumu:**
   - `GOOGLE_OAUTH_SETUP.md` dosyasındaki adımları takip edin

### 5. Development Server'ı Başlatın

```bash
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## 📁 Proje Yapısı

```
beyin_firtinasi/
├── app/
│   ├── actions/          # Server actions
│   ├── auth/             # Authentication routes
│   ├── topics/           # Topic pages
│   └── page.tsx          # Homepage
├── components/           # React components
│   └── ui/              # Shadcn/ui components
├── hooks/               # TanStack Query hooks
├── lib/                 # Utilities
│   ├── api/            # API client
│   └── supabase/       # Supabase clients
├── supabase/
│   └── migrations/     # Database migrations
└── types/              # TypeScript types
```

## 🔐 Authentication

Sadece Google OAuth ile giriş yapılabilir. Supabase Dashboard'da Google provider'ı etkinleştirmeniz gerekir.

## 📝 Database Schema

- **topics**: Konular
- **ideas**: Fikirler
- **comments**: Yorumlar
- **likes**: Beğeniler
- **profiles**: Kullanıcı profilleri

## 🚢 Production Deployment

1. `.env.local` dosyasında `NEXT_PUBLIC_SITE_URL` değişkenini production URL'iniz ile güncelleyin
2. Supabase Dashboard > Settings > API > Site URL'i production URL'iniz ile güncelleyin
3. Google Cloud Console'da Authorized redirect URIs'e production callback URL'inizi ekleyin

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
