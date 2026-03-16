# Cybin Enterprises

A comprehensive platform for high-risk payment processing and healthcare solutions.

## Overview

Cybin Enterprises provides a suite of solutions including:
- **Payment Processing** - High-risk merchant account solutions
- **Industry Portals** - Healthcare, peptides, and specialty industry platforms
- **Fraud Prevention** - Chargeback prevention and fraud detection systems
- **Hardware Integration** - Payment hardware solutions (POS, card readers, mobile readers)
- **Partner Management** - Partner lead tracking and analytics
- **Compliance** - Regulatory compliance and legal documentation

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite |
| State Management | React Query (TanStack) |
| UI Components | Radix UI, Tailwind CSS, shadcn/ui |
| Routing | React Router v7 |
| Animations | Motion (Framer Motion) |
| Backend | Internet Computer (ICP) Canisters |
| Authentication | Internet Identity |
| Storage | ICP Asset Canisters |

## Quick Start

### Prerequisites

- Node.js 18+ (Recommended: v20.x)
- pnpm 8+
- DFX (for local ICP development) - https://internetcomputer.org/docs/current/developer-docs/getting-started/install/

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd cybin-enterprises-1

# Install dependencies
pnpm install

# Copy environment configuration
cp src/frontend/env.json.example src/frontend/env.json 2>/dev/null || true
```

### Development

```bash
# Start frontend dev server (hot reload)
pnpm dev

# Or with ICP local replica (if using backend)
dfx start --background --clean
dfx deploy
```

The application runs at **http://localhost:5173**

### Building for Production

```bash
pnpm build
```

Output: `src/frontend/dist/`

### Testing

```bash
# Run tests with UI
pnpm test

# Run tests headless
pnpm test:run

