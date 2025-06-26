# CivicAI: Smart Proposal Engine for Island Governance

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/daghondi/CivicAI-Crypto_Cities_Hackathon)

## 🚀 Overview

CivicAI transforms civic engagement by using AI to convert citizen-reported problems into structured, actionable governance proposals. Built for island communities like Próspera/Roatán, it bridges the gap between community needs and effective local governance.

## ✨ Features

### 🤖 AI-Powered Governance
- **Smart Proposal Generation:** Convert civic problems into structured, actionable proposals
- **Comprehensive Analysis:** AI-generated feasibility scores, cost estimates, and risk assessments
- **Multi-step Creation Wizard:** Guided proposal creation with problem analysis and solution refinement

### 🗳️ Advanced Voting System
- **Wallet-Based Authentication:** Secure voting with cryptographic signatures
- **One Vote Per Wallet:** Prevents manipulation while maintaining privacy
- **Real-time Results:** Live vote counting with detailed statistics
- **Voting History:** Complete audit trail of all votes cast

### 👤 User Profiles & Reputation
- **Advanced User Profiles:** Wallet integration with ENS resolution
- **Reputation System:** Track civic engagement and voting participation
- **Achievement Badges:** Earn badges for active community participation
- **Vote Statistics:** Personal voting history and impact tracking

### 🏛️ Governance Infrastructure
- **Proposal Lifecycle Management:** From creation to implementation tracking
- **Quorum Requirements:** Configurable voting thresholds for proposal validity
- **Time-bound Voting:** Automatic voting periods with deadline enforcement
- **Community Analytics:** Engagement metrics and participation insights

### 💰 Incentive System
- **I₵C Integration:** Infinita City Credits reward system for participation
- **Engagement Rewards:** Earn credits for voting, creating proposals, and community involvement
- **Transparent Tracking:** Clear record of all earned rewards and contributions

### 🔒 Security & Trust
- **Cryptographic Verification:** All votes signed and verified on-chain simulation
- **Anti-fraud Measures:** One vote per wallet enforcement with signature validation
- **Transparent Process:** Public voting records while maintaining voter privacy
- **Audit Trail:** Complete history of all governance actions

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 14 with App Router
- **UI Library:** React 18 with TypeScript
- **Styling:** Tailwind CSS with custom components
- **Icons:** Lucide React icon library

### Backend & Database
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Wallet-based auth with signature verification
- **Real-time:** Supabase real-time subscriptions
- **Storage:** Supabase storage for files and assets

### AI Integration
- **Primary:** OpenAI GPT-4o for proposal generation
- **Alternative:** Claude API support
- **Processing:** Custom prompt engineering for civic proposals

### Web3 & Blockchain
- **Wallet Integration:** Thirdweb SDK with multi-wallet support
- **Signature Verification:** Ethers.js for cryptographic operations
- **Network:** Optimism Sepolia testnet for development
- **ENS Support:** Ethereum Name Service resolution

### Deployment & DevOps
- **Hosting:** Vercel with edge functions
- **CI/CD:** GitHub Actions integration
- **Monitoring:** Built-in error tracking and analytics
- **Security:** API middleware with rate limiting

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key
- Thirdweb Client ID
- WalletConnect Project ID (optional)

### Installation

1. **Clone the repository**
    ```bash
    git clone https://github.com/daghondi/CivicAI-Crypto_Cities_Hackathon.git
    cd CivicAI-Crypto_Cities_Hackathon
    ```

