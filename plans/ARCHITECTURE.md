# Senior Architect Theme System - Technical Specification

## Design Principles

### 1. Single Source of Truth
All design tokens live in ONE file. Colors, spacing, typography, shadows - everything.

### 2. CSS-First Architecture
Theme switching happens via CSS custom properties. React only manages the `data-theme` attribute. No runtime theme calculations in components.

### 3. Composition Over Configuration
Small, focused components that compose together. No prop drilling, no complex theme contexts.

### 4. Zero Runtime Theme Logic
Components receive no theme-related props. They read from CSS variables directly. This eliminates the `isLight ? "#fff" : "#000"` pattern entirely.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           index.html                                     │
│                    (loads Google Fonts)                                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          index.css                                       │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  :root — DEFAULT (Dark)                                         │    │
│  │    --color-background: #0a0f1e                                  │    │
│  │    --color-text-primary: #e8edf8                                 │    │
│  │    --color-accent: #00d4b8                                      │    │
│  │    ...                                                           │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  [data-theme="light"] — Light Override                           │    │
│  │    --color-background: #ffffff                                  │    │
│  │    --color-text-primary: #0a0f1e                                 │    │
│  │    --color-accent: #00d4b8  (unchanged)                         │    │
│  │    ...                                                           │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     ThemeContext.tsx                                     │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │  ONLY JOB: Toggle data-theme attribute on <html>                │    │
│  │  No color calculations. No theme objects. Just state toggle.    │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     Modular Components                                   │
│                                                                         │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │
│   │  PageHero    │  │ContentSection│  │  ThemeCard  │                │
│   │  (has neuro) │  │              │  │              │                │
│   └──────────────┘  └──────────────┘  └──────────────┘                │
│                                                                         │
│   ALL components use CSS variables:                                      │
│     background: var(--color-background)                                 │
│     color: var(--color-text-primary)                                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
src/frontend/
├── src/
│   ├── lib/
│   │   └── theme/
│   │       ├── tokens.css          # All design tokens (CSS variables)
│   │       ├── tokens.ts           # TypeScript constants (for IDE autocomplete)
│   │       ├── index.ts            # Theme hooks (minimal)
│   │       └── neurals.ts          # Neuron canvas config
│   │
│   └── components/
│       ├── primitives/             # Atomic building blocks
│       │   ├── ThemeText.tsx
│       │   ├── ThemeCard.tsx
│       │   ├── ThemeButton.tsx
│       │   └── ThemeSection.tsx
│       │
│       ├── layout/
│       │   ├── PageHero.tsx        # Hero with optional neuron background
│       │   ├── ContentSection.tsx # Standard content container
│       │   └── CtaSection.tsx      # Call-to-action sections
│       │
│       └── pages/                  # Page components (composed of above)
│
└── index.css                       # Imports tokens.css
```

---

## Implementation Details

### 1. tokens.css — The Heart of Theming

```css
/* src/lib/theme/tokens.css */

/* ============================================
   BASE TOKENS — Semantic color names
   These NEVER change between light/dark
   ============================================ */
:root {
  /* Brand Colors */
  --color-primary: #0a0f1e;
  --color-accent: #00d4b8;
  --color-accent-warm: #a87ef5;
  
  /* Typography */
  --font-display: 'Sora', system-ui, sans-serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --font-serif: 'Playfair Display', Georgia, serif;
}

/* ============================================
   DARK THEME (Default)
   ============================================ */
:root,
[data-theme='dark'] {
  /* Surfaces */
  --color-background: #0a0f1e;
  --color-surface: #110f22;
  --color-surface-elevated: #1a1833;
  
  /* Text */
  --color-text-primary: #e8edf8;
  --color-text-secondary: #d4e0f5;
  --color-text-muted: rgba(232, 237, 248, 0.55);
  
  /* Borders */
  --color-border: rgba(255, 255, 255, 0.08);
  --color-border-subtle: rgba(255, 255, 255, 0.04);
  
  /* Hero backgrounds */
  --color-hero-bg: #0d1526;
  
  /* Card backgrounds */
  --color-card-bg: rgba(255, 255, 255, 0.03);
  --color-card-border: rgba(255, 255, 255, 0.07);
}

/* ============================================
   LIGHT THEME
   ============================================ */
[data-theme='light'] {
  /* Surfaces */
  --color-background: #ffffff;
  --color-surface: #f8fafc;
  --color-surface-elevated: #ffffff;
  
  /* Text */
  --color-text-primary: #0a0f1e;
  --color-text-secondary: rgba(10, 15, 30, 0.75);
  --color-text-muted: rgba(10, 15, 30, 0.55);
  
  /* Borders */
  --color-border: #e2e8f0;
  --color-border-subtle: #f1f5f9;
  
  /* Hero backgrounds */
  --color-hero-bg: #f8fafc;
  
  /* Card backgrounds */
  --color-card-bg: rgba(99, 102, 241, 0.04);
  --color-card-border: rgba(99, 102, 241, 0.12);
}

/* ============================================
   COMPONENT-SPECIFIC TOKENS
   Using base tokens for consistency
   ============================================ */
