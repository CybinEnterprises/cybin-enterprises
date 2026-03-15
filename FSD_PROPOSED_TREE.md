# Proposed FSD Directory Structure

## /app: Global Setup
- App.tsx (root component)
- main.tsx (entry point)
- index.css (global styles)
- lib/router.tsx (routing setup)
- contexts/ThemeContext.tsx (theme provider)
- config.ts (application configuration)

## /pages: Full Page Compositions
- HomePage.tsx
- AboutPage.tsx
- ContactPage.tsx
- BlogPostPage.tsx
- FaqPage.tsx
- HowItWorksPage.tsx
- IndustriesPage.tsx
- IndustryLandingPage.tsx
- IntegrationsPage.tsx
- InsightsPage.tsx
- KnowledgePage.tsx
- LegalPage.tsx
- PartnersPage.tsx
- PaymentSolutionsPage.tsx
- PeptidesPage.tsx
- SolutionsPage.tsx
- SolutionsEnterprisePage.tsx
- WizardPage.tsx
- AccessibilityPage.tsx
- CompliancePage.tsx
- DoNotSellPage.tsx
- PrivacyPage.tsx
- TermsOfServicePage.tsx

## /widgets: Complex Components
- layout/PageHero.tsx
- layout/Header.tsx (extracted from Layout)
- layout/Footer.tsx (extracted from Layout)
- src/components/NeuronCanvas.tsx
- src/components/TickerBar.tsx
- src/components/PaymentAnimation.tsx
- src/components/PaymentBadges.tsx
- src/components/JsonLd.tsx
- src/components/ui/menubar.tsx
- src/components/ui/navigation-menu.tsx

## /features: Business Logic
- hooks/useThemeColors.ts
- hooks/useSiteSettings.ts
- hooks/useInternetIdentity.ts
- hooks/useActor.ts
- hooks/useImageSettings.ts
- hooks/useLiveImageSettings.ts
- hooks/useLiveSiteSettings.ts
- hooks/usePageTracking.ts
- hooks/useScrollAnimation.ts
- hooks/useScrollReveal.ts

## /entities: Domain Data
- data/blogPosts.ts
- data/industries.ts
- components/pages/home/IndustryTicker.tsx (ALL_INDUSTRIES array)
- components/pages/home/IndustryGrid.tsx

## /shared: Reusable Utilities
- components/ui/* (all primitive UI components)
- lib/StorageClient.ts (API client)
- lib/theme/* (design tokens, CSS variables)
- lib/utils.ts
- hooks/useSeo.ts (SEO utility)

## Layer Dependencies
- app → shared, features
- pages → app, widgets, features, entities, shared
- widgets → shared, features
- features → shared
- entities → shared
- shared → (independent)

## Migration Notes
1. Create new directory structure under src/frontend/
2. Move files according to above mapping
3. Update import paths accordingly
4. Verify no broken references
5. Run tests to ensure functionality preserved

## Reference ID Header Template
Each file must include:
// Reference ID: <layer>.<subpath>.<filename>
// Dependencies: <comma-separated list of reference IDs>

Example for src/frontend/shared/ui/button.tsx:
// Reference ID: shared.ui.button
// Dependencies: shared.lib.utils