2. **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    ```

3. **Configure environment variables**
    Copy `.env.local.example` to `.env.local` and fill in your configuration:

    ```bash
    cp .env.local.example .env.local
    ```

    Required environment variables:
    ```bash
    # Supabase Configuration
    NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

    # AI Configuration
    OPENAI_API_KEY=sk-your-openai-api-key

    # Web3 Configuration
    NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

    # Feature Flags
    NEXT_PUBLIC_ENABLE_AI=true
    NEXT_PUBLIC_ENABLE_ENS=true
    NEXT_PUBLIC_ENABLE_BADGES=true
    ```

4. **Set up the database**
    ```bash
    # Run Supabase migrations
    npx supabase db reset
    
    # Seed with sample data (optional)
    node scripts/seed-data.js
    ```

5. **Run the development server**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

6. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 🎯 Usage

### For Citizens
1. **Connect Your Wallet:** Use MetaMask, Coinbase Wallet, or any WalletConnect-compatible wallet
2. **Submit Problems:** Report civic issues through the intuitive problem submission form
3. **Review AI Proposals:** See how AI transforms your problem into actionable proposals
4. **Vote on Proposals:** Cast your vote using wallet signatures for security
5. **Track Impact:** Monitor proposal progress and your civic engagement

### For Administrators
1. **Governance Dashboard:** Monitor all proposals and voting activity
2. **User Management:** View community engagement and reputation metrics
3. **Analytics:** Track platform usage and democratic participation
4. **Moderation:** Review and manage proposal submissions

### Key Workflows

#### Creating Proposals
```
Connect Wallet → Submit Problem → AI Generation → Review & Edit → Publish
```

#### Voting Process
```
Browse Proposals → Review Details → Connect Wallet → Sign Vote → Confirm Submission
```

#### Profile Management
```
Connect Wallet → View Profile → Check Badges → Review Vote History → Update Settings
```

## ⚙️ Configuration

- Set all required environment variables in the `.env` file.
- Refer to the `.env.example` file for the required keys.
- Ensure your Supabase instance is set up with the appropriate schema (see `/supabase` or `/docs` if present).

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a Pull Request

Please check for existing issues before starting new work. For major changes, open an issue to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## 🙌 Acknowledgements
- Hosted by [Infinita City](https://www.infinita.city/) , [Odeiea](https://www.odisea.xyz/) , and [TAIKAI](https://taikai.network/)
- Inspired by the needs of island governance and digital democracy.
- Powered by  [Próspera](https://www.prospera.co/), [Supabase](https://supabase.com/), [OpenAI](https://openai.com/), and the Web3 ecosystem.

## 📫 Contact

For questions, feedback, or support, please open an issue or contact [@daghondi](https://github.com/daghondi).

---

## 🔧 API Endpoints

### Core Endpoints
- `POST /api/ai/generate` - Generate AI proposals from problems
- `GET /api/proposals` - List all proposals with pagination
- `POST /api/proposals` - Create new proposals
- `GET /api/proposals/[id]` - Get specific proposal details
- `POST /api/votes` - Submit votes with wallet signatures
- `GET /api/users/[address]` - Get user profile and voting history
- `POST /api/auth` - Wallet-based authentication

### Features
- **Wallet Authentication:** Secure signature-based login
- **Real-time Updates:** Live voting results and proposal status
- **Comprehensive Validation:** Input validation and error handling
- **Rate Limiting:** API protection against abuse

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suites
npm run test:api
npm run test:components
```

### Test Advanced Features
```bash
# Test wallet integration and voting
npm run test:wallet

# Test AI proposal generation
npm run test:ai

# Test governance features
npm run test:governance
```

## 📱 Mobile Support

CivicAI is fully responsive and optimized for mobile devices:
- **Touch-friendly Interface:** Large buttons and intuitive gestures
- **Responsive Design:** Adapts to all screen sizes
- **Mobile Wallet Integration:** Native mobile wallet support
- **Offline Capability:** View proposals without internet connection
- **Progressive Web App:** Install on mobile home screen

## 🔐 Security Features

- **Wallet-based Authentication:** No passwords, just cryptographic signatures
- **Vote Verification:** All votes cryptographically signed and verified
- **Anti-fraud Protection:** One vote per wallet enforcement
- **Rate Limiting:** API protection against abuse
- **Input Validation:** Comprehensive validation on all user inputs
- **SQL Injection Prevention:** Parameterized queries and ORM protection
