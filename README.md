# Cybin Enterprises

A comprehensive platform for healthcare and pharmaceutical solutions.

## Overview

Cybin Enterprises provides a suite of healthcare solutions including:
- Payment processing solutions
- Industry-specific healthcare portals
- Fraud prevention systems
- Hardware integration solutions
- Insights and knowledge sharing
- Partner and compliance management

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **State Management**: React Query (TanStack)
- **UI Components**: Radix UI, Tailwind CSS
- **Backend**: Internet Computer (ICP) Canisters
- **Authentication**: Internet Identity
- **Storage**: ICP Asset Canisters

## Getting Started

### Prerequisites- Node.js 18+ (Recommended: v20.x)
- pnpm 8+
- DFX (for local development) - https://sdk.dfinity.org/docs/install-guide
- Internet Identity setup

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cybin-enterprises-1
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Environment Setup:
   ```bash
   cp src/frontend/env.json.example src/frontend/env.json
   # Edit env.json with your configuration
   ```

### Development

Start the development server:
```bash
# Start local replica (if needed)
dfx start --background --clean

# Deploy canisters locally
dfx deploy

# Start frontend dev server
pnpm dev -- --host
```

The application will be available at http://localhost:5173

### Building for Production

```bash
pnpm build
```

The built assets will be in the `dist/` directory.

### Testing

```bash
# Run unit tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests in CI mode
pnpm test:run# Generate coverage report
pnpm coverage
```

Note: Vitest requires Vite 6.x for full functionality. Current setup uses Vite 5.x.

## Project Structure

```
src/
├── frontend/                 # Frontend application
│   ├── src/                  # Source code
│   │   ├── components/       # Reusable UI components
│   │   ├── contexts/         # React contexts (Theme, etc.)
│   │   ├── hooks/            # Custom React hooks│   │   ├── lib/              # Utility functions and services
│   │   ├── pages/            # Page components
│   │   ├── widgets/          # Layout widgets
│   │   └── test/             # Test utilities and setup│   ├── public/               # Static assets│   ├── vite.config.js        # Vite configuration
│   ├── tsconfig.json         # TypeScript configuration
│   └── package.json          # Frontend dependencies
├── backend/                  # Backend canisters
│   └── src/                  # Motoko source code
└── package.json              # Root package.json (workspace)
```

## Available Scripts

### Frontend (`src/frontend/package.json`)

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run Vitest with UI
- `pnpm test:run` - Run tests in headless mode
- `pnpm coverage` - Run tests with coverage report
- `pnpm typecheck` - Run TypeScript type checking

### Backend

See `src/backend/README.md` for backend-specific commands.

## Configuration

### Environment Variables

The application uses environment variables configured in `src/frontend/env.json`:

- `CANISTER_ID_BACKEND` - Backend canister ID
- `BASE_URL` - Base URL for API calls
- `STORAGE_GATEWAY_URL` - URL for asset storage
- `II_URL` - Internet Identity URL- `VITE_USE_MOCK` - Use mock backend (true/false)

### Internet Identity

The application integrates with Internet Identity for authentication. Configure the `II_URL` in env.json to point to your Identity provider.

## Deployment

### Vercel

The frontend is configured for Vercel deployment with `vercel.json`.

### Internet Computer

For ICP deployment:
1. Set up your identity and networks in `dfx.json`
2. Update canister IDs in `src/frontend/env.json`
3. Deploy using `dfx deploy`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary and confidential. All rights reserved.

## Contact

For support and inquiries, please contact the development team.

## Acknowledgments

- Built with [React](https://reactjs.org/)
- UI components from [Radix UI](https://radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- State management with [React Query](https://tanstack.com/query/v4)
- Blockchain platform: [Internet Computer](https://internetcomputer.org/)