# Generate coverage
pnpm coverage
```

## Project Structure

```
cybin-enterprises-1/
├── src/
│   ├── frontend/                    # React frontend application
│   │   ├── app/                     # App entry point and routing
│   │   ├── src/
│   │   │   ├── components/         # React components
│   │   │   │   ├── layout/          # Layout components (PageHero)
│   │   │   │   └── pages/          # Page-specific components
│   │   │   ├── contexts/            # React contexts (ThemeContext)
│   │   │   ├── hooks/              # Custom hooks (useSeo, usePageTracking, etc.)
│   │   │   └── test/               # Test setup
│   │   ├── pages/                  # Page components (route handlers)
│   │   ├── widgets/                # Composed widgets (Layout)
│   │   ├── shared/ui/              # UI component library (shadcn/ui)
│   │   ├── lib/                   # Utilities (router, theme, storage)
│   │   ├── data/                  # Static data (industries, blog posts)
│   │   ├── declarations/           # ICP canister type declarations
│   │   ├── mocks/                 # Mock data for development
│   │   ├── public/                 # Static assets
│   │   ├── vite.config.js          # Vite configuration (dev/build)
│   │   ├── vite.config.ts          # Vitest configuration
│   │   ├── tsconfig.json           # TypeScript configuration
│   │   └── package.json
│   └── backend/                    # ICP canisters (Motoko)
│       ├── main.mo
│       └── system-idl/
├── plans/                         # Architecture planning documents
├── scripts/                       # Build/utility scripts
├── package.json                   # Root workspace config
└── pnpm-workspace.yaml           # pnpm workspace definition
```

### Path Aliases

The project uses path aliases for cleaner imports:

| Alias | Resolution |
|-------|------------|
| `@/*` | `./src/*` |
| `@/components/*` | `./src/components/*` |
| `@/components/ui/*` | `./shared/ui/*` |
| `@/hooks/*` | `./src/hooks/*` |
| `@/contexts/*` | `./src/contexts/*` |
| `@/pages/*` | `./pages/*` |
| `@/widgets/*` | `./widgets/*` |
| `@/shared/*` | `./shared/*` |
| `@/lib/*` | `./lib/*` |

## Available Scripts

### Root Workspace

```bash
pnpm dev          # Start all dev servers
pnpm build        # Build all packages
pnpm test         # Run tests
```

### Frontend (`src/frontend/`)

```bash
cd src/frontend
pnpm dev              # Start Vite dev server
pnpm build            # Production build
pnpm test             # Run Vitest with UI
pnpm test:run         # Run tests headless
pnpm coverage         # Coverage report
pnpm typecheck        # TypeScript check
```

### Backend

```bash
dfx start            # Start local ICP replica
dfx deploy           # Deploy canisters
dfx generate         # Regenerate types
```

## Configuration

### Environment Variables

Create `src/frontend/env.json`:

```json
{
  "CANISTER_ID_BACKEND": "ryjl3-tyaaa-aaaaa-aaaba-cai",
  "BASE_URL": "http://localhost:4943",
  "STORAGE_GATEWAY_URL": "https://blob.caffeine.ai",
  "II_URL": "https://identity.ic0.app",
  "VITE_USE_MOCK": "false"
}
```

### Internet Identity

The app integrates with Internet Identity for authentication. Set `II_URL`:
- Local: `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:8081/`
- Production: `https://identity.ic0.app/`

## UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) for UI components. Components are located in `shared/ui/`.

Available components include:
- Accordion, Alert, AlertDialog
- Avatar, Badge, Breadcrumb
- Button, Calendar, Card, Carousel
- Checkbox, Collapsible, Command
- Dialog, Drawer, DropdownMenu
- Form, Input, Label
- NavigationMenu, Pagination
- Select, Separator, Sheet
- Slider, Switch, Tabs
- Table, Textarea, Toast
- Tooltip, Toggle

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | HomePage | Landing page with hero, industries, testimonials |
| `/about` | AboutPage | Company information |
| `/solutions` | SolutionsPage | Payment solutions overview |
| `/solutions/enterprise` | SolutionsEnterprisePage | Enterprise solutions |
| `/industries` | IndustriesPage | Industry directory |
| `/industries/:slug` | IndustryLandingPage | Industry-specific landing |
| `/how-it-works` | HowItWorksPage | Process explanation |
| `/hardware` | HardwarePage | Payment hardware catalog |
| `/integrations` | IntegrationsPage | Integration partners |
| `/partners` | PartnersPage | Partner program |
| `/insights` | InsightsPage | Blog and resources |
| `/knowledge` | KnowledgePage | Knowledge base |
| `/faq` | FaqPage | Frequently asked questions |
| `/contact` | ContactPage | Contact form |
| `/compliance` | CompliancePage | Compliance information |
| `/accessibility` | AccessibilityPage | Accessibility statement |
| `/apply` | WizardPage | Merchant application |
| `/admin` | AdminPage | Admin dashboard |

## Deployment

### Vercel (Frontend)

The frontend is configured for Vercel deployment:

```bash
# Build command
pnpm build

# Output directory
src/frontend/dist
```

### Internet Computer (Backend)

```bash
# Configure networks in dfx.json
dfx deploy --network ic
```

## Development Guidelines

### TypeScript

- All new code should be TypeScript
- Use strict type checking
- Run `pnpm typecheck` before committing

### Component Structure

```tsx
// Use functional components with hooks
function MyComponent({ title }: MyComponentProps) {
  const [state, setState] = useState<string>("");

  return <div>{title}</div>;
}
```

### Styling

- Use Tailwind CSS classes
- Use theme tokens for colors: `text-foreground`, `bg-background`, `border-input`
- Use `cn()` utility for conditional classes

### Testing

```bash
# Write tests near components
// MyComponent.test.tsx

import { render, screen } from "@testing-library/react";
import { MyComponent } from "./MyComponent";

test("renders title", () => {
  render(<MyComponent title="Hello" />);
  expect(screen.getByText("Hello")).toBeInTheDocument();
});
```

## License

Proprietary - All rights reserved.

## Acknowledgments

- [React](https://react.dev/)
- [Radix UI](https://radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query)
- [Motion](https://motion.dev/)
- [Internet Computer](https://internetcomputer.org/)