:root {
  /* Neuron Canvas */
  --neuron-color: var(--color-accent);
  --neuron-bg: transparent;
  
  /* Buttons */
  --button-primary-bg: var(--color-accent);
  --button-primary-text: #0a0f1e;
  
  /* Links */
  --link-color: var(--color-accent);
  --link-hover: #00f5cc;
}
```

### 2. tokens.ts — TypeScript Constants (IDE Support)

```typescript
// src/lib/theme/tokens.ts

/** Design tokens with TypeScript support for IDE autocomplete */
export const tokens = {
  colors: {
    brand: {
      primary: '#0a0f1e',
      accent: '#00d4b8',
      accentWarm: '#a87ef5',
    },
    dark: {
      background: '#0a0f1e',
      surface: '#110f22',
      textPrimary: '#e8edf8',
      textSecondary: '#d4e0f5',
      textMuted: 'rgba(232, 237, 248, 0.55)',
    },
    light: {
      background: '#ffffff',
      surface: '#f8fafc',
      textPrimary: '#0a0f1e',
      textSecondary: 'rgba(10, 15, 30, 0.75)',
      textMuted: 'rgba(10, 15, 30, 0.55)',
    },
  },
  fonts: {
    display: "'Sora', system-ui, sans-serif",
    body: "'DM Sans', system-ui, sans-serif",
    serif: "'Playfair Display', Georgia, serif",
  },
  spacing: {
    section: '80px',
    sectionSm: '60px',
    container: '1280px',
  },
} as const;

/** CSS variable names for dynamic usage */
export const cssVars = {
  colors: {
    background: '--color-background',
    surface: '--color-surface',
    textPrimary: '--color-text-primary',
    textSecondary: '--color-text-secondary',
    textMuted: '--color-text-muted',
    border: '--color-border',
    accent: '--color-accent',
  },
} as const;
```

### 3. index.css — Import Tokens

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Import design tokens FIRST */
@import './lib/theme/tokens.css';

/* Base styles using tokens */
body {
  background-color: var(--color-background);
  color: var(--color-text-primary);
  font-family: var(--font-body);
}

/* Utility classes for common patterns */
@layer utilities {
  .bg-surface {
    background-color: var(--color-surface);
  }
  
  .text-primary {
    color: var(--color-text-primary);
  }
  
  .text-secondary {
    color: var(--color-text-secondary);
  }
  
  .text-muted {
    color: var(--color-text-muted);
  }
  
  .border-subtle {
    border-color: var(--color-border);
  }
  
  .bg-card {
    background-color: var(--color-card-bg);
    border: 1px solid var(--color-card-border);
  }
}
```

### 4. ThemeText.tsx — Zero-Logic Text Component

```tsx
// src/components/primitives/ThemeText.tsx

import { cssVars } from '@/lib/theme/tokens';

interface ThemeTextProps {
  /** Content */
  children: React.ReactNode;
  
  /** HTML element */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'small';
  
  /** Variant controls size and weight */
  variant?: 'display' | 'heading' | 'subheading' | 'body' | 'caption' | 'label';
  
  /** Optional custom styles */
  className?: string;
}

const variantStyles: Record<string, React.CSSProperties> = {
  display: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: 700,
    lineHeight: 1.1,
  },
  heading: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
    fontWeight: 600,
    lineHeight: 1.2,
  },
  subheading: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.25rem',
    fontWeight: 500,
    lineHeight: 1.4,
  },
  body: {
    fontFamily: 'var(--font-body)',
    fontSize: '1rem',
    lineHeight: 1.7,
  },
  caption: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  label: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
  },
};

export function ThemeText({ 
  children, 
  as: Component = 'p', 
  variant = 'body',
  className = '' 
}: ThemeTextProps) {
  return (
    <Component 
      className={className}
      style={{
        color: 'var(--color-text-primary)',
        ...variantStyles[variant]
      }}
    >
      {children}
    </Component>
  );
}
```

### 5. PageHero.tsx — Composed Hero with Neuron

```tsx
// src/components/layout/PageHero.tsx

import NeuronCanvas from '@/components/NeuronCanvas';
import { ThemeText } from '../primitives/ThemeText';

interface PageHeroProps {
  /** Page title */
  title: string;
  
  /** Optional subtitle */
  subtitle?: string;
  
  /** Breadcrumb trail */
  breadcrumb?: Array<{ label: string; href?: string }>;
  
  /** Show neuron background */
  showNeurons?: boolean;
  
  /** Additional content */
  children?: React.ReactNode;
}

export function PageHero({ 
  title, 
  subtitle, 
  breadcrumb, 
  showNeurons = true,
  children 
}: PageHeroProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: 'var(--color-hero-bg)',
        padding: '80px 0 60px',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      {/* Neuron background - automatic theme */}
      {showNeurons && (
        <NeuronCanvas 
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.4,
          }}
        />
      )}
      
      {/* Content */}
      <div 
        className="relative z-10 max-w-7xl mx-auto px-4"
        style={{ maxWidth: '1280px' }}
      >
        {/* Breadcrumb */}
        {breadcrumb && (
          <nav style={{ marginBottom: '16px' }}>
            {breadcrumb.map((item, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                {i > 0 && <ChevronRight size={14} style={{ color: 'var(--color-text-muted)' }} />}
                {item.href ? (
                  <Link to={item.href} style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    {item.label}
                  </Link>
                ) : (
                  <span style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    {item.label}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}
        
        {/* Title */}
        <ThemeText as="h1" variant="display">
          {title}
        </ThemeText>
        
        {/* Subtitle */}
        {subtitle && (
          <ThemeText 
            as="p" 
            variant="body" 
            className="mt-4"
            style={{ color: 'var(--color-text-secondary)', maxWidth: '640px' }}
          >
            {subtitle}
          </ThemeText>
        )}
        
        {/* Additional content */}
        {children}
      </div>
    </section>
  );
}
```

