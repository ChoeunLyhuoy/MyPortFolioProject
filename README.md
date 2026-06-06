# NexaData Portfolio — Angular 17

A dark-themed, fully responsive portfolio website built with **Angular 17 Standalone Components**.

## ✨ Features
- 8 fully-styled Angular standalone components
- Dark neon design (blue/cyan accents) matching your Figma mockup
- Smooth scroll navigation with active section tracking
- Animated hero with orbital rings and icon grid
- Filterable portfolio grid
- Skill progress bars with scroll-triggered animation
- FAQ accordion
- Contact form with simulated send state
- Brand marquee ticker
- Scroll-reveal animations on all cards
- Fully responsive (desktop → tablet → mobile)
- CSS custom properties throughout for easy theming

## 📁 Project Structure
```
nexadata-portfolio/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── navbar/         # Fixed navbar, mobile hamburger
│   │   │   ├── hero/           # Hero section with animated blob
│   │   │   ├── brands/         # Marquee brand ticker
│   │   │   ├── services/       # Services, industries, FAQ
│   │   │   ├── portfolio/      # Filterable case studies
│   │   │   ├── about/          # Profile card, skills, CTA
│   │   │   ├── career/         # Job listings
│   │   │   ├── contact/        # Contact form + info
│   │   │   └── footer/         # Footer with links
│   │   ├── services/
│   │   │   └── scroll.service.ts
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css              # Global CSS variables & utilities
├── angular.json
├── package.json
├── tsconfig.json
└── tsconfig.app.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+

### Install & Run
```bash
# Install dependencies
npm install

# Start dev server → http://localhost:4200
npm start

# Build for production
npm run build
```

## 🎨 Customization

### Change colors — edit `src/styles.css`:
```css
:root {
  --blue:  #2563eb;   /* Primary blue */
  --cyan:  #06b6d4;   /* Accent cyan */
  --bg:    #080b12;   /* Background */
}
```

### Update content — edit each component's `.ts` file:
- **Hero stats** → `hero.component.ts` → `stats[]`
- **Services** → `services.component.ts` → `services[]`
- **Portfolio** → `portfolio.component.ts` → `projects[]`
- **Jobs** → `career.component.ts` → `jobs[]`

## 📦 Tech Stack
- Angular 17 (Standalone Components)
- TypeScript 5.2
- Pure CSS (no Tailwind, no Bootstrap)
- Google Fonts: Syne + Space Grotesk + JetBrains Mono
