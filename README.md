# Aqua Solar - Blockchain Energy Platform

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Environment Setup

Before running the application, you need to set up your environment variables:

### 1. Copy the example environment file:
```bash
cp .env.example .env
```

### 2. Get a WalletConnect Project ID (Required):
- Visit [WalletConnect Cloud](https://cloud.walletconnect.com)
- Sign up for a free account
- Create a new project
- Copy your Project ID
- Add it to your `.env` file:
  ```bash
  NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your_project_id_here"
  ```

### 3. Hedera Testnet Credentials (Optional for development):
- The example credentials are already provided in `.env.example`
- For production, get your own from [Hedera Portal](https://portal.hedera.com/register)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Features

- **Energy Management**: Track and manage solar energy production in real-time
- **Blockchain Integration**: Secure energy transactions using Hedera Consensus Service
- **Wallet Connection**: Connect your Hedera wallet using HashConnect
- **Energy Trading**: Sell surplus energy to other users on the network
- **AI Forecasting**: Get AI-powered predictions for energy production

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.