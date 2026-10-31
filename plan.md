# Architecture & Implementation Plan: Linktree Clone (Full-Stack)

## 1. Project Overview
A complete, fully functional clone of **Linktree** (https://linktr.ee/), replicating its public landing page, user registration/login, public bio link profiles (`/:username`), administrative dashboard with live mobile device preview, theme/appearance customizer, social icons bar, QR code sharing, and click analytics tracking.

---

## 2. Technical Stack
- **Runtime & Server**: Node.js + Express.js.
- **Data Persistence**: File-backed atomic JSON Database (`data/database.json`) with automated seeding — zero external database dependencies or native build requirements on Windows.
- **Frontend & Styling**: Responsive HTML5, Vanilla JavaScript, Tailwind CSS (CDN), FontAwesome / Lucide Icons, and Canvas-based QR Code generator.
- **Security & Session**: Cookie-based session authentication with bcrypt-compatible password hashing and input validation.

---

## 3. Core Modules & Features

### 3.1. Public Landing Page (`/`)
- Authentic Linktree hero section with dynamic username claim input (`linktr.ee/yourname`).
- Visual feature showcase: "Everything you are. In one simple link in bio."
- Template picker preview showing different bio themes.
- Interactive demo profile cards and feature breakdown (Analytics, Customization, Monetization/Links).
- Navigation header (Templates, Discover, Pricing, Login, Sign up free) and complete footer.

### 3.2. Authentication System (`/login`, `/signup`, `/logout`)
- Registration flow with instant username availability checking.
- Session-based login with persistent authentication.
- Demo pre-seeded accounts for immediate testing.

### 3.3. Admin Dashboard (`/admin`)
- **Live Split-Screen Preview**: Real-time interactive smartphone mockup that updates dynamically as links and styling change.
- **Links Management (`/admin`)**:
  - Add, edit, remove links.
  - Toggle link active / inactive state.
  - Reorder links (drag / move up & down).
  - Add section headers / dividers.
  - Custom thumbnail/icon selection per link.
- **Appearance Customizer (`/admin/appearance`)**:
  - Profile avatar upload (URL or local preview) and bio description.
  - Preset themes: Classic Light, Charcoal Noir, Sunset Glow, Neon Cyber, Matcha Garden, Lavender Dream, Ocean Breeze, Custom Colorway.
  - Button styles: Rounded pill, Soft rectangle, Hard shadow, Glassmorphism, Wireframe outline.
  - Font selection and color pickers.
- **Social Links (`/admin/socials`)**:
  - Quick connectors for Instagram, TikTok, YouTube, X/Twitter, GitHub, Spotify, Facebook, LinkedIn, Twitch, Discord, Email, WhatsApp.
  - Placement toggle (Top above links or Bottom below links).
- **Analytics Dashboard (`/admin/analytics`)**:
  - Total profile views, total link clicks, and overall click-through rate (CTR).
  - Per-link click breakdown with visual metrics.
  - Daily traffic activity trends.
- **Share & QR Code (`/admin/share`)**:
  - High-resolution QR code generator for printing or digital display.
  - One-click copy link and direct share buttons.

### 3.4. Public Bio Link Pages (`/:username`)
- Ultra-responsive, mobile-first design matching Linktree's live user pages.
- Verified badge, profile image, title, and bio description.
- Active social links bar.
- Interactive link cards with smooth micro-animations.
- Invisible click tracking redirection (counts clicks before forwarding to target URL).
- Built-in Share sheet modal with direct social sharing and downloadable QR code.
- "Join [username] on Linktree" footer badge.

---

## 4. Directory Structure
```
d:\KIM\BOT\ทำเว็ปลิ้งค์ Bio\
├── data\
│   └── database.json          # Pre-seeded users, links, themes, analytics
├── public\
│   ├── css\
│   │   └── custom.css         # Theme styles, animation keyframes
│   ├── js\
│   │   ├── admin.js           # Admin panel live preview & API client
│   │   ├── landing.js         # Claim username & interactions
│   │   └── profile.js         # Public bio page interactions & QR modal
│   └── images\                # Default avatars and assets
├── views\
│   ├── landing.html           # Linktree official landing page replica
│   ├── login.html             # Login view
│   ├── signup.html            # Registration view
│   ├── admin.html             # Dashboard with split-screen mobile mockup
│   └── profile.html           # Public /:username bio page
├── server.js                  # Express application, routes, controllers
├── package.json               # Project manifest and start scripts
└── plan.md                    # This architecture specification
```

---

## 5. Verification & Testing Steps
1. Initialize `package.json` and install required dependencies (`express`, `cookie-parser`, `bcryptjs`).
2. Implement backend database layer with automated seed data (`@alex`, `@sarah_designs`, `@tech_daily`).
3. Build the public landing page matching Linktree's aesthetic.
4. Implement authentication routes and session middleware.
5. Build the admin dashboard with live phone preview and link management.
6. Build public `/:username` bio profiles with click tracking and QR sharing.
7. Start server on `http://localhost:3000` and verify all workflows.
