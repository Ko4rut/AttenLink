src/                      ← (tùy chọn: dùng src/ để tách biệt code khỏi config)
├── app/                  ← Chỉ để routing + layout + page 
│   ├── (auth)/           ← Route group: không ảnh hưởng URL 
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/     ← nếu có đăng ký
│   │   │   └── page.tsx
│   │   └── layout.tsx    ← Layout riêng cho auth 
│   ├── (dashboard)/      ← Route group cho phần sau login
│   │   ├── page.tsx      ← /dashboard
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── layout.tsx    ← Layout có sidebar, header cho user đã login
│   ├── layout.tsx        ← Root layout (toàn app: html, body, providers...)
│   ├── page.tsx          ← Trang chủ / (public)
│   ├── globals.css       ← (nếu có)
│   └── favicon.ico
├── components/           ← Tất cả UI components (shadcn + custom)
│   ├── ui/               ← Components từ shadcn/ui (Button, Card, Input, ...)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ... (tự động tạo khi add shadcn)
│   ├── auth/             ← Components riêng cho auth
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── dashboard/        ← Components cho dashboard
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   └── common/           ← Reusable khắp nơi (nếu cần)
│       └── ThemeToggle.tsx
├── lib/                  ← Utilities, helpers, non-UI logic
│   ├── auth.ts           ← Hàm login/logout, getSession...
│   ├── utils.ts
│   └── constants.ts
├── hooks/                ← Custom React hooks
│   └── useAuth.ts
├── types/                ← TypeScript types/interfaces
│   └── index.ts
├── actions/              ← Server Actions (nếu dùng)
│   └── auth-actions.ts
└── public/               ← Static files (images, fonts...)