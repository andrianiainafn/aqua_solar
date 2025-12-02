# HelioSol Flow - DePIN Platform for Solar Micro-Grids and Water Pumps

A decentralized physical infrastructure network (DePIN) platform that enables African communities to manage, monitor, and trade solar energy and water resources through peer-to-peer transactions secured by blockchain technology.

## 🌍 The Problem

**Critical shortages in Africa**: Over 60% of the population lacks reliable access to electricity, and nearly 30% lack access to clean water. This creates significant challenges for agriculture, healthcare, and education in rural communities.

**Failing centralized systems**: Traditional electrical and water networks are expensive, unstable, and inaccessible in rural areas.

**Climate change impact**: Droughts and floods exacerbate resource shortages, making sustainable solutions more urgent than ever.

## 💡 Our Solution

**HelioSol Flow** is an innovative DePIN platform that addresses water and electricity shortages in Africa through a decentralized, community-driven approach. The platform enables:

- **Solar Micro-Grids**: Community-managed solar energy systems that generate electricity locally
- **Water Pump Systems**: Connected water pumps powered by solar energy for reliable water access
- **Peer-to-Peer Trading**: Communities can sell excess energy (kWh) and water (liters) to neighboring villages
- **AI-Powered Optimization**: Predictive intelligence analyzes weather patterns and usage habits to optimize resource management, especially for irrigation during dry seasons
- **Blockchain Security**: Hedera blockchain ensures secure, transparent transactions for energy and water trading

## 🛠️ Tech Stack

- **Frontend/Backend**: [Next.js](https://nextjs.org) - React framework with server-side rendering
- **Database**: MySQL - Relational database for storing user data, projects, systems, and readings
- **ORM**: Prisma - Type-safe database client
- **Blockchain**: Hedera - For secure P2P transactions (future integration)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MySQL database server running
- npm, yarn, pnpm, or bun package manager

### Installation Steps

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd aqua_solar
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**:
   
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env` file with the following variables:
   ```env
   # Database
   DATABASE_URL="mysql://user:password@localhost:3306/heliosol_flow"
   
   # Hedera Testnet Credentials
   # Get these from: https://portal.hedera.com/register
   OPERATOR_ID="0.0.6921835"
   OPERATOR_KEY="0x3d7febfee802255e53d071bf7290a31ab564769cdab9d1f4ed79e96aeff9e197"
   
   # WalletConnect Project ID
   # Get your Project ID from: https://cloud.walletconnect.com
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="your_project_id_here"
   ```

4. **Set up the database**:
   
   Create a MySQL database:
   ```sql
   CREATE DATABASE heliosol_flow;
   ```
   
   Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```
   
   (Optional) Generate Prisma Client:
   ```bash
   npx prisma generate
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

6. **Open your browser**:
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📱 Features

- **Real-Time Monitoring**: Track solar energy production and water pump output in real-time
- **Community Dashboard**: View production levels, consumption, and available surplus
- **P2P Trading Interface**: Simple interface to sell excess energy (kWh) and water (liters) to other communities
- **AI Forecasting**: Predictive analytics for energy and water production based on weather data
- **Resource Management**: Optimize irrigation and energy distribution using AI recommendations
- **Secure Transactions**: Blockchain-backed transactions for transparent and secure trading

## 📁 Project Structure

```
aqua_solar/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/                   # Next.js app directory
│   └── lib/
│       └── prisma.ts          # Prisma client instance
├── .env.example               # Example environment variables
└── README.md                  # This file
```

## 🗄️ Database Schema

The application uses the following main models:

- **User**: Community members and administrators
- **Project**: Solar and water infrastructure projects
- **SolarSystem**: Individual solar panel systems with capacity tracking
- **Reading**: Real-time readings of power output, water volume, and temperature

## 🔧 Development

### Database Management

View your database with Prisma Studio:
```bash
npx prisma studio
```

Reset the database (development only):
```bash
npx prisma migrate reset
```

### Code Structure

- Edit pages in `src/app/`
- Database models are defined in `prisma/schema.prisma`
- Prisma client is initialized in `src/lib/prisma.ts`

## 🚢 Deployment

### Deploy on Vercel

The easiest way to deploy your Next.js app is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

1. Push your code to GitHub
2. Import your repository on Vercel
3. Configure your environment variables
4. Deploy!

For more details, check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

## 📊 Pitch Deck

View our presentation: [HelioSol Flow Pitch Deck](https://docs.google.com/presentation/d/1A7zceBeRgXXzu43x8Fxa5xCwMAV2gLCI/edit?usp=sharing&ouid=117390220751267108923&rtpof=true&sd=true)

## 🎓 Certifications

- **[Hedera Developer Certification Course](https://hashgraphdev.com/courses/hashgraph-developer-course)** - Comprehensive introduction to Hedera development and Web3 technologies

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Prisma Documentation](https://www.prisma.io/docs) - Learn about Prisma ORM
- [MySQL Documentation](https://dev.mysql.com/doc/) - MySQL database reference

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is part of a hackathon submission.

---

**HelioSol Flow** - Empowering African communities through decentralized energy and water infrastructure.