### 6. ContentSection.tsx — Standardized Sections

```tsx
// src/components/layout/ContentSection.tsx

interface ContentSectionProps {
  /** Section content */
  children: React.ReactNode;
  
  /** Background variant */
  background?: 'default' | 'surface' | 'elevated' | 'gradient';
  
  /** Section padding */
  padding?: 'none' | 'small' | 'medium' | 'large';
  
  /** Optional id for anchors */
  id?: string;
  
  /** Additional CSS */
  className?: string;
}

const paddingMap = {
  none: '0',
  small: '40px 0',
  medium: '80px 0',
  large: '120px 0',
};

const bgMap = {
  default: 'var(--color-background)',
  surface: 'var(--color-surface)',
  elevated: 'var(--color-surface-elevated)',
  gradient: 'linear-gradient(135deg, var(--color-surface) 0%, var(--color-background) 100%)',
};

export function ContentSection({
  children,
  background = 'default',
  padding = 'medium',
  id,
  className = '',
}: ContentSectionProps) {
  return (
    <section
      id={id}
      className={className}
      style={{
        background: bgMap[background],
        padding: paddingMap[padding],
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
        {children}
      </div>
    </section>
  );
}
```

### 7. ThemeCard.tsx — Consistent Card Component

```tsx
// src/components/primitives/ThemeCard.tsx

interface ThemeCardProps {
  children: React.ReactNode;
  /** Make card clickable */
  onClick?: () => void;
  /** Elevated appearance */
  elevated?: boolean;
  className?: string;
}

export function ThemeCard({ 
  children, 
  onClick, 
  elevated = false,
  className = '' 
}: ThemeCardProps) {
  const style: React.CSSProperties = {
    backgroundColor: elevated ? 'var(--color-surface-elevated)' : 'var(--color-card-bg)',
    border: '1px solid var(--color-card-border)',
    borderRadius: '16px',
    padding: '24px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: onClick ? 'pointer' : 'default',
  };
  
  return (
    <div 
      style={style}
      className={className}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow = '';
        }
      }}
    >
      {children}
    </div>
  );
}
```

---

## Migration Strategy

### Phase 1: Create New System
1. Create `src/lib/theme/` directory
2. Add `tokens.css` with all CSS variables
3. Add `tokens.ts` for TypeScript support
4. Add primitive components

### Phase 2: Create Layout Components
1. Create `PageHero.tsx`
2. Create `ContentSection.tsx`
3. Create `ThemeCard.tsx`

### Phase 3: Migrate One Page as Example
- Migrate `HowItWorksPage.tsx` to use new components
- Verify light/dark mode works perfectly

### Phase 4: Roll Out to All Pages
- Migrate remaining pages one by one
- Delete old inline styles as you go

---

## Debugging Strategy

With this architecture, debugging is straightforward:

### "Text is wrong color in light mode"
1. Open browser devtools
2. Inspect element
3. Check computed `color` value
4. Find which CSS variable it maps to in `tokens.css`
5. Fix in ONE place

### "Component looks wrong in dark mode"
1. Check if component uses CSS variables
2. If yes → check `tokens.css`
3. If no → convert to use variables (one-time fix)

### "New component needs theming"
1. Use `ThemeCard`, `ThemeText`, `ContentSection`
2. Or use CSS variables directly: `color: var(--color-text-primary)`
3. NEVER use `isLight ?` ternary

---

## Benefits

| Problem | Solution |
|---------|----------|
| 123+ hardcoded colors scattered | 1 file (`tokens.css`) |
| Inconsistent light/dark | CSS variables auto-switch |
| Forgot `isLight` in one place | Components use CSS vars |
| Hard to find where colors defined | Single source of truth |
| Adding new color = search/replace | Add to tokens.css |
| New developer onboarding | Read 1 file, understand system |
| Theme-specific bugs | Fix in tokens.css, all components update |
| Testing theme | CSS handles it, no JS tests needed |

---

## Success Criteria

- [ ] Zero `isLight` or `isDark` ternaries in page components
- [ ] All colors defined in `tokens.css`
- [ ] All pages use `PageHero`, `ContentSection`, `ThemeCard`
- [ ] Light/dark mode 100% consistent across all pages
- [ ] New developer can add a new color in under 1 minute
- [ ] Debug any theme issue in under 30 seconds
